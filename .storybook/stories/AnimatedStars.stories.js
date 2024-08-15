import AnimatedStars from '#src/components/Thanks/AnimatedStars.vue';

export default {
	title: 'Components/AnimatedStars',
	component: AnimatedStars,
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { AnimatedStars },
	template: '<div class="tw-bg-stone-1 tw-w-12 tw-h-12 tw-relative"><animated-stars v-bind="$props" /></div>',
});

export const Default = Template.bind({});
