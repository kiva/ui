import { render } from '@testing-library/vue';
import GoalInReviewSlide2 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide2';
import { MAX_BORROWER_CARDS } from '#src/util/goalInReviewBorrowers';
import { globalOptions } from '../../../../specUtils';

const global = {
	...globalOptions,
	mocks: { ...globalOptions.mocks, $appConfig: { photoPath: '' } },
};

const buildLoans = (count, startId = 1) => Array.from({ length: count }, (_unused, i) => ({
	id: startId + i,
	name: `Borrower ${startId + i}`,
	image: { hash: `hash-${startId + i}` },
}));

const renderSlide = (props = {}) => render(GoalInReviewSlide2, {
	global,
	props: { loans: buildLoans(3), borrowerCount: 3, ...props },
});

describe('GoalInReviewSlide2', () => {
	it('renders the eyebrow copy', () => {
		const { getByText } = renderSlide();
		getByText('The people behind the loans');
	});

	describe('headline', () => {
		it('uses the borrower total on both halves', () => {
			const { getByText } = renderSlide({ loans: buildLoans(48), borrowerCount: 48 });
			getByText(/48 borrowers\./);
			getByText('48 futures.');
		});

		it('formats large totals with separators', () => {
			const { getByText } = renderSlide({ loans: buildLoans(12), borrowerCount: 1200 });
			getByText(/1,200 borrowers\./);
			getByText('1,200 futures.');
		});

		it('uses singular copy for a single borrower', () => {
			const { getByText } = renderSlide({ loans: buildLoans(1), borrowerCount: 1 });
			getByText(/1 borrower\./);
			getByText('1 future.');
		});

		it('falls back to the number of cards when the total is missing', () => {
			const { getByText } = renderSlide({ loans: buildLoans(3), borrowerCount: null });
			getByText(/3 borrowers\./);
		});
	});

	describe('borrower grid', () => {
		it('renders a card per loan with the borrower name', () => {
			const { getByText } = renderSlide();
			getByText('Borrower 1');
			getByText('Borrower 2');
			getByText('Borrower 3');
		});

		it('renders the borrower photo with the name as alt text', () => {
			const { getByAltText } = renderSlide({ loans: buildLoans(1), borrowerCount: 1 });
			expect(getByAltText('Borrower 1')).toBeTruthy();
		});

		it('truncates names to a single line rather than wrapping', () => {
			const { getByText } = renderSlide({
				loans: [{ id: 1, name: 'Esperanza Del Carmen Villalobos Hernández', image: { hash: 'h' } }],
				borrowerCount: 1,
			});
			expect(getByText('Esperanza Del Carmen Villalobos Hernández').className).toContain('tw-truncate');
		});

		it('keeps the grid hook that caps the photo columns', () => {
			const { getByTestId } = renderSlide();
			expect(getByTestId('goal-in-review-slide-2-borrowers').className).toContain('borrower-grid');
		});

		it('falls back to a placeholder tile when a loan has no image', () => {
			const { queryByAltText, getByText } = renderSlide({
				loans: [{ id: 1, name: 'No photo' }],
				borrowerCount: 1,
			});
			getByText('No photo');
			expect(queryByAltText('No photo')).toBeNull();
		});
	});

	describe('overflow tile', () => {
		it('is hidden at exactly the card limit', () => {
			const { queryByTestId } = renderSlide({
				loans: buildLoans(MAX_BORROWER_CARDS),
				borrowerCount: MAX_BORROWER_CARDS,
			});
			expect(queryByTestId('goal-in-review-slide-2-more')).toBeNull();
		});

		it('shows the remainder one over the limit', () => {
			const total = MAX_BORROWER_CARDS + 1;
			const { getByText } = renderSlide({ loans: buildLoans(total), borrowerCount: total });
			getByText('+1 more');
		});

		it('sums with the shown cards back to the slide 1 total', () => {
			const { getByText, getByTestId } = renderSlide({ loans: buildLoans(48), borrowerCount: 48 });
			getByText(`+${48 - MAX_BORROWER_CARDS} more`);
			expect(getByTestId('goal-in-review-slide-2-more')).toBeTruthy();
		});

		it('formats a large remainder with separators', () => {
			const { getByText } = renderSlide({ loans: buildLoans(12), borrowerCount: 1200 });
			getByText(`+${(1200 - MAX_BORROWER_CARDS).toLocaleString('en-US')} more`);
		});
	});

	it('degrades gracefully with no loans (no "undefined" or "NaN" in copy)', () => {
		const { container } = renderSlide({ loans: [], borrowerCount: null });
		expect(container.textContent).not.toContain('undefined');
		expect(container.textContent).not.toContain('NaN');
	});
});
