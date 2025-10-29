import { render } from '@testing-library/vue';
import LoanPromoCredits from '../../../../../src/components/Checkout/LoanPromoCredits';

describe('LoanPromoCredits', () => {
	it('should display promo credit amount', () => {
		const { getByText } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: [
					{
						amount: 25,
						promoFund: {
							displayName: 'Test Sponsor'
						}
					}
				]
			}
		});

		getByText('25 credit applied');
		getByText('Test Sponsor');
	});

	it('should handle multiple promo credits', () => {
		const { getAllByTestId } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: [
					{
						amount: 10,
						promoFund: { displayName: 'Sponsor 1' }
					},
					{
						amount: 15,
						promoFund: { displayName: 'Sponsor 2' }
					}
				]
			}
		});

		const credits = getAllByTestId('basket-loan-promo-credit');
		expect(credits.length).toBe(2);
	});

	it('should not display credit badge when amount is 0', () => {
		const { queryByText, getByText } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: [
					{
						amount: 0,
						promoFund: { displayName: 'Zero Sponsor' }
					}
				]
			}
		});

		// Credit badge should not show (line 31)
		expect(queryByText('0 credit applied')).toBeNull();
		// But sponsor name should still show
		getByText('Zero Sponsor');
	});

	it('should handle null promoFund displayName', () => {
		const { getByText, queryByText } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: [
					{
						amount: 20,
						promoFund: null
					}
				]
			}
		});

		// Amount shows (lines 38-39)
		getByText('20 credit applied');
		// Display name section doesn't show when null
		expect(queryByText('Sponsored by:')).toBeNull();
	});

	it('should handle undefined amount with nullish coalescing', () => {
		const { queryByText } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: [
					{
						amount: undefined,
						promoFund: { displayName: 'Test' }
					}
				]
			}
		});

		// When amount is undefined, defaults to 0 via ?? operator
		expect(queryByText('0 credit applied')).toBeNull();
	});

	it('should handle empty appliedPromoCredits array', () => {
		const { container } = render(LoanPromoCredits, {
			props: {
				appliedPromoCredits: []
			}
		});

		const credits = container.querySelectorAll('[data-testid="basket-loan-promo-credit"]');
		expect(credits.length).toBe(0);
	});
});
