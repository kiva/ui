import { render, fireEvent } from '@testing-library/vue';
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
			totalAmountPurchased: '25',
			amountPurchasedByLender: '25',
			amountPurchasedByPromo: null,
			promoTypeLabel: null,
			amountRepaidToLender: '5',
			amountReturnedTotal: '5',
			latestSharePurchaseTime: '2026-03-15T12:00:00Z',
		},
		userAttributedTeam: null,
		wasMatched: false,
	},
	partnerName: 'Partner 44',
	partnerId: 44,
	...overrides,
});

const renderLoanList = ({
	loans, loading = false, hasError = false, lendingTeams = [], reassigningLoanIds = [], reassignNonce = {},
} = {}) => render(LoanList, {
	props: {
		loans, loading, hasError, lendingTeams, reassigningLoanIds, reassignNonce,
	},
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
			KvMaterialIcon: { props: ['icon'], template: '<span class="kv-material-icon" />' },
			PaidAmountModal: {
				props: ['amount'],
				// eslint-disable-next-line no-template-curly-in-string
				template: '<span class="paid-amount">${{ amount }}</span>',
			},
		},
	},
});

describe('LoanList — no-results empty state', () => {
	it('renders the live legacy no-match copy when a filter/search returns no loans', () => {
		const page = renderLoanList({ loans: [], loading: false });

		expect(page.getByTestId('no-loans-message').textContent.trim())
			.toBe("You haven't made any loans that match this search.");
		// Legacy parity: this is the filtered no-match state, not the tombstoned
		// DataTables "No loans found" / "No loans returned" strings.
		expect(page.queryByText('No loans found')).toBeNull();
	});

	it('does not render the no-results copy while loans are still loading', () => {
		const page = renderLoanList({ loans: [], loading: true });

		expect(page.queryByTestId('no-loans-message')).toBeNull();
	});
});

describe('LoanList — error state', () => {
	it('shows a distinct error message (not the no-match copy) when hasError is set', () => {
		const page = renderLoanList({ loans: [], loading: false, hasError: true });

		expect(page.getByTestId('loans-error-message').textContent.trim())
			.toBe("We couldn't load your loans right now. Please refresh the page and try again.");
		// A backend failure must NOT masquerade as the filtered "no loans match" empty state.
		expect(page.queryByTestId('no-loans-message')).toBeNull();
	});

	it('does not render the error message while loans are still loading', () => {
		const page = renderLoanList({ loans: [], loading: true, hasError: true });

		expect(page.queryByTestId('loans-error-message')).toBeNull();
	});
});

describe('LoanList — Hotjar PII suppression (legacy parity)', () => {
	// Legacy tagged every borrower-identifying surface with the data-hj-suppress hook so
	// names, loan IDs, and dedication recipients are masked in Hotjar recordings.
	const piiLoan = () => makeLoan({
		partnerName: 'Partner 44',
		partnerId: 44,
		userProperties: {
			loanBalance: {
				amountPurchasedByLender: '25',
				amountPurchasedByPromo: null,
				promoTypeLabel: null,
				amountRepaidToLender: '5',
				amountReturnedTotal: '5',
				latestSharePurchaseTime: '2026-03-15T12:00:00Z',
			},
			wasMatched: false,
			canChangeTeamAssignment: false,
			dedication: { recipientName: 'Grandma Rosa', dedicationUrl: '/dedicate/1', toKiva: false },
			userAttributedTeam: {
				id: 7, name: 'Team Kiva', teamPublicId: 'team-kiva', image: { url: '/t.jpg' },
			},
		},
	});

	it('suppresses the borrower image, name/ID link, partner link, dedication link, and read-only team link', () => {
		const page = renderLoanList({ loans: [piiLoan()] });

		expect(page.container.querySelector('img.loan-image').classList.contains('data-hj-suppress')).toBe(true);
		expect(
			page.container.querySelector('a[href="/lend/1208499"]').classList.contains('data-hj-suppress')
		).toBe(true);
		expect(page.getByText('Partner 44').closest('a').classList.contains('data-hj-suppress')).toBe(true);
		expect(
			page.container.querySelector('[data-testid="loan-dedication"] a').classList.contains('data-hj-suppress')
		).toBe(true);
		expect(page.getByText('Team Kiva').closest('a').classList.contains('data-hj-suppress')).toBe(true);
	});

	it('suppresses the team reassignment select for eligible loans', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						promoTypeLabel: null,
						amountRepaidToLender: '5',
						amountReturnedTotal: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					wasMatched: false,
					canChangeTeamAssignment: true,
					userAttributedTeam: null,
				},
			})],
			lendingTeams: [{ id: 7, name: 'Team Kiva' }],
		});

		const select = page.container.querySelector('#reassign-team-1208499');
		expect(select).not.toBeNull();
		// The suppress hook may sit on the select or a KvSelect wrapper; either masks the subtree.
		expect(select.closest('.data-hj-suppress')).not.toBeNull();
	});
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

		// Legacy parity (MP-2936): lender share uses $0,0.00 — always two decimals.
		expect(page.getByText('$25.00')).toBeTruthy();
		expect(page.getByText('Mar 15, 2026')).toBeTruthy();
	});

	it('renders no date element when latestSharePurchaseTime is null', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						totalAmountPurchased: '25',
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$25.00')).toBeTruthy();
		expect(page.queryByText('Mar 15, 2026')).toBeNull();
		expect(page.queryByText('Invalid Date')).toBeNull();
	});

	it('renders the typed promo label when promoTypeLabel is present', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10',
						promoTypeLabel: 'free credit',
						amountRepaidToLender: '5',
						amountReturnedTotal: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
				},
			})],
		});

		expect(page.getByText('$10 free credit')).toBeTruthy();
	});

	it('renders the "free trial" promo label when promoTypeLabel is "free trial"', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10',
						promoTypeLabel: 'free trial',
						amountRepaidToLender: '5',
						amountRepaidToPromo: null,
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
				},
			})],
		});

		expect(page.getByText('$10 free trial')).toBeTruthy();
	});

	it('falls back to "promotional credit" when promoTypeLabel is null', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10',
						promoTypeLabel: null,
						amountRepaidToLender: '5',
						amountRepaidToPromo: null,
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
				},
			})],
		});

		expect(page.getByText('$10 promotional credit')).toBeTruthy();
	});

	it('omits the promo line when amountPurchasedByPromo is null or zero', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		expect(page.queryByText(/promotional credit/)).toBeNull();
		expect(page.queryByText(/free credit/)).toBeNull();
	});

	it('shows the gross share (totalAmountPurchased), not the lender net cash, when promo credit was applied', () => {
		// Legacy parity (MP-2943): the "You loaned" headline is the GROSS share — sum of every
		// purchase_amt (totalAmountPurchased), matching legacy's $loan_lender->shareAmount. A $25
		// share bought partly/entirely with free credit has amountPurchasedByLender of $20/$0 (net
		// of promo), which would understate or zero out what the lender loaned.
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						totalAmountPurchased: '25',
						amountPurchasedByLender: '0',
						amountPurchasedByPromo: '25',
						promoTypeLabel: 'free credit',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$25.00')).toBeTruthy();
		expect(page.queryByText('$0.00')).toBeNull();
	});
});

describe('LoanList — cents formatting (MP-2936)', () => {
	// Legacy parity: fractional amounts must keep their cents instead of rounding to
	// whole dollars ($10.50 -> $11). Legacy uses an always-two-decimal $0,0.00 for the
	// lender / raised / loan-amount figures and a cents-when-present $0,0[.]00 for promo.
	it('renders the lender share with cents, not rounded to whole dollars', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						totalAmountPurchased: '10.50',
						amountPurchasedByLender: '10.50',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$10.50')).toBeTruthy();
		expect(page.queryByText('$11')).toBeNull();
	});

	it('renders the promo amount with cents when present', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10.50',
						promoTypeLabel: 'free trial',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.getByText('$10.50 free trial')).toBeTruthy();
	});

	it('renders a whole-dollar promo amount without trailing .00 (legacy [.]00 behavior)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: '10',
						promoTypeLabel: 'free trial',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		// Promo is the one field whose cents are conditional: $10, not $10.00.
		expect(page.getByText('$10 free trial')).toBeTruthy();
	});

	it('renders the loan amount with cents, not rounded', () => {
		const page = renderLoanList({
			loans: [makeLoan({ terms: { loanAmount: '525.50', expectedPayments: [] } })],
		});

		expect(page.getByText('$525.50')).toBeTruthy();
		expect(page.queryByText('$526')).toBeNull();
	});

	it('renders the "raised" amount with cents, not rounded', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'fundraising',
				loanFundraisingInfo: { id: 1, fundedAmount: '300.25' },
			})],
		});

		expect(page.container.textContent.replace(/\s+/g, ' ')).toContain('$300.25 raised');
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

		expect(page.container.textContent.replace(/\s+/g, ' ')).toContain('$300.00 raised');
	});

	it('renders "raised" amount for raised loans', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'raised',
				loanFundraisingInfo: { id: 1, fundedAmount: '525' },
			})],
		});

		expect(page.container.textContent.replace(/\s+/g, ' ')).toContain('$525.00 raised');
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

	it('shows the total returned ($3.50) as the trigger and "repaid to Kiva" copy '
		+ 'when nothing went to the lender', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '0',
						amountPurchasedByPromo: '25',
						amountRepaidToLender: '0',
						amountReturnedTotal: '3.50',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$3.50');
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
						amountReturnedTotal: '25',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$25');
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
						amountReturnedTotal: '5',
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

	it('shows "repaid to Kiva" when the share returned via a non-lender path '
		+ '(dedicated/buyback) with nothing to the lender (MP-2932)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						amountRepaidToLender: '0',
						amountReturnedTotal: '6',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$6');
		expect(page.getByText('repaid to Kiva')).toBeTruthy();
	});

	it('gates "repaid to you" on the returned-to-lender amount, so a refund-only '
		+ 'lender share (returned > 0, repaid 0) still shows the line (MP-2932)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'refunded',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						amountRepaidToLender: '25',
						amountReturnedTotal: '25',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.container.querySelector('.paid-amount').textContent.trim()).toBe('$25');
		expect(page.getByText('repaid/refunded to you')).toBeTruthy();
		expect(page.queryByText(/to Kiva/)).toBeNull();
	});

	it('shows no repaid line when nothing was returned on the share (MP-2932)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				status: 'payingBack',
				userProperties: {
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						amountRepaidToLender: '0',
						amountReturnedTotal: '0',
						latestSharePurchaseTime: null,
					},
				},
			})],
		});

		expect(page.queryByText(/repaid/)).toBeNull();
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
						amountReturnedTotal: '0',
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

	it('renders no arrears line when arrears amounts are zero (MP-2932)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				arrearsAmount: '0',
				sharedArrearsAmount: '0',
			})],
		});

		expect(page.queryByText(/in arrears/)).toBeNull();
	});

	it('formats arrears with thousand-separators and cents', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				terms: { loanAmount: '50000', expectedPayments: [] },
				arrearsAmount: '1234.56',
				sharedArrearsAmount: '61.73',
			})],
		});

		expect(page.getByText('$50,000.00')).toBeTruthy();
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

	it('applies alternating banding to every other data row, starting on the second', () => {
		const page = renderLoanList({ loans: makeLoans(4) });
		const rows = [...page.container.querySelectorAll('tbody tr')];

		expect(rows).toHaveLength(4);
		expect(rows[0].classList.contains('!tw-bg-gray-50')).toBe(false);
		expect(rows[1].classList.contains('!tw-bg-gray-50')).toBe(true);
		expect(rows[2].classList.contains('!tw-bg-gray-50')).toBe(false);
		expect(rows[3].classList.contains('!tw-bg-gray-50')).toBe(true);
	});
});

describe('LoanList — matched badge', () => {
	it('renders the "Matched" badge when the lender\'s purchase was matched (wasMatched true)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					wasMatched: true,
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						promoTypeLabel: null,
						amountRepaidToLender: '5',
						amountReturnedTotal: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: null,
				},
			})],
		});

		expect(page.getByTestId('matched-badge').textContent.trim()).toBe('Matched');
	});

	it('does not render the "Matched" badge when wasMatched is false', () => {
		const page = renderLoanList({ loans: [makeLoan()] });

		expect(page.queryByTestId('matched-badge')).toBeNull();
	});

	it('does not render the "Matched" badge when wasMatched is null (no logged-in user)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					wasMatched: null,
					loanBalance: {
						amountPurchasedByLender: '25',
						amountPurchasedByPromo: null,
						promoTypeLabel: null,
						amountRepaidToLender: '5',
						amountReturnedTotal: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: null,
				},
			})],
		});

		expect(page.queryByTestId('matched-badge')).toBeNull();
	});

	it('renders "Nx matched" when the matched loan carries a match ratio (legacy parity)', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				matchRatio: 2,
				userProperties: {
					wasMatched: true,
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: null,
				},
			})],
		});

		expect(page.getByTestId('matched-badge').textContent.trim()).toBe('2x matched');
	});

	it('renders a bare "Matched" when the match ratio is exactly 1 (legacy parity — no "1x matched")', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				matchRatio: 1,
				userProperties: {
					wasMatched: true,
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: null,
				},
			})],
		});

		expect(page.getByTestId('matched-badge').textContent.trim()).toBe('Matched');
	});

	it('falls back to a bare "Matched" when wasMatched is true but the ratio is absent', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				matchRatio: null,
				userProperties: {
					wasMatched: true,
					loanBalance: {
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: '2026-03-15T12:00:00Z',
					},
					userAttributedTeam: null,
				},
			})],
		});

		expect(page.getByTestId('matched-badge').textContent.trim()).toBe('Matched');
	});

	it('does not render the badge from a match ratio alone when wasMatched is false', () => {
		// The viewer-relative wasMatched flag is the gate; a loan-level ratio on an
		// unmatched-for-this-lender share must not surface a badge.
		const page = renderLoanList({ loans: [makeLoan({ matchRatio: 3 })] });

		expect(page.queryByTestId('matched-badge')).toBeNull();
	});
});

describe('LoanList — "Length" cell', () => {
	it('renders the "months" suffix on the repayment term', () => {
		const page = renderLoanList({ loans: [makeLoan({ lenderRepaymentTerm: 8 })] });

		expect(page.getByText('8 months')).toBeTruthy();
		expect(page.queryByText('8 mos')).toBeNull();
	});

	it('renders a dash with "months" when the repayment term is missing', () => {
		const page = renderLoanList({ loans: [makeLoan({ lenderRepaymentTerm: null })] });

		expect(page.getByText('- months')).toBeTruthy();
	});
});

describe('LoanList — team cell', () => {
	it('renders the user-attributed team name and image, linked to the team page, when present', () => {
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
						teamPublicId: 'cat_lovers',
						image: { id: 5, url: '/img/team-cat.jpg' },
					},
				},
			})],
		});

		expect(page.getByText('Cat Lovers')).toBeTruthy();
		expect(page.getByAltText('Cat Lovers team image')).toBeTruthy();
		// Legacy parity: the read-only team wraps name + image in an anchor to its team page.
		const link = page.container.querySelector('.team-cell a');
		expect(link).not.toBeNull();
		expect(link.getAttribute('href')).toBe('/team/cat_lovers');
	});

	it('truncates a read-only attributed team name longer than 20 characters (legacy parity)', () => {
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
						name: 'A Really Long Team Name That Exceeds Twenty',
						teamPublicId: 'long_team',
					},
				},
			})],
		});

		// Legacy LoanRowView truncates to 20 chars + "..." ("A Really Long Team N").
		expect(page.getByText('A Really Long Team N...')).toBeTruthy();
		expect(page.queryByText('A Really Long Team Name That Exceeds Twenty')).toBeNull();
	});

	it('renders the read-only team unlinked when no teamPublicId is resolvable', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						totalAmountPurchased: '25',
						amountPurchasedByLender: '25',
						amountRepaidToLender: '5',
						latestSharePurchaseTime: null,
					},
					userAttributedTeam: {
						id: 7,
						name: 'No Slug Team',
						teamPublicId: null,
						image: null,
					},
				},
			})],
		});

		expect(page.getByText('No Slug Team')).toBeTruthy();
		expect(page.container.querySelector('.team-cell a')).toBeNull();
	});

	it('renders an empty cell when there is no user-attributed team', () => {
		const page = renderLoanList({
			loans: [makeLoan()],
		});

		// Legacy parity: a loan with no team (and no reassignment dropdown) shows an
		// empty cell, not a placeholder dash.
		expect(page.container.querySelector('.team-cell').textContent.trim()).toBe('');
	});

	it('renders the team name without an image when image is missing', () => {
		const page = renderLoanList({
			loans: [makeLoan({
				userProperties: {
					loanBalance: {
						totalAmountPurchased: '25',
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

describe('LoanList — team reassignment', () => {
	const lendingTeams = [
		{ id: 1, name: 'Team One' },
		{ id: 2, name: 'Team Two' },
	];

	const eligibleLoan = (overrides = {}) => makeLoan({
		userProperties: {
			loanBalance: {
				amountPurchasedByLender: '25',
				amountRepaidToLender: '5',
				latestSharePurchaseTime: '2026-03-15T12:00:00Z',
			},
			userAttributedTeam: { id: 1, name: 'Team One' },
			canChangeTeamAssignment: true,
		},
		...overrides,
	});

	const teamSelect = container => container.querySelector('.team-cell select');

	it('renders a team dropdown for eligible loans: current team then other teams (no detach option)', () => {
		const page = renderLoanList({ loans: [eligibleLoan()], lendingTeams });

		const select = teamSelect(page.container);
		expect(select).not.toBeNull();

		// Legacy parity: a loan that already has a team offers only real teams — there is
		// no "None"/detach entry, since the backend's reassignLoanTeam requires a team.
		const options = [...select.querySelectorAll('option')]
			.map(o => ({ value: o.value, label: o.textContent.trim() }));
		expect(options).toEqual([
			{ value: '1', label: 'Team One' },
			{ value: '2', label: 'Team Two' },
		]);
		expect(select.value).toBe('1');
	});

	it('renders read-only team text (no dropdown) for ineligible loans', () => {
		const loan = eligibleLoan({
			userProperties: {
				loanBalance: {
					amountPurchasedByLender: '25',
					amountRepaidToLender: '5',
					latestSharePurchaseTime: '2026-03-15T12:00:00Z',
				},
				userAttributedTeam: { id: 1, name: 'Team One' },
				canChangeTeamAssignment: false,
			},
		});
		const page = renderLoanList({ loans: [loan], lendingTeams });

		expect(teamSelect(page.container)).toBeNull();
		expect(page.container.querySelector('.team-cell').textContent).toContain('Team One');
	});

	it('renders read-only team text (no dropdown) for an eligible loan when the user has no teams', () => {
		// Legacy parity: with zero teams there is nothing to reassign to, so the cell stays
		// read-only even though canChangeTeamAssignment is true.
		const page = renderLoanList({ loans: [eligibleLoan()], lendingTeams: [] });

		expect(teamSelect(page.container)).toBeNull();
		expect(page.container.querySelector('.team-cell').textContent).toContain('Team One');
	});

	it('shows a selected "None" placeholder first for an eligible loan with no attributed team', () => {
		const loan = eligibleLoan({
			userProperties: {
				loanBalance: {
					amountPurchasedByLender: '25',
					amountRepaidToLender: '5',
					latestSharePurchaseTime: '2026-03-15T12:00:00Z',
				},
				userAttributedTeam: null,
				canChangeTeamAssignment: true,
			},
		});
		const page = renderLoanList({ loans: [loan], lendingTeams });

		const select = teamSelect(page.container);
		expect(select.value).toBe('');
		// Legacy parity: the "None" placeholder leads and is selected to show the current
		// teamless state, followed by the user's real teams.
		const options = [...select.querySelectorAll('option')]
			.map(o => ({ value: o.value, label: o.textContent.trim() }));
		expect(options).toEqual([
			{ value: '', label: 'None' },
			{ value: '1', label: 'Team One' },
			{ value: '2', label: 'Team Two' },
		]);
	});

	it('emits reassign-team with the chosen team id on change', async () => {
		const page = renderLoanList({ loans: [eligibleLoan({ id: 101 })], lendingTeams });

		const select = teamSelect(page.container);
		select.value = '2';
		await fireEvent.change(select);

		expect(page.emitted()['reassign-team'][0]).toEqual([{ loanId: 101, teamId: 2 }]);
	});

	it('does not emit reassign-team when the "None" placeholder is chosen (no detach)', async () => {
		const loan = eligibleLoan({
			id: 202,
			userProperties: {
				loanBalance: {
					amountPurchasedByLender: '25',
					amountRepaidToLender: '5',
					latestSharePurchaseTime: '2026-03-15T12:00:00Z',
				},
				userAttributedTeam: null,
				canChangeTeamAssignment: true,
			},
		});
		const page = renderLoanList({ loans: [loan], lendingTeams });

		const select = teamSelect(page.container);
		select.value = '';
		await fireEvent.change(select);

		// The backend has no detach; selecting "None" is a no-op, not a teamId: null emit.
		expect(page.emitted()['reassign-team']).toBeUndefined();
	});

	it('disables the team dropdown for the row whose reassignment is in flight', () => {
		const page = renderLoanList({
			loans: [eligibleLoan({ id: 303 })],
			lendingTeams,
			reassigningLoanIds: [303],
		});

		expect(teamSelect(page.container).disabled).toBe(true);
	});

	it('reverts the dropdown to the attributed team when this loan\'s nonce changes', async () => {
		const loan = eligibleLoan({ id: 404 }); // attributed to Team One (id 1)
		const page = renderLoanList({ loans: [loan], lendingTeams, reassignNonce: {} });

		const select = teamSelect(page.container);
		select.value = '2';
		await fireEvent.change(select);
		expect(teamSelect(page.container).value).toBe('2');

		// Parent bumps only this loan's nonce when the (rejected) reassignment settles; the
		// loan's attributed team is unchanged, so the remounted control snaps back to Team One.
		await page.rerender({
			loans: [loan], loading: false, lendingTeams, reassigningLoanIds: [], reassignNonce: { 404: 1 },
		});

		expect(teamSelect(page.container).value).toBe('1');
	});
});

describe('LoanList — dedication indicator (MP-2847)', () => {
	// Override userProperties wholesale (loanBalance must stay for the "You loaned" cell)
	// so each test fully controls the viewer-relative dedication shape.
	const dedicatedLoan = dedication => makeLoan({
		userProperties: {
			loanBalance: {
				amountPurchasedByLender: '25',
				amountRepaidToLender: '5',
				amountReturnedTotal: '5',
				latestSharePurchaseTime: '2026-03-15T12:00:00Z',
			},
			userAttributedTeam: null,
			dedication,
		},
	});

	it('renders no dedication block when the lender has no dedication on the loan', () => {
		// makeLoan's default userProperties omits `dedication` entirely (field resolves null
		// for a loan this lender never dedicated, or when there is no logged-in user).
		const page = renderLoanList({ loans: [makeLoan()] });

		expect(page.queryByTestId('loan-dedication')).toBeNull();
	});

	it('renders no dedication block when dedication is null', () => {
		const page = renderLoanList({ loans: [dedicatedLoan(null)] });

		expect(page.queryByTestId('loan-dedication')).toBeNull();
	});

	it('renders a heart + "Dedicated to {name}" linking to the dedication page for a named recipient', () => {
		const page = renderLoanList({
			loans: [dedicatedLoan({
				recipientName: 'Jane Doe',
				toKiva: false,
				dedicationUrl: '/dedication/1208499',
			})],
		});

		const block = page.getByTestId('loan-dedication');
		// Legacy copy: "Dedicated to {name}" with no colon.
		expect(block.textContent).toContain('Dedicated to Jane Doe');
		expect(block.textContent).not.toContain('Dedicated to:');

		// The whole indicator is the link to /dedication/{loanId} (legacy parity).
		const link = block.querySelector('a');
		expect(link.getAttribute('href')).toBe('/dedication/1208499');
		expect(link.querySelector('.kv-material-icon')).not.toBeNull();

		// Named dedications carry the legacy footer about repayments going to Kiva.
		expect(page.getByTestId('loan-dedication-footer').textContent.trim())
			.toBe('Repayments for dedications are donated to Kiva');
	});

	it('renders the legacy "multiple recipients" label when the loan was dedicated to more than one person', () => {
		const page = renderLoanList({
			loans: [dedicatedLoan({
				recipientName: 'multiple recipients',
				toKiva: false,
				dedicationUrl: '/dedication/1208499',
			})],
		});

		expect(page.getByTestId('loan-dedication').textContent).toContain('Dedicated to multiple recipients');
	});

	it('renders the to-Kiva thank-you copy with no link and no footer for a Kiva dedication', () => {
		const page = renderLoanList({
			loans: [dedicatedLoan({
				recipientName: null,
				toKiva: true,
				dedicationUrl: null,
			})],
		});

		const block = page.getByTestId('loan-dedication');
		expect(block.textContent).toContain('You opted to donate repayments from this loan to Kiva (Thanks!)');
		// Legacy parity: to-Kiva dedications render without a link, without the footer note,
		// and without the heart icon (the heart is reserved for named recipients).
		expect(block.querySelector('a')).toBeNull();
		expect(block.querySelector('.kv-material-icon')).toBeNull();
		expect(page.queryByTestId('loan-dedication-footer')).toBeNull();
		expect(page.queryByText('Dedicated to', { exact: false })).toBeNull();
	});
});
