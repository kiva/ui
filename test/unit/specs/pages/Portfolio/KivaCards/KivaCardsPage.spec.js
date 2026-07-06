import { render, fireEvent, waitFor } from '@testing-library/vue';
import KivaCardsPage from '#src/pages/Portfolio/KivaCards/KivaCardsPage';

const flushPromises = () => new Promise(resolve => {
	setTimeout(resolve);
});

const scrollIntoView = vi.fn();

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
	configurable: true,
	value: scrollIntoView,
});

const kivaCardsResponse = (purchasedKivaCards = {}) => ({
	my: {
		id: 'my-id',
		userAccount: {
			id: 'ua-id',
			purchasedKivaCards: {
				total: 3,
				canWithdraw: true,
				values: [
					{ id: 111, status: 'redeemed' },
					{ id: 222, status: 'active' },
				],
				...purchasedKivaCards,
			},
		},
	},
});

const renderPage = ({ query } = {}) => {
	const queryFn = query || vi.fn().mockResolvedValue({ data: kivaCardsResponse() });

	return {
		query: queryFn,
		...render(KivaCardsPage, {
			global: {
				provide: {
					apollo: { query: queryFn },
				},
				directives: {
					'kv-track-event': {},
				},
				stubs: {
					WwwPage: { template: '<div><slot name="secondary" /><slot /></div>' },
					TheMyKivaSecondaryMenu: { template: '<div />' },
					ThePortfolioTertiaryMenu: { template: '<div />' },
					KvPageContainer: { template: '<div><slot /></div>' },
					KvGrid: { template: '<div><slot /></div>' },
					KvLoadingPlaceholder: { template: '<div />' },
					KvButton: { template: '<a data-testid="export"><slot /></a>' },
					KvSelect: {
						props: ['modelValue', 'disabled'],
						emits: ['update:model-value'],
						template: `<button
							data-testid="sort"
							:disabled="disabled"
							@click="$emit('update:model-value', 'redeemedDate')"
						>sort</button>`,
					},
					KvPagination: {
						props: ['limit', 'offset', 'total'],
						emits: ['page-changed'],
						template: `<button
							data-testid="page"
							@click="$emit('page-changed', { pageOffset: 10 })"
						>page</button>`,
					},
					KivaCardList: {
						props: ['cards', 'loading', 'hasError', 'canWithdraw'],
						template: `<div data-testid="kiva-card-list">
							loading:{{ loading }} error:{{ hasError }} canWithdraw:{{ canWithdraw }}
							cards:{{ cards.map(c => c.id).join(',') }}
						</div>`,
					},
				},
			},
		}),
	};
};

describe('KivaCardsPage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('fetches on mount and shows the count and cards', async () => {
		const { query, getByText, getByTestId } = renderPage();

		await waitFor(() => expect(getByText('3 Kiva Cards purchased')).toBeTruthy());

		expect(query).toHaveBeenCalledWith(expect.objectContaining({
			variables: { offset: 0, limit: 10, sortBy: 'purchasedDate' },
		}));
		expect(getByTestId('kiva-card-list').textContent).toContain('cards:111,222');
	});

	it('shows the non-withdrawable warning and forwards canWithdraw to the list', async () => {
		const query = vi.fn().mockResolvedValue({
			data: kivaCardsResponse({ canWithdraw: false }),
		});
		const { getByText, getByTestId } = renderPage({ query });

		await waitFor(() => expect(
			getByText(/This type of account must not purchase Kiva Cards/)
		).toBeTruthy());
		expect(getByTestId('kiva-card-list').textContent).toContain('canWithdraw:false');
	});

	it('re-queries with the selected sort and resets the offset', async () => {
		const { query, getByTestId, getByText } = renderPage();

		await waitFor(() => expect(getByText('3 Kiva Cards purchased')).toBeTruthy());

		await fireEvent.click(getByTestId('sort'));
		await flushPromises();

		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({
			variables: { offset: 0, limit: 10, sortBy: 'redeemedDate' },
		}));
	});

	it('re-queries with the new offset on page change', async () => {
		// total must exceed the page limit for the pagination control to render.
		const query = vi.fn().mockResolvedValue({ data: kivaCardsResponse({ total: 25 }) });
		const { getByTestId, getByText } = renderPage({ query });

		await waitFor(() => expect(getByText('25 Kiva Cards purchased')).toBeTruthy());

		await fireEvent.click(getByTestId('page'));
		await flushPromises();

		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({
			variables: { offset: 10, limit: 10, sortBy: 'purchasedDate' },
		}));
	});

	it('passes the error state to the list when the query rejects', async () => {
		const query = vi.fn().mockRejectedValue(new Error('boom'));
		const { getByTestId } = renderPage({ query });

		await waitFor(() => expect(getByTestId('kiva-card-list').textContent).toContain('error:true'));
	});
});
