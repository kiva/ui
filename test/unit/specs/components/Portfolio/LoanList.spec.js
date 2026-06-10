import { render } from '@testing-library/vue';
import LoanList from '#src/components/Portfolio/LoanList';
import numeralFilter from '#src/plugins/numeral-filter';

const makeLoan = (overrides = {}) => ({
	id: 1208499,
	name: 'Maria',
	status: 'payingBack',
	statusLabel: null,
	use: 'to buy supplies',
	image: { id: 1, url: '/img/loan.jpg' },
	geocode: { country: { id: 1, isoCode: 'PE', name: 'Peru' } },
	activity: { id: 11, name: 'General Store' },
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
			amountPurchasedByPromo: null,
			amountRepaidToLender: '5',
			amountRepaidToPromo: null,
			latestSharePurchaseTime: '2026-03-15T12:00:00Z',
		},
		userAttributedTeam: null,
	},
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
		mocks: {
			$filters: { numeral: numeralFilter },
		},
		stubs: {
			KvFlag: { template: '<span class="kv-flag" />' },
			KvLoadingPlaceholder: { template: '<div class="kv-loading-placeholder" />' },
			PaidAmountModal: {
				props: ['amount'],
				// eslint-disable-next-line no-template-curly-in-string
				template: '<span class="paid-amount">${{ amount }}</span>',
			},
		},
	},
});

describe('LoanList — column order', () => {
	it('renders headers in the legacy parity order', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		const headers = Array.from(page.container.querySelectorAll('thead th')).map(th => th.textContent.trim());
		expect(headers).toEqual([
			'Loan details',
			'Status',
			'You loaned',
			'Paid back or raised',
			'Length',
			'Amount',
			'Team',
		]);
	});
});

describe('LoanList — "Loan details" cell', () => {
	it('renders activity name, not sector', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				activity: { id: 11, name: 'General Store' },
				sector: { id: 1, name: 'Retail' },
			})],
		});

		expect(page.getByText('General Store')).toBeTruthy();
		expect(page.queryByText('Retail')).toBeNull();
	});

	it('renders a dash when activity is missing', () => {
		const page = renderLoanList({
			loans: [makeLoan({ activity: null })],
		});

		expect(page.queryByText('General Store')).toBeNull();
		expect(page.getAllByText('-').length).toBeGreaterThan(0);
	});

	it('renders trustee link for a direct loan with trusteeName', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				partnerName: undefined,
				partnerId: undefined,
				trusteeName: 'My Trustee Org',
				trusteeId: 99,
			})],
		});

		const link = page.getByText('My Trustee Org');
		expect(link).toBeTruthy();
		expect(link.closest('a').getAttribute('href')).toBe('/trustees/99');
	});

	it('renders partner link for a partner loan', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		const link = page.getByText('Partner 44');
		expect(link.closest('a').getAttribute('href')).toBe('/about/where-kiva-works/partners/44');
	});

	it('prefers trustee over partner if both are present (direct-loan parity)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				partnerName: 'Partner 44',
				partnerId: 44,
				trusteeName: 'My Trustee Org',
				trusteeId: 99,
			})],
		});

		expect(page.getByText('My Trustee Org')).toBeTruthy();
		expect(page.queryByText('Partner 44')).toBeNull();
	});
});

describe('LoanList — "Status" cell', () => {
	it('renders the server-provided statusLabel', () => {
		const page = renderLoanList({
			loans: [makeLoan({ status: 'payingBack', statusLabel: 'Currently Repaying' })],
		});

		expect(page.getByText('Currently Repaying')).toBeTruthy();
	});

	it('falls back to the raw status when statusLabel is missing', () => {
		const page = renderLoanList({
			loans: [makeLoan({ status: 'payingBackDelinquent', statusLabel: null })],
		});

		expect(page.getByText('payingBackDelinquent')).toBeTruthy();
	});
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

	it('renders free credit when amountPurchasedByPromo is positive', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10',
						amountRepaidToLender: '5',
						amountRepaidToPromo: null,
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
				},
			})],
		});

		expect(page.getByText('$10 free credit')).toBeTruthy();
	});

	it('omits free credit line when amountPurchasedByPromo is null or zero', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		expect(page.queryByText(/free credit/)).toBeNull();
	});
});

describe('LoanList — "Paid back or raised" cell', () => {
	it('renders "raised" amount for fundraising loans', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'fundraising',
				loanFundraisingInfo: { id: 1, fundedAmount: '300' },
			})],
		});

		expect(page.getByText('$300 raised')).toBeTruthy();
	});

	it('renders "raised" amount for raised loans', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'raised',
				loanFundraisingInfo: { id: 1, fundedAmount: '525' },
			})],
		});

		expect(page.getByText('$525 raised')).toBeTruthy();
	});

	it('renders the lender-repaid amount as the clickable trigger with "repaid to you" copy below', () => {
		const page = renderLoanList({ loans: [makeLoan({ status: 'payingBack' })] });

		expect(page.getByText('$5')).toBeTruthy();
		expect(page.getByText('repaid to you')).toBeTruthy();
		expect(page.queryByText(/\$5.*repaid to you/)).toBeNull();
	});

	it('uses "repaid/refunded to you" copy below the trigger for refunded loans with lender repayment', () => {
		const page = renderLoanList({
			loans: [makeLoan({ status: 'refunded' })],
		});

		expect(page.getByText('$5')).toBeTruthy();
		expect(page.getByText('repaid/refunded to you')).toBeTruthy();
	});

	it('shows the lender share ($0) as the trigger and "repaid to Kiva" copy when only promo was repaid', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '0',
						amountPurchasedByPromo: '25',
						amountRepaidToLender: '0',
						amountRepaidToPromo: '3.50',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$0');
		expect(page.getByText('repaid to Kiva')).toBeTruthy();
	});

	it('uses "repaid/refunded to Kiva" copy for expired loans with only promo repayment', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'expired',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '0',
						amountPurchasedByPromo: '25',
						amountRepaidToLender: '0',
						amountRepaidToPromo: '25.00',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$0');
		expect(page.getByText('repaid/refunded to Kiva')).toBeTruthy();
	});

	it('uses the lender share only as the clickable amount, not lender + promo', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '20',
						amountPurchasedByPromo: '5',
						amountRepaidToLender: '4',
						amountRepaidToPromo: '1',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		// Lender share only — promo $1 is not added to the trigger
		expect(page.getByText('$4')).toBeTruthy();
		expect(page.queryByText('$5')).toBeNull();
		expect(page.getByText('repaid to you')).toBeTruthy();
	});

	it('renders shared arrears alongside paid-back amount', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBackDelinquent',
				sharedArrearsAmount: '1.25',
			})],
		});

		expect(page.getByText('$5')).toBeTruthy();
		expect(page.getByText('repaid to you')).toBeTruthy();
		expect(page.getByText('(-$1.25 in arrears)')).toBeTruthy();
	});

	it('renders a clickable $0 placeholder when there is nothing repaid and the loan is not fundraising', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						amountRepaidToLender: '0',
						amountRepaidToPromo: null,
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$0')).toBeTruthy();
		expect(page.queryByText(/repaid/)).toBeNull();
		expect(page.queryByText(/\$\d.*\braised\b/)).toBeNull();
	});
});

describe('LoanList — arrears rendering', () => {
	it('renders loan-wide and shared arrears for a delinquent paying-back loan', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				arrearsAmount: '7.50',
				sharedArrearsAmount: '1.25',
			})],
		});

		expect(page.getByText('(-$7.50 in arrears)')).toBeTruthy();
		expect(page.getByText('(-$1.25 in arrears)')).toBeTruthy();
	});

	it('renders no arrears text when arrears amounts are null', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				arrearsAmount: null,
				sharedArrearsAmount: null,
			})],
		});

		expect(page.queryByText(/in arrears/)).toBeNull();
	});

	it('renders "$0.00 in arrears" without a negative sign when amounts are zero', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				arrearsAmount: '0',
				sharedArrearsAmount: '0',
			})],
		});

		expect(page.getAllByText('($0.00 in arrears)').length).toBe(2);
	});

	it('formats arrears with thousand-separators and cents', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				terms: { loanAmount: '50000', expectedPayments: [] },
				arrearsAmount: '1234.56',
				sharedArrearsAmount: '61.73',
			})],
		});

		expect(page.getByText('$50,000')).toBeTruthy();
		expect(page.getByText('(-$1,234.56 in arrears)')).toBeTruthy();
		expect(page.getByText('(-$61.73 in arrears)')).toBeTruthy();
	});

	// kiva-main's resolver can return negative values when the borrower has caught
	// back up while the delinquency flag is still set (see LoanBasicType.arrearsAmount).
	// The UI must suppress these — rendering "($-3.21 in arrears)" would be wrong.
	it('renders no arrears text when arrears amounts are negative', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				arrearsAmount: '-3.21',
				sharedArrearsAmount: '-0.16',
			})],
		});

		expect(page.queryByText(/in arrears/)).toBeNull();
	});
});

describe('LoanList — row banding', () => {
	const makeLoans = count => Array.from({ length: count }, (_, i) => makeLoan({ id: 2000 + i }));

	it('applies alternating gray banding to every other data row, starting on the second', () => {
		const page = renderLoanList({ loans: makeLoans(4) });
		const rows = [...page.container.querySelectorAll('tbody tr')];

		expect(rows).toHaveLength(4);
		expect(rows[0].classList.contains('tw-bg-gray-50')).toBe(false);
		expect(rows[1].classList.contains('tw-bg-gray-50')).toBe(true);
		expect(rows[2].classList.contains('tw-bg-gray-50')).toBe(false);
		expect(rows[3].classList.contains('tw-bg-gray-50')).toBe(true);
	});
});

describe('LoanList — team cell', () => {
	it('renders the user-attributed team name and image when present', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: {
						id: 42,
						name: 'Cat Lovers',
						image: { id: 5, url: '/img/team-cat.jpg' },
					},
				},
			})],
		});

		expect(page.getByText('Cat Lovers')).toBeTruthy();
		expect(page.getByAltText('Cat Lovers team image')).toBeTruthy();
	});

	it('renders a placeholder when there is no user-attributed team', () => {
		const page = renderLoanList({
			loans: [makeLoan()],
		});

		// Placeholder dash for missing team.
		expect(page.getAllByText('-').length).toBeGreaterThan(0);
	});

	it('renders the team name without an image when image is missing', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: null,
					},
					userAttributedTeam: {
						id: 7,
						name: 'No Image Team',
						image: null,
					},
				},
			})],
		});

		expect(page.getByText('No Image Team')).toBeTruthy();
		expect(page.queryByAltText('No Image Team team image')).toBeNull();
	});
});
