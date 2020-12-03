import KvPhoneInput from '@/components/Kv/KvPhoneInput';

export default {
	title: 'Kv/KvPhoneInput',
	component: KvPhoneInput,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	template: `
		<kv-phone-input />
	`,
});
