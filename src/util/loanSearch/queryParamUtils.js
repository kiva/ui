/**
 * Check for excluded query params
 *
 * @param {Object} query
 * @returns {boolean}
 */
export function hasExcludedQueryParams(query) {
	// Handle temporary query param exclusions
	const excludedParams = [
		'city_state',
		'loanTags',
		'state',
		'loanLimit',
	];
	// Check route.query for excluded params
	const queryContainsExcludedParams = Object.keys(query).filter(key => {
		return excludedParams.includes(key);
	});
	return queryContainsExcludedParams.length > 0;
}
