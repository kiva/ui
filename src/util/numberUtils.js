/**
 * Returns whether the provided value is a number
 *
 * @param {*} value The value to check
 * @returns Whether the value is a number
 */
export function isNumber(value) {
	if (value === '' || ['object', 'boolean'].includes(typeof value)) return false;

	return !Number.isNaN(Number(value));
}

/**
 * Parses a GraphQL `Money` value into a JS number.
 *
 * The gateway serializes `Money` as a display-formatted string with thousands
 * separators (e.g. `'11,621.53'`), so a bare `Number()` returns `NaN` for any
 * value of 1,000 or more. Strip the separators before coercing.
 *
 * @param {string|number|null|undefined} value The `Money` value to parse
 * @returns {number} The parsed amount, or 0 when it isn't numeric
 */
export function parseMoney(value) {
	if (value === null || value === undefined || typeof value === 'boolean') return 0;

	const parsed = Number(String(value).replace(/,/g, ''));

	return Number.isFinite(parsed) ? parsed : 0;
}
