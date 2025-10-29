import {
	getForcedTeamId,
	removeLoansFromChallengeCookie,
	TEAM_CHALLENGE_COOKIE_NAME,
	setChallengeCookieData
} from '../../../../src/util/teamChallengeUtils';

describe('teamChallengeUtils.js', () => {
	const mockLoans = [
		{ loanId: 123, teamId: 456, teamName: 'Team Name 1' },
		{ loanId: 234, teamId: 345, teamName: 'Team Name 2' },
	];
	const mockCookieJson = JSON.stringify(mockLoans);

	describe('getForcedTeamId', () => {
		it('should use expected cookie name', () => {
			const cookieStore = { get: vi.fn() };
			const result = getForcedTeamId(cookieStore, 1, [], []);
			expect(result).toEqual(undefined);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(cookieStore.get).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME);
		});

		it('should handle empty cookie', () => {
			const cookieStore = { get: vi.fn() };
			const result = getForcedTeamId(cookieStore, 1, [], []);
			expect(result).toEqual(undefined);
			expect(cookieStore.get).toBeCalledTimes(1);
		});

		it('should handle bad cookie value', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(JSON.stringify({})), set: vi.fn() };
			const result = getForcedTeamId(cookieStore, [mockLoans[0].loanId]);
			expect(result).toEqual(undefined);
			expect(cookieStore.get).toBeCalledTimes(1);
		});

		it('should handle non-matching loan ID', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			const result = getForcedTeamId(cookieStore, -1, [], []);
			expect(result).toEqual(undefined);
			expect(cookieStore.get).toBeCalledTimes(1);
		});

		it('should append when team arrays are empty', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			const appendedTeams = [];
			const result = getForcedTeamId(cookieStore, mockLoans[0].loanId, [], appendedTeams);
			expect(result).toEqual(mockLoans[0].teamId);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(appendedTeams).toEqual([{ id: mockLoans[0].teamId, name: mockLoans[0].teamName }]);
		});

		it('should use the cookie value as default', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			const appendedTeams = [];
			const result = getForcedTeamId(
				cookieStore,
				mockLoans[0].loanId,
				[{ id: mockLoans[0].teamId }],
				appendedTeams
			);
			expect(result).toEqual(mockLoans[0].teamId);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(appendedTeams.length).toBe(0);
		});

		it('should append when non-matching team ID', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			const appendedTeams = [];
			const result = getForcedTeamId(cookieStore, mockLoans[0].loanId, [{ id: -1 }], appendedTeams);
			expect(result).toEqual(mockLoans[0].teamId);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(appendedTeams[0]).toEqual({ id: mockLoans[0].teamId, name: mockLoans[0].teamName });
		});
	});

	describe('removeLoansFromChallengeCookie', () => {
		it('should use expected cookie name', () => {
			const cookieStore = { get: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, 1);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(cookieStore.get).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME);
		});

		it('should handle empty cookie', () => {
			const cookieStore = { get: vi.fn(), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, []);
			expect(cookieStore.set).toBeCalledTimes(0);
		});

		it('should handle bad cookie value', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(JSON.stringify({})), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, [mockLoans[0].loanId]);
			expect(cookieStore.set).toBeCalledTimes(0);
		});

		it('should handle bad array', () => {
			const cookieStore = { get: vi.fn(), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, 1);
			removeLoansFromChallengeCookie(cookieStore, {});
			removeLoansFromChallengeCookie(cookieStore, undefined);
			expect(cookieStore.set).toBeCalledTimes(0);
		});

		it('should handle empty loan IDs', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, []);
			expect(cookieStore.set).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME, mockCookieJson);
		});

		it('should handle empty array in cookie', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(JSON.stringify([])), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, []);
			expect(cookieStore.set).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME, JSON.stringify([]));
		});

		it('should remove loan from cookie', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, [mockLoans[0].loanId]);
			expect(cookieStore.set).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME, JSON.stringify([mockLoans[1]]));
		});

		it('should remove loans from cookie', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(mockCookieJson), set: vi.fn() };
			removeLoansFromChallengeCookie(cookieStore, [mockLoans[0].loanId, mockLoans[1].loanId]);
			expect(cookieStore.set).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME, JSON.stringify([]));
		});
	});

	describe('setChallengeCookie', () => {
		it('should add data to challenge cookie', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(JSON.stringify([])), set: vi.fn() };

			const mockLoan = { loanId: 345, teamId: 678, teamName: 'Team Name 3' };

			setChallengeCookieData(cookieStore, mockLoan);
			expect(cookieStore.set).toBeCalledTimes(1);
			expect(cookieStore.get).toBeCalledTimes(1);
			expect(cookieStore.set).toBeCalledWith(TEAM_CHALLENGE_COOKIE_NAME, JSON.stringify([mockLoan]));
		});

		it('should not add data without loan id', () => {
			const cookieStore = { get: vi.fn().mockReturnValue(JSON.stringify([])), set: vi.fn() };

			const mockLoan = { loanId: null, teamId: 678, teamName: 'Team Name 3' };

			setChallengeCookieData(cookieStore, mockLoan);
			expect(cookieStore.set).toBeCalledTimes(0);

			setChallengeCookieData(cookieStore, { ...mockLoan, loanId: 123, teamId: null });
			expect(cookieStore.set).toBeCalledTimes(0);
		});
	});
});
