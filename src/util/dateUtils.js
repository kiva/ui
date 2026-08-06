import { isValid, parseISO } from 'date-fns';

/**
 * Parses a value into a valid Date, or returns null when it can't be parsed.
 * Strings are parsed as ISO; numbers and Dates go through the Date constructor.
 *
 * @param {string|number|Date} value The value to parse.
 * @returns {Date|null} A valid Date, or null.
 */
export function toValidDate(value) {
	if (!value) {
		return null;
	}
	const parsed = typeof value === 'string' ? parseISO(value) : new Date(value);
	return isValid(parsed) ? parsed : null;
}

// The timezone the server renders dates in.
export const KIVA_SERVER_TIMEZONE = 'America/Los_Angeles';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a date-only string ("YYYY-MM-DD") or an ISO datetime. Date-only values are
 * anchored at noon UTC, inside the same calendar day in Kiva's timezone.
 *
 * @param {string|number|Date} value The value to parse.
 * @returns {Date|null} A valid Date, or null.
 */
export function parseKivaDate(value) {
	if (typeof value === 'string' && DATE_ONLY_PATTERN.test(value)) {
		const [year, month, day] = value.split('-').map(Number);
		return toValidDate(Date.UTC(year, month - 1, day, 12, 0, 0));
	}
	return toValidDate(value);
}

const formatters = new Map();

// Building an Intl.DateTimeFormat costs far more than formatting with one, and callers
// reuse a handful of fixed option sets, so keep one formatter per set. They depend only on
// the fixed locale and timezone, so the instances carry no per-request state.
function kivaDateFormatter(options) {
	const key = JSON.stringify(options ?? {});
	if (!formatters.has(key)) {
		formatters.set(key, new Intl.DateTimeFormat('en-US', { ...options, timeZone: KIVA_SERVER_TIMEZONE }));
	}
	return formatters.get(key);
}

/**
 * Formats a date in Kiva's server timezone.
 *
 * @param {string|number|Date} value The value to format.
 * @param {object} options Intl.DateTimeFormat options, without the timezone.
 * @returns {string} The formatted date, or an empty string when it can't be parsed.
 */
export function formatInKivaServerTimezone(value, options) {
	const date = parseKivaDate(value);
	if (!date) {
		return '';
	}
	return kivaDateFormatter(options).format(date);
}

export default function getMonthsCount(startTimestamp, endTimestamp = null) {
	const endDate = endTimestamp ? new Date(endTimestamp) : new Date();
	const startDate = new Date(startTimestamp);
	let monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12;
	monthsDiff -= startDate.getMonth();
	monthsDiff += endDate.getMonth() + 1; // +1 counting the first month

	if (endDate.getDate() < startDate.getDate()) {
		monthsDiff -= 1;
	}

	return monthsDiff;
}
