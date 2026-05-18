import { render, fireEvent, waitFor } from '@testing-library/vue';
import LoansPage from '#src/pages/Portfolio/Loans/LoansPage';

const deferred = () => {
	let resolve;
	const promise = new Promise(resolvePromise => {
		resolve = resolvePromise;
	});
	return { promise, resolve };
};

const flushPromises = () => new Promise(resolve => {
	setTimeout(resolve);
});

const loansResponse = (
	loanId = '101',
	totalCount = 45,
	{
		countriesLentTo = [
			{ id: 'country-1', isoCode: 'PE', name: 'Peru' },
		],
		partnersLentTo = [
			{ id: 44, name: 'Partner 44' },
		],
	} = {}
) => ({
	my: {
		id: 'my-id',
		lendingStats: {
			countriesLentTo,
			partnersLentTo,
		},
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
						props: ['filters', 'keywordSearch', 'countries', 'partners', 'totalLoans'],
						emits: ['filters-changed'],
						template: `
							<div>
								<div data-testid="filter-options">
									{{ countries.length }} countries {{ partners.length }} partners
								</div>
								<div data-testid="filter-countries">
									{{ countries.map(country => country.name).join(',') }}
								</div>
								<div data-testid="filter-partners">
									{{ partners.map(partner => partner.name).join(',') }}
								</div>
								<button
									type="button"
									data-testid="filter"
									@click="$emit('filters-changed', {
										filters: {
											status: 'payingBack',
											country: ['PE'],
											partner: [44],
										},
										keywordSearch: 'Maria'
									})"
								>
									filter
								</button>
							</div>
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
				includeFilterOptions: true,
			},
		}));
	});

	it('queries selected pages without updating the route and scrolls to the table', async () => {
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
			includeFilterOptions: false,
		});
		expect(page.query.mock.calls[2][0].variables).toEqual({
			offset: 40,
			limit: 20,
			includeFilterOptions: false,
		});
		expect(page.getByTestId('pagination').getAttribute('data-scroll-to-top')).toBe('false');
		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		});
	});

	it('passes portfolio filter options to the filter bar', async () => {
		const page = renderLoansPage();

		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(1));

		await waitFor(() => {
			expect(page.getByTestId('filter-options').textContent).toContain('1 countries 1 partners');
		});
	});

	it('resets to the first page and queries with active filters and keyword search', async () => {
		const page = renderLoansPage();

		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(1));
		await fireEvent.click(await page.findByTestId('later-page'));
		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(2));
		await fireEvent.click(page.getByTestId('filter'));
		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(3));

		expect(page.query.mock.calls[2][0].variables).toEqual({
			offset: 0,
			limit: 20,
			includeFilterOptions: false,
			filters: {
				status: 'payingBack',
				country: ['PE'],
				partner: [44],
			},
			keywordSearch: 'Maria',
		});
	});

	it('only requests portfolio filter options until they are loaded', async () => {
		const page = renderLoansPage();

		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(1));
		await fireEvent.click(await page.findByTestId('later-page'));
		await waitFor(() => expect(page.query).toHaveBeenCalledTimes(2));

		expect(page.query.mock.calls[0][0].variables).toEqual({
			offset: 0,
			limit: 20,
			includeFilterOptions: true,
		});
		expect(page.query.mock.calls[1][0].variables).toEqual({
			offset: 40,
			limit: 20,
			includeFilterOptions: false,
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

	it('sorts portfolio filter options by name', async () => {
		const query = vi.fn().mockResolvedValue({
			data: loansResponse('101', 45, {
				countriesLentTo: [
					{ id: 'country-2', isoCode: 'ZW', name: 'Zimbabwe' },
					{ id: 'country-1', isoCode: 'AL', name: 'Albania' },
				],
				partnersLentTo: [
					{ id: 22, name: 'Z Partner' },
					{ id: 11, name: 'A Partner' },
				],
			}),
		});
		const page = renderLoansPage({ apollo: { query } });

		await waitFor(() => expect(query).toHaveBeenCalled());

		await waitFor(() => {
			expect(page.getByTestId('filter-countries').textContent).toContain('Albania,Zimbabwe');
			expect(page.getByTestId('filter-partners').textContent).toContain('A Partner,Z Partner');
		});
	});

	it('ignores stale loan responses when a newer filter request finishes first', async () => {
		const pageRequest = deferred();
		const filterRequest = deferred();
		const query = vi.fn()
			.mockResolvedValueOnce({ data: loansResponse('101') })
			.mockReturnValueOnce(pageRequest.promise)
			.mockReturnValueOnce(filterRequest.promise);
		const page = renderLoansPage({ apollo: { query } });

		await waitFor(() => expect(page.getByTestId('loan-list').textContent).toContain('loans:101'));
		await fireEvent.click(await page.findByTestId('later-page'));
		await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
		await fireEvent.click(page.getByTestId('filter'));
		await waitFor(() => expect(query).toHaveBeenCalledTimes(3));

		filterRequest.resolve({ data: loansResponse('303') });
		await waitFor(() => expect(page.getByTestId('loan-list').textContent).toContain('loans:303'));

		pageRequest.resolve({ data: loansResponse('202') });
		await flushPromises();

		expect(page.getByTestId('loan-list').textContent).toContain('loans:303');
		expect(page.getByTestId('loan-list').textContent).not.toContain('loans:202');
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
