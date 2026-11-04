import { render, waitFor, fireEvent } from '@testing-library/vue';
import InviteActivityTable from '#src/components/Portfolio/Invites/InviteActivityTable';
import { getOperationName } from '../../../../specUtils';

const NOW = new Date('2026-03-10T12:00:00Z');

const emailRow = (n, overrides = {}) => ({
	id: `pending:${n}`,
	date: '2026-03-05T12:00:00Z',
	source: 'EMAIL',
	createdAsType: 'INVITE',
	team: null,
	invitee: null,
	toEmailAddress: `friend${n}@example.com`,
	status: 'PENDING',
	remindAvailableAt: null,
	clickCount: null,
	acceptedCount: null,
	...overrides,
});

const socialRow = (n, overrides = {}) => emailRow(n, {
	id: `social:${n}`,
	source: 'FACEBOOK',
	toEmailAddress: null,
	status: null,
	clickCount: 12,
	acceptedCount: 3,
	...overrides,
});

const activityResponse = (values, totalCount = values.length) => ({
	data: {
		my: {
			id: 'my-id',
			userAccount: { id: 3, invites: { id: 3, activity: { totalCount, values } } },
		},
	},
});

const rowsOf = (from, count) => Array.from({ length: count }, (_, i) => emailRow(from + i));

// Records each element's tracking payload so specs can check it
const trackEventDirective = {
	mounted(el, { value }) {
		el.setAttribute('data-track-event', JSON.stringify(value));
	},
};

const renderTable = (query, kvTrackEvent = vi.fn(), { mutate = vi.fn(), showTipMsg = vi.fn() } = {}) => render(
	InviteActivityTable,
	{
		global: {
			provide: { apollo: { query, mutate } },
			mocks: { $kvTrackEvent: kvTrackEvent, $showTipMsg: showTipMsg },
			directives: { 'kv-track-event': trackEventDirective },
			stubs: {
				KvButton: {
					props: ['state'],
					// Like KvButton, disabled while loading
					template: '<button :data-state="state" :disabled="state === \'disabled\' || state === \'loading\'">'
						+ '<slot /></button>',
				},
				KvLoadingText: { template: '<div />' },
			},
		},
	},
);

const sentRow = (n, overrides = {}) => emailRow(n, {
	status: 'SENT',
	remindAvailableAt: '2026-03-06T18:00:00Z',
	...overrides,
});

const actionResponse = (field, status, message) => ({
	data: { my: { [field]: { status, message } } },
});

const firstRow = async (query, kvTrackEvent) => {
	const { findAllByTestId, ...rest } = renderTable(query, kvTrackEvent);
	const [row] = await findAllByTestId('invite-activity-row');
	const cells = row.querySelectorAll('td');
	// Joins text nodes with spaces, since block children render on separate lines but share no whitespace
	const text = cell => {
		const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
		const parts = [];
		while (walker.nextNode()) parts.push(walker.currentNode.textContent);
		return parts.join(' ').replace(/\s+/g, ' ').trim();
	};
	return {
		row, activity: text(cells[1]), status: text(cells[2]), date: text(cells[0]), ...rest,
	};
};

// Stands in for a browser in the given timezone; an explicit timeZone option still wins
const { toLocaleDateString } = Date.prototype;
let dateSpy;
const useTimezone = timezone => dateSpy.mockImplementation(function localDate(locale, options) {
	return toLocaleDateString.call(this, locale, { timeZone: timezone, ...options });
});

describe('InviteActivityTable', () => {
	beforeEach(() => {
		dateSpy = vi.spyOn(Date.prototype, 'toLocaleDateString');
		useTimezone('UTC');
	});

	afterEach(() => {
		dateSpy.mockRestore();
	});

	beforeEach(() => {
		vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	let confirmSpy;
	beforeEach(() => {
		confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
	});

	afterEach(() => {
		confirmSpy.mockRestore();
	});

	it('shows a loader until the first page loads, then asks for 4 rows', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1)]));
		const { getByTestId, queryByTestId, getByRole } = renderTable(query);
		expect(getByTestId('invite-activity-loading')).toBeTruthy();
		expect(getByRole('status').textContent).toBe('Loading invite activity');
		await waitFor(() => expect(getByTestId('invite-activity-table')).toBeTruthy());
		expect(queryByTestId('invite-activity-loading')).toBeNull();
		expect(query).toHaveBeenCalledWith(expect.objectContaining({
			variables: { offset: 0, limit: 4 },
			fetchPolicy: 'network-only',
		}));
	});

	it('shows a social share row with its click and accept counts', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([socialRow(1)]));
		const { activity, status, date } = await firstRow(query);
		expect(date).toBe('Mar 5, 2026');
		expect(activity).toBe('via Facebook, Invite');
		expect(status).toBe('12 clicks 3 accepted');
	});

	it('shows 0 for a missing share count', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([socialRow(1, { clickCount: null })]));
		const { status } = await firstRow(query);
		expect(status).toBe('0 clicks 3 accepted');
	});

	it.each([
		[{ source: 'URL' }, 'via Special Invitation Link, Invite'],
		[{ source: 'KIVACARD', createdAsType: null }, 'via Kiva Card Redemption'],
		[{ source: null, createdAsType: null }, ''],
	])('labels share link %o as "%s" with no status', async (fields, expected) => {
		const query = vi.fn().mockResolvedValue(activityResponse([socialRow(1, {
			clickCount: null, acceptedCount: null, ...fields,
		})]));
		const { activity, status } = await firstRow(query);
		expect(activity).toBe(expected);
		expect(status).toBe('');
	});

	it('names the table for screen readers', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1)]));
		const { findByRole } = renderTable(query);
		expect(await findByRole('table', { name: 'My invite activity' })).toBeTruthy();
	});

	it('shows a pending email invite with its address', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1)]));
		const { activity, status, row } = await firstRow(query);
		expect(activity).toBe('via Email, Invite friend1@example.com');
		expect(status).toBe('Pending');
		expect(row.querySelector('button')).toBeNull();
	});

	it('shows "Sent <date>" and Clear before a reminder is available', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1, {
			date: '2026-03-09T12:00:00Z',
			status: 'SENT',
			remindAvailableAt: '2026-03-10T12:00:00Z',
		})]));
		const { status, queryByTestId, getByTestId } = await firstRow(query);
		expect(status).toBe('Sent Mar 9, 2026 Clear');
		expect(queryByTestId('invite-activity-remind')).toBeNull();
		expect(getByTestId('invite-activity-clear').disabled).toBe(false);
	});

	it('shows Remind and Clear once a reminder is available', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const { status } = await firstRow(query);
		expect(status).toBe('Remind Clear');
	});

	it.each([
		['remind', 'remindInvite', 'SENT'],
		['clear', 'clearInvite', 'CLEARED'],
	])('tracks %s once it is confirmed', async (action, field, status) => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse(field, status, 'Done'));
		const kvTrackEvent = vi.fn();
		const { findByTestId } = renderTable(query, kvTrackEvent, { mutate });
		await fireEvent.click(await findByTestId(`invite-activity-${action}`));
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', `Invite activity ${action}`);
	});

	it.each([
		['remind', 'Are you sure you want to send a reminder?'],
		['clear', 'Are you sure you want to remove this invitation?'],
	])('asks before running %s, and does nothing when declined', async (action, question) => {
		confirmSpy.mockReturnValue(false);
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const mutate = vi.fn();
		const kvTrackEvent = vi.fn();
		const { findByTestId, getByTestId } = renderTable(query, kvTrackEvent, { mutate });
		await fireEvent.click(await findByTestId(`invite-activity-${action}`));
		expect(confirmSpy).toHaveBeenCalledWith(question);
		expect(mutate).not.toHaveBeenCalled();
		expect(kvTrackEvent).not.toHaveBeenCalled();
		expect(getByTestId(`invite-activity-${action}`).dataset.state).toBe('');
	});

	it('reminds an invite, shows the message, and shows it as sent now', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(2), sentRow(1)]));
		let resolveMutate;
		const mutate = vi.fn(() => new Promise(resolve => { resolveMutate = resolve; }));
		const showTipMsg = vi.fn();
		const {
			findByTestId, getByTestId, queryByTestId, getAllByTestId
		} = renderTable(
			query,
			vi.fn(),
			{ mutate, showTipMsg },
		);
		await fireEvent.click(await findByTestId('invite-activity-remind'));

		expect(getByTestId('invite-activity-remind').dataset.state).toBe('loading');
		expect(getByTestId('invite-activity-clear').disabled).toBe(true);
		expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ variables: { id: 'pending:1' } }));
		expect(getOperationName(mutate.mock.calls[0][0].mutation)).toBe('RemindInvite');

		resolveMutate(actionResponse('remindInvite', 'SENT', 'Reminder sent'));
		await waitFor(() => expect(queryByTestId('invite-activity-remind')).toBeNull());
		expect(showTipMsg).toHaveBeenCalledWith('Reminder sent');
		// The reminded invite is now the newest, so it moves to the top
		const [row] = getAllByTestId('invite-activity-row');
		expect(row.textContent).toContain('friend1@');
		expect(row.querySelector('td').textContent.trim()).toBe('Mar 10, 2026');
		expect(row.textContent).toContain('Sent Mar 10, 2026');
		expect(getByTestId('invite-activity-clear').disabled).toBe(false);
		expect(query).toHaveBeenCalledTimes(1);
	});

	it('clears an invite and removes its row without re-reading the table', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(activityResponse([sentRow(1), ...rowsOf(2, 3)], 5))
			.mockResolvedValueOnce(activityResponse(rowsOf(5, 1), 4));
		const mutate = vi.fn().mockResolvedValue(actionResponse('clearInvite', 'CLEARED', 'Invitation cleared'));
		const showTipMsg = vi.fn();
		const {
			findByTestId, getAllByTestId, getByTestId, queryByTestId,
		} = renderTable(query, vi.fn(), { mutate, showTipMsg });
		await fireEvent.click(await findByTestId('invite-activity-clear'));
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(3));
		expect(showTipMsg).toHaveBeenCalledWith('Invitation cleared');
		expect(getOperationName(mutate.mock.calls[0][0].mutation)).toBe('ClearInvite');
		expect(getAllByTestId('invite-activity-row')[0].textContent).toContain('friend2@');
		expect(query).toHaveBeenCalledTimes(1);

		// 4 invites remain, so "More" still reaches the one not shown
		const toggle = getByTestId('invite-activity-toggle');
		expect(toggle.textContent.trim()).toBe('More');
		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(4));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 3, limit: 20 } }));
		// All 4 fit in the first rows, so there's nothing to collapse
		expect(queryByTestId('invite-activity-toggle')).toBeNull();
	});

	it('keeps "More" instead of the empty message when every shown invite is cleared', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)], 3));
		const mutate = vi.fn().mockResolvedValue(actionResponse('clearInvite', 'CLEARED', 'Cleared'));
		const {
			findByTestId, queryByTestId, queryAllByTestId, getByTestId
		} = renderTable(query, vi.fn(), { mutate });
		await fireEvent.click(await findByTestId('invite-activity-clear'));
		await waitFor(() => expect(queryAllByTestId('invite-activity-row')).toHaveLength(0));
		expect(queryByTestId('invite-activity-empty')).toBeNull();
		expect(getByTestId('invite-activity-toggle').textContent.trim()).toBe('More');
	});

	it('shows the empty message when the last invite is cleared', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse('clearInvite', 'CLEARED', 'Cleared'));
		const { findByTestId } = renderTable(query, vi.fn(), { mutate });
		await fireEvent.click(await findByTestId('invite-activity-clear'));
		expect(await findByTestId('invite-activity-empty')).toBeTruthy();
	});

	it('moves focus to the table when the focused button leaves with its row', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1), emailRow(2)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse('clearInvite', 'CLEARED', 'Cleared'));
		const { findByTestId, getByRole } = renderTable(query, vi.fn(), { mutate });
		const clear = await findByTestId('invite-activity-clear');
		clear.focus();
		await fireEvent.click(clear);
		await waitFor(() => expect(document.activeElement).toBe(getByRole('table')));
	});

	it('moves focus to the empty message\'s container when the last row is cleared', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse('clearInvite', 'CLEARED', 'Cleared'));
		const { findByTestId, container } = renderTable(query, vi.fn(), { mutate });
		const clear = await findByTestId('invite-activity-clear');
		clear.focus();
		await fireEvent.click(clear);
		await findByTestId('invite-activity-empty');
		await waitFor(() => expect(document.activeElement).toBe(container.firstElementChild));
	});

	it('moves focus to the row\'s Clear button when a reminder replaces Remind', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1), sentRow(2)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse('remindInvite', 'SENT', 'Reminder sent'));
		const { findByTestId, getByTestId } = renderTable(query, vi.fn(), { mutate });
		const remind = await findByTestId('invite-activity-remind');
		remind.focus();
		await fireEvent.click(remind);
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invite-activity-clear')));
	});

	it('returns focus to the button when a failed action lost it', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		let resolveMutate;
		const mutate = vi.fn(() => new Promise(resolve => { resolveMutate = resolve; }));
		const { findByTestId, getByTestId } = renderTable(query, vi.fn(), { mutate });
		const remind = await findByTestId('invite-activity-remind');
		remind.focus();
		await fireEvent.click(remind);
		// Browsers drop focus from a button that becomes disabled
		remind.blur();
		resolveMutate(actionResponse('remindInvite', 'TOO_SOON', 'You must wait 24 hours.'));
		await waitFor(() => expect(document.activeElement).toBe(getByTestId('invite-activity-remind')));
	});

	it.each([
		['remind', 'remindInvite', 'TOO_SOON', 'You must wait 24 hours.', 'You must wait 24 hours.'],
		['clear', 'clearInvite', 'INVALID', 'Invalid invitation', 'Invalid invitation'],
		['remind', 'remindInvite', 'ERROR', '', 'An error occurred. Please try again.'],
	])('shows a %s %s/%s result as an error and keeps the row', async (action, field, status, message, shown) => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const mutate = vi.fn().mockResolvedValue(actionResponse(field, status, message));
		const showTipMsg = vi.fn();
		const { findByTestId, getByTestId, getAllByTestId } = renderTable(query, vi.fn(), { mutate, showTipMsg });
		await fireEvent.click(await findByTestId(`invite-activity-${action}`));
		await waitFor(() => expect(showTipMsg).toHaveBeenCalledWith(shown, 'error'));
		await waitFor(() => expect(getByTestId(`invite-activity-${action}`).dataset.state).toBe(''));
		expect(getAllByTestId('invite-activity-row')).toHaveLength(1);
		expect(query).toHaveBeenCalledTimes(1);
	});

	it.each([
		['GraphQL errors', () => Promise.resolve({ data: null, errors: [{ message: 'denied' }] })],
		['a missing result', () => Promise.resolve({ data: { my: null } })],
		['a network error', () => Promise.reject(new Error('boom'))],
	])('shows a generic error for %s', async (_case, mutateImpl) => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1)]));
		const showTipMsg = vi.fn();
		const { findByTestId, getAllByTestId } = renderTable(query, vi.fn(), { mutate: vi.fn(mutateImpl), showTipMsg });
		await fireEvent.click(await findByTestId('invite-activity-clear'));
		await waitFor(() => expect(showTipMsg).toHaveBeenCalledWith('An error occurred. Please try again.', 'error'));
		expect(getAllByTestId('invite-activity-row')).toHaveLength(1);
	});

	it('disables row actions while "More" loads', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(activityResponse([sentRow(1), ...rowsOf(2, 3)], 10))
			.mockReturnValueOnce(new Promise(() => {}));
		const mutate = vi.fn();
		const { findByTestId, getByTestId } = renderTable(query, vi.fn(), { mutate });
		await fireEvent.click(await findByTestId('invite-activity-toggle'));
		['remind', 'clear'].forEach(action => {
			const button = getByTestId(`invite-activity-${action}`);
			expect(button.disabled).toBe(true);
			expect(button.dataset.state).toBe('disabled');
		});
	});

	it('disables paging and other row actions while a row action runs', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([sentRow(1), sentRow(2), ...rowsOf(3, 2)], 10));
		const mutate = vi.fn(() => new Promise(() => {}));
		const { findByTestId, getAllByTestId } = renderTable(query, vi.fn(), { mutate });
		const toggle = await findByTestId('invite-activity-toggle');
		const [firstRemind, secondRemind] = getAllByTestId('invite-activity-remind');
		await fireEvent.click(firstRemind);
		expect(toggle.disabled).toBe(true);
		expect(secondRemind.disabled).toBe(true);
		await fireEvent.click(secondRemind);
		expect(mutate).toHaveBeenCalledTimes(1);
	});

	it('shows an accepted email invite with the invitee\'s profile link', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1, {
			status: 'ACCEPTED',
			toEmailAddress: null,
			invitee: { id: 9, name: 'Lender 9', publicId: 'lender9' },
		})]));
		const { activity, status, getByText } = await firstRow(query);
		expect(activity).toBe('via Email, Invite Lender 9');
		expect(status).toBe('Accepted!');
		expect(getByText('Lender 9').getAttribute('href')).toBe('/lender/lender9');
		expect(JSON.parse(getByText('Lender 9').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Invite activity invitee profile']);
	});

	it('shows an anonymous invitee who joined a team', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1, {
			createdAsType: 'TEAM_RECRUIT',
			team: { id: 1, name: 'Team Tula' },
			status: 'JOINED_TEAM',
			toEmailAddress: null,
		})]));
		const { activity, status, row } = await firstRow(query);
		expect(activity).toBe('via Email, Team Recruit (Team Tula) Anonymous');
		expect(status).toBe('Joined Team!');
		expect(row.querySelector('a')).toBeNull();
	});

	it.each([
		['America/New_York', 'Mar 5, 2026'],
		['Asia/Tokyo', 'Mar 6, 2026'],
	])('formats dates in the viewer\'s timezone (%s)', async (timezone, expected) => {
		useTimezone(timezone);
		// 03:00 UTC on Mar 6 is still Mar 5 in New York
		const query = vi.fn().mockResolvedValue(activityResponse([emailRow(1, {
			date: '2026-03-06T03:00:00Z',
			status: 'SENT',
			remindAvailableAt: '2026-03-12T03:00:00Z',
		})]));
		const { date, status } = await firstRow(query);
		expect(date).toBe(expected);
		expect(status).toBe(`Sent ${expected} Clear`);
	});

	it('shows the empty message when there is no activity', async () => {
		const query = vi.fn().mockResolvedValue(activityResponse([]));
		const { findByTestId, queryByTestId } = renderTable(query);
		expect((await findByTestId('invite-activity-empty')).textContent.trim())
			.toBe("You don't have any invites on record.");
		expect(queryByTestId('invite-activity-toggle')).toBeNull();
	});

	it('pages with "More", switches to "Less" at the end, and collapses back to 4 rows', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(activityResponse(rowsOf(1, 4), 30))
			.mockResolvedValueOnce(activityResponse(rowsOf(5, 20), 30))
			.mockResolvedValueOnce(activityResponse(rowsOf(25, 6), 30))
			.mockResolvedValueOnce(activityResponse(rowsOf(5, 20), 30));
		const kvTrackEvent = vi.fn();
		const { findByTestId, getAllByTestId } = renderTable(query, kvTrackEvent);
		const toggle = await findByTestId('invite-activity-toggle');
		expect(toggle.textContent.trim()).toBe('More');

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(24));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 4, limit: 20 } }));

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(30));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 24, limit: 20 } }));
		expect(toggle.textContent.trim()).toBe('Less');

		await fireEvent.click(toggle);
		expect(getAllByTestId('invite-activity-row')).toHaveLength(4);
		expect(toggle.textContent.trim()).toBe('More');
		expect(query).toHaveBeenCalledTimes(3);

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(24));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 4, limit: 20 } }));

		expect(kvTrackEvent.mock.calls.map(call => call[2])).toEqual([
			'Invite activity more',
			'Invite activity more',
			'Invite activity less',
			'Invite activity more',
		]);
	});

	it('keeps the rows and offers "More" again when loading more fails', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(activityResponse(rowsOf(1, 4), 10))
			.mockRejectedValueOnce(new Error('boom'))
			.mockResolvedValueOnce(activityResponse(rowsOf(5, 6), 10));
		const { findByTestId, getAllByTestId } = renderTable(query);
		const toggle = await findByTestId('invite-activity-toggle');
		await fireEvent.click(toggle);
		await waitFor(() => expect(toggle.dataset.state).toBe(''));
		expect(getAllByTestId('invite-activity-row')).toHaveLength(4);
		expect(toggle.textContent.trim()).toBe('More');

		await fireEvent.click(toggle);
		await waitFor(() => expect(getAllByTestId('invite-activity-row')).toHaveLength(10));
		expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ variables: { offset: 4, limit: 20 } }));
	});

	it('shows the error state and recovers on retry', async () => {
		const query = vi.fn()
			.mockRejectedValueOnce(new Error('boom'))
			.mockResolvedValueOnce(activityResponse([emailRow(1)]));
		const { findByTestId, getByText, queryByTestId } = renderTable(query);
		expect((await findByTestId('invite-activity-error')).getAttribute('role')).toBe('alert');
		expect(JSON.parse(getByText('Try again').dataset.trackEvent))
			.toEqual(['portfolio', 'click', 'Invite activity retry load']);
		await fireEvent.click(getByText('Try again'));
		await findByTestId('invite-activity-table');
		expect(queryByTestId('invite-activity-error')).toBeNull();
	});

	it.each([
		['GraphQL errors', { ...activityResponse([emailRow(1)]), errors: [{ message: 'activity failed' }] }],
		['a missing collection', { data: { my: { id: 'my-id', userAccount: { id: 3, invites: null } } } }],
		['a null list', activityResponse(null, 5)],
	])('shows the error state for %s', async (_case, response) => {
		const query = vi.fn().mockResolvedValue(response);
		const { findByTestId } = renderTable(query);
		expect(await findByTestId('invite-activity-error')).toBeTruthy();
	});
});
