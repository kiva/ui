import GoalInReviewSlide4 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide4';

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewSlide4',
	component: GoalInReviewSlide4,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (args = {}) => {
	const template = () => ({
		components: { GoalInReviewSlide4 },
		setup() { return { args }; },
		template: '<GoalInReviewSlide4 v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const Desktop = story();

Desktop.parameters = {
	viewport: {
		defaultViewport: 'largeBreakpoint',
	},
};

export const Mobile = story();

Mobile.parameters = {
	viewport: {
		defaultViewport: 'mobile2',
	},
};
