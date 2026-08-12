import { defineAsyncComponent } from 'vue';
import getDeepComponents from '#src/util/getDeepComponents';

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

// The build step attaches __childComponents as a list of loaders for the imported children
describe('getDeepComponents attached child components', () => {
	it('walks children attached without a components option', async () => {
		const AttachedChild = { name: 'AttachedChild' };
		const ScriptSetupParent = {
			name: 'ScriptSetupParent',
			__childComponents: [() => AttachedChild],
		};
		const result = await getDeepComponents([ScriptSetupParent]);
		expectMatchingComponents(result, [ScriptSetupParent, AttachedChild]);
	});

	it('walks children attached as module namespace loaders', async () => {
		const NamespacedChild = { name: 'NamespacedChild' };
		const Parent = {
			name: 'Parent',
			__childComponents: [() => Promise.resolve({ default: NamespacedChild })],
		};
		const result = await getDeepComponents([Parent]);
		expectMatchingComponents(result, [Parent, NamespacedChild]);
	});

	it('walks the components option and the attached children together', async () => {
		const RegisteredChild = { name: 'RegisteredChild' };
		const AttachedChild = { name: 'AttachedChild' };
		const Parent = {
			name: 'Parent',
			components: { RegisteredChild },
			__childComponents: [() => AttachedChild],
		};
		const result = await getDeepComponents([Parent]);
		expectMatchingComponents(result, [Parent, RegisteredChild, AttachedChild]);
	});

	it('walks a whole tree of attached children', async () => {
		const Grandchild = { name: 'Grandchild' };
		const Child = { name: 'Child', __childComponents: [() => Grandchild] };
		const Parent = { name: 'Parent', __childComponents: [() => Child] };
		const result = await getDeepComponents([Parent]);
		expectMatchingComponents(result, [Parent, Child, Grandchild]);
	});

	it('adds a child reached through both routes only once', async () => {
		const SharedChild = { name: 'SharedChild' };
		const Parent = {
			name: 'Parent',
			components: { SharedChild },
			__childComponents: [() => SharedChild],
		};
		const result = await getDeepComponents([Parent]);
		expect(result.filter(c => c.name === 'SharedChild')).toHaveLength(1);
	});

	it('skips a child whose loader resolves to nothing', async () => {
		const RealChild = { name: 'RealChild' };
		const Parent = {
			name: 'Parent',
			__childComponents: [() => undefined, () => RealChild],
		};
		const result = await getDeepComponents([Parent]);
		expectMatchingComponents(result, [Parent, RealChild]);
	});

	it('terminates on a cycle between attached children', async () => {
		// The loader reads through the holder, so the child can point back at a parent
		// that does not exist yet
		const cycle = {};
		const CyclicChild = { name: 'CyclicChild', __childComponents: [() => cycle.parent] };
		const CyclicParent = { name: 'CyclicParent', __childComponents: [() => CyclicChild] };
		cycle.parent = CyclicParent;
		const result = await getDeepComponents([CyclicParent]);
		expectMatchingComponents(result, [CyclicParent, CyclicChild]);
	});
});
