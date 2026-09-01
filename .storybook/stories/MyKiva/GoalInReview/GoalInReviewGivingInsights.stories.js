import GoalInReviewGivingInsights from '#src/components/MyKiva/GoalInReview/GoalInReviewGivingInsights';
import { buildSampleGoalInReviewData } from '../../../mock-data/goalInReviewSampleData';

const baseGoalSummary = buildSampleGoalInReviewData(2025).goalSummary;

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewGivingInsights',
	component: GoalInReviewGivingInsights,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = ({ lifetimePercentile = null, ...goalSummaryOverrides } = {}) => {
	const args = {
		goalSummary: { ...baseGoalSummary, ...goalSummaryOverrides },
		lifetimePercentile,
	};
	const template = () => ({
		components: { GoalInReviewGivingInsights },
		setup() { return { args }; },
		template: '<GoalInReviewGivingInsights v-bind="args" />',
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

// The base Desktop/Mobile stories already cover the default variants:
// origin "The spark starters" (Jan), identity "Barrier Breaker" (women's equality),
// and habit "Kiva champion" (6 sessions). The stories below cover the rest.

// Origin-story variant: Apr–Jun start -> "The bloom chasers".
export const OriginBloomChasers = story({ dateStarted: '2025-05-10' });

// Origin-story variant: Jul–Sep start -> "The sun chasers".
export const OriginSunChasers = story({ dateStarted: '2025-08-02' });

// Origin-story variant: Oct–Dec start -> "The Reflectionist".
export const OriginReflectionist = story({ dateStarted: '2025-11-20' });

// Impact-identity variant: support-all -> "Opportunity Spotter".
export const IdentityOpportunitySpotter = story({ category: 'support-all' });

// Impact-identity variant: any other category -> "Cause advocate".
export const IdentityCauseAdvocate = story({ category: 'basic-needs' });

// Impact-habit variant: fewer than 5 sessions -> "Rising Kiva champion".
export const HabitRisingChampion = story({ transactionSessionCount: 3 });

// Impact-habit variant: a single session -> "Rising Kiva champion" with singular "1 time".
export const HabitSingleSession = story({ transactionSessionCount: 1 });

// Impact-habit variant: top-percentile lender -> "Top X%".
// TODO: lifetimePercentile is dummy data here — the parent page will supply the
// real value once the percentile query is integrated.
export const HabitTopPercentile = story({ lifetimePercentile: 92 });
