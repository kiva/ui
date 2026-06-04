import _orderBy from 'lodash/orderBy';

/**
 * Sorts the provided regions and countries of regions
 *
 * @param {Array<Object>} regions The regions to sort
 * @returns {Array<Object>} New sorted array
 */
export function sortRegions(regions) {
	const sorted = _orderBy(regions, 'region');

	// eslint-disable-next-line no-param-reassign
	sorted.forEach(region => { region.countries = _orderBy(region.countries, 'name'); });

	return sorted;
}

/**
 * Map isoCode to country name
 *
 * @param {String} isoCode
 * @param {Array<Object>} region
 * @returns String
 */
export function isoToCountryName(isoCode, countryList = []) {
	const isoMatch = countryList.find(country => country.isoCode === isoCode);
	return isoMatch?.name ?? null;
}
