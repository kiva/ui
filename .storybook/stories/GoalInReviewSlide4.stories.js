import GoalInReviewSlide4 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide4';
import { buildSampleGoalInReviewData } from '../mock-data/goalInReviewSampleData';

const baseGoalSummary = buildSampleGoalInReviewData(2025).goalSummary;

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewSlide4',
	component: GoalInReviewSlide4,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (goalSummaryOverrides = {}) => {
	const args = { goalSummary: { ...baseGoalSummary, ...goalSummaryOverrides } };
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

// Origin-story variant: Apr–Jun start -> "The bloom chasers".
export const OriginBloomChasers = story({ dateStarted: '2025-05-10' });

// Origin-story variant: Jul–Sep start -> "The sun chasers".
export const OriginSunChasers = story({ dateStarted: '2025-08-02' });

// Impact-identity variant: support-all -> "Opportunity Spotter".
export const IdentityOpportunitySpotter = story({ category: 'support-all' });

// Impact-identity variant: any other category -> "Cause advocate".
export const IdentityCauseAdvocate = story({ category: 'basic-needs' });

// Impact-habit variant: fewer than 5 sessions -> "Rising Kiva champion".
export const HabitRisingChampion = story({ transactionSessionCount: 3 });
