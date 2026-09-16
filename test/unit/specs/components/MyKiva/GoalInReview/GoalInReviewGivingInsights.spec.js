import { render } from '@testing-library/vue';
import GoalInReviewGivingInsights from '#src/components/MyKiva/GoalInReview/GoalInReviewGivingInsights';
import { globalOptions } from '../../../../specUtils';

const GOAL_YEAR = 2026;
const NEXT_YEAR = 2027;

const goalSummary = {
	dateStarted: '2026-02-10',
	category: 'support-all',
	transactionSessionCount: 6,
};

const renderSlide = (props = {}) => render(GoalInReviewGivingInsights, {
	global: globalOptions,
	props: {
		goalSummary,
		year: GOAL_YEAR,
		currentYear: GOAL_YEAR,
		...props,
	},
});

describe('GoalInReviewGivingInsights', () => {
	it('renders a card for each insight', () => {
		const { getByText } = renderSlide();
		getByText('Your origin story');
		getByText('Your impact identity');
		getByText('Your impact habit');
	});

	describe('impact habit timeframe', () => {
		// The habit copy emphasizes the session count in its own <strong>, so the card's
		// textContent is what reads as a sentence.
		const habitCopy = getByTestId => getByTestId('goal-in-review-giving-insights-card-impact-habit')
			.textContent
			.replace(/\s+/g, ' ');

		it('speaks in the present tense during the goal year', () => {
			const { getByTestId } = renderSlide();
			expect(habitCopy(getByTestId)).toContain('You showed up 6 times this year');
		});

		it('looks back on the sessions when read in a later year', () => {
			const { getByTestId } = renderSlide({ currentYear: NEXT_YEAR });
			expect(habitCopy(getByTestId)).toContain('You showed up 6 times last year');
		});

		it('looks back on the top percentile when read in a later year', () => {
			const { getByTestId, getByText } = renderSlide({ lifetimePercentile: 92, currentYear: NEXT_YEAR });
			getByText('Top 8%');
			expect(habitCopy(getByTestId)).toContain('among the top 8% of goal setters last year');
		});

		it('keeps the present tense when the years are unknown', () => {
			const { getByTestId } = renderSlide({ year: null, currentYear: null });
			expect(habitCopy(getByTestId)).toContain('You showed up 6 times this year');
		});
	});
});
