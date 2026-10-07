import { HAS_LENT_BEFORE_COOKIE, HAS_DEPOSIT_BEFORE_COOKIE } from '@kiva/kv-analytics';
import { FUNDRAISING } from '#src/api/fixtures/LoanStatusEnum';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';

export const NEW_USER_BP_EXP_KEY = 'new_user_borrower_profile';
export const NEW_USER_BP_EXP_EVENT_ACTION = 'EXP-MP-3035-Oct2026';

// Injection key for components under the borrower profile page
export const NEW_USER_BP_EXP_INJECT_KEY = 'newUserBorrowerProfileExp';

/**
 * Whether the visitor and loan are in the new user borrower profile experiment: a new, logged out
 * visitor (never logged in, no lifetime lend/deposit signals) viewing the full profile of a fundraising
 * loan. Loans in their private fundraising period are fundraising too, so they're included.
 *
 * @param {object} params
 * @param {string} params.loanStatus The loan status
 * @param {boolean} params.isFullView Whether the full borrower profile is shown
 * @param {boolean} params.isLoggedIn Whether the visitor is currently logged in
 * @param {boolean} params.hasEverLoggedIn The hasEverLoggedIn local field
 * @param {object} params.cookieStore The cookie store
 * @returns {boolean}
 */
export function isNewUserBpExpEligible({
	loanStatus,
	isFullView,
	isLoggedIn,
	hasEverLoggedIn,
	cookieStore,
}) {
	return loanStatus === FUNDRAISING
		&& !!isFullView
		&& !isLoggedIn
		// Strict false: an unknown value means we can't confirm a new visitor
		&& hasEverLoggedIn === false
		&& cookieStore?.get(HAS_LENT_BEFORE_COOKIE) !== 'true'
		&& cookieStore?.get(HAS_DEPOSIT_BEFORE_COOKIE) !== 'true';
}

/**
 * Reads the assigned version of the experiment from the Apollo cache.
 *
 * @param {object} client The Apollo client
 * @returns {string|null} 'a', 'b', or null when not assigned
 */
export function readNewUserBpExpVersion(client) {
	try {
		const version = client?.readFragment({
			id: `Experiment:${NEW_USER_BP_EXP_KEY}`,
			fragment: experimentVersionFragment,
		})?.version;
		return version && version !== 'unassigned' ? version : null;
	} catch {
		return null;
	}
}
