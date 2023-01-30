import FormAssemblyEmbed from '@/components/Forms/FormAssemblyEmbed';

export default {
	title: 'Forms/FormAssemblyEmbed',
	component: FormAssemblyEmbed,
	args: {
		formAssemblyId: `134`,
		queryParams: `?tfa_3989=0`
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		FormAssemblyEmbed
	},
	template: `
		<form-assembly-embed
			:form-assembly-id="formAssemblyId"
			:query-params="queryParams"
		/>
	`,
});
