import BasketItem from '#src/components/Checkout/BasketItem';
import { render, within } from '@testing-library/vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '#src/router/routes';
import loanReservation from '../../../fixtures/MatchedPromoLoanReservation.json';
import basketLoanTeams from '../../../fixtures/BasketLoanTeams.json';
import { emptyComponent, globalOptions } from '../../../specUtils';

const router = createRouter({
	history: createWebHistory(),
	routes
});

// Test that the basket item renders the components it contains:
// Checkout Item Img/Borrower Link, Remove Basket Item Button, Loan Reservation, Team Attribution, Loan Promo Credits,
// Loan Price, Remove Basket Item, Matching Text
describe('BasketItem loan', () => {
	it('should contain these components and text', () => {
		loanReservation.expiryTime = '2050-09-19T19:02:10Z';
		const {
			getByText, getByTestId, getAllByTestId, getAllByRole, getByRole,
			getByDisplayValue, queryByText, queryByDisplayValue
		} = render(
			BasketItem,
			{
				global: {
					...globalOptions,
					stubs: {
						LoanReservation: { ...emptyComponent },
					},
					plugins: [router],
				},
				props: {
					disableMatching: false,
					disableRedirects: false,
					loan: loanReservation,
					teams: basketLoanTeams,
				},
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
		const BorrowerLinkUrl = new URL(BorrowerLink.href);
		expect(BorrowerLinkUrl.pathname).toBe('/lend/2444883');

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

	it('should not show a promo credit badge when applied is 0', () => {
		const loan = {
			...loanReservation,
			creditsUsed: [{
				...loanReservation.creditsUsed[0],
				applied: '0.00',
			}]
		};
		const { queryByTestId } = render(
			BasketItem,
			{
				global: {
					...globalOptions,
					stubs: { LoanReservation: { ...emptyComponent } },
					plugins: [router],
				},
				props: {
					disableRedirects: false,
					loan,
					teams: [],
				},
			}
		);

		expect(queryByTestId('basket-loan-promo-credit')).toBeNull();
	});

	it('should show the applied amount on the promo credit badge, not the total amount', () => {
		const loan = {
			...loanReservation,
			creditsUsed: [{
				...loanReservation.creditsUsed[0],
				amount: '25.00',
				applied: '15.00',
			}]
		};
		const { getByTestId } = render(
			BasketItem,
			{
				global: {
					...globalOptions,
					stubs: { LoanReservation: { ...emptyComponent } },
					plugins: [router],
				},
				props: {
					disableRedirects: false,
					loan,
					teams: [],
				},
			}
		);

		const LoanPromoCredit = getByTestId('basket-loan-promo-credit');
		expect(within(LoanPromoCredit).getByText('15.00 credit applied'));
		expect(within(LoanPromoCredit).queryByText('25.00 credit applied')).toBeNull();
	});

	describe('simultaneous matching', () => {
		const matchers = [
			{
				managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null
			},
			{
				managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null
			},
		];

		// Mock apollo returning the multiMatchingEnabled setting that useMultiMatching reads.
		function matchingApollo(multiMatchingEnabled = true) {
			return {
				readFragment: () => {},
				readQuery: () => {},
				query: () => Promise.resolve({
					data: {
						general: {
							multiMatchingEnabled: {
								key: 'multiMatchingEnabled',
								value: String(multiMatchingEnabled),
							},
						},
					},
				}),
				mutate: () => Promise.resolve({}),
			};
		}

		function renderWithFlag(loan, multiMatchingEnabled = true) {
			return render(BasketItem, {
				global: {
					...globalOptions,
					provide: { ...globalOptions.provide, apollo: matchingApollo(multiMatchingEnabled) },
					stubs: { LoanReservation: { ...emptyComponent } },
					plugins: [router],
				},
				props: { disableRedirects: false, loan, teams: [] },
			});
		}

		it('shows simultaneous matching text when the flag is on, simultaneousMatching is present '
			+ 'and matchingText is empty', async () => {
			const loan = {
				...loanReservation,
				loan: {
					...loanReservation.loan,
					matchingText: '',
					simultaneousMatching: matchers,
				},
			};
			const { getByTestId } = renderWithFlag(loan);
			await flushPromises();
			// 1 base + Capital One ratio 3 + Tripadvisor ratio 1 = 5x
			const matchingText = getByTestId('basket-loan-matching-text').textContent;
			expect(matchingText).toContain('5x matching by contributing partners');
		});

		it('shows simultaneous matching text even when matchingText is also present', async () => {
			const loan = {
				...loanReservation,
				loan: {
					...loanReservation.loan,
					matchingText: 'Coca Cola Foundation',
					simultaneousMatching: matchers,
				},
			};
			const { getByTestId } = renderWithFlag(loan);
			await flushPromises();
			const matchingText = getByTestId('basket-loan-matching-text').textContent;
			expect(matchingText).toContain('5x matching by contributing partners');
		});

		it('falls back to matchingText when the multiMatching flag is off, even if matchers are present', async () => {
			const loan = {
				...loanReservation,
				loan: {
					...loanReservation.loan,
					matchingText: 'Coca Cola Foundation',
					simultaneousMatching: matchers,
				},
			};
			const { getByTestId } = renderWithFlag(loan, false);
			await flushPromises();
			expect(getByTestId('basket-loan-matching-text').textContent).toContain('Matched by Coca Cola Foundation');
		});

		it('does not render the matcher when the flag is off and only simultaneousMatching is present', async () => {
			const loan = {
				...loanReservation,
				loan: {
					...loanReservation.loan,
					matchingText: '',
					simultaneousMatching: matchers,
				},
			};
			const { queryByTestId } = renderWithFlag(loan, false);
			await flushPromises();
			expect(queryByTestId('basket-loan-matching-text')).toBeNull();
		});

		it('falls back to matchingText when simultaneousMatching is empty', async () => {
			const loan = {
				...loanReservation,
				loan: {
					...loanReservation.loan,
					matchingText: 'Coca Cola Foundation',
					simultaneousMatching: [],
				},
			};
			const { getByTestId } = renderWithFlag(loan);
			await flushPromises();
			expect(getByTestId('basket-loan-matching-text').textContent).toContain('Matched by Coca Cola Foundation');
		});
	});

	it('should show amounts 1,000 and over for logged in user and huge amount enabled', () => {
		loanReservation.expiryTime = '2050-09-19T19:02:10Z';
		render(
			BasketItem,
			{
				global: {
					...globalOptions,
					stubs: {
						LoanReservation: { ...emptyComponent },
					},
					plugins: [router],
				},
				props: {
					disableMatching: false,
					disableRedirects: false,
					loan: loanReservation,
					teams: basketLoanTeams,
					isLoggedIn: true,
				},
			},
		);

		const LoanPrice = document.getElementById('loan-price');
		expect(within(LoanPrice).getByRole('option', { name: '$1,000' }));
		expect(within(LoanPrice).getByRole('option', { name: '$2,000' }));
		expect(within(LoanPrice).getByRole('option', { name: '$3,685' }));
	});

	describe('achievement / goal pill suppression', () => {
		const renderItem = (props = {}) => render(BasketItem, {
			global: {
				...globalOptions,
				plugins: [router],
				stubs: {
					LoanReservation: { ...emptyComponent },
					KvCartPill: {
						name: 'KvCartPill',
						props: ['customMessage'],
						template: '<div data-testid="cart-pill">{{ customMessage }}<slot name="icon" /></div>',
					},
				},
			},
			props: {
				disableMatching: false,
				disableRedirects: false,
				loan: loanReservation,
				teams: basketLoanTeams,
				...props,
			},
		});

		it('shows the achievement pill when nudges are not suppressed and loan contributes to an achievement', () => {
			const { queryByTestId } = renderItem({
				contributesInAchievement: true,
				suppressAchievementNudges: false,
				loadingGoalData: false,
			});
			expect(queryByTestId('cart-pill')).not.toBeNull();
		});

		it('hides the achievement pill when nudges are suppressed and the loan does not contribute to the goal', () => {
			const { queryByTestId } = renderItem({
				contributesInAchievement: true,
				suppressAchievementNudges: true,
				loanContributesToGoal: false,
				loadingGoalData: false,
			});
			expect(queryByTestId('cart-pill')).toBeNull();
		});

		it('does not show the first-loan pill while nudges are suppressed', () => {
			const { queryByTestId } = renderItem({
				contributesInAchievement: false,
				suppressAchievementNudges: true,
				loanContributesToGoal: false,
				isFirstLoan: true,
				loadingGoalData: false,
			});
			expect(queryByTestId('cart-pill')).toBeNull();
		});

		it('still shows the goal-progress pill when nudges are suppressed and the loan contributes to the goal', () => {
			const { queryByTestId, getByText } = renderItem({
				contributesInAchievement: false,
				suppressAchievementNudges: true,
				loanContributesToGoal: true,
				loadingGoalData: false,
			});
			expect(queryByTestId('cart-pill')).not.toBeNull();
			expect(getByText('Supporting this loan reaches your annual goal!')).toBeTruthy();
		});

		it('hides the pill while goal data is still loading even when nudges are not suppressed', () => {
			const { queryByTestId } = renderItem({
				contributesInAchievement: true,
				suppressAchievementNudges: false,
				loadingGoalData: true,
			});
			expect(queryByTestId('cart-pill')).toBeNull();
		});
	});
});
