import { render, waitFor, fireEvent } from '@testing-library/vue';
import InvitesPage from '#src/pages/Portfolio/Invites/InvitesPage';
import { trackEventDirective } from '../../../components/Portfolio/Invites/invitesSpecHelpers';

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

const invitesResponse = ({
	inviter = null, inviterName = 'caseyd', firstName = 'Casey', isPublic = true,
} = {}) => ({
	my: {
		id: 'my-id',
		userAccount: {
			id: 3,
			firstName,
			public: isPublic,
			inviterName,
			invites: { id: 3, inviter },
		},
		userStats: {
			number_of_invites: 4,
			number_of_loans_by_invitees: 12,
		},
	},
});

// Records the props the page passes the email form, and lets specs report a send
const composerStub = {
	props: ['firstName', 'isPublic', 'disabled'],
	emits: ['sent'],
	template: '<button data-testid="invite-composer-stub" :data-first-name="firstName" :data-public="isPublic" '
		+ ':data-disabled="disabled" @click="$emit(\'sent\')" />',
};

// Shows the email form the page gives the tabs, records their props, and lets specs report a share
const tabsStub = {
	props: ['personalUrl', 'loading', 'loadError'],
	emits: ['shared'],
	template: '<div data-testid="invite-tabs-stub" :data-personal-url="personalUrl" :data-loading="loading" '
		+ ':data-load-error="loadError">'
		+ '<slot name="email" /><button data-testid="invite-composer-share" @click="$emit(\'shared\')" /></div>',
};

// Shows whether the page opened the form, and lets specs close it or report its outcome
const ackModalStub = {
	props: ['visible'],
	emits: ['close', 'acknowledged', 'not-found'],
	data: () => ({ acknowledgement: null }),
	template: '<div data-testid="ack-modal-stub" :data-visible="visible">'
		+ '<button data-testid="ack-modal-close" @click="$emit(\'close\')" />'
		+ '<button data-testid="ack-modal-ack" @click="$emit(\'acknowledged\', acknowledgement)" />'
		+ '<button data-testid="ack-modal-not-found" @click="$emit(\'not-found\')" /></div>',
};

const renderPage = ({
	response = invitesResponse(), errors, rejects = false, query: customQuery, fetchActivity = vi.fn(),
	showTipMsg = vi.fn(), acknowledgement,
} = {}) => {
	const query = customQuery ?? (rejects
		? vi.fn().mockRejectedValue(new Error('boom'))
		: vi.fn().mockResolvedValue({ data: response, errors }));

	return {
		query,
		...render(InvitesPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: { $appConfig: { host: 'www.kiva.org' }, $showTipMsg: showTipMsg },
				directives: { 'kv-track-event': trackEventDirective },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					AcceptedInvitesTable: { template: '<div data-testid="accepted-invites-table-stub" />' },
					InviteActivityTable: {
						methods: { fetchFirstPage: fetchActivity },
						template: '<div data-testid="invite-activity-table-stub" />',
					},
					InviteComposer: composerStub,
					InviteComposerTabs: tabsStub,
					AcknowledgeInviterModal: {
						...ackModalStub,
						data: () => ({ acknowledgement }),
					},
					KvButton: { template: '<button><slot /></button>' },
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
		expect(getByTestId('invites-activity').querySelector('[data-testid="invite-activity-table-stub"]'))
			.toBeTruthy();
		expect(getByTestId('invites-accepted').querySelector('[data-testid="accepted-invites-table-stub"]'))
			.toBeTruthy();
		expect(getByText('Your personal invite page')).toBeTruthy();
		expect(getByText('Successful invites')).toBeTruthy();
		expect(getByTestId('invites-personal-url-loading')).toBeTruthy();
		expect(queryByLabelText('Your personal invite page')).toBeNull();
		expect(getByTestId('invites-inviter-loading')).toBeTruthy();
		// The personal URL, two stat numbers, plus the inviter heading and line
		expect(getAllByTestId('loading-text')).toHaveLength(5);
		expect(getByRole('status').textContent).toBe('Loading invite details');
	});

	it('keeps the composer disabled until the viewer loads, then signs it with their name', async () => {
		const { getByTestId } = renderPage();
		expect(getByTestId('invite-composer-stub').dataset.disabled).toBe('true');
		await waitFor(() => expect(getByTestId('invite-composer-stub').dataset.disabled).toBe('false'));
		expect(getByTestId('invite-composer-stub').dataset.firstName).toBe('Casey');
		expect(getByTestId('invite-composer-stub').dataset.public).toBe('true');
	});

	it('passes a private viewer to the composer as not public', async () => {
		const { getByTestId } = renderPage({ response: invitesResponse({ isPublic: false }) });
		await waitFor(() => expect(getByTestId('invite-composer-stub').dataset.disabled).toBe('false'));
		expect(getByTestId('invite-composer-stub').dataset.public).toBe('false');
	});

	it('keeps the composer disabled when the viewer fails to load', async () => {
		const { getByTestId } = renderPage({ rejects: true });
		await waitFor(() => expect(getByTestId('invites-load-error')).toBeTruthy());
		expect(getByTestId('invite-composer-stub').dataset.disabled).toBe('true');
		expect(getByTestId('invite-tabs-stub').dataset.loadError).toBe('true');
	});

	it.each([
		['invites are sent', 'invite-composer-stub'],
		['a share link is made', 'invite-composer-share'],
	])('reloads the activity table after %s', async (_, testId) => {
		const fetchActivity = vi.fn();
		const { getByTestId } = renderPage({ fetchActivity });
		await fireEvent.click(getByTestId(testId));
		expect(fetchActivity).toHaveBeenCalledTimes(1);
	});

	it('passes the personal invite URL to the tabs once it loads', async () => {
		const { getByTestId } = renderPage();
		expect(getByTestId('invite-tabs-stub').dataset.loading).toBe('true');
		await waitFor(() => expect(getByTestId('invite-tabs-stub').dataset.loading).toBe('false'));
		expect(getByTestId('invite-tabs-stub').dataset.personalUrl).toBe('https://www.kiva.org/invitedby/caseyd');
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
		const input = getByLabelText('Your personal invite page');
		expect(JSON.parse(input.dataset.trackEvent)).toEqual(['portfolio', 'click', 'Invites personal url']);
		await fireEvent.click(input);
		expect([input.selectionStart, input.selectionEnd]).toEqual([0, input.value.length]);
		expect(getByTestId('invites-accepted-count').textContent.trim()).toBe('4');
		expect(getByTestId('invitee-loan-count').textContent.trim()).toBe('12');
	});

	it('falls back to empty values for fields the account leaves out', async () => {
		const response = invitesResponse();
		Object.assign(response.my.userAccount, { inviterName: null, firstName: null, public: null });
		response.my.userAccount.invites = { id: 3 };
		response.my.userStats = { number_of_invites: null, number_of_loans_by_invitees: null };
		const { getByLabelText, getByTestId } = renderPage({ response });
		await waitFor(() => expect(getByTestId('invites-accepted-count').textContent.trim()).toBe('0'));
		expect(getByTestId('invitee-loan-count').textContent.trim()).toBe('0');
		expect(getByLabelText('Your personal invite page').value).toBe('');
		const composer = getByTestId('invite-composer-stub');
		expect(composer.dataset.firstName).toBe('');
		expect(composer.dataset.public).toBe('false');
		expect(getByTestId('invites-ack-inviter')).toBeTruthy();
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

	it('titles the page', () => {
		expect(InvitesPage.head().title).toBe('Invite friends');
	});

	it('opens and closes the give-credit form', async () => {
		const { getByTestId, findByTestId } = renderPage();
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('false');
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('true');
		expect(JSON.parse(getByTestId('invites-ack-inviter').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Invites open acknowledge inviter']);
		await fireEvent.click(getByTestId('ack-modal-close'));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('false');
		// The control that closed it is hidden, so focus goes back to the button that opened it
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invites-ack-inviter')));
	});

	it('shows the credited inviter, thanks the viewer and moves focus to the inviter box', async () => {
		const showTipMsg = vi.fn();
		const acknowledgement = {
			inviter: { lender: publicLender },
			lines: ['Thank you. You helped your friend to get the credit to invite you.'],
		};
		const {
			getByTestId, findByTestId, getByText, queryByTestId,
		} = renderPage({ showTipMsg, acknowledgement });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-ack'));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('false');
		expect(getByText('Invited by')).toBeTruthy();
		expect(getByTestId('invites-inviter-name').textContent).toBe('Inviter Ivy');
		expect(queryByTestId('invites-ack-inviter')).toBeNull();
		expect(showTipMsg).toHaveBeenCalledWith(acknowledgement.lines[0]);
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invites-inviter')));
	});

	it('shows an inviter credited since the page loaded when crediting finds nothing', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce({ data: invitesResponse() })
			.mockResolvedValueOnce({ data: invitesResponse({ inviter: { lender: publicLender } }) });
		const { getByTestId, findByTestId } = renderPage({ query });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-not-found'));
		await waitFor(() => expect(getByTestId('invites-inviter-name').textContent).toBe('Inviter Ivy'));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('false');
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ fetchPolicy: 'network-only' }));
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invites-inviter')));
	});

	it('leaves focus alone when the viewer closed the form and moved on before the inviter was found', async () => {
		let resolveRefresh;
		const query = vi.fn()
			.mockResolvedValueOnce({ data: invitesResponse() })
			.mockReturnValueOnce(new Promise(r => { resolveRefresh = r; }));
		const { getByTestId, findByTestId } = renderPage({ query });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-not-found'));
		await fireEvent.click(getByTestId('ack-modal-close'));
		const elsewhere = document.createElement('input');
		document.body.appendChild(elsewhere);
		elsewhere.focus();
		resolveRefresh({ data: invitesResponse({ inviter: { lender: publicLender } }) });
		await waitFor(() => expect(getByTestId('invites-inviter-name').textContent).toBe('Inviter Ivy'));
		expect(document.activeElement).toBe(elsewhere);
		elsewhere.remove();
	});

	it('keeps the form open when crediting finds nothing and there is still no inviter', async () => {
		const query = vi.fn().mockResolvedValue({ data: invitesResponse() });
		const { getByTestId, findByTestId } = renderPage({ query });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-not-found'));
		await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('true');
		expect(getByTestId('invites-ack-inviter')).toBeTruthy();
	});

	it('keeps the form open when the inviter check fails', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce({ data: invitesResponse() })
			.mockRejectedValueOnce(new Error('offline'));
		const { getByTestId, findByTestId } = renderPage({ query });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-not-found'));
		await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
		expect(getByTestId('ack-modal-stub').dataset.visible).toBe('true');
	});

	it('shows an inviter credited without details as anonymous', async () => {
		const { getByTestId, findByTestId } = renderPage({ acknowledgement: { inviter: null, lines: ['Thanks'] } });
		await fireEvent.click(await findByTestId('invites-ack-inviter'));
		await fireEvent.click(getByTestId('ack-modal-ack'));
		expect(getByTestId('invites-inviter-name').textContent.trim()).toBe('Anonymous');
	});

	it('suppresses user data from session recording', async () => {
		const { getByTestId } = renderPage();
		await waitFor(() => {
			expect(getByTestId('invites-personal-url').closest('[data-hj-suppress]')).toBeTruthy();
		});
	});
});
