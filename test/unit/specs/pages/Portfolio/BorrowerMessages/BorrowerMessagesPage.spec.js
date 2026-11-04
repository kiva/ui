import { render, fireEvent } from '@testing-library/vue';
import { ref } from 'vue';
import BorrowerMessagesPage from '#src/pages/Portfolio/BorrowerMessages/BorrowerMessagesPage';

const mockPush = vi.fn();
const mockRoute = { query: {} };
const mockState = {};

vi.mock('vue-router', () => ({
	useRoute: () => mockRoute,
	useRouter: () => ({ push: mockPush }),
}));

vi.mock('@unhead/vue', () => ({
	useHead: vi.fn(),
}));

vi.mock('#src/composables/useBorrowerMessages', () => ({
	default: () => mockState,
}));

const buildMessages = count => Array.from({ length: count }, (_, i) => ({ id: i + 1, subject: `Message ${i + 1}` }));

const renderPage = (options = {}) => {
	const {
		updates = buildMessages(2),
		offset = 0,
		loading = false,
		error = null,
		query = {},
	} = options;
	mockRoute.query = query;
	Object.assign(mockState, {
		updates: ref(updates),
		totalCount: ref('totalCount' in options ? options.totalCount : updates.length),
		limit: 10,
		offset: ref(offset),
		loading: ref(loading),
		error: ref(error),
	});

	return render(BorrowerMessagesPage, {
		global: {
			provide: { $kvTrackEvent: vi.fn() },
			directives: { kvTrackEvent: {} },
			stubs: {
				WwwPage: { template: '<div><slot /></div>' },
				RouterLink: { props: ['to'], template: '<a :href="JSON.stringify(to)"><slot /></a>' },
				BorrowerMessageRow: {
					props: ['message'],
					template: '<div data-testid="borrower-message">{{ message.subject }}</div>',
				},
				KvPagination: {
					props: ['total', 'limit', 'offset'],
					emits: ['page-changed'],
					template: `<button
						data-testid="pagination"
						@click="$emit('page-changed', { pageOffset: 20 })"
					/>`,
				},
			},
		},
	});
};

beforeEach(() => {
	mockPush.mockClear();
});

describe('BorrowerMessagesPage', () => {
	it('shows the page heading', () => {
		const { getByRole, getByText } = renderPage();

		getByRole('heading', { level: 1, name: 'Borrower Messages' });
		getByText('Your account');
		getByText('Messages from the borrowers you have funded, newest first.');
	});

	it('shows a row for each message', () => {
		const { getAllByTestId } = renderPage();

		expect(getAllByTestId('borrower-message').map(row => row.textContent)).toEqual(['Message 1', 'Message 2']);
	});

	it('shows placeholders while loading', () => {
		const { getAllByTestId, queryByTestId } = renderPage({ updates: [], totalCount: undefined, loading: true });

		expect(getAllByTestId('borrower-message-loading')).toHaveLength(3);
		expect(queryByTestId('borrower-message')).toBeNull();
	});

	it('shows the empty state when the lender has no messages', () => {
		const { getByTestId, queryByTestId } = renderPage({ updates: [], totalCount: 0 });

		getByTestId('messages-empty');
		expect(queryByTestId('pagination')).toBeNull();
	});

	it('shows the error state', () => {
		const { getByTestId, queryByTestId } = renderPage({ updates: [], error: new Error('boom') });

		getByTestId('messages-error');
		expect(queryByTestId('borrower-message')).toBeNull();
	});

	it('links back to the first page when past the last page', () => {
		const { getByTestId } = renderPage({
			updates: [], totalCount: 5, offset: 10, query: { page: '2', x: '1' }
		});

		const link = getByTestId('messages-past-last-page').querySelector('a');
		expect(JSON.parse(link.getAttribute('href'))).toEqual({ query: { x: '1' } });
	});

	it('hides pagination when everything fits on one page', () => {
		const { queryByTestId } = renderPage({ updates: buildMessages(10), totalCount: 10 });

		expect(queryByTestId('pagination')).toBeNull();
	});

	it('pages through the route query', async () => {
		const { getByTestId } = renderPage({ updates: buildMessages(10), totalCount: 25, query: { x: '1' } });

		await fireEvent.click(getByTestId('pagination'));

		expect(mockPush).toHaveBeenCalledWith({ query: { x: '1', page: '3' } });
	});

	it('ignores page changes while loading', async () => {
		const { getByTestId } = renderPage({ updates: buildMessages(10), totalCount: 25, loading: true });

		await fireEvent.click(getByTestId('pagination'));

		expect(mockPush).not.toHaveBeenCalled();
	});
});
