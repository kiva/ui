// TODO: remove eslint-disable when more exports are added
/* eslint-disable import/prefer-default-export */

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
