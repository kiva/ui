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
