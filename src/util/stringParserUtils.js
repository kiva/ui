/**
 * Capitalizes the first letter of a string, leaving the rest unchanged.
 *
 * @param {string} value
 * @returns {string}
 */
export function capitalize(value) {
	return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/**
 * Returns a possessive name
 *
 * @param {string} name
 * @returns {string}
 */
export function formatPossessiveName(name) {
	const trimmed = (name ?? '').trim();
	if (!trimmed) { return ''; }

	const lastChar = trimmed.slice(-1);
	return (lastChar === 's') ? `${trimmed}'` : `${trimmed}'s`;
}
