import { render, fireEvent } from '@testing-library/vue';
import GoalInReviewSlide7 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide7';
import { globalOptions } from '../../../../specUtils';

// Derive years relative to "now" so the year-boundary logic is tested regardless of run date.
const currentYear = new Date().getFullYear();

const renderSlide = (props = {}) => render(GoalInReviewSlide7, {
	global: globalOptions,
	props: {
		goalStatus: 'completed',
		loanCount: 14,
		year: currentYear,
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
			const { getByText } = renderSlide({ goalStatus: 'completed', year: currentYear });
			getByText(/Thank you for helping make/);
		});

		it('uses an "already helped" lead for an in-progress goal in the current year', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'in-progress', year: currentYear });
			getByText(/already helped make/);
			expect(queryByText(/Thank you for helping make/)).toBeNull();
		});

		it('keeps the thank-you lead for an in-progress goal in the next year', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'in-progress', year: currentYear - 1 });
			getByText(/Thank you for helping make/);
			expect(queryByText(/already helped make/)).toBeNull();
		});
	});

	describe('primary CTA — current goal year', () => {
		it('complete: "Back to Kiva"', async () => {
			const { getByText, emitted } = renderSlide({ goalStatus: 'completed', year: currentYear });
			await fireEvent.click(getByText('Back to Kiva'));
			expect(emitted()['back-to-kiva']).toHaveLength(1);
		});

		it('in progress: "Finish my {year} goal"', async () => {
			const { getByText, emitted } = renderSlide({ goalStatus: 'in-progress', year: currentYear });
			await fireEvent.click(getByText(`Finish my ${currentYear} goal`));
			expect(emitted()['finish-goal']).toHaveLength(1);
		});
	});

	describe('next year (past the goal year)', () => {
		it('switches the body copy to look back and forward', () => {
			const { getByText } = renderSlide({ goalStatus: 'completed', year: currentYear - 1 });
			getByText(/more possible last year/);
			getByText(/Imagine what another year of lending could make possible/);
		});

		it('emits set-goal and hides the feedback toggle', async () => {
			const { getByText, queryByText, emitted } = renderSlide({
				goalStatus: 'completed',
				year: currentYear - 1,
			});
			await fireEvent.click(getByText(`Set my ${currentYear} goal`));
			expect(emitted()['set-goal']).toHaveLength(1);
			expect(queryByText('Share your feedback')).toBeNull();
		});
	});

	it('expands the feedback placeholder when "Share your feedback" is clicked', async () => {
		const { getByText, queryByTestId, getByTestId } = renderSlide({ goalStatus: 'completed', year: currentYear });

		expect(queryByTestId('goal-in-review-slide-7-feedback-placeholder')).toBeNull();
		await fireEvent.click(getByText('Share your feedback'));
		getByTestId('goal-in-review-slide-7-feedback-placeholder');
	});
});
