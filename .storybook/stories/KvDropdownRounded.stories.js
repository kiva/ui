import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default { title: 'Kv | KvDropdownRounded' };

export const withData = () => ({
	components: { KvDropdownRounded },
	data: () => ({
		testModel: 'test3',
	}),
	template: `
	<kv-dropdown-rounded v-model="testModel">
		<option value="test">Test</option>
		<option value="test2">Test2</option>
		<option value="test3">Test3</option>
	</kv-dropdown-rounded>`,
});
