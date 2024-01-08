export const TEAM_CHALLENGE_COOKIE_NAME = 'kv-team-challenge';

const getChallengeCookieData = cookieStore => {
	const cookie = cookieStore.get(TEAM_CHALLENGE_COOKIE_NAME);
	if (cookie) {
		return JSON.parse(cookie);
	}
};

/**
 * If team challenge cookie is present, the user has added a loan to basket from the challenge page.
 * In that case, append the team info to the list of teams and attribute this loan to that team.
 *
 * @param cookieStore The object for affecting cookies
 * @param loanId The ID of the loan to check
 * @param combinedTeams The combined team list for the loan
 * @param appendedTeams The extra teams added to the loan
 * @returns The team ID possibly forced for the loan
 */
export const getForcedTeamId = (cookieStore, loanId, combinedTeams, appendedTeams) => {
	const data = getChallengeCookieData(cookieStore);
	if (Array.isArray(data)) {
		let forcedTeamId;
		data.forEach(loan => {
			if (loan.loanId === loanId) {
				// Loan has a different team attribution, we should override the default
				// Is team not in the users list, append it
				if (!combinedTeams.some(team => team.id === loan.teamId)) {
					appendedTeams.push({
						id: loan.teamId,
						name: loan.teamName
					});
					forcedTeamId = loan.teamId;
				}
			}
		});
		return forcedTeamId;
	}
};

/**
 * Removes loans from the challenge cookie.
 * Used after checkout.
 *
 * @param cookieStore The object for affecting cookies
 * @param loanIds The IDs of the loans to check
 */
export const removeLoansFromChallengeCookie = (cookieStore, loanIds) => {
	const data = getChallengeCookieData(cookieStore);
	if (Array.isArray(data)) {
		loanIds.forEach(loanId => {
			// Remove this loan from the cookie object after checkout
			data.splice(data.findIndex(loan => loan.loanId === loanId), 1);
		});
		// Overwrite the cookie with the new data
		cookieStore.set(TEAM_CHALLENGE_COOKIE_NAME, JSON.stringify(data));
	}
};
