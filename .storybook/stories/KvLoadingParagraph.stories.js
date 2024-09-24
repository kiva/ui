import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';

const args = {
	numLines: 4,
};

export default {
	title: 'Kv/KvLoadingParagraph',
	component: KvLoadingParagraph,
	args,
};

export const Default = (args, { argTypes }) => ({
	components: { KvLoadingParagraph },
	props: Object.keys(argTypes),
	setup() { return args; },
	template: '<kv-loading-paragraph :numLines="numLines" />'
});
