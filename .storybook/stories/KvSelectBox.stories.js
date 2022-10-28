import KvSelectBox from '@/components/Kv/KvSelectBox';

export default {
	title: 'Kv/Form Elements/KvSelectBox',
	component: KvSelectBox,
};

const items = [...Array(20)].map((_, i) => ({ id: i, name: `Item ${i + 1}`, header: `Header ${i % 5}` }));

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvSelectBox },
		data: () => ({
			myCoolModel: '',
		}),
		template: `<kv-select-box id="select-box" :items="items" header-key="header" :selected-ids="selectedIds">
			<option value="test">Test</option>
			<option value="test2">Test2</option>
			<option value="test3">Test3</option>
		</kv-select-box>`,
	})
	template.args = args;
	return template;
};

export const Empty = story();

export const Items = story({ items });

export const Selected = story({ items, selectedIds: [0, 2] });
