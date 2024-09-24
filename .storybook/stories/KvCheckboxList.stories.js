import KvCheckboxList from '#src/components/Kv/KvCheckboxList';

export default {
	title: 'Kv/Form Elements/KvCheckboxList',
	component: KvCheckboxList,
};

const items = [...Array(4)].map((_, i) => ({ value: `${i}`, title: `Option ${i}` }));

export const Default = { args: { items } };

export const ShowSelectAll = { args: { items, showSelectAll: true } };

export const SelectedValues = { args: { items, selectedValues: items.slice(0, 2).map(i => i.value) } };

export const Disabled = { args: { items: items.map(i => ({ ...i, disabled: true })) } };
