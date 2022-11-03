import { isNumber } from '@/util/numberUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';

/**
 * Returns the enum name property based on the query param
 *
 * @param {string} param The query param
 * @param {Array} facets Facets from the API
 * @returns The valid enum value
 */
export function getEnumNameFromQueryParam(param, facets) {
	if (param) {
		return facets.find(f => f.name.toUpperCase() === param.toUpperCase())?.name;
	}
}

/**
 * Gets boolean value based on string query param
 *
 * @param {string} param The query param to parse
 * @returns The boolean value
 */
export function getBooleanValueFromQueryParam(param) {
	const lowerParam = param?.toLowerCase();

	// eslint-disable-next-line no-nested-ternary
	return lowerParam === 'true' ? true : (lowerParam === 'false' ? false : null);
}

/**
 * Gets the min max range object based on string query param
 *
 * @param {string} param The query param to parse
 * @returns The min max range object
 */
export function getMinMaxRangeFromQueryParam(param) {
	if (!param) return;

	const minMaxSplit = param?.split(',');

	if (minMaxSplit.length === 2 && isNumber(minMaxSplit[0]) && isNumber(minMaxSplit[1])) {
		return createMinMaxRange(+minMaxSplit[0], +minMaxSplit[1]);
	}
}

/**
 * Returns IDs based on the query param. Handles FLSS/legacy and Algolia formats.
 *
 * @param {string} param The query param
 * @param {Array} names Facet names from the APIs
 * @param {Array} facets Facets from the APIs
 * @returns {Array} Valid IDs based on the query param
 */
export function getIdsFromQueryParam(param, names, facets) {
	if (!param) return;

	// Handles FLSS and legacy query params, such as "1" and "1,2" AND chained theme names
	if (param.includes(',') || isNumber(param)) {
		return param.split(',').reduce((prev, current) => {
			const name = current.toUpperCase();
			if (names.includes(name)) {
				const facet = facets.find(s => s.name.toUpperCase() === name);

				if (facet) {
					prev.push(facet.id);
				}
			} else if (current !== '') {
				return [...prev, parseInt(current, 10)];
			}

			return prev;
		}, []);
	}

	// Handles Algolia query params, such as "Arts" and "Arts~Clothing" AND single theme names
	return param.split('~').reduce((prev, current) => {
		const name = current.toUpperCase();

		if (names.includes(name)) {
			const facet = facets.find(s => s.name.toUpperCase() === name);

			if (facet) {
				prev.push(facet.id);
			}
		}

		return prev;
	}, []);
}
