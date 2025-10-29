import { defineAsyncComponent } from 'vue';
import getDeepComponents from '../../../../src/util/getDeepComponents';

const ComponentA = { name: 'ComponentA' };

const asyncDefinitionA = { name: 'AsyncComponentA' };
const AsyncComponentA = defineAsyncComponent(() => Promise.resolve({ default: asyncDefinitionA }));

const ComponentB = { name: 'ComponentB' };

const asyncDefinitionB = {
	name: 'AsyncComponentB',
	components: {
		ComponentB
	}
};
const AsyncComponentB = defineAsyncComponent(() => Promise.resolve({ default: asyncDefinitionB }));

const ComponentC = {
	name: 'ComponentC',
	components: {
		ComponentA,
		AsyncComponentB,
	}
};

const ComponentD = {
	name: 'ComponentD',
	components: {
		ComponentA,
		ComponentC,
	},
};

const ParentComponent = {
	name: 'ParentComponent',
	components: {
		AsyncComponentA,
		ComponentD,
	},
};

function expectMatchingComponents(received, expected) {
	expect(received.map(c => c.name).sort()).toEqual(expected.map(c => c.name).sort());
}

describe('getDeepComponents', () => {
	it('returns a list of all the components in the tree', async () => {
		const noChildrenResult = await getDeepComponents([ComponentA]);
		expectMatchingComponents(noChildrenResult, [ComponentA]);

		const asyncNoChildrenResult = await getDeepComponents([AsyncComponentA]);
		expectMatchingComponents(asyncNoChildrenResult, [asyncDefinitionA]);

		const asnycResult = await getDeepComponents([AsyncComponentB]);
		expectMatchingComponents(asnycResult, [asyncDefinitionB, ComponentB]);

		const complexTreeResult = await getDeepComponents([ParentComponent]);
		expectMatchingComponents(complexTreeResult, [
			ParentComponent, ComponentA, ComponentB, ComponentC, ComponentD, asyncDefinitionA, asyncDefinitionB
		]);
	});

	it('should handle function-based dynamic imports', async () => {
		// Function that returns a component definition (line 13 case)
		const dynamicComponent = () => Promise.resolve({ name: 'DynamicComponent' });
		const result = await getDeepComponents([dynamicComponent]);
		expectMatchingComponents(result, [{ name: 'DynamicComponent' }]);
	});

	it('should handle empty components array', async () => {
		const result = await getDeepComponents([]);
		expect(result).toEqual([]);
	});

	it('should handle null components', async () => {
		const result = await getDeepComponents(null);
		expect(result).toEqual([]);
	});

	it('should handle undefined components', async () => {
		const result = await getDeepComponents(undefined);
		expect(result).toEqual([]);
	});

	it('should handle object-based components (not array)', async () => {
		const components = {
			CompA: ComponentA,
			CompB: ComponentB,
		};
		const result = await getDeepComponents(components);
		expectMatchingComponents(result, [ComponentA, ComponentB]);
	});

	it('should handle component with default export wrapper', async () => {
		const componentDefinition = { name: 'InnerComponent' };
		const wrappedComponent = () => Promise.resolve({ default: componentDefinition });
		const result = await getDeepComponents([wrappedComponent]);
		expectMatchingComponents(result, [componentDefinition]);
	});

	it('should deduplicate components that appear multiple times', async () => {
		const ComponentX = { name: 'ComponentX' };
		const Parent1 = {
			name: 'Parent1',
			components: { ComponentX },
		};
		const Parent2 = {
			name: 'Parent2',
			components: { ComponentX },
		};
		const result = await getDeepComponents([Parent1, Parent2]);
		// ComponentX should appear only once
		const componentXCount = result.filter(c => c.name === 'ComponentX').length;
		expect(componentXCount).toBe(1);
		expect(result.length).toBe(3); // Parent1, Parent2, ComponentX
	});

	it('should handle nested async components with children', async () => {
		const DeepChild = { name: 'DeepChild' };
		const asyncParent = defineAsyncComponent(() => Promise.resolve({
			default: {
				name: 'AsyncParent',
				components: { DeepChild },
			},
		}));
		const result = await getDeepComponents([asyncParent]);
		expect(result.length).toBe(2);
		expectMatchingComponents(result, [
			{ name: 'AsyncParent', components: { DeepChild } },
			DeepChild,
		]);
	});

	it('should handle component without components property', async () => {
		const SimpleComponent = { name: 'SimpleComponent' };
		const result = await getDeepComponents([SimpleComponent]);
		expectMatchingComponents(result, [SimpleComponent]);
	});

	it('should handle mixed array of regular and async components', async () => {
		const RegularComp = { name: 'RegularComp' };
		const AsyncComp = defineAsyncComponent(() => Promise.resolve({
			default: { name: 'AsyncComp' },
		}));
		const result = await getDeepComponents([RegularComp, AsyncComp]);
		expect(result.length).toBe(2);
		expect(result.map(c => c.name).sort()).toEqual(['AsyncComp', 'RegularComp']);
	});
});
