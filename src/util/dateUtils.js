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
