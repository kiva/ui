import GoalInReviewSlide3 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide3';
import { buildSampleGoalInReviewData } from '../mock-data/goalInReviewSampleData';

const baseCountries = buildSampleGoalInReviewData(2025).goalSummary.countries;

// Dummy userAchievementProgress.tieredLendingAchievements shaped like the real
// GoalDonut query. A compact [sectorName | null, loanCount] seed expands into
// loanPurchases; the component groups these via getSectorChartValues (null sector
// -> "Other"). One loan id is duplicated across achievements to exercise de-dup.
const sectorSeed = [
	['Agriculture', 8],
	['Eco-friendly', 7],
	['Services', 5],
	['Water / Sanitation', 4],
	['Food', 3],
	['Education', 3],
	['Single Parents', 2],
	['Refugees', 2],
	['Manufacturing', 2],
	[null, 3],
];

const sampleLoanPurchases = sectorSeed.flatMap(([name, count], sectorIndex) => (
	Array.from({ length: count }, (_unused, i) => ({
		purchaseTime: '2026-01-01T00:00:00Z',
		loan: {
			id: `loan-${sectorIndex}-${i}`,
			sector: name ? { id: `sector-${sectorIndex}`, name } : null,
		},
	}))
));

const sampleSectors = [
	{
		id: 'lending-achievement',
		progressForYear: sampleLoanPurchases.length,
		loanPurchases: sampleLoanPurchases,
	},
	// A second achievement re-listing one loan — should NOT be double-counted.
	{
		id: 'womens-equality',
		progressForYear: 1,
		loanPurchases: [sampleLoanPurchases[0]],
	},
];

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewSlide3',
	component: GoalInReviewSlide3,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (countries = baseCountries, sectors = sampleSectors) => {
	const args = { countries, sectors };
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

// No sectors data -> the sectors section is hidden entirely.
export const NoSectors = story(baseCountries, null);
