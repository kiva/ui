import getDeepComponents from '@/util/getDeepComponents';

const ComponentA = { name: 'ComponentA' };

const asyncDefinitionA = { name: 'AsyncComponentA' };
const AsyncComponentA = () => Promise.resolve({ default: asyncDefinitionA });

const ComponentB = { name: 'ComponentB' };

const asyncDefinitionB = {
	name: 'AsyncComponentB',
	components: {
		ComponentB
	}
};
const AsyncComponentB = () => Promise.resolve({ default: asyncDefinitionB });

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
});
