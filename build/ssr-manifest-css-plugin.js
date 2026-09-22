/*
 * Vite plugin that adds to every SSR manifest entry the stylesheets of the chunks the
 * entry's own chunk reaches by static import.
 *
 * Vite maps a module to its own chunk and that chunk's own stylesheets, and never walks
 * `chunk.imports`. A component whose styles rollup hoisted into a shared chunk therefore
 * gets no stylesheet link in the server-rendered head, and the browser first sees those
 * styles when the client bundle loads that chunk — after the markup has painted.
 *
 * Vite appends its own ssr-manifest plugin after every user plugin, post-enforced ones
 * included, so the manifest asset does not exist yet during generateBundle. This rewrites
 * the written file instead, which is the first hook where it exists.
 */
import fs from 'fs';
import path from 'path';
import { parseVueRequest } from '@vitejs/plugin-vue';

const DEFAULT_MANIFEST = '.vite/ssr-manifest.json';

const toUrl = (base, file) => `${base.endsWith('/') ? base : `${base}/`}${file}`;
const dedupe = (...arrays) => [...new Set(arrays.flat())];

// A Vue SFC's script/template/style blocks each get their own virtual module id
// (`Foo.vue?vue&type=style&index=0&lang.css`), and Vite's default ssr-manifest maps
// every one of them to its own key. `context.modules` only ever registers a
// component's plain id, so the variant keys are never looked up.
const toBaseId = id => {
	const { filename, query } = parseVueRequest(id);
	return query.vue ? filename : id;
};

// Stylesheets and static imports of every chunk, keyed by output file name
function readChunks(bundle, base) {
	return Object.fromEntries(
		Object.values(bundle)
			.filter(output => output.type === 'chunk')
			.map(chunk => [chunk.fileName, {
				css: [...(chunk.viteMetadata?.importedCss ?? [])].map(file => toUrl(base, file)),
				imports: chunk.imports,
				isEntry: chunk.isEntry,
			}])
	);
}

// Collapse an SFC's `?vue&type=` variant keys onto their base id
function collapseVueTypeVariants(manifest) {
	const collapsed = {};
	Object.entries(manifest).forEach(([key, files]) => {
		const baseKey = toBaseId(key);
		collapsed[baseKey] = dedupe(collapsed[baseKey] ?? [], files);
	});
	return collapsed;
}

// The stylesheets a chunk reaches through static imports, minus its own — Vite
// already records those for the chunks it maps a module to. An entry chunk's
// stylesheet is excluded too, since Vite writes that link into index.html directly.
// The list is built depth-first: a dependency's stylesheets land before the
// stylesheets of the chunk that imports it, the same order Vite's client preload
// helper loads them in.
export function importedCss(fileName, chunks) {
	const css = new Set();
	const seen = new Set([fileName]);
	function visit(next) {
		if (seen.has(next) || !chunks[next]) {
			return;
		}
		seen.add(next);
		chunks[next].imports.forEach(visit);
		if (!chunks[next].isEntry) {
			chunks[next].css.forEach(file => css.add(file));
		}
	}
	(chunks[fileName]?.imports ?? []).forEach(visit);
	return [...css];
}

export function expandManifest(manifest, bundle, { base, root }) {
	const collapsedManifest = collapseVueTypeVariants(manifest);
	const chunks = readChunks(bundle, base);
	const reached = new Map();
	Object.values(bundle)
		.filter(output => output.type === 'chunk')
		.forEach(chunk => {
			const css = importedCss(chunk.fileName, chunks);
			if (!css.length) {
				return;
			}
			Object.keys(chunk.modules).forEach(id => {
				const key = toBaseId(path.relative(root, id).split(path.sep).join('/'));
				reached.set(key, [...(reached.get(key) ?? []), ...css]);
			});
		});
	return Object.fromEntries(Object.entries(collapsedManifest).map(([key, files]) => {
		const added = dedupe(reached.get(key) ?? []).filter(file => !files.includes(file));
		return [key, added.length ? [...added, ...files] : files];
	}));
}

export default function ssrManifestCssPlugin() {
	let enabled = false;
	let manifestFile = '';
	let options = {};
	return {
		name: 'ssr-manifest-css',
		apply: 'build',
		configResolved(config) {
			const root = path.resolve(config.root);
			const { outDir, ssrManifest } = config.build;
			enabled = !!ssrManifest;
			options = { base: config.base, root };
			manifestFile = path.resolve(
				root,
				outDir,
				typeof ssrManifest === 'string' ? ssrManifest : DEFAULT_MANIFEST,
			);
		},
		writeBundle(outputOptions, bundle) {
			if (!enabled) {
				return;
			}
			const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
			const expanded = expandManifest(manifest, bundle, options);
			fs.writeFileSync(manifestFile, JSON.stringify(expanded, undefined, 2));
		},
	};
}
