import { render, fireEvent, waitFor } from '@testing-library/vue';
import LoansPage from '#src/pages/Portfolio/Loans/LoansPage';

const deferred = () => {
	let resolve;
	const promise = new Promise(resolvePromise => {
		resolve = resolvePromise;
	});
	return { promise, resolve };
};

const loansResponse = (loanId = '101', totalCount = 45) => ({
	my: {
		id: 'my-id',
		loans: {
			totalCount,
			values: [
				{ id: loanId, name: 'Maria' },
			],
		},
	},
});

const scrollIntoView = vi.fn();

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
	configurable: true,
	value: scrollIntoView,
});

const renderLoansPage = ({ apollo = null, router = null } = {}) => {
	const query = vi.fn().mockResolvedValue({ data: loansResponse() });
	const push = vi.fn();

	return {
		query,
		push,
		...render(LoansPage, {
			global: {
				provide: {
					apollo: apollo || { query },
					cookieStore: {},
				},
				mocks: {
					$router: router || { push },
				},
				stubs: {
					WwwPage: { template: '<div><slot name="secondary" /><slot /></div>' },
					TheMyKivaSecondaryMenu: { template: '<div />' },
					ThePortfolioTertiaryMenu: { template: '<div />' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					LoanStatsTable: { template: '<div />' },
					LoanList: {
						props: ['loans', 'loading'],
						template: `
							<div data-testid="loan-list">
								loading:{{ loading }} loans:{{ loans.map(loan => loan.id).join(",") }}
							</div>
						`,
					},
					LoanFilterBar: {
						props: ['filters', 'queryString', 'countries', 'partners', 'totalLoans'],
						emits: ['filters-changed'],
						template: `
							<button
								type="button"
								data-testid="filter"
								@click="$emit('filters-changed', { status: 'delinquent' })"
							>
								filter
							</button>
						`,
					},
					KvPagination: {
						props: ['limit', 'total', 'offset', 'scrollToTop'],
						emits: ['page-changed'],
						template: `
							<div
								data-testid="pagination"
								:data-scroll-to-top="scrollToTop"
							>
								<button
									type="button"
									data-testid="first-page"
									@click="$emit('page-changed', { pageOffset: 0 })"
								>
									first {{ offset }} {{ total }}
								</button>
								<button
									type="button"
									data-testid="middle-page"
									@click="$emit('page-changed', { pageOffset: 20 })"
								>
									middle
								</button>
								<button
									type="button"
									data-testid="later-page"
									@click="$emit('page-changed', { pageOffset: 40 })"
								>
									later
								</button>
							</div>
						`,
					},
				},
			},
		}),
	};
};

describe('LoansPage', () => {
	beforeEach(() => {
		scrollIntoView.mockClear();
	});

	it('queries my loans with first page paging variables', async () => {
		const { query } = renderLoansPage();

		await waitFor(() => expect(query).toHaveBeenCalled());

		expect(query.mock.calls[0][0]).toEqual(expect.objectContaining({
			fetchPolicy: 'network-only',
			variables: {
				offset: 0,
				limit: 20,
			},
		}));
	});

	it('queries selected pages without adding query strings and scrolls to the table', async () => {
		const page = renderLoansPage();

		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(page.getByTestId('pagination').getAttribute('aria-disabled')).toBeNull());
		expect(page.getByTestId('pagination').getAttribute('class')).not.toContain('tw-pointer-events-none');
		await fireEvent.click(await page.findByTestId('middle-page'));
		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(2));
		await waitFor(() => expect(page.getByTestId('pagination').getAttribute('aria-disabled')).toBeNull());
		await fireEvent.click(await page.findByTestId('later-page'));
		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(3));

		expect(page.push).not.toHaveBeenCalled();
		expect(page.query.mock.calls[1][0].variables).toEqual({
			offset: 20,
			limit: 20,
		});
		expect(page.query.mock.calls[2][0].variables).toEqual({
			offset: 40,
			limit: 20,
		});
		expect(page.getByTestId('pagination').getAttribute('data-scroll-to-top')).toBe('false');
		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		});
	});

	it('hides pagination for a single page of results', async () => {
		const query = vi.fn().mockResolvedValue({
			data: loansResponse('101', 20),
		});

		const { queryByTestId } = renderLoansPage({ apollo: { query } });

		await waitFor(() => expect(query).toHaveBeenCalled());

		expect(queryByTestId('first-page')).toBeNull();
	});

	it('clears previous page loans while the next page is loading', async () => {
		const nextRequest = deferred();
		const query = vi.fn()
			.mockResolvedValueOnce({ data: loansResponse('101') })
			.mockReturnValueOnce(nextRequest.promise);
		const page = renderLoansPage({ apollo: { query } });

		await waitFor(() => expect(page.getByTestId('loan-list').textContent).toContain('loans:101'));

		await fireEvent.click(await page.findByTestId('later-page'));

		expect(page.getByTestId('loan-list').textContent).toContain('loading:true loans:');
		expect(page.getByTestId('loan-list').textContent).not.toContain('101');
	});

	it('disables pagination while the next page is loading', async () => {
		const nextRequest = deferred();
		const query = vi.fn()
			.mockResolvedValueOnce({ data: loansResponse('101') })
			.mockReturnValueOnce(nextRequest.promise);
		const page = renderLoansPage({ apollo: { query } });

		await waitFor(() => expect(page.getByTestId('loan-list').textContent).toContain('loans:101'));
		await fireEvent.click(await page.findByTestId('later-page'));

		expect(page.getByTestId('pagination').getAttribute('aria-disabled')).toBe('true');
		expect(page.getByTestId('pagination').getAttribute('class')).toContain('tw-pointer-events-none');
		expect(page.getByTestId('pagination').getAttribute('class')).toContain('tw-opacity-low');

		await fireEvent.click(await page.findByTestId('middle-page'));

		expect(query).toHaveBeenCalledTimes(2);
	});
});
