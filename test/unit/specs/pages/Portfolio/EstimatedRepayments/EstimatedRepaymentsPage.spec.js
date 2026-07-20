import { render, fireEvent, waitFor } from '@testing-library/vue';
// eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests
import { flushPromises } from '@vue/test-utils';
import numeral from 'numeral';
import EstimatedRepaymentsPage from '#src/pages/Portfolio/EstimatedRepayments/EstimatedRepaymentsPage';

const listResponse = (expectedRepayments = [
	{
		repaymentDate: '2026-07-01', userRepayments: 300, promoRepayments: 100, loansMakingRepayments: 6
	},
	{
		repaymentDate: '2026-08-01', userRepayments: 200, promoRepayments: 0, loansMakingRepayments: 4
	},
]) => ({
	my: { id: 'my-1', userAccount: { id: 'ua-1', expectedRepayments } },
});

const julyDetail = [
	{
		repaymentDate: '2026-07-01',
		amount: 50,
		userAmount: 40,
		promoAmount: 10,
		promoType: 'reward_credit',
		isDelinquent: false,
		pastRepayments: 3,
		totalRepayments: 8,
		loan: { id: '123', name: 'Maria' },
	},
	{
		repaymentDate: '2026-07-01',
		amount: 25,
		userAmount: 25,
		promoAmount: 0,
		promoType: null,
		isDelinquent: true,
		pastRepayments: 8,
		totalRepayments: 8,
		loan: { id: '456', name: 'Juan' },
	},
];

const augustDetail = [
	{
		repaymentDate: '2026-08-01',
		amount: 200,
		userAmount: 200,
		promoAmount: 0,
		promoType: null,
		isDelinquent: false,
		pastRepayments: 1,
		totalRepayments: 12,
		loan: { id: '789', name: 'Amara' },
	},
];

const detailResponse = rows => ({
	my: { id: 'my-1', userAccount: { id: 'ua-1', expectedRepaymentsDetail: rows } },
});

const renderPage = ({ expectedRepayments, rejects = false } = {}) => {
	const query = vi.fn().mockImplementation(({ variables } = {}) => {
		if (rejects) {
			return Promise.reject(new Error('boom'));
		}
		if (variables) {
			const rows = variables.month === 8 ? augustDetail : julyDetail;
			return Promise.resolve({ data: detailResponse(rows) });
		}
		return Promise.resolve({ data: listResponse(expectedRepayments) });
	});

	return {
		query,
		...render(EstimatedRepaymentsPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: {
					$router: { push: vi.fn() },
					$kvTrackEvent: vi.fn(),
					$filters: { numeral: (value, format) => numeral(value).format(format) },
				},
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: { props: ['to'], template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvStackedBarGraph: {
						props: ['points'],
						template: '<div data-testid="chart" :data-bars="points.length" />',
					},
				},
			},
		}),
	};
};

describe('EstimatedRepaymentsPage', () => {
	it('loads the summary and auto-selects the first month detail', async () => {
		const { getByTestId, getByText } = renderPage();
		await waitFor(() => {
			expect(getByTestId('repayments-summary-table')).toBeTruthy();
		});
		// first (July) month detail auto-loaded
		expect(getByText('Maria')).toBeTruthy();
		expect(getByText('Estimated repayments due by Jul 1, 2026')).toBeTruthy();
	});

	it('renders the promo, delinquent, and final note flags (legacy parity)', async () => {
		const { getByText } = renderPage();
		await waitFor(() => {
			expect(getByText(/Includes \$10\.00 of bonus credit \(repaid to Kiva or sponsor\)/)).toBeTruthy();
		});
		expect(getByText('Delinquent')).toBeTruthy();
		expect(getByText('Final')).toBeTruthy();
	});

	it('loads a different month detail when a month row is clicked', async () => {
		const { getByText, query } = renderPage();
		await waitFor(() => expect(getByText('Aug')).toBeTruthy());
		await fireEvent.click(getByText('Aug'));
		await waitFor(() => expect(getByText('Amara')).toBeTruthy());
		expect(query).toHaveBeenCalledWith(expect.objectContaining({
			variables: { year: 2026, month: 8, limit: 500 },
		}));
	});

	it('ignores a stale detail response that resolves after a newer month is selected', async () => {
		// Select July (auto), then August while July is still in flight, and make July
		// resolve LAST. The stale July response must not overwrite August's rows.
		let resolveJuly;
		const query = vi.fn().mockImplementation(({ variables } = {}) => {
			if (!variables) {
				return Promise.resolve({ data: listResponse() });
			}
			if (variables.month === 7) {
				return new Promise(resolve => { resolveJuly = () => resolve({ data: detailResponse(julyDetail) }); });
			}
			return Promise.resolve({ data: detailResponse(augustDetail) });
		});
		const { getByText, queryByText } = render(EstimatedRepaymentsPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: {
					$router: { push: vi.fn() },
					$kvTrackEvent: vi.fn(),
					$filters: { numeral: (value, format) => numeral(value).format(format) },
				},
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: { props: ['to'], template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvStackedBarGraph: { props: ['points'], template: '<div data-testid="chart" />' },
				},
			},
		});
		// July is auto-selected on load and its detail request is pending (unresolved).
		await waitFor(() => expect(getByText('Aug')).toBeTruthy());
		// Select August; its detail resolves immediately.
		await fireEvent.click(getByText('Aug'));
		await waitFor(() => expect(getByText('Amara')).toBeTruthy());
		// Now let the stale July response resolve and flush its continuation + re-render.
		// It must be discarded: August's rows stay, July's never appear.
		resolveJuly();
		await flushPromises();
		expect(getByText('Amara')).toBeTruthy();
		expect(queryByText('Maria')).toBeNull();
	});

	it('anchors the 12-month graph window to the first repayment month, not "now"', async () => {
		// The window follows the data, not the clock: with repayments starting in
		// August (the 1st has passed, so "now" is mid-July) the graph must still run
		// a full year from August — anchoring to "now" would clip the final month.
		// Fake only Date so the async apollo/waitFor timing keeps using real timers.
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2026-07-15T00:00:00Z'));
		try {
			// 15 monthly points starting the month AFTER now: 2026-08 through 2027-10.
			const months = Array.from({ length: 15 }, (unused, i) => {
				const year = 2026 + Math.floor((7 + i) / 12);
				const month = ((7 + i) % 12) + 1;
				return {
					repaymentDate: `${year}-${String(month).padStart(2, '0')}-01`,
					userRepayments: 100 + i,
					promoRepayments: 10,
					loansMakingRepayments: 2,
				};
			});
			const { getByTestId, getAllByTestId } = renderPage({ expectedRepayments: months });
			await waitFor(() => expect(getByTestId('repayments-summary-table')).toBeTruthy());
			// Graph: 2026-08 through 2027-08 inclusive = 13 bars (2027-09, 2027-10 excluded).
			// A "now"-anchored window would have stopped at 2027-07 = 12 bars.
			expect(getByTestId('chart').getAttribute('data-bars')).toBe('13');
			// Table still lists all 15 months.
			expect(getAllByTestId(/^repayments-month-row-/)).toHaveLength(15);
		} finally {
			vi.useRealTimers();
		}
	});

	it('flags truncation with the true total only when the server cap is actually hit', async () => {
		// July summary reports 1200 loans; the capped detail returns exactly 500 rows.
		const capped = Array.from({ length: 500 }, (unused, i) => ({
			repaymentDate: '2026-07-01',
			amount: 10,
			userAmount: 10,
			promoAmount: 0,
			promoType: null,
			isDelinquent: false,
			pastRepayments: 1,
			totalRepayments: 8,
			loan: { id: `L${i}`, name: `Borrower ${i}` },
		}));
		const query = vi.fn().mockImplementation(({ variables } = {}) => {
			if (variables) {
				return Promise.resolve({ data: detailResponse(capped) });
			}
			return Promise.resolve({
				data: listResponse([{
					repaymentDate: '2026-07-01', userRepayments: 1, promoRepayments: 0, loansMakingRepayments: 1200,
				}]),
			});
		});
		const { getByTestId } = render(EstimatedRepaymentsPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: {
					$router: { push: vi.fn() },
					$kvTrackEvent: vi.fn(),
					$filters: { numeral: (value, format) => numeral(value).format(format) },
				},
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: { props: ['to'], template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvStackedBarGraph: { props: ['points'], template: '<div data-testid="chart" />' },
				},
			},
		});
		const notice = await waitFor(() => getByTestId('detail-truncated'));
		expect(notice.textContent).toContain('first 500 of 1,200');
	});

	it('does not flag truncation when the month has fewer loans than the cap', async () => {
		// July summary reports 6 loans but the detail mock returns only 2 (summary/detail
		// drift): the cap was never hit, so no misleading "first 500 of 6" notice.
		const { queryByTestId, getByText } = renderPage();
		await waitFor(() => expect(getByText('Maria')).toBeTruthy());
		expect(queryByTestId('detail-truncated')).toBeNull();
	});

	it('shows the empty state when there are no upcoming repayments', async () => {
		const { getByTestId } = renderPage({ expectedRepayments: [] });
		await waitFor(() => {
			expect(getByTestId('repayments-empty')).toBeTruthy();
		});
	});

	it('shows the error state when the query fails', async () => {
		const { getByTestId } = renderPage({ rejects: true });
		await waitFor(() => {
			expect(getByTestId('repayments-load-error')).toBeTruthy();
		});
	});
});
