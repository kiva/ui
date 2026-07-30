import GoalInReviewSlide3 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide3';
import { buildSampleGoalInReviewData } from '../mock-data/goalInReviewSampleData';

const baseCountries = buildSampleGoalInReviewData(2025).goalSummary.countries;

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewSlide3',
	component: GoalInReviewSlide3,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (countries = baseCountries) => {
	const args = { countries };
	const template = () => ({
		components: { GoalInReviewSlide3 },
		setup() { return { args }; },
		template: '<GoalInReviewSlide3 v-bind="args" />',
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

// Fewer than 14 countries -> all pills shown, no "Other (n)" overflow pill.
export const FewCountries = story(baseCountries.slice(0, 6));
