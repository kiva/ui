import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel.vue';

export default {
	title: 'MyKiva/JourneyCardCarousel',
	component: JourneyCardCarousel,
};

const slideData = {
	title: 'Women’s equality',
	subtitle: 'Continue challenge',
	badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg',
	backgroundImg: 'https://images.ctfassets.net/j0p9a6ql0rn7/7mY5ZujL9UfbluRkVkHgkX/5ec83a74e7c1dc387f3fa35af34f5243/mg-hppromo-1-wxga-retina.jpg',
	primaryCtaText: 'Lend to a woman',
	primaryCtaUrl: '/lend-by-category',
	secondaryCtaText: 'Learn more',
	secondaryCtaUrl: '/about',
};

const content = {
	slides: [
		{ ...slideData },
		{ ...slideData, secondaryCtaText: '', },
		{ ...slideData },
		{ ...slideData },
		{ ...slideData },
	],
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JourneyCardCarousel },
		setup() { return { args }; },
		template: `
			<div style="max-width: 1200px;">
				<journey-card-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ content });
