import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default { title: 'Kv | Form Elements/KvDropdownRounded' };

export const Default = () => ({
	components: { KvDropdownRounded },
	data: () => ({
		myCoolModel: 'test3',
	}),
	template: `
		<kv-dropdown-rounded v-model="myCoolModel">
			<option value="test">Test</option>
			<option value="test2">Test2</option>
			<option value="test3">Test3</option>
		</kv-dropdown-rounded>
	`,
});

export const Disabled = () => ({
	components: { KvDropdownRounded },
	data: () => ({
		myCoolModel: 'test3',
	}),
	template: `
		<kv-dropdown-rounded disabled v-model="myCoolModel">
			<option value="test">Test</option>
			<option value="test2">Test2</option>
			<option value="test3">Test3</option>
		</kv-dropdown-rounded>
	`,
});

