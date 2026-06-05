import store2 from 'store2';
import { createUserPreferences, updateUserPreferences } from '#src/util/userPreferenceUtils';

// Single source of truth for both the localStorage key and the userPreferences JSON key.
export const RAIL_PREF_KEY = 'showLoanDetailsInRail';

/**
 * Read the rail preference from localStorage. Client-only.
 *
 * @returns {boolean|null} the stored boolean, or null at SSR / when unset.
 */
export function getLocalRailPreference() {
	if (typeof window === 'undefined') return null;
	const value = store2(RAIL_PREF_KEY);
	return typeof value === 'boolean' ? value : null;
}

/**
 * Persist the rail preference to localStorage.
 *
 * @param {boolean} value
 */
export function setLocalRailPreference(value) {
	store2(RAIL_PREF_KEY, value);
}

/**
 * Parse the rail preference out of a `my.userPreferences` node.
 *
 * @param {{preferences?: string}|null} userPreferences
 * @returns {boolean|null} the stored boolean, or null when absent/unparseable.
 */
export function readAccountRailPreference(userPreferences) {
	if (!userPreferences?.preferences) return null;
	try {
		const parsed = JSON.parse(userPreferences.preferences);
		return typeof parsed[RAIL_PREF_KEY] === 'boolean' ? parsed[RAIL_PREF_KEY] : null;
	} catch {
		return null;
	}
}

/**
 * Pure decision for whether the rail details should show: the account
 * preference wins, then localStorage, otherwise off by default.
 *
 * @param {object} sources
 * @param {boolean|null} sources.accountPref
 * @param {boolean|null} sources.local
 * @returns {boolean}
 */
export function resolveRailPreference({ accountPref = null, local = null } = {}) {
	if (accountPref !== null) return accountPref;
	if (local !== null) return local;
	return false;
}

/**
 * Persist the preference: always localStorage; additionally the account
 * userPreferences blob when a logged-in `my` context is present (create if
 * there's no record yet, else merge-update).
 *
 * @param {object} apollo Apollo client
 * @param {object} opts
 * @param {boolean} opts.value
 * @param {{id?: number, userPreferences?: {id?: number, preferences?: string}}|null} opts.my
 */
export async function persistRailPreference(apollo, { value, my }) {
	setLocalRailPreference(value);
	if (!my?.id) return;

	const userPreferences = my.userPreferences ?? null;
	if (userPreferences?.id) {
		let parsed = {};
		try {
			parsed = JSON.parse(userPreferences.preferences || '{}');
		} catch {
			parsed = {};
		}
		await updateUserPreferences(apollo, userPreferences, parsed, { [RAIL_PREF_KEY]: value });
	} else {
		await createUserPreferences(apollo, { [RAIL_PREF_KEY]: value });
	}
}
