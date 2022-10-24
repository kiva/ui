import KvSelectBox from '@/components/Kv/KvSelectBox';

export default {
	title: 'Kv/Form Elements/KvSelectBox',
	component: KvSelectBox,
};

const items = [...Array(20)].map((_, i) => ({ id: i, name: `Item ${i + 1}` }));
[...Array(5)].forEach((_, i) => items.splice([i * 5], 0, { isHeader: true, name: `Header ${i + 1}` }));

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvSelectBox },
		data: () => ({
			myCoolModel: '',
		}),
		template: `<kv-select-box id="select-box" :items="items">
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
