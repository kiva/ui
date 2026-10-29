import { render, waitFor, fireEvent } from '@testing-library/vue';
import AcceptedInvitesTable from '#src/components/Portfolio/Invites/AcceptedInvitesTable';

const publicRow = (n, overrides = {}) => ({
	id: `invitation:${n}`,
	date: '2026-03-05T18:00:00Z',
	source: 'EMAIL',
	createdAsType: 'INVITE',
	teamName: null,
	invitee: { id: n, name: `Lender ${n}`, publicId: `lender${n}` },
	loanCount: n,
	...overrides,
});

const anonymousRow = (n, overrides = {}) => publicRow(n, { invitee: null, loanCount: null, ...overrides });

const acceptedResponse = (values, totalCount = values.length) => ({
	data: {
		my: {
			id: 'my-id',
			userAccount: { id: 3, invites: { id: 3, accepted: { totalCount, values } } },
		},
	},
});

const rowsOf = (from, count) => Array.from({ length: count }, (_, i) => publicRow(from + i));

// Records each element's tracking payload so specs can check it
const trackEventDirective = {
	mounted(el, { value }) {
		el.setAttribute('data-track-event', JSON.stringify(value));
	},
};

const renderTable = (query, kvTrackEvent = vi.fn()) => render(AcceptedInvitesTable, {
	global: {
		provide: { apollo: { query } },
		mocks: { $kvTrackEvent: kvTrackEvent },
		directives: { 'kv-track-event': trackEventDirective },
		stubs: {
			KvButton: {
				props: ['state'],
				template: '<button :data-state="state"><slot /></button>',
			},
			KvLoadingText: { template: '<div />' },
		},
	},
});

describe('AcceptedInvitesTable', () => {
	it('shows a loader until the first page loads, then asks for 4 rows', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([publicRow(1)]));
		const { getByTestId, queryByTestId, getByRole } = renderTable(query);
		expect(getByTestId('accepted-invites-loading')).toBeTruthy();
		expect(getByRole('status').textContent).toBe('Loading accepted invites');
		await waitFor(() => expect(getByTestId('accepted-invites-table')).toBeTruthy());
		expect(queryByTestId('accepted-invites-loading')).toBeNull();
		expect(query).toHaveBeenCalledWith(expect.objectContaining({
			variables: { offset: 0, limit: 4 },
			fetchPolicy: 'network-only',
		}));
	});

	it('shows a public invitee with a profile link, date, via label and loan count', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([publicRow(7)]));
		const { findAllByTestId, getByText } = renderTable(query);
		const [row] = await findAllByTestId('accepted-invites-row');
		const cells = row.querySelectorAll('td');
		expect(cells[0].textContent.trim()).toBe('Mar 5, 2026');
		expect(getByText('Lender 7').getAttribute('href')).toBe('/lender/lender7');
		expect(JSON.parse(getByText('Lender 7').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Accepted invites invitee profile']);
		expect(cells[1].textContent).toContain('via Email, Invite');
		expect(cells[2].textContent.trim()).toBe('7');
	});

	it('shows an anonymous invitee without a link or loan count', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([anonymousRow(2)]));
		const { findAllByTestId } = renderTable(query);
		const [row] = await findAllByTestId('accepted-invites-row');
		const cells = row.querySelectorAll('td');
		expect(cells[1].textContent).toContain('Anonymous');
		expect(row.querySelector('a')).toBeNull();
		expect(cells[2].textContent.trim()).toBe('');
	});

	it('shows 0 loans for a public invitee with no loan count', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([publicRow(4, { loanCount: null })]));
		const { findAllByTestId } = renderTable(query);
		const [row] = await findAllByTestId('accepted-invites-row');
		expect(row.querySelectorAll('td')[2].textContent.trim()).toBe('0');
	});

	it.each([
		[{ source: 'PERMTEAM', createdAsType: 'TEAM_RECRUIT', teamName: 'Team Tula' },
			'via Team Invitation Link, Team Recruit (Team Tula)'],
		[{ source: 'KIVACARD', createdAsType: 'INVITE' }, 'via Kiva Card Redemption, Invite'],
		[{ source: null, createdAsType: 'THANKS' }, 'via User credited you as invitee'],
		[{ source: 'FACEBOOK_SHARE', createdAsType: null }, 'via Shared Loan on Facebook'],
	])('labels %o as "%s"', async (fields, expected) => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([publicRow(1, fields)]));
		const { findAllByTestId } = renderTable(query);
		const [row] = await findAllByTestId('accepted-invites-row');
		expect(row.querySelectorAll('td')[1].textContent.replace(/\s+/g, ' ')).toContain(expected);
	});

	it.each([
		['America/New_York', 'Mar 5, 2026'],
		['Asia/Tokyo', 'Mar 6, 2026'],
	])('formats the date in the viewer\'s timezone (%s)', async (timezone, expected) => {
		// Stands in for a browser in this timezone; an explicit timeZone option still wins
		const { toLocaleDateString } = Date.prototype;
		const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(
			function localDate(locale, options) {
				return toLocaleDateString.call(this, locale, { timeZone: timezone, ...options });
			}
		);
		try {
			// 03:00 UTC on Mar 6 is still Mar 5 in New York
			const query = vi.fn().mockResolvedValue(
				acceptedResponse([publicRow(1, { date: '2026-03-06T03:00:00Z' })])
			);
			const { findAllByTestId } = renderTable(query);
			const [row] = await findAllByTestId('accepted-invites-row');
			expect(row.querySelector('td').textContent.trim()).toBe(expected);
		} finally {
			spy.mockRestore();
		}
	});

	it('leaves the date blank when it cannot be parsed', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([publicRow(1, { date: 'not a date' })]));
		const { findAllByTestId } = renderTable(query);
		const [row] = await findAllByTestId('accepted-invites-row');
		expect(row.querySelector('td').textContent.trim()).toBe('');
	});

	it('shows the empty message when there are no accepted invites', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse([]));
		const { findByTestId, queryByTestId } = renderTable(query);
		expect((await findByTestId('accepted-invites-empty')).textContent.trim())
			.toBe("You don't have any accepted invites");
		expect(queryByTestId('accepted-invites-toggle')).toBeNull();
	});

	it('hides "More" when every row fits on the first page', async () => {
		const query = vi.fn().mockResolvedValue(acceptedResponse(rowsOf(1, 4), 4));
		const { findAllByTestId, queryByTestId } = renderTable(query);
		expect(await findAllByTestId('accepted-invites-row')).toHaveLength(4);
		expect(queryByTestId('accepted-invites-toggle')).toBeNull();
	});

	it('pages with "More", switches to "Less" at the end, and collapses back to 4 rows', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(acceptedResponse(rowsOf(1, 4), 30))
			.mockResolvedValueOnce(acceptedResponse(rowsOf(5, 20), 30))
			.mockResolvedValueOnce(acceptedResponse(rowsOf(25, 6), 30))
			.mockResolvedValueOnce(acceptedResponse(rowsOf(5, 20), 30));
		const kvTrackEvent = vi.fn();
		const { findByTestId, getAllByTestId } = renderTable(query, kvTrackEvent);
		const toggle = await findByTestId('accepted-invites-toggle');
		expect(toggle.textContent.trim()).toBe('More');

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('accepted-invites-row')).toHaveLength(24));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 4, limit: 20 } }));
		expect(toggle.textContent.trim()).toBe('More');

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('accepted-invites-row')).toHaveLength(30));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 24, limit: 20 } }));
		expect(toggle.textContent.trim()).toBe('Less');

		await fireEvent.click(toggle);
		expect(getAllByTestId('accepted-invites-row')).toHaveLength(4);
		expect(toggle.textContent.trim()).toBe('More');
		expect(query).toHaveBeenCalledTimes(3);

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('accepted-invites-row')).toHaveLength(24));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 4, limit: 20 } }));

		expect(kvTrackEvent.mock.calls.map(call => call[2])).toEqual([
			'Accepted invites more',
			'Accepted invites more',
			'Accepted invites less',
			'Accepted invites more',
		]);
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'Accepted invites more');
	});

	it('keeps the rows and offers "More" again when loading more fails', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(acceptedResponse(rowsOf(1, 4), 10))
			.mockRejectedValueOnce(new Error('boom'));
		const { findByTestId, getAllByTestId } = renderTable(query);
		const toggle = await findByTestId('accepted-invites-toggle');
		await fireEvent.click(toggle);
		await waitFor(() => expect(toggle.dataset.state).toBe(''));
		expect(getAllByTestId('accepted-invites-row')).toHaveLength(4);
		expect(toggle.textContent.trim()).toBe('More');
	});

	it('stops offering "More" when a later page comes back empty', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(acceptedResponse(rowsOf(1, 4), 10))
			.mockResolvedValueOnce(acceptedResponse([], 4));
		const { findByTestId, queryByTestId, getAllByTestId } = renderTable(query);
		await fireEvent.click(await findByTestId('accepted-invites-toggle'));
		await waitFor(() => expect(queryByTestId('accepted-invites-toggle')).toBeNull());
		expect(getAllByTestId('accepted-invites-row')).toHaveLength(4);
	});

	it('shows the error state and recovers on retry', async () => {
		const query = vi.fn()
			.mockRejectedValueOnce(new Error('boom'))
			.mockResolvedValueOnce(acceptedResponse([publicRow(1)]));
		const { findByTestId, getByText, queryByTestId } = renderTable(query);
		expect((await findByTestId('accepted-invites-error')).getAttribute('role')).toBe('alert');
		expect(JSON.parse(getByText('Try again').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Accepted invites retry load']);
		await fireEvent.click(getByText('Try again'));
		await findByTestId('accepted-invites-table');
		expect(queryByTestId('accepted-invites-error')).toBeNull();
	});

	it.each([
		['GraphQL errors', { ...acceptedResponse([publicRow(1)]), errors: [{ message: 'accepted failed' }] }],
		['a missing collection', { data: { my: { id: 'my-id', userAccount: { id: 3, invites: null } } } }],
	])('shows the error state for %s', async (_case, response) => {
		const query = vi.fn().mockResolvedValue(response);
		const { findByTestId } = renderTable(query);
		expect(await findByTestId('accepted-invites-error')).toBeTruthy();
	});
});
