/*
 * Vite plugin that attaches to compiled component definitions the two things the
 * runtime prefetch walk cannot read for itself:
 *
 * - `preFetchOperations`: the union of the `preFetchOperations` exports of the
 *   composable modules a component statically imports. Composable modules get
 *   the same treatment, merging in the exports of the composables they import,
 *   so the operation surface composes one hop at a time.
 * - `__childComponents`: thunks over the child components a `<script setup>`
 *   component imports. Components authored any other way register their children
 *   in a `components` option, which the walk already follows.
 *
 * A compiled component module is a single-file-component main module or a
 * ?vue&type=script sub-module; both default-export the same definition object,
 * and the component's imports sit in whichever of the two the vue plugin put
 * them in.
 *
 * The authoring style is read from the component source before the vue plugin
 * compiles it, since the compiled module records the style only indirectly.
 *
 * Each rewritten module depends only on its own source.
 */
import path from 'path';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

// A script block carrying the setup attribute, whatever else the tag holds
const SCRIPT_SETUP_BLOCK = /<script[^>]*\ssetup[\s=>]/;

const HOST = '__componentDefinition__';
const NS = '__composableModule';
const CHILD_NS = '__childModule';
const MERGED = '__mergedPreFetchOperations';
const CHILDREN = '__childComponents';

// One guarded spread per imported composable module; the `in` guard (rather
// than `?? []`) keeps the probe safe for module namespaces that throw on
// missing exports, like vitest factory mocks
function operationSpreads(composableSpecifiers) {
	return composableSpecifiers.map(
		(specifier, i) => `\t...('preFetchOperations' in ${NS}${i} ? ${NS}${i}.preFetchOperations : []),`
	);
}

function namespaceImports(specifiers, prefix) {
	return specifiers.map((specifier, i) => `import * as ${prefix}${i} from '${specifier}';`);
}

// Thunks rather than direct references, so a circular import does not read a
// child's binding before that module has finished evaluating; the `in` guard
// keeps the probe safe for module namespaces that throw on missing exports,
// like vitest factory mocks
function childThunks(childSpecifiers, dynamicChildSpecifiers) {
	return [
		...childSpecifiers.map(
			(specifier, i) => `\t() => ('default' in ${CHILD_NS}${i} ? ${CHILD_NS}${i}.default : undefined),`
		),
		...dynamicChildSpecifiers.map(specifier => `\t() => import('${specifier}'),`),
	];
}

// Attach the imported operations and child components to a component definition
// by capturing the default export and assigning onto it
function attachToComponent(code, id, exports, { composables, children, dynamicChildren }, warn) {
	const defaultExport = exports.find(ex => code.slice(ex.s, ex.e) === 'default');
	const exportStart = defaultExport ? code.lastIndexOf('export', defaultExport.s) : -1;
	const isPlainDefault = exportStart !== -1
		&& /^\s+$/.test(code.slice(exportStart + 'export'.length, defaultExport.s));
	if (!isPlainDefault) {
		warn(`prefetch-discovery: no plain default export in ${id}; not attaching to the component`);
		return null;
	}
	const magic = new MagicString(code);
	magic.overwrite(exportStart, defaultExport.e, `const ${HOST} =`);
	magic.append([
		'',
		...namespaceImports(composables, NS),
		...namespaceImports(children, CHILD_NS),
		...(composables.length ? [
			`${HOST}.preFetchOperations = [`,
			...operationSpreads(composables),
			'];',
		] : []),
		...(children.length || dynamicChildren.length ? [
			`${HOST}.${CHILDREN} = [`,
			...childThunks(children, dynamicChildren),
			'];',
		] : []),
		`export default ${HOST};`,
		'',
	].join('\n'));
	return { code: magic.toString(), map: magic.generateMap({ source: id, hires: true }) };
}

// Merge the operations of imported composable modules into this module's own
// preFetchOperations export, creating that export if the module has none
function composeExport(code, id, exports, composableSpecifiers, warn) {
	const ownExport = exports.find(ex => code.slice(ex.s, ex.e) === 'preFetchOperations');
	const magic = new MagicString(code);
	if (ownExport) {
		const exportStart = code.lastIndexOf('export', ownExport.s);
		const declaration = exportStart === -1 ? '' : code.slice(exportStart, ownExport.s);
		if (!/^export\s+(const|let|var)\s+$/.test(declaration)) {
			warn(`prefetch-discovery: unsupported preFetchOperations export shape in ${id}; not composing imports`);
			return null;
		}
		// Un-export the authored declaration; the merged export below replaces
		// it while internal references to the binding keep working
		magic.remove(exportStart, exportStart + 'export'.length);
	}
	magic.append([
		'',
		...namespaceImports(composableSpecifiers, NS),
		`const ${MERGED} = [`,
		...(ownExport ? ['\t...preFetchOperations,'] : []),
		...operationSpreads(composableSpecifiers),
		'];',
		`export { ${MERGED} as preFetchOperations };`,
		'',
	].join('\n'));
	return { code: magic.toString(), map: magic.generateMap({ source: id, hires: true }) };
}

// Specifiers that could name a module in this repo, written without an
// extension as the lint rules require; skips packages, and assets and graphql
// documents that carry an extension
function isLocalSpecifier(specifier) {
	return /^[.#/]/.test(specifier) && ['', '.vue'].includes(path.extname(specifier));
}

// A child component resolves to a bare .vue path inside this repo; a component's
// own style and script sub-blocks resolve to its own path plus a query, and
// packages ship their components already compiled
function isChildComponent(resolvedId, rootDir) {
	return !!resolvedId
		&& !resolvedId.includes('?')
		&& resolvedId.endsWith('.vue')
		&& resolvedId.startsWith(rootDir)
		&& !resolvedId.includes(`${path.sep}node_modules${path.sep}`);
}

export default function prefetchDiscoveryPlugin() {
	// Which components are authored with <script setup>, by file path
	const scriptSetup = new Map();
	let composablesDir;
	let rootDir;
	return [{
		name: 'prefetch-discovery-source',
		// Run before the vue plugin so the transform sees the component source
		enforce: 'pre',
		transform(code, id) {
			if (id.endsWith('.vue')) {
				scriptSetup.set(id, SCRIPT_SETUP_BLOCK.test(code));
			}
			return null;
		},
	}, {
		name: 'prefetch-discovery',
		// Run after the vue plugin so the transform sees the compiled component module
		enforce: 'post',
		configResolved(config) {
			rootDir = path.resolve(config.root) + path.sep;
			composablesDir = path.resolve(config.root, 'src/composables') + path.sep;
		},
		async transform(code, id) {
			// Component main modules carry no query, and plugin-vue emits a
			// ?vue&type=script sub-module for a script block needing its own
			// transform; sub-blocks of any other type carry no component imports
			const isComponent = id.endsWith('.vue') || id.includes('?vue&type=script');
			const isComposable = !id.includes('?') && id.startsWith(composablesDir);
			if (!isComponent && !isComposable) {
				return null;
			}
			if (isComposable && !code.includes('composables/')) {
				return null;
			}
			await init;
			const warn = message => this.warn(message);
			let imports;
			let exports;
			try {
				[imports, exports] = parse(code, id);
			} catch (e) {
				warn(`prefetch-discovery: could not parse ${id}: ${e}`);
				return null;
			}
			// Resolve each distinct specifier once, then classify by where it
			// landed rather than by how it was written
			const resolveAll = async candidates => {
				const specifiers = [...new Set(candidates.filter(imp => isLocalSpecifier(imp.n)).map(imp => imp.n))];
				return Promise.all(specifiers.map(async specifier => {
					const resolved = await this.resolve(specifier, id);
					return { specifier, resolvedId: resolved?.id };
				}));
			};
			const staticResolutions = await resolveAll(imports.filter(imp => imp.d === -1 && imp.n));
			const composables = staticResolutions
				.filter(r => r.resolvedId?.startsWith(composablesDir))
				.map(r => r.specifier);
			if (isComposable) {
				return composables.length ? composeExport(code, id, exports, composables, warn) : null;
			}
			// Only a <script setup> component needs its children attached; every other
			// component registers the children it renders in a components option
			const componentFile = id.split('?')[0];
			if (!scriptSetup.has(componentFile)) {
				warn(`prefetch-discovery: no component source seen for ${id}; not attaching child components`);
			}
			const attachChildren = scriptSetup.get(componentFile) === true;
			const children = attachChildren
				? staticResolutions.filter(r => isChildComponent(r.resolvedId, rootDir)).map(r => r.specifier)
				: [];
			// Statically written dynamic imports, the defineAsyncComponent pattern
			const dynamicChildren = attachChildren
				? (await resolveAll(imports.filter(imp => imp.d > -1 && imp.n)))
					.filter(r => isChildComponent(r.resolvedId, rootDir))
					.map(r => r.specifier)
				: [];
			if (!composables.length && !children.length && !dynamicChildren.length) {
				return null;
			}
			return attachToComponent(code, id, exports, { composables, children, dynamicChildren }, warn);
		},
	}];
}
