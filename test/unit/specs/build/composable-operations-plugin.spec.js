// @vitest-environment node
import composableOperationsPlugin from '../../../../build/composable-operations-plugin';

const ROOT = '/repo';

const KV_COMPOSABLE = '@kiva/kv-components/composables/useSomething';

const resolutions = {
	'#src/composables/useMultiMatching': `${ROOT}/src/composables/useMultiMatching.js`,
	'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
	[KV_COMPOSABLE]: `${ROOT}/node_modules/${KV_COMPOSABLE}.js`,
};

// Run the plugin's transform hook with a stand-in rollup plugin context
function makeTransform() {
	const plugin = composableOperationsPlugin();
	plugin.configResolved({ root: ROOT });
	const warnings = [];
	const context = {
		warn: message => warnings.push(message),
		resolve: async specifier => (resolutions[specifier] ? { id: resolutions[specifier] } : null),
	};
	const transform = (code, id) => plugin.transform.call(context, code, id);
	return { transform, warnings };
}

// The shape @vitejs/plugin-vue compiles a single file component into
const compiledSfc = `import { ref } from 'vue';
import useMultiMatching from '#src/composables/useMultiMatching';
const _sfc_main = { name: 'LendCta' };
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render', _sfc_render]]);
`;

describe('composable-operations-plugin', () => {
	it('attaches the imported composable operations to the default export', async () => {
		const { transform } = makeTransform();
		const output = await transform(compiledSfc, `${ROOT}/src/components/BorrowerProfile/LendCta.vue`);
		expect(output.code).toContain("import * as __composableModule0 from '#src/composables/useMultiMatching';");
		expect(output.code).toContain('const __componentDefinition__ = /*#__PURE__*/_export_sfc(_sfc_main,');
		expect(output.code).toContain('__componentDefinition__.preFetchOperations = [');
		expect(output.code).toContain(
			"...('preFetchOperations' in __composableModule0 ? __composableModule0.preFetchOperations : []),"
		);
		expect(output.code).toContain('export default __componentDefinition__;');
		expect(output.code).not.toContain('export default /*#__PURE__*/_export_sfc');
		expect(output.map).toBeTruthy();
	});

	it('attaches one spread per distinct composable module', async () => {
		const { transform } = makeTransform();
		const code = `import useMultiMatching from '#src/composables/useMultiMatching';
import useBadgeData from '#src/composables/useBadgeData';
import { computed } from '#src/composables/useMultiMatching';
export default { name: 'TwoComposables' };
`;
		const output = await transform(code, `${ROOT}/src/components/TwoComposables.vue`);
		expect(output.code).toContain('__composableModule0');
		expect(output.code).toContain('__composableModule1');
		expect(output.code).not.toContain('__composableModule2');
	});

	it('leaves modules that are not .vue main modules alone', async () => {
		const { transform } = makeTransform();
		expect(await transform(compiledSfc, `${ROOT}/src/util/someUtil.js`)).toBeNull();
		expect(await transform(compiledSfc, `${ROOT}/src/components/LendCta.vue?vue&type=style`)).toBeNull();
	});

	it('leaves components without composable imports alone', async () => {
		const { transform } = makeTransform();
		const code = `import { ref } from 'vue';
export default { name: 'Plain' };
`;
		expect(await transform(code, `${ROOT}/src/components/Plain.vue`)).toBeNull();
	});

	it('ignores composable-looking imports that resolve outside src/composables', async () => {
		const { transform } = makeTransform();
		const code = `import useSomething from '@kiva/kv-components/composables/useSomething';
export default { name: 'External' };
`;
		expect(await transform(code, `${ROOT}/src/components/External.vue`)).toBeNull();
	});

	it('ignores dynamic composable imports', async () => {
		const { transform } = makeTransform();
		const code = `const lazy = () => import('#src/composables/useMultiMatching');
export default { name: 'Dynamic' };
`;
		expect(await transform(code, `${ROOT}/src/components/Dynamic.vue`)).toBeNull();
	});

	it('warns and skips when the module has no plain default export', async () => {
		const { transform, warnings } = makeTransform();
		const code = `import useMultiMatching from '#src/composables/useMultiMatching';
const _sfc_main = { name: 'Odd' };
export { _sfc_main as default };
`;
		expect(await transform(code, `${ROOT}/src/components/Odd.vue`)).toBeNull();
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain('no plain default export');
	});
});
