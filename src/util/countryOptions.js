/**
 * Country options for cases where all countries need to be listed.
 */
import countryIsoToName from '#src/assets/data/countryIsoToName.json';

/**
 * @returns {Array<{isoCode: string, name: string}>} Sorted by name for display
 */
export function getCountryOptions() {
	return countryIsoToName.map(entry => {
		const [isoCode] = Object.keys(entry);
		return { isoCode, name: entry[isoCode] };
	});
}
