import BasketItem from '@/components/Checkout/BasketItem';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import VueRouter from 'vue-router';
import numeralFilter from '@/plugins/numeral-filter';
import CookieStore from '@/util/cookieStore';
import { render, within } from '@testing-library/vue';
import loanReservation from '../../../../fixtures/MatchedPromoLoanReservation.json';
import basketLoanTeams from '../../../../fixtures/BasketLoanTeams.json';

// Test that the basket item renders the components it contains:
// Checkout Item Img/Borrower Link, Remove Basket Item Button, Loan Reservation, Team Attribution, Loan Promo Credits,
// Loan Price, Remove Basket Item, Matching Text

const emptyComponent = {
	template: '<div></div>',
};

describe('BasketItem loan', () => {
	it('should contain these components and text', () => {
		loanReservation.expiryTime = '2050-09-19T19:02:10Z';
		const {
			getByText, getByTestId, getAllByTestId, getAllByRole, getByRole,
			getByDisplayValue, queryByText, queryByDisplayValue
		} = render(
			BasketItem,
			{
				provide: {
					apollo: {
						readFragment: () => {},
						query: () => Promise.resolve({}),
						readQuery: () => {},
					},
					cookieStore: new CookieStore(),
				},
				routes: new VueRouter(),
				props: {
					disableMatching: false,
					disableRedirects: false,
					loan: loanReservation,
					teams: basketLoanTeams,
				},
				stubs: {
					LoanReservation: { ...emptyComponent }
				}
			},
			vue => {
				vue.use(kvAnalytics);
				vue.filter('numeral', numeralFilter);
			}
		);

		// not a component, but making sure this is showing
		const LoanTitle = getByText('Twubakane Cb Group in Rwanda');
		const LoanName = getByTestId('basket-loan-name');
		expect(LoanTitle).toBe(LoanName);

		// Can't use text 'reservation expires in' to select because it is inside a component rendered
		// by LoanReservation, which has not actually been rendered here.
		const LoanReservation = getByTestId('basket-loan-reservation-text');
		const LoanResEx = LoanReservation.getAttribute('expiry-time');
		// correct expiry time made it to component
		expect(LoanResEx).toBe('2050-09-19T19:02:10Z');

		const CheckoutItemImg = getByTestId('basket-loan-image');
		const BorrowerLink = getByRole('link');
		expect(BorrowerLink).toBe(CheckoutItemImg);
		expect(BorrowerLink.href).toBe('http://localhost/#/lend/2444883');

		const LoanPrice = document.getElementById('loan-price');
		const LoanPriceSelected = LoanPrice.options[LoanPrice.selectedIndex].getAttribute('value');
		getByTestId('basket-loan-price-selector');
		getByText('$25');
		getByText('$50');
		// 25 should be selected by default
		getByDisplayValue('$25');
		const LoanPriceDisplayValueNext = queryByDisplayValue('$50');
		expect(LoanPriceDisplayValueNext).toBe(null);
		expect(LoanPriceSelected).toBe('25');
		expect(LoanPrice.value).toBe('25');
		expect(LoanPrice.value).not.toBe('50');
		expect(within(LoanPrice).getByRole('option', { name: '$50' }));
		expect(within(LoanPrice).getByRole('option', { name: '$975' }));
		// 1000 should not exist in drop down
		const LoanPriceOptionNull = queryByText('$1000');
		expect(LoanPriceOptionNull).toBeNull();

		getAllByTestId('basket-loan-team-selector');

		getAllByTestId('removeBasketItem');
		getByTestId('basket-loan-info');
		const RemoveButton = getAllByRole('button', { name: 'Close' });
		expect(within(RemoveButton[0]).getByTitle('Remove from cart'));
		expect(within(RemoveButton[1]).getByTitle('Remove from cart'));
		expect(RemoveButton[0].classList.contains('md:tw-hidden')).toBe(true); // mobile version
		expect(RemoveButton[1].classList.contains('md:tw-flex')).toBe(true); // tablet and up sizes

		getByText('Matched by Coca Cola Foundation');

		const LoanPromoCredit = getByTestId('basket-loan-promo-credit');
		expect(within(LoanPromoCredit).getByText('25.00 credit applied'));
		expect(within(LoanPromoCredit).getByText('AppDynamics'));
		expect(within(LoanPromoCredit).getByText('Sponsored by:'));
	});
});
