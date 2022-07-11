import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';

export default {
	title: 'Kv/KvLoadingParagraph',
	component: KvLoadingParagraph,
	args: {
		numLines: 4,
	},
};

export const Default = (args, { argTypes }) => ({
	components: { KvLoadingParagraph },
	props: Object.keys(argTypes),
	template: '<kv-loading-paragraph :numLines="numLines" />'
});
