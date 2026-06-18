import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import LoanStatsTable from '#src/components/Portfolio/LoanStatsTable';
import { globalOptions } from '../../../specUtils';

// Full backend payload covering both My stats (my.userStats) and Avg Kiva lender
// (general.kivaStats) columns for all 13 comparison rows.
const fullData = (overrides = {}) => ({
	my: {
		userStats: {
			amount_of_loans: 1000,
			amount_repaid: 800,
			amount_defaulted: 50,
			amount_refunded: 25,
			arrears_rate: 0.0123,
			amount_in_arrears: 10,
			amount_outstanding: 200,
			default_rate: 0.05,
			total_ended: 700,
			total_defaulted: 50,
			currency_loss_rate: 1.5,
			currency_loss: -12.5,
			currency_loss_reimbursement: 7.25,
			...overrides.userStats,
		},
		// Every status count comes from the my.loans search. On the live (Sphinx) path the
		// status buckets are mutually exclusive: `ended` excludes currency-loss ends,
		// `ended_with_loss` is ended-with-currency-loss only, and `defaulted` is separate —
		// so each totalCount maps directly to its row with no subtraction.
		fundRaisingLoans: { totalCount: 3, ...overrides.fundRaisingLoans },
		raisedLoans: { totalCount: 4, ...overrides.raisedLoans },
		payingBackLoans: { totalCount: 5, ...overrides.payingBackLoans },
		delinquentLoans: { totalCount: 1, ...overrides.delinquentLoans },
		endedLoans: { totalCount: 6, ...overrides.endedLoans },
		endedWithLossLoans: { totalCount: 3, ...overrides.endedWithLossLoans },
		defaultedLoans: { totalCount: 2, ...overrides.defaultedLoans },
		refundedLoans: { totalCount: 1, ...overrides.refundedLoans },
		expiredLoans: { totalCount: 0, ...overrides.expiredLoans },
	},
	general: {
		kivaStats: {
			avgAmountLent: 1500,
			avgAmountRepaid: 1200,
			avgTotalAmountLost: 60,
			avgAmountRefunded: 30,
			avgDelinquencyRate: 0.02,
			avgAmountArrears: 15,
			avgAmountOutstanding: 250,
			avgDefaultRate: 0.04,
			avgAmountDefaulted: 55,
			avgTotalEnded: 800,
			avgCurrencyLossRate: 1.1,
			avgCurrencyLoss: -8,
			avgCurrencyLossReimbursement: 9,
			avgLenderStatsUpdatedAt: '2026-05-19T21:30:00.000Z',
			...overrides.kivaStats,
		},
	},
});

// Invoke the component's apollo result handler against a bare context, the way the
// rest of the suite tests Options API handlers directly.
const runResult = (data, context = {}) => {
	const emit = vi.fn();
	const ctx = { $emit: emit, ...context };
	LoanStatsTable.apollo.result.call(ctx, { data });
	return { ctx, emit };
};

const renderTable = () => {
	const childRef = { current: null };
	const Wrapper = {
		components: { LoanStatsTable },
		template: '<LoanStatsTable ref="child" />',
		mounted() {
			childRef.current = this.$refs.child;
		},
	};
	const utils = render(Wrapper, {
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				apollo: { ...globalOptions.provide.apollo },
				cookieStore: {},
			},
		},
	});
	return { ...utils, getVm: () => childRef.current };
};

// Read a comparison-table row's cells as [label, myValue, avgValue].
const statsRow = (container, label) => [...container.querySelectorAll('tbody tr')]
	.map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim()))
	.find(cells => cells[0] === label);

// Read a loan-count row's cells as [label, value].
const countRow = (container, label) => [
	...container.querySelectorAll('[aria-label="Loan count statistics"] [role="row"]'),
]
	.map(row => [...row.querySelectorAll('[role="cell"]')].map(cell => cell.textContent.trim()))
	.find(cells => cells[0] === label);

describe('LoanStatsTable', () => {
	describe('formatValue', () => {
		const { formatValue } = LoanStatsTable.methods;

		it('formats currency, percentage, and currency-loss rate values', () => {
			expect(formatValue(1234.5, 'currency')).toBe('$1234.50');
			expect(formatValue(0.0123, 'percentage')).toBe('1.23%');
			expect(formatValue(1.5, 'currencyLossRate')).toBe('1.50%');
		});

		it('renders currency-loss amounts as an absolute dollar value', () => {
			expect(formatValue(-12.5, 'currencyLossAmount')).toBe('$12.50');
			expect(formatValue(12.5, 'currencyLossAmount')).toBe('$12.50');
		});

		it('falls back to zero for missing currency and percentage values', () => {
			expect(formatValue(null, 'currency')).toBe('$0.00');
			expect(formatValue(undefined, 'currency')).toBe('$0.00');
			expect(formatValue(0, 'currency')).toBe('$0.00');
			expect(formatValue(null, 'percentage')).toBe('0.00%');
		});

		it('renders "Not available" for missing currency-loss rate and amount', () => {
			expect(formatValue(null, 'currencyLossRate')).toBe('Not available');
			expect(formatValue(undefined, 'currencyLossAmount')).toBe('Not available');
		});
	});

	describe('result mapping', () => {
		it('applies legacy My-stats formulas', () => {
			const { ctx } = runResult(fullData());

			// Amount lost = abs(-amount_defaulted + currency_loss) = abs(-50 + -12.5)
			expect(ctx.stats.amount_lost).toBeCloseTo(62.5);
			// Amount defaulted = abs(amount_defaulted)
			expect(ctx.stats.amount_defaulted).toBe(50);
			// Amount ended = total_ended + total_defaulted
			expect(ctx.stats.amount_ended).toBe(750);
			expect(ctx.stats.amount_lent).toBe(1000);
			expect(ctx.stats.currency_loss_reimbursement).toBe(7.25);
		});

		it('maps the Avg Kiva lender column to precomputed avg fields', () => {
			const { ctx } = runResult(fullData());

			expect(ctx.avgStats).toMatchObject({
				amount_lent: 1500,
				amount_repaid: 1200,
				amount_lost: 60,
				amount_refunded: 30,
				arrears_rate: 0.02,
				amount_in_arrears: 15,
				amount_outstanding: 250,
				default_rate: 0.04,
				amount_defaulted: 55,
				amount_ended: 800,
				currency_loss_rate: 1.1,
				currency_loss: -8,
				currency_loss_reimbursement: 9,
			});
		});

		it('hides currency-loss rate and amount when the loss amount is unavailable', () => {
			const { ctx } = runResult(fullData({
				userStats: { currency_loss_rate: 1.5, currency_loss: null },
			}));

			expect(ctx.stats.currency_loss_rate).toBeNull();
			expect(ctx.stats.currency_loss).toBeNull();
		});

		it('shows currency-loss rate and amount when both are present', () => {
			const { ctx } = runResult(fullData());

			expect(ctx.stats.currency_loss_rate).toBe(1.5);
			expect(ctx.stats.currency_loss).toBe(-12.5);
		});

		it('maps each loan status count directly from its my.loans search bucket', () => {
			const { ctx } = runResult(fullData());

			expect(ctx.loanCounts).toEqual({
				fundraising: 3,
				funded: 4,
				payingBack: 5,
				payingBackDelinquent: 1,
				repaid: 6,
				repaidWithCurrencyLoss: 3,
				defaulted: 2,
				refunded: 1,
				expired: 0,
			});
		});

		it('keeps defaulted and repaid-with-currency-loss as separate buckets', () => {
			// On the live search path `ended_with_loss` excludes defaulted loans, so the
			// with-loss count is the bucket value directly and defaulted is independent —
			// no subtraction, no overlap.
			const { ctx } = runResult(fullData({
				endedWithLossLoans: { totalCount: 7 },
				defaultedLoans: { totalCount: 5 },
			}));

			expect(ctx.loanCounts.repaidWithCurrencyLoss).toBe(7);
			expect(ctx.loanCounts.defaulted).toBe(5);
		});

		it('sources the defaulted count from the defaulted search bucket', () => {
			const { ctx } = runResult(fullData({
				defaultedLoans: { totalCount: 4 },
			}));

			expect(ctx.loanCounts.defaulted).toBe(4);
		});

		it('derives the ended split from search buckets, not the currency-loss amount', () => {
			const { ctx } = runResult(fullData({
				userStats: { currency_loss: -99999 },
				endedLoans: { totalCount: 15 },
				endedWithLossLoans: { totalCount: 5 },
			}));

			expect(ctx.loanCounts.repaidWithCurrencyLoss).toBe(5);
			expect(ctx.loanCounts.repaid).toBe(15);
		});

		it('renders zero for empty status buckets', () => {
			const zero = { totalCount: 0 };
			const { ctx } = runResult(fullData({
				fundRaisingLoans: zero,
				raisedLoans: zero,
				payingBackLoans: zero,
				delinquentLoans: zero,
				endedLoans: zero,
				endedWithLossLoans: zero,
				defaultedLoans: zero,
				refundedLoans: zero,
				expiredLoans: zero,
			}));

			Object.values(ctx.loanCounts).forEach(value => expect(value).toBe(0));
		});

		it('emits the avg-lender snapshot timestamp as updated-as-of', () => {
			const { emit } = runResult(fullData());
			expect(emit).toHaveBeenCalledWith('updated-as-of', '2026-05-19T21:30:00.000Z');
		});

		it('emits null updated-as-of when no snapshot timestamp is available', () => {
			const { emit } = runResult(fullData({ kivaStats: { avgLenderStatsUpdatedAt: null } }));
			expect(emit).toHaveBeenCalledWith('updated-as-of', null);
		});
	});

	describe('rendering', () => {
		it('renders all 13 comparison rows with real values for both columns', async () => {
			const { getVm, container } = renderTable();
			const vm = getVm();
			vm.$options.apollo.result.call(vm, { data: fullData() });
			await nextTick();

			expect(statsRow(container, 'Amount lent')).toEqual(['Amount lent', '$1000.00', '$1500.00']);
			expect(statsRow(container, 'Amount repaid')).toEqual(['Amount repaid', '$800.00', '$1200.00']);
			expect(statsRow(container, 'Amount lost')).toEqual(['Amount lost', '$62.50', '$60.00']);
			expect(statsRow(container, 'Amount refunded')).toEqual(['Amount refunded', '$25.00', '$30.00']);
			expect(statsRow(container, 'Delinquency rate')).toEqual(['Delinquency rate', '1.23%', '2.00%']);
			expect(statsRow(container, 'Amount in arrears')).toEqual(['Amount in arrears', '$10.00', '$15.00']);
			expect(statsRow(container, 'Outstanding loans')).toEqual(['Outstanding loans', '$200.00', '$250.00']);
			expect(statsRow(container, 'Default rate')).toEqual(['Default rate', '5.00%', '4.00%']);
			expect(statsRow(container, 'Amount defaulted')).toEqual(['Amount defaulted', '$50.00', '$55.00']);
			expect(statsRow(container, 'Amount ended')).toEqual(['Amount ended', '$750.00', '$800.00']);
			expect(statsRow(container, 'Currency loss rate')).toEqual(['Currency loss rate', '1.50%', '1.10%']);
			expect(statsRow(container, 'Amount of currency loss'))
				.toEqual(['Amount of currency loss', '$12.50', '$8.00']);
			expect(statsRow(container, 'Currency loss reimbursement'))
				.toEqual(['Currency loss reimbursement', '$7.25', '$9.00']);
		});

		it('shows "Not available" currency-loss cells and zero fallbacks for missing My stats', async () => {
			const { getVm, container } = renderTable();
			const vm = getVm();
			vm.$options.apollo.result.call(vm, {
				data: fullData({
					userStats: {
						amount_of_loans: null,
						arrears_rate: null,
						currency_loss_rate: null,
						currency_loss: null,
						amount_defaulted: null,
						total_ended: null,
						total_defaulted: null,
					},
				}),
			});
			await nextTick();

			expect(statsRow(container, 'Amount lent')[1]).toBe('$0.00');
			expect(statsRow(container, 'Delinquency rate')[1]).toBe('0.00%');
			expect(statsRow(container, 'Amount lost')[1]).toBe('$0.00');
			expect(statsRow(container, 'Currency loss rate')[1]).toBe('Not available');
			expect(statsRow(container, 'Amount of currency loss')[1]).toBe('Not available');
		});

		it('renders mapped loan status counts', async () => {
			const { getVm, container } = renderTable();
			const vm = getVm();
			vm.$options.apollo.result.call(vm, { data: fullData() });
			await nextTick();

			expect(countRow(container, 'Fundraising')).toEqual(['Fundraising', '3']);
			expect(countRow(container, 'Funded')).toEqual(['Funded', '4']);
			expect(countRow(container, 'Paying back')).toEqual(['Paying back', '5']);
			expect(countRow(container, 'Paying back delinquent')).toEqual(['Paying back delinquent', '1']);
			expect(countRow(container, 'Repaid')).toEqual(['Repaid', '6']);
			expect(countRow(container, 'Repaid with currency loss'))
				.toEqual(['Repaid with currency loss', '3']);
			expect(countRow(container, 'Ended in default')).toEqual(['Ended in default', '2']);
			expect(countRow(container, 'Refunded')).toEqual(['Refunded', '1']);
			expect(countRow(container, 'Expired')).toEqual(['Expired', '0']);
		});
	});

	describe('locale-formatted Money values', () => {
		// The Money scalar arrives as legacy number_format strings, so amounts of $1,000+
		// carry thousands separators (e.g. "12,500.00"). Number() can't parse those, which
		// rendered "$NaN" for large My-stats and Avg totals (amount lent/repaid/ended).
		const formatted = () => fullData({
			userStats: {
				amount_of_loans: '12,500.00',
				amount_repaid: '9,800.50',
				amount_refunded: '1,025.00',
				amount_defaulted: '50.00',
				currency_loss: '-12.50',
				total_ended: '8,200.00',
				total_defaulted: '1,050.00',
			},
			kivaStats: {
				avgAmountLent: '1,500.00',
			},
		});

		it('parses My-stats Money strings that contain thousands separators', () => {
			const { ctx } = runResult(formatted());

			expect(ctx.stats.amount_lent).toBeCloseTo(12500);
			expect(ctx.stats.amount_repaid).toBeCloseTo(9800.5);
			expect(ctx.stats.amount_refunded).toBeCloseTo(1025);
			// amount_ended = total_ended + total_defaulted = 8200 + 1050
			expect(ctx.stats.amount_ended).toBeCloseTo(9250);
		});

		it('parses Avg-column Money strings that contain thousands separators', () => {
			const { ctx } = runResult(formatted());
			expect(ctx.avgStats.amount_lent).toBeCloseTo(1500);
		});

		it('renders parsed dollar amounts instead of $NaN', async () => {
			const { getVm, container } = renderTable();
			const vm = getVm();
			vm.$options.apollo.result.call(vm, { data: formatted() });
			await nextTick();

			expect(statsRow(container, 'Amount lent')[1]).toBe('$12500.00');
			expect(statsRow(container, 'Amount repaid')[1]).toBe('$9800.50');
			expect(statsRow(container, 'Amount ended')[1]).toBe('$9250.00');
			expect(statsRow(container, 'Amount lent')[2]).toBe('$1500.00');
		});
	});

	describe('legacy row banding and indent', () => {
		// Based on the legacy setupCompareStat($label, ..., $is_tabbed, $show_in_white,
		// $show_in_gray) flags in LoansView.php (MP-2859), plus product-requested gray banding
		// on the Amount repaid / Amount refunded rows. `bg` is the expected explicit row
		// background (null = default); `tabbed` indents the label under its parent metric.
		const expected = {
			'Amount lent': { tabbed: false, bg: null },
			'Amount repaid': { tabbed: false, bg: 'tw-bg-gray-50' },
			'Amount lost': { tabbed: false, bg: null },
			'Amount refunded': { tabbed: false, bg: 'tw-bg-gray-50' },
			'Delinquency rate': { tabbed: false, bg: 'tw-bg-white' },
			'Amount in arrears': { tabbed: true, bg: 'tw-bg-white' },
			'Outstanding loans': { tabbed: true, bg: 'tw-bg-white' },
			'Default rate': { tabbed: false, bg: 'tw-bg-gray-50' },
			'Amount defaulted': { tabbed: true, bg: 'tw-bg-gray-50' },
			'Amount ended': { tabbed: true, bg: 'tw-bg-gray-50' },
			'Currency loss rate': { tabbed: false, bg: 'tw-bg-white' },
			'Amount of currency loss': { tabbed: true, bg: 'tw-bg-white' },
			'Currency loss reimbursement': { tabbed: true, bg: 'tw-bg-white' },
		};

		const renderRows = async () => {
			const { getVm, container } = renderTable();
			const vm = getVm();
			vm.$options.apollo.result.call(vm, { data: fullData() });
			await nextTick();
			return container;
		};

		const trByLabel = (container, label) => [...container.querySelectorAll('tbody tr')]
			.find(tr => tr.querySelector('td')?.textContent.trim() === label);

		it('applies the legacy white/gray banding per row', async () => {
			const container = await renderRows();
			Object.entries(expected).forEach(([label, { bg }]) => {
				const tr = trByLabel(container, label);
				expect(tr, `row "${label}" should render`).toBeTruthy();
				expect(tr.classList.contains('tw-bg-white'), `${label} white banding`)
					.toBe(bg === 'tw-bg-white');
				expect(tr.classList.contains('tw-bg-gray-50'), `${label} gray banding`)
					.toBe(bg === 'tw-bg-gray-50');
			});
		});

		it('indents the tabbed rows under their parent metric', async () => {
			const container = await renderRows();
			Object.entries(expected).forEach(([label, { tabbed }]) => {
				const labelCell = trByLabel(container, label).querySelector('td');
				expect(labelCell.classList.contains('tw-pl-6'), `${label} indent`).toBe(tabbed);
			});
		});
	});
});
