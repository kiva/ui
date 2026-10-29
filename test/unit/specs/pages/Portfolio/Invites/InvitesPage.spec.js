import { render, waitFor, fireEvent } from '@testing-library/vue';
import InvitesPage from '#src/pages/Portfolio/Invites/InvitesPage';

const publicLender = {
	id: 601,
	name: 'Inviter Ivy',
	publicId: 'ivy',
	image: { id: 9, url: 'https://example.com/ivy.jpg' },
	lenderPage: {
		city: 'Austin',
		state: 'TX',
		country: { id: 1, name: 'United States' },
	},
};

const invitesResponse = ({ inviter = null, inviterName = 'caseyd' } = {}) => ({
	my: {
		id: 'my-id',
		userAccount: {
			id: 3,
			inviterName,
			invites: { id: 3, inviter },
		},
		userStats: {
			number_of_invites: 4,
			number_of_loans_by_invitees: 12,
		},
	},
});

// Records each element's tracking payload so specs can check it
const trackEventDirective = {
	mounted(el, { value }) {
		el.setAttribute('data-track-event', JSON.stringify(value));
	},
};

const renderPage = ({
	response = invitesResponse(), errors, rejects = false, query: customQuery,
} = {}) => {
	const query = customQuery ?? (rejects
		? vi.fn().mockRejectedValue(new Error('boom'))
		: vi.fn().mockResolvedValue({ data: response, errors }));

	return {
		query,
		...render(InvitesPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: { $appConfig: { host: 'www.kiva.org' } },
				directives: { 'kv-track-event': trackEventDirective },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					AcceptedInvitesTable: { template: '<div data-testid="accepted-invites-table-stub" />' },
					KvButton: { template: '<button><slot /></button>' },
					KvLoadingPlaceholder: { template: '<div />' },
					KvLoadingText: { template: '<span data-testid="loading-text" />' },
					KvUserAvatar: {
						props: ['lenderName', 'lenderImageUrl'],
						template: '<img data-testid="avatar" :alt="lenderName" :src="lenderImageUrl">',
					},
				},
			},
		}),
	};
};

describe('InvitesPage', () => {
	it('renders the static frame and per-section loaders before the query resolves', () => {
		const {
			getByText, getByTestId, getAllByTestId, getByRole, queryByLabelText,
		} = renderPage();
		expect(getByText('Invite your friends to Kiva!')).toBeTruthy();
		expect(getByText('My invite activity')).toBeTruthy();
		expect(getByTestId('invites-accepted').querySelector('[data-testid="accepted-invites-table-stub"]'))
			.toBeTruthy();
		expect(getByText('Your personal invite page')).toBeTruthy();
		expect(getByText('Successful invites')).toBeTruthy();
		expect(getByTestId('invites-personal-url-loading')).toBeTruthy();
		expect(queryByLabelText('Your personal invite page')).toBeNull();
		expect(getByTestId('invites-inviter-loading')).toBeTruthy();
		// Two stat numbers, plus the inviter heading and line
		expect(getAllByTestId('loading-text')).toHaveLength(4);
		expect(getByRole('status').textContent).toBe('Loading invite details');
	});

	it('queries the network each time the page loads', () => {
		const { query } = renderPage();
		expect(query).toHaveBeenCalledWith(expect.objectContaining({ fetchPolicy: 'network-only' }));
	});

	it('shows the personal invite URL and invite stats', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => {
			expect(getByLabelText('Your personal invite page').value).toBe('https://www.kiva.org/invitedby/caseyd');
		});
		expect(JSON.parse(getByLabelText('Your personal invite page').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Invites personal url']);
		expect(getByTestId('invites-accepted-count').textContent.trim()).toBe('4');
		expect(getByTestId('invitee-loan-count').textContent.trim()).toBe('12');
	});

	it('asks a user with no inviter to give their friend credit', async () => {
		const { getByText, getByTestId } = renderPage();
		await waitFor(() => expect(getByText('Invited to Kiva by a friend?')).toBeTruthy());
		expect(getByTestId('invites-ack-inviter').textContent.trim()).toBe('Give your friend credit.');
	});

	it('shows a public inviter with a profile link, image and location', async () => {
		const { getByText, getByTestId } = renderPage({
			response: invitesResponse({ inviter: { lender: publicLender } }),
		});
		await waitFor(() => expect(getByText('Invited by')).toBeTruthy());
		const name = getByTestId('invites-inviter-name');
		expect(name.textContent).toBe('Inviter Ivy');
		expect(name.getAttribute('href')).toBe('/lender/ivy');
		expect(JSON.parse(name.dataset.trackEvent)).toEqual(['portfolio', 'click', 'Invites inviter profile']);
		expect(getByTestId('avatar').getAttribute('src')).toBe('https://example.com/ivy.jpg');
		expect(getByTestId('invites-inviter-location').textContent.trim()).toBe('Austin, TX, USA');
	});

	it('shows an anonymous inviter without a link or location', async () => {
		const { getByText, getByTestId, queryByTestId } = renderPage({
			response: invitesResponse({ inviter: { lender: null } }),
		});
		await waitFor(() => expect(getByText('Invited by')).toBeTruthy());
		const name = getByTestId('invites-inviter-name');
		expect(name.textContent.trim()).toBe('Anonymous');
		expect(name.getAttribute('href')).toBeNull();
		expect(queryByTestId('invites-inviter-location')).toBeNull();
		expect(queryByTestId('invites-ack-inviter')).toBeNull();
	});

	it('shows the error state and recovers on retry', async () => {
		const query = vi.fn()
			.mockRejectedValueOnce(new Error('boom'))
			.mockResolvedValueOnce({ data: invitesResponse() });
		const {
			getByTestId, getByText, getByLabelText, queryByTestId,
		} = renderPage({ query });
		await waitFor(() => expect(getByTestId('invites-load-error')).toBeTruthy());
		expect(getByText('My invite activity')).toBeTruthy();
		expect(JSON.parse(getByText('Try again').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Invites retry load']);
		await fireEvent.click(getByText('Try again'));
		await waitFor(() => {
			expect(getByLabelText('Your personal invite page').value).toBe('https://www.kiva.org/invitedby/caseyd');
		});
		expect(queryByTestId('invites-load-error')).toBeNull();
		expect(query).toHaveBeenCalledTimes(2);
	});

	it('shows the error state when the response carries GraphQL errors', async () => {
		const { getByTestId, queryByText } = renderPage({ errors: [{ message: 'inviter failed' }] });
		await waitFor(() => expect(getByTestId('invites-load-error')).toBeTruthy());
		expect(queryByText('Invited to Kiva by a friend?')).toBeNull();
	});

	const { my } = invitesResponse();
	it.each([
		['userAccount', { ...my, userAccount: null }],
		['invites', { ...my, userAccount: { ...my.userAccount, invites: null } }],
		['userStats', { ...my, userStats: null }],
	])('shows the error state when %s is missing', async (_field, partialMy) => {
		const { getByTestId } = renderPage({ response: { my: partialMy } });
		await waitFor(() => expect(getByTestId('invites-load-error')).toBeTruthy());
	});

	it('uses the encoded invite name for a private user', async () => {
		const { getByLabelText } = renderPage({ response: invitesResponse({ inviterName: '_abc123' }) });
		await waitFor(() => {
			expect(getByLabelText('Your personal invite page').value).toBe('https://www.kiva.org/invitedby/_abc123');
		});
	});

	it('leaves the personal invite URL empty without an invite name', async () => {
		const { getByLabelText } = renderPage({ response: invitesResponse({ inviterName: null }) });
		await waitFor(() => expect(getByLabelText('Your personal invite page').value).toBe(''));
	});

	it.each([
		[{ city: 'Austin', state: null, country: null }, 'Austin'],
		[{ city: null, state: 'Ontario', country: { id: 2, name: 'Canada' } }, 'Ontario, Canada'],
		[{ city: null, state: null, country: { id: 1, name: 'United States' } }, 'USA'],
		[{ city: 'Nairobi', state: null, country: { id: 3, name: 'Kenya' } }, 'Nairobi, Kenya'],
	])('formats the inviter location %o as %s', async (lenderPage, expected) => {
		const { getByTestId } = renderPage({
			response: invitesResponse({ inviter: { lender: { ...publicLender, lenderPage } } }),
		});
		await waitFor(() => {
			expect(getByTestId('invites-inviter-location').textContent.trim()).toBe(expected);
		});
	});

	it('omits the location and image when the public inviter has neither', async () => {
		const lender = {
			...publicLender,
			image: null,
			lenderPage: { city: null, state: null, country: null },
		};
		const { getByTestId, queryByTestId } = renderPage({
			response: invitesResponse({ inviter: { lender } }),
		});
		await waitFor(() => expect(getByTestId('invites-inviter-name')).toBeTruthy());
		expect(queryByTestId('invites-inviter-location')).toBeNull();
		expect(getByTestId('avatar').getAttribute('src')).toBe('');
	});

	it('keeps the give-credit action disabled until it is available', async () => {
		const { getByTestId } = renderPage();
		await waitFor(() => expect(getByTestId('invites-ack-inviter').disabled).toBe(true));
	});

	it('suppresses user data from session recording', async () => {
		const { getByTestId } = renderPage();
		await waitFor(() => {
			expect(getByTestId('invites-personal-url').closest('[data-hj-suppress]')).toBeTruthy();
		});
	});
});
