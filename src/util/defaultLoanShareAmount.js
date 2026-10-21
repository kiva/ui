import { getUserPreference } from '#src/util/userPreferenceUtils';

export const DEFAULT_LOAN_SHARE_AMOUNT_KEY = 'defaultLoanShareAmount';

const toAmount = value => {
	let amount;
	if (typeof value === 'number') {
		amount = value;
	} else if (typeof value === 'string' && value.trim() !== '') {
		amount = Number(value);
	}
	return Number.isFinite(amount) && amount > 0 ? amount : undefined;
};

/**
 * Decode the JSON-encoded value returned by `my.userPreference(key: "defaultLoanShareAmount")`.
 *
 * @param {string|null|undefined} raw
 * @returns {number|undefined} a finite amount above zero, or undefined when not set or invalid.
 */
export function decodeDefaultLoanShareAmount(raw) {
	if (typeof raw !== 'string') return undefined;
	try {
		return toAmount(JSON.parse(raw));
	} catch {
		return undefined;
	}
}

/**
 * Read the default loan share amount out of a `my.userPreferences` node.
 *
 * @param {{preferences?: string}|null} userPreferences
 * @returns {number|undefined} a finite amount above zero, or undefined when not set or invalid.
 */
export function readDefaultLoanShareAmount(userPreferences) {
	return toAmount(getUserPreference(userPreferences, DEFAULT_LOAN_SHARE_AMOUNT_KEY));
}
