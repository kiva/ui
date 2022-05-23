import orderBy from 'lodash/orderBy';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';

/**
 * Updates the search state using the provided apollo client and filters
 *
 * @param {Object} apollo The apollo client instance
 * @param {Object} loanQueryFilters The filters for the loan query
 * @returns {Promise<Array>} Returns Promise for the results of the mutation
 */
export async function updateSearchState(apollo, loanQueryFilters) {
	return apollo.mutate({
		mutation: updateLoanSearchMutation,
		variables: {
			searchParams: {
				...loanQueryFilters
			}
		}
	});
}

/**
 * Transforms for country facets into regions usable by the filters
 *
 * @param {Array} countryFacets The country facets from FLSS
 * @returns {Array} Regions with lists of countries
 */
export function transformCountryFacets(countryFacets) {
	let transformed = [];

	countryFacets.forEach(({ country }) => {
		// Ensure country has loans
		if (!country.numLoansFundraising) return;

		// Make deep copy so function is pure
		const countryCopy = { ...country };

		// Find existing region or add a new region
		const region = transformed.find(t => t.region === countryCopy.region);
		if (region) {
			region.countries.push(countryCopy);
			region.numLoansFundraising += countryCopy.numLoansFundraising;
		} else {
			transformed.push({
				region: countryCopy.region,
				countries: [countryCopy],
				numLoansFundraising: countryCopy.numLoansFundraising
			});
		}
	});

	// Sort regions and countries
	transformed = orderBy(transformed, 'region');
	// eslint-disable-next-line no-param-reassign
	transformed.forEach(region => { region.countries = orderBy(region.countries, 'name'); });

	return transformed;
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
