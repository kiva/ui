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

const DEFAULT_MANIFEST = '.vite/ssr-manifest.json';

const toUrl = (base, file) => `${base.endsWith('/') ? base : `${base}/`}${file}`;

// Stylesheets and static imports of every chunk, keyed by output file name
function readChunks(bundle, base) {
	return Object.fromEntries(
		Object.values(bundle)
			.filter(output => output.type === 'chunk')
			.map(chunk => [chunk.fileName, {
				css: [...(chunk.viteMetadata?.importedCss ?? [])].map(file => toUrl(base, file)),
				imports: chunk.imports,
			}])
	);
}

// The stylesheets a chunk reaches through static imports, its own excluded — Vite
// already records those for the chunks it maps a module to
export function importedCss(fileName, chunks) {
	const css = new Set();
	const seen = new Set([fileName]);
	const queue = [...(chunks[fileName]?.imports ?? [])];
	while (queue.length) {
		const next = queue.pop();
		if (!seen.has(next) && chunks[next]) {
			seen.add(next);
			chunks[next].css.forEach(file => css.add(file));
			queue.push(...chunks[next].imports);
		}
	}
	return [...css];
}

export function expandManifest(manifest, bundle, { base, root }) {
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
				const key = path.relative(root, id).split(path.sep).join('/');
				reached.set(key, [...(reached.get(key) ?? []), ...css]);
			});
		});
	return Object.fromEntries(Object.entries(manifest).map(([key, files]) => {
		const added = [...new Set(reached.get(key) ?? [])].filter(file => !files.includes(file));
		return [key, added.length ? [...files, ...added] : files];
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
