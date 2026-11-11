import { formatInviteDate, inviteViaLabel } from '#src/util/invites/inviteFormat';

// Stands in for a browser in the given timezone; an explicit timeZone option still wins
const { toLocaleDateString } = Date.prototype;
let dateSpy;
const useTimezone = timezone => dateSpy.mockImplementation(function localDate(locale, options) {
	return toLocaleDateString.call(this, locale, { timeZone: timezone, ...options });
});

describe('inviteFormat', () => {
	describe('formatInviteDate', () => {
		beforeEach(() => {
			dateSpy = vi.spyOn(Date.prototype, 'toLocaleDateString');
			useTimezone('UTC');
		});

		afterEach(() => {
			dateSpy.mockRestore();
		});

		it('shows the date as month, day and year', () => {
			expect(formatInviteDate('2026-03-05T12:00:00Z')).toBe('Mar 5, 2026');
		});

		it.each([
			['America/Los_Angeles', 'Mar 4, 2026'],
			['Asia/Tokyo', 'Mar 5, 2026'],
		])('shows the date in the viewer\'s timezone, %s', (timezone, expected) => {
			useTimezone(timezone);
			expect(formatInviteDate('2026-03-05T03:00:00Z')).toBe(expected);
		});

		it.each([
			['an unreadable date', 'not a date'],
			['an empty date', ''],
			['a missing date', undefined],
		])('shows nothing for %s', (_, date) => {
			expect(formatInviteDate(date)).toBe('');
		});
	});

	describe('inviteViaLabel', () => {
		it('names how the invite was sent and what it created', () => {
			expect(inviteViaLabel({ source: 'EMAIL', createdAsType: 'INVITE' })).toBe('via Email, Invite');
		});

		it('adds the team name', () => {
			expect(inviteViaLabel({ source: 'EMAIL', createdAsType: 'TEAM_RECRUIT', team: { name: 'Team Tula' } }))
				.toBe('via Email, Team Recruit (Team Tula)');
		});

		it('leaves out a team with no name', () => {
			expect(inviteViaLabel({ source: 'TWITTER', createdAsType: 'INVITE', team: { name: '' } }))
				.toBe('via Twitter, Invite');
		});

		it.each([
			['only the source is known', { source: 'FACEBOOK' }, 'via Facebook'],
			[
				'only the type is known',
				{ source: 'UNKNOWN', createdAsType: 'THANKS' },
				'via User credited you as invitee',
			],
		])('labels what is known when %s', (_, row, expected) => {
			expect(inviteViaLabel(row)).toBe(expected);
		});

		it('shows nothing when neither is known, even with a team', () => {
			expect(inviteViaLabel({ source: 'UNKNOWN', createdAsType: null, team: { name: 'Team Tula' } })).toBe('');
		});

		it('labels a source in the list it is given', () => {
			expect(inviteViaLabel({ source: 'TWITTER', createdAsType: 'INVITE' }, ['EMAIL', 'TWITTER']))
				.toBe('via Twitter, Invite');
		});

		it('shows nothing for a source outside the list it is given', () => {
			expect(inviteViaLabel({ source: 'PERMURL', createdAsType: 'INVITE' }, ['EMAIL', 'TWITTER'])).toBe('');
		});
	});
});
