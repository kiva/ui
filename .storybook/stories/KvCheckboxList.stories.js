import KvCheckboxList from '@/components/Kv/KvCheckboxList';

export default {
	title: 'Kv/Form Elements/KvCheckboxList',
	component: KvCheckboxList,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvCheckboxList },
		template: `<kv-checkbox-list
			:show-select-all="showSelectAll"
			:items="items"
			:initial-selected="initialSelected" />`,
	})
	template.args = args;
	return template;
};

const items = [...Array(4)].map((_, i) => ({ value: `${i}`, title: `Option ${i}` }));

export const Default = story({ items });

export const ShowSelectAll = story({ items, showSelectAll: true });

export const InitialSelected = story({ items, initialSelected: items.slice(0, 2).map(i => i.value) });
