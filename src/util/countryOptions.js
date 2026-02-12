/**
 * Country options for cases where all countries need to be listed.
 * Options are sourced from the general.allCountriesIsoMap GraphQL query.
 */

/**
 * Parses the JSON string from general.allCountriesIsoMap into a sorted options array.
 * API format: {"AF":"Afghanistan","AL":"Albania",...}
 *
 * @param {string} jsonString - JSON-encoded map of ISO code to country name
 * @returns {Array<{isoCode: string, name: string}>} Sorted by name for display
 */
export function parseAllCountriesIsoMapToOptions(jsonString) {
	if (!jsonString || typeof jsonString !== 'string') {
		return [];
	}
	let map;
	try {
		map = JSON.parse(jsonString);
	} catch {
		return [];
	}
	if (!map || typeof map !== 'object' || Array.isArray(map)) {
		return [];
	}
	return Object.entries(map)
		.map(([isoCode, name]) => ({ isoCode, name: name ?? '' }))
		.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}
