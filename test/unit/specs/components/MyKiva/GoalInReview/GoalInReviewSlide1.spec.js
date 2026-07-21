import { render } from '@testing-library/vue';
import GoalInReviewSlide1 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide1';
import { globalOptions } from '../../../../specUtils';

const baseProps = {
	goalStatus: 'completed',
	firstName: 'Alexandra',
	year: 2026,
	amountLent: 1025,
	borrowerCount: 14,
	category: 'women',
	percentComplete: 100,
};

const renderSlide = (props = {}) => render(GoalInReviewSlide1, {
	global: globalOptions,
	props: { ...baseProps, ...props },
});

describe('GoalInReviewSlide1', () => {
	it('renders the recap pill with the goal year', () => {
		const { getByText } = renderSlide();
		getByText('Your 2026 impact goal recap');
	});

	describe('complete variant', () => {
		it('greets the lender by name', () => {
			const { getByText } = renderSlide({ goalStatus: 'completed' });
			getByText(/You did it,/);
			getByText('Alexandra');
		});

		it('falls back to a generic headline when the name is missing', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'completed', firstName: '' });
			getByText('You did it!');
			expect(queryByText(/You did it,/)).toBeNull();
		});
	});

	describe('in-progress variant', () => {
		it('shows the in-progress headline instead of the complete one', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'in-progress' });
			getByText(/Your goal moved/);
			getByText('lives forward');
			expect(queryByText(/You did it/)).toBeNull();
		});
	});

	describe('stats', () => {
		it('renders all four stats from live data', () => {
			const { getByText } = renderSlide();
			getByText('$1,025');
			getByText('Total lent');
			getByText('14');
			getByText('Borrowers');
			getByText('Women');
			getByText('100%');
			getByText('Complete');
		});

		it('uses the singular "Borrower" label when the count is 1', () => {
			const { getByText, queryByText } = renderSlide({ borrowerCount: 1 });
			getByText('Borrower');
			expect(queryByText('Borrowers')).toBeNull();
		});

		it('formats large amounts and borrower counts with separators', () => {
			const { getByText } = renderSlide({ amountLent: 12500, borrowerCount: 1200 });
			getByText('$12,500');
			getByText('1,200');
		});

		it('degrades gracefully when stats are missing (no "undefined" in copy)', () => {
			const { container, getAllByText } = renderSlide({
				amountLent: null,
				borrowerCount: null,
				category: '',
				percentComplete: null,
			});
			// all four stat values fall back to an em dash
			expect(getAllByText('—')).toHaveLength(4);
			expect(container.textContent).not.toContain('undefined');
			expect(container.textContent).not.toContain('NaN');
		});
	});

	it('shows the scroll prompt', () => {
		const { getByText } = renderSlide();
		getByText('Scroll to explore the stories behind your goal');
	});
});
