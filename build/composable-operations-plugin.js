/*
 * Vite plugin that attaches the apollo operations of imported composable
 * modules to component definitions. For every compiled .vue module whose
 * static imports resolve into src/composables/, the default export gains a
 * `preFetchOperations` array holding the union of the imported modules' authored
 * `preFetchOperations` exports. preFetchAll reads the attached operations to
 * prefetch them alongside the component's own apollo block, and useApolloQuery
 * warns when a server render uses an operation that was never attached. Runs
 * in dev serve, build, vitest, and storybook, for both the ssr and client
 * environments, so every mode shares one mechanism.
 */
import path from 'path';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

const HOST = '__componentDefinition__';
const NS = '__composableModule';

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
			// Only compiled single-file-component main modules (sub-block requests
			// carry ?vue&type=...), and only ones that mention a composables path
			if (!id.endsWith('.vue') || !code.includes('composables/')) {
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
			// Capture the default export (the component definition) so the
			// operations can be attached to it before it is exported
			const defaultExport = exports.find(ex => code.slice(ex.s, ex.e) === 'default');
			const exportStart = defaultExport ? code.lastIndexOf('export', defaultExport.s) : -1;
			const isPlainDefault = exportStart !== -1
				&& /^\s+$/.test(code.slice(exportStart + 'export'.length, defaultExport.s));
			if (!isPlainDefault) {
				this.warn(`composable-operations: no plain default export in ${id}; not attaching operations`);
				return null;
			}
			const magic = new MagicString(code);
			magic.overwrite(exportStart, defaultExport.e, `const ${HOST} =`);
			// The `in` guard (rather than `?? []`) keeps the probe safe for module
			// namespaces that throw on missing exports, like vitest factory mocks
			magic.append([
				'',
				...composableSpecifiers.map((specifier, i) => `import * as ${NS}${i} from '${specifier}';`),
				`${HOST}.preFetchOperations = [`,
				...composableSpecifiers.map(
					(specifier, i) => `\t...('preFetchOperations' in ${NS}${i} ? ${NS}${i}.preFetchOperations : []),`
				),
				'];',
				`export default ${HOST};`,
				'',
			].join('\n'));
			return { code: magic.toString(), map: magic.generateMap({ hires: true }) };
		},
	};
}
