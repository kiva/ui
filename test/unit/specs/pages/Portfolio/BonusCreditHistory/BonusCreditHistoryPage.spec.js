import { render, waitFor, fireEvent } from '@testing-library/vue';
import BonusCreditHistoryPage from '#src/pages/Portfolio/BonusCreditHistory/BonusCreditHistoryPage';

const YEAR_MS = 60 * 60 * 24 * 365 * 1000;
const TEN_DAYS_MS = 60 * 60 * 24 * 10 * 1000;
// A far-future expiration keeps part-redeemed notes on the "remaining" branch.
const FUTURE_EXPIRATION = new Date(Date.now() + YEAR_MS).toISOString();
// A past expiration drives the EXPIRED status / "expired" note verb.
const PAST_EXPIRATION = new Date(Date.now() - TEN_DAYS_MS).toISOString();
// ISO 8601 string, matching the GraphQL Date scalar (asISO8601 output).
const CREATED_ISO = '2023-03-01T00:00:00.000Z';

const record = (overrides = {}) => ({
	id: 1,
	amountAtCreation: 25,
	amountUnredeemed: 25,
	expireTime: FUTURE_EXPIRATION,
	createTime: CREATED_ISO,
	awardType: 'invitation',
	promoFund: { id: 10, displayName: 'Kiva' },
	status: 'AVAILABLE',
	...overrides,
});

const historyResponse = (lenderPromoCredits = []) => ({
	my: {
		id: 'my-id',
		userAccount: {
			id: 3,
			lenderPromoCredits,
		},
	},
});

const renderPage = ({ response = historyResponse(), rejects = false, query } = {}) => {
	const q = query ?? (rejects
		? vi.fn().mockRejectedValue(new Error('boom'))
		: vi.fn().mockResolvedValue({ data: response }));

	return {
		query: q,
		...render(BonusCreditHistoryPage, {
			global: {
				provide: { apollo: { query: q }, cookieStore: {} },
				mocks: { $kvTrackEvent: vi.fn() },
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					// Parent @click falls through to this root <button> natively, so the
					// "Try again" retry path fires exactly once per click.
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					// Emit page-changed with the next page's offset when clicked.
					KvPagination: {
						props: ['limit', 'offset', 'total'],
						emits: ['page-changed'],
						template: '<button data-testid="pagination"'
							+ ' @click="$emit(\'page-changed\', { pageOffset: 10 })">page</button>',
					},
				},
			},
		}),
	};
};

describe('BonusCreditHistoryPage', () => {
	it('shows the loading placeholder before the query resolves', () => {
		const { getByTestId } = renderPage();
		expect(getByTestId('loading')).toBeTruthy();
	});

	it('shows the empty state when there is no history', async () => {
		const { getByTestId, getByText } = renderPage({ response: historyResponse([]) });
		await waitFor(() => {
			expect(getByTestId('free-credit-empty')).toBeTruthy();
		});
		expect(getByText('You have not earned any free credits.', { exact: false })).toBeTruthy();
		const learnMore = getByText('Learn More', { exact: false });
		expect(learnMore.getAttribute('href')).toBe('/bonus/learnmore');
	});

	it('renders a row per record with formatted amount, status badge and note', async () => {
		const { getByTestId, getByText } = renderPage({
			response: historyResponse([record()]),
		});
		await waitFor(() => {
			expect(getByTestId('free-credit-table')).toBeTruthy();
		});
		// Amount formatted as currency
		expect(getByText('$25.00')).toBeTruthy();
		// Status badge label + colour class
		const badge = getByText('Available');
		expect(badge.className).toContain('tw-bg-eco-green-1');
		// FE-composed note from awardType + createTime
		expect(getByText('Successful invite on', { exact: false })).toBeTruthy();
	});

	it('appends the remaining amount for a part-redeemed credit', async () => {
		const { getByText } = renderPage({
			response: historyResponse([record({
				status: 'PART_REDEEMED',
				amountUnredeemed: 2,
				awardType: 'promo_code',
			})]),
		});
		await waitFor(() => {
			expect(getByText('Part redeemed')).toBeTruthy();
		});
		expect(getByText('$2.00 remaining.', { exact: false })).toBeTruthy();
	});

	it('appends "expired" for a part-redeemed credit past its expiration', async () => {
		const { getByText } = renderPage({
			response: historyResponse([record({
				status: 'PART_REDEEMED',
				amountUnredeemed: 3,
				awardType: 'promo_code',
				expireTime: PAST_EXPIRATION,
			})]),
		});
		await waitFor(() => {
			expect(getByText('$3.00 expired.', { exact: false })).toBeTruthy();
		});
	});

	it.each([
		['lending_reward', 'Free credit added on'],
		['admin', 'Free credit added on'],
		['donation', 'Donation reward on'],
		['free_trial', 'Free trial reward on'],
	])('composes the note for award type %s', async (awardType, expectedPrefix) => {
		const { getByText } = renderPage({ response: historyResponse([record({ awardType })]) });
		await waitFor(() => {
			expect(getByText(expectedPrefix, { exact: false })).toBeTruthy();
		});
	});

	it('composes the default note (no "on") for an unknown award type', async () => {
		const { getByText, queryByText } = renderPage({
			response: historyResponse([record({ awardType: 'universal_code' })]),
		});
		await waitFor(() => {
			expect(getByText('Free credit added', { exact: false })).toBeTruthy();
		});
		expect(queryByText('added on', { exact: false })).toBeNull();
	});

	it('renders the Redeemed badge', async () => {
		const { getByText } = renderPage({
			response: historyResponse([record({ status: 'REDEEMED', amountUnredeemed: 0 })]),
		});
		await waitFor(() => {
			const badge = getByText('Redeemed');
			expect(badge.className).toContain('tw-bg-gray-100');
		});
	});

	it('renders the Expired badge', async () => {
		const { getByText } = renderPage({
			response: historyResponse([record({ status: 'EXPIRED', expireTime: PAST_EXPIRATION })]),
		});
		await waitFor(() => {
			const badge = getByText('Expired');
			expect(badge.className).toContain('tw-text-danger');
		});
	});

	it('paginates client-side: shows 10 of >10 rows and advances on page change', async () => {
		const many = Array.from({ length: 15 }, (_, i) => record({ id: i + 1, amountAtCreation: 100 + i }));
		const { container, getByTestId, queryByTestId } = renderPage({ response: historyResponse(many) });
		await waitFor(() => {
			expect(getByTestId('free-credit-table')).toBeTruthy();
		});
		// First page: 10 rows + pagination control present.
		expect(container.querySelectorAll('tbody tr')).toHaveLength(10);
		expect(queryByTestId('pagination')).toBeTruthy();
		// Advance a page -> the remaining 5 rows.
		await fireEvent.click(getByTestId('pagination'));
		await waitFor(() => {
			expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
		});
	});

	it('hides pagination when there are 10 or fewer rows', async () => {
		const few = Array.from({ length: 5 }, (_, i) => record({ id: i + 1 }));
		const { container, getByTestId, queryByTestId } = renderPage({ response: historyResponse(few) });
		await waitFor(() => {
			expect(getByTestId('free-credit-table')).toBeTruthy();
		});
		expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
		expect(queryByTestId('pagination')).toBeNull();
	});

	it('shows the error state when the query rejects', async () => {
		const { getByTestId } = renderPage({ rejects: true });
		await waitFor(() => {
			expect(getByTestId('free-credit-load-error')).toBeTruthy();
		});
	});

	it('shows the error state when the query resolves without a history list', async () => {
		const { getByTestId } = renderPage({ response: historyResponse(null) });
		await waitFor(() => {
			expect(getByTestId('free-credit-load-error')).toBeTruthy();
		});
	});

	it('retries the fetch when "Try again" is clicked', async () => {
		const query = vi.fn()
			.mockRejectedValueOnce(new Error('boom'))
			.mockResolvedValue({ data: historyResponse([record()]) });
		const { getByTestId, getByText } = renderPage({ query });
		await waitFor(() => {
			expect(getByTestId('free-credit-load-error')).toBeTruthy();
		});
		await fireEvent.click(getByText('Try again'));
		await waitFor(() => {
			expect(getByTestId('free-credit-table')).toBeTruthy();
		});
		expect(query).toHaveBeenCalledTimes(2);
	});

	it('wraps displayed user data in a HotJar-suppressed container', async () => {
		const { container, getByTestId } = renderPage({ response: historyResponse([record()]) });
		await waitFor(() => {
			expect(getByTestId('free-credit-table')).toBeTruthy();
		});
		const suppressed = container.querySelector('[data-hj-suppress]');
		expect(suppressed).toBeTruthy();
		expect(suppressed.contains(getByTestId('free-credit-table'))).toBe(true);
	});
});
