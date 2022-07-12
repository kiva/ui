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

/**
 * Map isoCode List to region keyed object with country name array
 *
 * @param {Array<String>} isoCodes
 * @param {Array<Object>} regions
 * @returns {Object}
 */
export function mapIsoCodesToCountryNames(isoCodes, regions) {
	if (!isoCodes || !regions) return {};

	const mappedIsos = regions.reduce((regionObject, region) => {
		const countryNames = isoCodes.filter(
			iso => region?.countries?.find(country => country.isoCode === iso)
		).map(iso => {
			return isoToCountryName(iso, region?.countries);
		});
		return countryNames.length ? { ...regionObject, [region.region]: countryNames } : { ...regionObject };
	}, {});

	return mappedIsos;
}

/**
 * Builds a flattened list of the ISO codes of the provided regions with countries
 *
 * @param {Array<Object>} regions All of the regions with countries
 * @param {Object} selectedCountries An object where the props are regions and values are countries
 * @returns {Array<string>} Flat list of the ISO codes
 */
export function getIsoCodes(regions, selectedCountries) {
	return Object.keys(selectedCountries).reduce((prev, current) => {
		const codes = regions
			.find(r => r.region === current)?.countries
			.filter(c => selectedCountries[current].includes(c.name))
			.map(c => c.isoCode);
		return [...prev, ...(codes || [])];
	}, []);
}
