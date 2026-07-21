import { render, fireEvent, waitFor } from '@testing-library/vue';
import TransactionsPage from '#src/pages/Portfolio/Transactions/TransactionsPage';

const flushPromises = () => new Promise(resolve => { setTimeout(resolve); });

const deferred = () => {
	let resolve;
	const promise = new Promise(res => { resolve = res; });
	return { promise, resolve };
};

const scrollIntoView = vi.fn();
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
	configurable: true,
	value: scrollIntoView,
});

beforeEach(() => {
	scrollIntoView.mockClear();
});

const transactionsResponse = (totalCount = 1, values = [{ displayName: 'Loan' }]) => ({
	my: {
		id: 'my-id',
		transactions: {
			totalCount,
			values,
		},
	},
});

const renderTransactionsPage = ({ apollo = null, totalCount = 1 } = {}) => {
	const query = vi.fn().mockResolvedValue({ data: transactionsResponse(totalCount) });
	const trackEvent = vi.fn();

	return {
		query,
		trackEvent,
		...render(TransactionsPage, {
			global: {
				provide: {
					apollo: apollo || { query },
					cookieStore: {},
				},
				mocks: {
					$kvTrackEvent: trackEvent,
				},
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					TransactionFilterBar: {
						props: ['totalTransactions', 'filters', 'keywordSearch'],
						emits: ['filters-changed'],
						template: `
							<button
								type="button"
								data-testid="apply-filters"
								@click="$emit('filters-changed', {
									filters: { category: 'deposit', sortBy: 'newest' },
									keywordSearch: '12345',
								})"
							>filter</button>
						`,
					},
					TransactionList: {
						props: ['transactions', 'loading', 'hasError', 'hasAnyTransactions'],
						template: `
							<div>
								<div v-if="hasError" data-testid="list-error"></div>
								<div data-testid="list-count">{{ transactions.length }}</div>
								<div data-testid="list-loading">{{ loading }}</div>
								<div data-testid="list-has-any">{{ hasAnyTransactions }}</div>
								<div data-testid="list-balances">
									{{ transactions.map(t => t.newBalance).join(',') }}
								</div>
							</div>
						`,
					},
					KvPagination: {
						emits: ['page-changed'],
						template: `
							<button
								type="button"
								data-testid="pagination"
								@click="$emit('page-changed', { pageOffset: 50 })"
							>page</button>
						`,
					},
				},
			},
		}),
	};
};

describe('TransactionsPage', () => {
	it('fetches and renders transactions on mount', async () => {
		const page = renderTransactionsPage({ totalCount: 1 });
		await waitFor(() => {
			expect(page.getByTestId('list-count').textContent).toBe('1');
		});
	});

	it('reports "no transactions at all" when the unfiltered mount fetch returns none', async () => {
		const page = renderTransactionsPage({ totalCount: 0 });
		await flushPromises();
		expect(page.getByTestId('list-has-any').textContent).toBe('false');
	});

	it('keeps hasAnyTransactions true when a filter yields no matches', async () => {
		// Unfiltered fetch finds transactions; the later filtered fetch finds none, but that must
		// not flip hasAnyTransactions — the account still has transactions, just none matching.
		const query = vi.fn(({ variables }) => Promise.resolve({
			data: transactionsResponse(variables.filter ? 0 : 3, variables.filter ? [] : [{ displayName: 'Loan' }]),
		}));
		const page = renderTransactionsPage({ apollo: { query } });
		await flushPromises();
		expect(page.getByTestId('list-has-any').textContent).toBe('true');

		await fireEvent.click(page.getByTestId('apply-filters'));
		await flushPromises();
		expect(page.getByTestId('list-count').textContent).toBe('0');
		expect(page.getByTestId('list-has-any').textContent).toBe('true');
	});

	it('shows pagination when the total exceeds the page limit', async () => {
		const page = renderTransactionsPage({ totalCount: 80 });
		await waitFor(() => {
			expect(page.getByTestId('pagination')).toBeTruthy();
		});
	});

	it('does not show pagination when the total fits on one page', async () => {
		const page = renderTransactionsPage({ totalCount: 1 });
		await flushPromises();
		expect(page.queryByTestId('pagination')).toBeNull();
	});

	it('surfaces an error state when the query rejects', async () => {
		const query = vi.fn().mockRejectedValue(new Error('boom'));
		const page = renderTransactionsPage({ apollo: { query } });
		await waitFor(() => {
			expect(page.getByTestId('list-error')).toBeTruthy();
		});
	});

	it('refetches with a queryString filter when the filter bar changes', async () => {
		const page = renderTransactionsPage({ totalCount: 1 });
		await flushPromises();
		await fireEvent.click(page.getByTestId('apply-filters'));
		await flushPromises();

		const lastVariables = page.query.mock.calls[page.query.mock.calls.length - 1][0].variables;
		expect(lastVariables.filter.queryString).toBe('12345');
		expect(lastVariables.filter.category).toBe('deposit');
		expect(lastVariables.offset).toBe(0);
	});

	it('tracks pagination changes', async () => {
		const page = renderTransactionsPage({ totalCount: 80 });
		await flushPromises();
		await fireEvent.click(page.getByTestId('pagination'));
		expect(page.trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-pagination', 50);
	});

	it('fetches with default variables (offset 0, limit 50, no filter) on mount', async () => {
		const page = renderTransactionsPage();
		await flushPromises();
		expect(page.query.mock.calls[0][0].variables).toEqual({ offset: 0, limit: 50 });
	});

	it('passes loading:true to the list while a fetch is in flight, then false', async () => {
		const d = deferred();
		const query = vi.fn().mockReturnValue(d.promise);
		const page = renderTransactionsPage({ apollo: { query } });

		expect(page.getByTestId('list-loading').textContent).toBe('true');
		d.resolve({ data: transactionsResponse() });
		await flushPromises();
		expect(page.getByTestId('list-loading').textContent).toBe('false');
	});

	it('ignores a stale response that resolves after a newer request', async () => {
		const first = deferred();
		const second = deferred();
		const query = vi.fn()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		const page = renderTransactionsPage({ apollo: { query } });

		// mount fired request #1 (pending); a filter change fires request #2
		await fireEvent.click(page.getByTestId('apply-filters'));

		// newer request resolves first, then the stale one resolves late
		second.resolve({ data: transactionsResponse(1, [{ newBalance: '222' }]) });
		await flushPromises();
		first.resolve({ data: transactionsResponse(1, [{ newBalance: '111' }]) });
		await flushPromises();

		// the list must reflect the newer request, not the stale one
		expect(page.getByTestId('list-balances').textContent).toBe('222');
	});

	it('refetches with the new offset and scrolls the table into view on page change', async () => {
		const page = renderTransactionsPage({ totalCount: 80 });
		await flushPromises();
		await fireEvent.click(page.getByTestId('pagination'));
		await flushPromises();

		const lastVariables = page.query.mock.calls[page.query.mock.calls.length - 1][0].variables;
		expect(lastVariables.offset).toBe(50);
		expect(scrollIntoView).toHaveBeenCalled();
	});

	it('resets to the first page when filters change after paginating', async () => {
		const page = renderTransactionsPage({ totalCount: 80 });
		await flushPromises();
		await fireEvent.click(page.getByTestId('pagination'));
		await flushPromises();
		await fireEvent.click(page.getByTestId('apply-filters'));
		await flushPromises();

		const lastVariables = page.query.mock.calls[page.query.mock.calls.length - 1][0].variables;
		expect(lastVariables.offset).toBe(0);
	});
});
