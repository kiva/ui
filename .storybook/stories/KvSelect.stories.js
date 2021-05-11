import KvSelect from '@/components/Kv/KvSelect';

export default {
	title: 'Kv/Form Elements/KvSelect',
	component: KvSelect,
};

export const Default = () => ({
	components: { KvSelect },
	data: () => ({
		myCoolModel: 'test3',
	}),
	template: `
		<kv-select v-model="myCoolModel">
			<option value="test">Test</option>
			<option value="test2">Test2</option>
			<option value="test3">Test3</option>
		</kv-select>
	`,
});

export const Disabled = () => ({
	components: { KvSelect },
	data: () => ({
		myCoolModel: 'test3',
	}),
	template: `
		<kv-select disabled v-model="myCoolModel">
			<option value="test">Test</option>
			<option value="test2">Test2</option>
			<option value="test3">Test3</option>
		</kv-select>
	`,
});

