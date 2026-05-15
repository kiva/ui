import { render } from '@testing-library/vue';
import LoanList from '#src/components/Portfolio/LoanList';

const makeLoan = (overrides = {}) => ({
	id: 1208499,
	name: 'Maria',
	status: 'payingBack',
	use: 'to buy supplies',
	image: { id: 1, url: '/img/loan.jpg' },
	geocode: { country: { id: 1, isoCode: 'PE', name: 'Peru' } },
	loanAmount: '525',
	loanFundraisingInfo: { id: 1, fundedAmount: '525' },
	sector: { id: 1, name: 'Retail' },
	lenderRepaymentTerm: 8,
	terms: {
		loanAmount: '525',
		expectedPayments: [{ dueToKivaDate: '2026-12-01' }],
	},
	userProperties: {
		loanBalance: {
			amountPurchasedByLender: '25',
			amountRepaidToLender: '5',
			latestSharePurchaseTime: '2026-03-15T12:00:00Z',
		},
	},
	teams: { values: [] },
	partnerName: 'Partner 44',
	partnerId: 44,
	...overrides,
});

const renderLoanList = ({ loans, loading = false } = {}) => render(LoanList, {
	props: { loans, loading },
	global: {
		provide: {
			cookieStore: { get: () => null, set: () => {} },
		},
		directives: { kvTrackEvent: () => {} },
		stubs: {
			KvFlag: { template: '<span class="kv-flag" />' },
			KvLoadingPlaceholder: { template: '<div class="kv-loading-placeholder" />' },
			PaidAmountModal: {
				props: ['amount'],
				template: '<span class="paid-amount">{{ amount }}</span>',
			},
		},
	},
});

describe('LoanList — "You loaned" cell', () => {
	it('renders the formatted latest share purchase date under the amount', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		expect(page.getByText('$25')).toBeTruthy();
		expect(page.getByText('Mar 15, 2026')).toBeTruthy();
	});

	it('renders no date element when latestSharePurchaseTime is null', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$25')).toBeTruthy();
		expect(page.queryByText('Mar 15, 2026')).toBeNull();
		expect(page.queryByText('Invalid Date')).toBeNull();
	});
});
