/*
 * Vite plugin that attaches the apollo operations of imported composable
 * modules to the modules that use them, one hop at a time:
 *
 * - Every compiled .vue module whose static imports resolve into
 *   src/composables/ gets the union of the imported modules'
 *   `preFetchOperations` exports attached to its default export (the
 *   component definition). preFetchAll reads the attached operations to
 *   prefetch them alongside the component's own apollo block, and
 *   useApolloQuery warns when a server render uses an operation that was
 *   never attached.
 * - Every module in src/composables/ that itself imports other composables
 *   gets their `preFetchOperations` merged into its own export, so a
 *   composable using another composable needs no re-export authoring and the
 *   full operation surface emerges by composition.
 *
 * Each rewritten module depends only on its own source, so the module stays
 * the unit of analysis and invalidation. Runs in dev serve, build, vitest,
 * and storybook, for both the ssr and client environments, so every mode
 * shares one mechanism.
 */
import path from 'path';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

const HOST = '__componentDefinition__';
const NS = '__composableModule';
const MERGED = '__mergedPreFetchOperations';

// One guarded spread per imported composable module; the `in` guard (rather
// than `?? []`) keeps the probe safe for module namespaces that throw on
// missing exports, like vitest factory mocks
function operationSpreads(composableSpecifiers) {
	return composableSpecifiers.map(
		(specifier, i) => `\t...('preFetchOperations' in ${NS}${i} ? ${NS}${i}.preFetchOperations : []),`
	);
}

function namespaceImports(composableSpecifiers) {
	return composableSpecifiers.map((specifier, i) => `import * as ${NS}${i} from '${specifier}';`);
}

// Attach the imported operations to a component definition by capturing the
// default export and assigning the union onto it
function attachToComponent(code, id, exports, composableSpecifiers, warn) {
	const defaultExport = exports.find(ex => code.slice(ex.s, ex.e) === 'default');
	const exportStart = defaultExport ? code.lastIndexOf('export', defaultExport.s) : -1;
	const isPlainDefault = exportStart !== -1
		&& /^\s+$/.test(code.slice(exportStart + 'export'.length, defaultExport.s));
	if (!isPlainDefault) {
		warn(`composable-operations: no plain default export in ${id}; not attaching operations`);
		return null;
	}
	const magic = new MagicString(code);
	magic.overwrite(exportStart, defaultExport.e, `const ${HOST} =`);
	magic.append([
		'',
		...namespaceImports(composableSpecifiers),
		`${HOST}.preFetchOperations = [`,
		...operationSpreads(composableSpecifiers),
		'];',
		`export default ${HOST};`,
		'',
	].join('\n'));
	return { code: magic.toString(), map: magic.generateMap({ hires: true }) };
}

// Merge the imported operations into a composable module's own
// preFetchOperations export (creating the export when the module authors
// none), so composition needs no re-export authoring
function composeExport(code, id, exports, composableSpecifiers, warn) {
	const ownExport = exports.find(ex => code.slice(ex.s, ex.e) === 'preFetchOperations');
	const magic = new MagicString(code);
	if (ownExport) {
		const exportStart = code.lastIndexOf('export', ownExport.s);
		const declaration = exportStart === -1 ? '' : code.slice(exportStart, ownExport.s);
		if (!/^export\s+(const|let|var)\s+$/.test(declaration)) {
			warn(`composable-operations: unsupported preFetchOperations export shape in ${id}; not composing imports`);
			return null;
		}
		// Un-export the authored declaration; the merged export below replaces
		// it while internal references to the binding keep working
		magic.remove(exportStart, exportStart + 'export'.length);
	}
	magic.append([
		'',
		...namespaceImports(composableSpecifiers),
		`const ${MERGED} = [`,
		...(ownExport ? ['\t...preFetchOperations,'] : []),
		...operationSpreads(composableSpecifiers),
		'];',
		`export { ${MERGED} as preFetchOperations };`,
		'',
	].join('\n'));
	return { code: magic.toString(), map: magic.generateMap({ hires: true }) };
}

export default function composableOperationsPlugin() {
	let composablesDir;
	return {
		name: 'composable-operations',
		// Run after the vue plugin so the transform sees the compiled component module
		enforce: 'post',
		configResolved(config) {
			composablesDir = path.resolve(config.root, 'src/composables') + path.sep;
		},
		async transform(code, id) {
			// Compiled single-file-component main modules (sub-block requests
			// carry ?vue&type=...) and composable modules themselves
			const isComponent = id.endsWith('.vue');
			const isComposable = !id.includes('?') && id.startsWith(composablesDir);
			if ((!isComponent && !isComposable) || !code.includes('composables/')) {
				return null;
			}
			await init;
			let imports;
			let exports;
			try {
				[imports, exports] = parse(code, id);
			} catch (e) {
				this.warn(`composable-operations: could not parse ${id}: ${e}`);
				return null;
			}
			// Static imports resolving into src/composables/ are composable modules
			const specifiers = [...new Set(
				imports
					.filter(imp => imp.d === -1 && imp.n?.includes('composables/'))
					.map(imp => imp.n)
			)];
			const resolutions = await Promise.all(specifiers.map(async specifier => {
				const resolved = await this.resolve(specifier, id);
				return resolved?.id?.startsWith(composablesDir) ? specifier : null;
			}));
			const composableSpecifiers = resolutions.filter(Boolean);
			if (!composableSpecifiers.length) {
				return null;
			}
			const warn = message => this.warn(message);
			return isComponent
				? attachToComponent(code, id, exports, composableSpecifiers, warn)
				: composeExport(code, id, exports, composableSpecifiers, warn);
		},
	};
}
