import { render, fireEvent } from '@testing-library/vue';
import GoalInReviewSlide7 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide7';
import { globalOptions } from '../../../../specUtils';

const GOAL_YEAR = 2026;
const CURRENT_YEAR = 2026;
const NEXT_YEAR = 2027;

const renderSlide = (props = {}) => render(GoalInReviewSlide7, {
	global: globalOptions,
	props: {
		goalStatus: 'completed',
		loanCount: 14,
		year: GOAL_YEAR,
		currentYear: CURRENT_YEAR,
		...props,
	},
});

describe('GoalInReviewSlide7', () => {
	it('renders the thank-you headline and loan-count copy', () => {
		const { getByText } = renderSlide();
		getByText('Thank you!');
		getByText(/14 dreams/);
	});

	describe('contribution lead copy', () => {
		it('thanks the lender for a completed goal', () => {
			const { getByText } = renderSlide({
				goalStatus: 'completed', year: GOAL_YEAR, currentYear: CURRENT_YEAR,
			});
			getByText(/Thank you for helping make/);
		});

		it('uses an "already helped" lead for an in-progress goal in the current year', () => {
			const { getByText, queryByText } = renderSlide({
				goalStatus: 'in-progress', year: GOAL_YEAR, currentYear: CURRENT_YEAR,
			});
			getByText(/already helped make/);
			expect(queryByText(/Thank you for helping make/)).toBeNull();
		});

		it('keeps the thank-you lead for an in-progress goal in the next year', () => {
			const { getByText, queryByText } = renderSlide({
				goalStatus: 'in-progress', year: GOAL_YEAR, currentYear: NEXT_YEAR,
			});
			getByText(/Thank you for helping make/);
			expect(queryByText(/already helped make/)).toBeNull();
		});
	});

	describe('primary CTA — current goal year', () => {
		it('complete: "Back to Kiva"', async () => {
			const { getByText, emitted } = renderSlide({
				goalStatus: 'completed', year: GOAL_YEAR, currentYear: CURRENT_YEAR,
			});
			await fireEvent.click(getByText('Back to Kiva'));
			expect(emitted()['back-to-kiva']).toHaveLength(1);
		});

		it('in progress: "Finish my {year} goal"', async () => {
			const { getByText, emitted } = renderSlide({
				goalStatus: 'in-progress', year: GOAL_YEAR, currentYear: CURRENT_YEAR,
			});
			await fireEvent.click(getByText(`Finish my ${GOAL_YEAR} goal`));
			expect(emitted()['finish-goal']).toHaveLength(1);
		});
	});

	describe('next year (past the goal year)', () => {
		it('switches the body copy to look back and forward', () => {
			const { getByText } = renderSlide({ goalStatus: 'completed', year: GOAL_YEAR, currentYear: NEXT_YEAR });
			getByText(/more possible last year/);
			getByText(/Imagine what another year of lending could make possible/);
		});

		it('emits set-goal and hides the feedback toggle', async () => {
			const { getByText, queryByText, emitted } = renderSlide({
				goalStatus: 'completed',
				year: GOAL_YEAR,
				currentYear: NEXT_YEAR,
			});
			await fireEvent.click(getByText(`Set my ${GOAL_YEAR + 1} goal`));
			expect(emitted()['set-goal']).toHaveLength(1);
			expect(queryByText('Share your feedback')).toBeNull();
		});
	});

	it('expands the feedback placeholder when "Share your feedback" is clicked', async () => {
		const { getByText, queryByTestId, getByTestId } = renderSlide({
			goalStatus: 'completed', year: GOAL_YEAR, currentYear: CURRENT_YEAR,
		});

		expect(queryByTestId('goal-in-review-slide-7-feedback-placeholder')).toBeNull();
		await fireEvent.click(getByText('Share your feedback'));
		getByTestId('goal-in-review-slide-7-feedback-placeholder');
	});

	it('tracks opening the feedback survey', async () => {
		const trackEvent = vi.fn();
		const { getByText } = render(GoalInReviewSlide7, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					$kvTrackEvent: trackEvent,
				},
			},
			props: {
				goalStatus: 'completed',
				loanCount: 14,
				year: GOAL_YEAR,
				currentYear: CURRENT_YEAR,
			},
		});

		await fireEvent.click(getByText('Share your feedback'));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'goal-in-review-share-feedback');
	});
});
