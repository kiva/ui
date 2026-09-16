// @vitest-environment node
import prefetchDiscoveryPlugin from '../../../../build/prefetch-discovery-plugin';

const ROOT = '/repo';

// The source of a component authored each way; the source decides whether
// children are attached
const SCRIPT_SETUP_SOURCE = `<template><div /></template>
<script setup>
const value = 1;
</script>
`;

const OPTIONS_API_SOURCE = `<template><div /></template>
<script>
export default { name: 'OptionsApi' };
</script>
`;

// Run both of the plugin's transform hooks with a stand-in rollup plugin context.
// The plugin classifies an import by where it resolves, so each case passes the
// resolutions its own imports need; an unlisted specifier throws rather than
// resolving to nothing, so a case cannot pass by failing to resolve at all.
function makeTransform(resolutions = {}) {
	const [sourcePlugin, plugin] = prefetchDiscoveryPlugin();
	plugin.configResolved({ root: ROOT });
	const warnings = [];
	const context = {
		warn: message => warnings.push(message),
		resolve: async specifier => {
			if (!(specifier in resolutions)) {
				throw new Error(`the test declared no resolution for '${specifier}'`);
			}
			return resolutions[specifier] ? { id: resolutions[specifier] } : null;
		},
	};
	const readSource = (source, id) => sourcePlugin.transform.call(context, source, id);
	const transform = (code, id) => plugin.transform.call(context, code, id);
	// Most cases care about one authoring style for one component, so record it and
	// transform in a single step
	const transformScriptSetup = (code, id) => {
		readSource(SCRIPT_SETUP_SOURCE, id.split('?')[0]);
		return transform(code, id);
	};
	const transformOptionsApi = (code, id) => {
		readSource(OPTIONS_API_SOURCE, id.split('?')[0]);
		return transform(code, id);
	};
	return {
		transform, transformScriptSetup, transformOptionsApi, readSource, warnings,
	};
}

// The shape @vitejs/plugin-vue compiles a single file component into
const compiledSfc = `import { ref } from 'vue';
import useMultiMatching from '#src/composables/useMultiMatching';
const _sfc_main = { name: 'LendCta' };
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render', _sfc_render]]);
`;

describe('prefetch-discovery-plugin composable operations', () => {
	it('attaches the imported composable operations to the default export', async () => {
		const { transformOptionsApi } = makeTransform({
			'#src/composables/useMultiMatching': `${ROOT}/src/composables/useMultiMatching.js`,
		});
		const output = await transformOptionsApi(compiledSfc, `${ROOT}/src/components/BorrowerProfile/LendCta.vue`);
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
		const { transformOptionsApi } = makeTransform({
			'#src/composables/useMultiMatching': `${ROOT}/src/composables/useMultiMatching.js`,
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
		});
		const code = `import useMultiMatching from '#src/composables/useMultiMatching';
import useBadgeData from '#src/composables/useBadgeData';
import { computed } from '#src/composables/useMultiMatching';
export default { name: 'TwoComposables' };
`;
		const output = await transformOptionsApi(code, `${ROOT}/src/components/TwoComposables.vue`);
		expect(output.code).toContain('__composableModule0');
		expect(output.code).toContain('__composableModule1');
		expect(output.code).not.toContain('__composableModule2');
	});

	it('leaves modules that are neither component nor composable modules alone', async () => {
		const { transform } = makeTransform();
		expect(await transform(compiledSfc, `${ROOT}/src/util/someUtil.js`)).toBeNull();
	});

	it('leaves sub-block requests other than the script block alone', async () => {
		const { transform } = makeTransform();
		const id = `${ROOT}/src/components/LendCta.vue?vue&type=style&index=0&lang.postcss`;
		expect(await transform(compiledSfc, id)).toBeNull();
	});

	it('ignores imports that resolve outside src/composables', async () => {
		const { transform } = makeTransform({
			'#src/util/loanUtils': `${ROOT}/src/util/loanUtils.js`,
		});
		const code = `import { toParagraphs } from '#src/util/loanUtils';
import useSomething from '@kiva/kv-components/composables/useSomething';
export default { name: 'NoComposables' };
`;
		expect(await transform(code, `${ROOT}/src/components/NoComposables.vue`)).toBeNull();
	});

	it('ignores dynamic composable imports', async () => {
		const { transform } = makeTransform();
		const code = `const lazy = () => import('#src/composables/useMultiMatching');
export default { name: 'Dynamic' };
`;
		expect(await transform(code, `${ROOT}/src/components/Dynamic.vue`)).toBeNull();
	});

	it('warns and skips when the module has no plain default export', async () => {
		const { transformScriptSetup, warnings } = makeTransform({
			'#src/composables/useMultiMatching': `${ROOT}/src/composables/useMultiMatching.js`,
		});
		const code = `import useMultiMatching from '#src/composables/useMultiMatching';
const _sfc_main = { name: 'Odd' };
export { _sfc_main as default };
`;
		expect(await transformScriptSetup(code, `${ROOT}/src/components/Odd.vue`)).toBeNull();
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain('no plain default export');
	});
});

describe('prefetch-discovery-plugin child components', () => {
	it('attaches statically imported children as namespace loaders', async () => {
		const { transformScriptSetup } = makeTransform({
			'#src/components/MyKiva/JourneyCardCarousel': `${ROOT}/src/components/MyKiva/JourneyCardCarousel.vue`,
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import { ref } from 'vue';
import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'ScriptSetupParent' };
`;
		const output = await transformScriptSetup(code, `${ROOT}/src/pages/MyKiva/MyKivaNextStepsContent.vue`);
		expect(output.code).toContain(
			"import * as __childModule0 from '#src/components/MyKiva/JourneyCardCarousel';"
		);
		expect(output.code).toContain("import * as __childModule1 from '#src/components/MyKiva/MyKivaContainer';");
		expect(output.code).toContain('__componentDefinition__.__childComponents = [');
		expect(output.code).toContain("() => ('default' in __childModule0 ? __childModule0.default : undefined),");
		expect(output.code).toContain("() => ('default' in __childModule1 ? __childModule1.default : undefined),");
		expect(output.code).toContain('export default __componentDefinition__;');
		expect(output.map).toBeTruthy();
	});

	it('attaches statically written dynamic children as import loaders', async () => {
		const { transformScriptSetup } = makeTransform({
			'#src/components/MyKiva/GoalSetting/CategoryForm':
				`${ROOT}/src/components/MyKiva/GoalSetting/CategoryForm.vue`,
		});
		const code = `import { defineAsyncComponent } from 'vue';
const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
export default { name: 'AsyncParent' };
`;
		const output = await transformScriptSetup(code, `${ROOT}/src/components/MyKiva/GoalSettingModal.vue`);
		expect(output.code).toContain("() => import('#src/components/MyKiva/GoalSetting/CategoryForm'),");
		expect(output.code).not.toContain('__childModule0');
	});

	it('attaches composable operations and children together', async () => {
		const { transformScriptSetup } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'Both' };
`;
		const output = await transformScriptSetup(code, `${ROOT}/src/components/Both.vue`);
		expect(output.code).toContain('__componentDefinition__.preFetchOperations = [');
		expect(output.code).toContain('__componentDefinition__.__childComponents = [');
		expect(output.code).toContain("import * as __composableModule0 from '#src/composables/useBadgeData';");
		expect(output.code).toContain("import * as __childModule0 from '#src/components/MyKiva/MyKivaContainer';");
	});

	it('excludes the component own sub-blocks from its children', async () => {
		const { transformScriptSetup } = makeTransform();
		const id = `${ROOT}/src/components/MyKiva/GoalSettingModal.vue`;
		const code = `import _sfc_main from '${id}?vue&type=script&setup=true&lang.ts';
import '${id}?vue&type=style&index=0&scoped=f9b1c13d&lang.postcss';
export default _sfc_main;
`;
		expect(await transformScriptSetup(code, id)).toBeNull();
	});

	it('excludes an import that resolves to a sub-block request', async () => {
		const { transformScriptSetup } = makeTransform({
			// An extensionless specifier can still resolve to a sub-block request
			'#src/components/Odd/SubBlockResolution':
				`${ROOT}/src/components/Odd/SubBlockResolution.vue?vue&type=script&setup=true&lang.ts`,
		});
		const code = `import SubBlockResolution from '#src/components/Odd/SubBlockResolution';
export default { name: 'ResolvesToSubBlock' };
`;
		expect(await transformScriptSetup(code, `${ROOT}/src/components/ResolvesToSubBlock.vue`)).toBeNull();
	});

	it('excludes a component that resolves inside node_modules', async () => {
		const { transformScriptSetup } = makeTransform({
			'#kv-components/KvPackagedComponent': `${ROOT}/node_modules/@kiva/kv-components/dist/vue/KvPackaged.vue`,
		});
		const code = `import KvPackagedComponent from '#kv-components/KvPackagedComponent';
export default { name: 'PackagedChild' };
`;
		expect(await transformScriptSetup(code, `${ROOT}/src/components/PackagedChild.vue`)).toBeNull();
	});

	it('attaches children on the script sub-module a lang="ts" block compiles into', async () => {
		const { transformScriptSetup } = makeTransform({
			'#src/components/BorrowerProfile/CountryInfo': `${ROOT}/src/components/BorrowerProfile/CountryInfo.vue`,
		});
		const id = `${ROOT}/src/components/BorrowerSideSheet/SideSheetCountry.vue`
			+ '?vue&type=script&setup=true&lang.ts';
		const code = `import { defineComponent } from 'vue';
import CountryInfo from '#src/components/BorrowerProfile/CountryInfo';
export default /* @__PURE__ */ defineComponent({ name: 'SideSheetCountry' });
`;
		const output = await transformScriptSetup(code, id);
		expect(output.code).toContain("import * as __childModule0 from '#src/components/BorrowerProfile/CountryInfo';");
		expect(output.code).toContain('__componentDefinition__.__childComponents = [');
		expect(output.code).toContain('const __componentDefinition__ = /* @__PURE__ */ defineComponent(');
	});

	it('does not attach children to a component that is not <script setup>', async () => {
		const { transformOptionsApi } = makeTransform({
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'OptionsApiParent', components: { MyKivaContainer } };
`;
		expect(await transformOptionsApi(code, `${ROOT}/src/components/OptionsApiParent.vue`)).toBeNull();
	});

	it('attaches composable operations to a component that is not <script setup>', async () => {
		const { transformOptionsApi } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'OptionsApiWithComposable' };
`;
		const output = await transformOptionsApi(code, `${ROOT}/src/components/OptionsApiWithComposable.vue`);
		expect(output.code).toContain('__componentDefinition__.preFetchOperations = [');
		expect(output.code).not.toContain('__childComponents');
	});

	it('warns and attaches no children when the component source was never seen', async () => {
		const { transform, warnings } = makeTransform({
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'Unseen' };
`;
		expect(await transform(code, `${ROOT}/src/components/Unseen.vue`)).toBeNull();
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain('no component source seen');
	});

	// The source decides whether children are attached, so cover the shapes a setup
	// block can take alongside the near misses
	it.each([
		['a setup block', '<script setup>\nconst a = 1;\n</script>', true],
		['a setup block with lang first', '<script lang="ts" setup>\nconst a = 1;\n</script>', true],
		['a setup block with lang last', '<script setup lang="ts">\nconst a = 1;\n</script>', true],
		['attributes on separate lines', '<script\n\tsetup\n\tlang="ts"\n>\nconst a = 1;\n</script>', true],
		[
			'a setup block beside a plain block',
			"<script>\nexport default { name: 'Hybrid' };\n</script>\n<script setup>\nconst a = 1;\n</script>",
			true,
		],
		['a plain block', "<script>\nexport default { name: 'Plain' };\n</script>", false],
		['a setup option in a plain block', '<script>\nexport default { setup() { return {}; } };\n</script>', false],
		['an attribute ending in setup', '<script data-setup>\nexport default {};\n</script>', false],
	])('attaches children for a component with %s: %s', async (description, scriptBlock, attaches) => {
		const { transform, readSource } = makeTransform({
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const id = `${ROOT}/src/components/DetectionCase.vue`;
		const code = `import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
export default { name: 'DetectionCase' };
`;
		readSource(`<template><div /></template>\n${scriptBlock}\n`, id);
		const output = await transform(code, id);
		expect(output !== null).toBe(attaches);
	});

	it('leaves a component with neither composables nor children alone', async () => {
		const { transformScriptSetup } = makeTransform();
		const code = `import { ref } from 'vue';
export default { name: 'Plain' };
`;
		expect(await transformScriptSetup(code, `${ROOT}/src/components/Plain.vue`)).toBeNull();
	});
});

describe('prefetch-discovery-plugin composable modules', () => {
	it('merges imported operations into the authored preFetchOperations export', async () => {
		const { transform } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';

const operation = { query: {} };

export const preFetchOperations = [operation];

export default function useGoalData() {
	return preFetchOperations;
}
`;
		const output = await transform(code, `${ROOT}/src/composables/useGoalData.js`);
		// The authored declaration keeps its binding but loses the export
		expect(output.code).not.toContain('export const preFetchOperations');
		expect(output.code).toContain('const preFetchOperations = [operation];');
		expect(output.code).toContain("import * as __composableModule0 from '#src/composables/useBadgeData';");
		expect(output.code).toContain('const __mergedPreFetchOperations = [');
		expect(output.code).toContain('\t...preFetchOperations,');
		expect(output.code).toContain(
			"...('preFetchOperations' in __composableModule0 ? __composableModule0.preFetchOperations : []),"
		);
		expect(output.code).toContain('export { __mergedPreFetchOperations as preFetchOperations };');
		expect(output.code).not.toContain('__componentDefinition__');
		expect(output.map).toBeTruthy();
	});

	it('creates the export for a composable that only composes others', async () => {
		const { transform } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';

export default function useGoalSummary() {
	return useBadgeData();
}
`;
		const output = await transform(code, `${ROOT}/src/composables/useGoalSummary.js`);
		expect(output.code).toContain('const __mergedPreFetchOperations = [');
		expect(output.code).not.toContain('...preFetchOperations,');
		expect(output.code).toContain('export { __mergedPreFetchOperations as preFetchOperations };');
	});

	it('does not attach child components to composable modules', async () => {
		const { transform } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
			'#src/components/MyKiva/MyKivaContainer': `${ROOT}/src/components/MyKiva/MyKivaContainer.vue`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';

export default function useGoalSummary() {
	return useBadgeData();
}
`;
		const output = await transform(code, `${ROOT}/src/composables/useGoalSummary.js`);
		expect(output.code).not.toContain('__childComponents');
		expect(output.code).not.toContain('__childModule0');
	});

	it('leaves composables without composable imports alone', async () => {
		const { transform } = makeTransform();
		const code = `import { computed } from 'vue';

const operation = { query: {} };

export const preFetchOperations = [operation];
`;
		expect(await transform(code, `${ROOT}/src/composables/useLeafThing.js`)).toBeNull();
	});

	it('leaves modules outside src/composables alone', async () => {
		const { transform } = makeTransform();
		const code = `import useMultiMatching from '#src/composables/useMultiMatching';
export default function helper() {}
`;
		expect(await transform(code, `${ROOT}/src/util/helper.js`)).toBeNull();
	});

	it('warns and skips composition for an unsupported export shape', async () => {
		const { transform, warnings } = makeTransform({
			'#src/composables/useBadgeData': `${ROOT}/src/composables/useBadgeData.js`,
		});
		const code = `import useBadgeData from '#src/composables/useBadgeData';
const ops = [];
export { ops as preFetchOperations };
`;
		expect(await transform(code, `${ROOT}/src/composables/useOdd.js`)).toBeNull();
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toContain('unsupported preFetchOperations export shape');
	});
});
