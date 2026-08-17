import GoalInReviewGlobalReach from '#src/components/MyKiva/GoalInReview/GoalInReviewGlobalReach';
import {
	buildSampleGoalInReviewData,
	sampleGoalSectors,
	sampleGoalSectorsWithOther,
} from '../../../mock-data/goalInReviewSampleData';

const baseCountries = buildSampleGoalInReviewData(2025).goalSummary.countries;

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewGlobalReach',
	component: GoalInReviewGlobalReach,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (countries = baseCountries, sectors = sampleGoalSectors) => {
	const args = { countries, sectors };
	const template = () => ({
		components: { GoalInReviewGlobalReach },
		setup() { return { args }; },
		template: '<GoalInReviewGlobalReach v-bind="args" />',
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

// No sectors data -> the sectors section is hidden entirely.
export const NoSectors = story(baseCountries, null);

// Some loans have no sector -> an "Other (n)" pill joins the legend.
export const WithOtherSector = story(baseCountries, sampleGoalSectorsWithOther);
