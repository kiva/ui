import numeral from 'numeral';

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
 * `Money` arrives as a display-formatted string (`'11,621.53'`), so plain
 * coercion mangles it: `Number()` gives `NaN` at 1,000 and up, `parseFloat()`
 * truncates at the comma. Uses `numeral` to match how the rest of the app
 * parses Money.
 *
 * @param {string|number|null|undefined} value The `Money` value to parse
 * @returns {number} The parsed amount, or 0 when it isn't a finite number
 */
export function parseMoney(value) {
	// numeral reads booleans as 1 and passes Infinity through; Money is neither.
	if (typeof value === 'boolean') return 0;

	const parsed = numeral(value).value();

	return Number.isFinite(parsed) ? parsed : 0;
}
