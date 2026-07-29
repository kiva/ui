import { differenceInDays, isValid, parseISO } from 'date-fns';

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

/**
 * Whole days elapsed between a date and a reference point, tolerating bad input.
 *
 * Wraps date-fns differenceInDays with the null handling from toValidDate, so callers
 * with optional or unparseable dates get null rather than NaN.
 *
 * @param {string|number|Date} date
 * @param {Date} now The reference point, defaults to the current time.
 * @returns {Number|null} null when the date is missing or unparseable.
 */
export function daysSince(date, now = new Date()) {
	const parsed = toValidDate(date);
	return parsed ? differenceInDays(now, parsed) : null;
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
