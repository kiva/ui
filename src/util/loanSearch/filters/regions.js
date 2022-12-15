import { filterUiType } from '@/util/loanSearch/filterUtils';
import { sortRegions } from '@/util/loanSearch/countryUtils';

/**
 * Transforms ISO codes into regions usable by the filters
 *
 * @param {Array<Object>} countryFacets The ISO codes from FLSS
 * @param {Array<Object>} allCountryFacets The countries from lend API
 * @returns {Array<Object>} Regions with lists of countries
 */
export function transformIsoCodes(filteredIsoCodes, allCountryFacets = []) {
	const transformed = [];

	filteredIsoCodes.forEach(({ key: isoCode, value: numLoansFundraising }) => {
		// Create company object based on country defined by lend API
		const lookupCountry = allCountryFacets.find(({ country }) => {
			// Case insensitive matching just in case lend and FLSS APIs have different casing
			return country.isoCode.toUpperCase() === isoCode.toUpperCase();
		});
		if (!lookupCountry) return;
		const country = { ...lookupCountry.country, isoCode, numLoansFundraising };

		// Find existing transformed region or add a new region
		const region = transformed.find(t => t.region === country.region);
		if (region) {
			region.countries.push(country);
			region.numLoansFundraising += numLoansFundraising;
		} else {
			transformed.push({ region: country.region, countries: [country], numLoansFundraising });
		}
	});

	return sortRegions(transformed);
}

/**
 * Returns the country ISO codes based on the query param. Handles FLSS/legacy and Algolia formats.
 *
 * @param {string} param The query param
 * @param {Object} allFacets All available facets from the APIs
 * @returns {Array} Valid country ISO codes based on the query param
 */
export function getCountryIsoCodesFromQueryParam(param, allFacets) {
	if (!param) return;

	const decoded = decodeURI(param).toUpperCase();

	// Handles FLSS and legacy query params, such as "do,ht"
	if (decoded.includes(',') || allFacets.countryIsoCodes.includes(decoded)) {
		return decoded.split(',').filter(s => s !== '');
	}

	// Handles Algolia query params, such as "Africa%20>%20Burkina%20Faso~Africa%20>%20Congo%20%28DRC%29"
	return decoded.split('~').reduce((prev, current) => {
		const [region, country] = current.toUpperCase().split('>').map(s => s.trim());

		if (allFacets.countryNames.includes(country)) {
			const facet = allFacets.countryFacets.find(({ country: c }) => (
				c.region.toUpperCase() === region && c.name.toUpperCase() === country
			));

			if (facet) {
				prev.push(facet.country.isoCode);
			}
		}
		return prev;
	}, []);
}

/**
 * Gets an updated regions list to display in the filter with updated numLoansFundraising
 *
 * @param {Array<Object>} regions The regions previously displayed in the filter
 * @param {Array<Object>} nextRegions The regions returned by the latest FLSS facets query
 * @returns {Array<Object>} The updated regions list
 */
export function getUpdatedRegions(regions, nextRegions) {
	// Default to nextRegions
	if (!regions) return nextRegions;

	const updated = [];

	// Get updated numLoansFundraising
	regions.forEach(region => {
		const nextRegion = nextRegions.find(r => r.region === region.region);
		const nextRegionExists = !!nextRegion;
		const updatedRegion = {
			region: region.region,
			numLoansFundraising: nextRegionExists ? nextRegion.numLoansFundraising : 0,
			countries: []
		};

		updated.push(updatedRegion);

		region.countries.forEach(country => {
			const updatedCountry = { ...country };

			if (!nextRegionExists) {
				updatedCountry.numLoansFundraising = 0;
			} else {
				const nextCountry = nextRegion.countries.find(c => c.name === updatedCountry.name);
				updatedCountry.numLoansFundraising = nextCountry?.numLoansFundraising || 0;
			}

			updatedRegion.countries.push(updatedCountry);
		});
	});

	// Add missing regions that have been added since previous query
	nextRegions.forEach(region => {
		let updatedRegion = updated.find(r => r.region === region.region);

		if (!updatedRegion) {
			updatedRegion = {
				region: region.region,
				numLoansFundraising: region.numLoansFundraising,
				countries: []
			};
			updated.push(updatedRegion);
		}

		region.countries.forEach(country => {
			if (!updatedRegion.countries.find(c => c.name === country.name)) {
				updatedRegion.countries.push({ ...country });
			}
		});
	});

	return sortRegions(updated);
}

export default {
	uiConfig: {
		type: filterUiType.location,
		hasAccordion: true,
		topLine: false,
		bottomLine: false,
		title: 'Location',
		itemHeaderKey: undefined,
		placeholder: undefined,
		facetsKey: 'regions',
		stateKey: 'countryIsoCode',
		eventAction: undefined,
		allOptionsTitle: undefined,
		valueMap: undefined,
		isPercentage: false,
		displayedUnit: undefined,
	},
	getOptions: (allFacets = {}, filteredFacets = {}) => {
		return transformIsoCodes(filteredFacets.isoCodes, allFacets.countryFacets);
	},
	showSavedSearch: loanSearchState => loanSearchState.countryIsoCode.length > 0,
	getFilterChips: (loanSearchState, allFacets) => {
		if (loanSearchState.countryIsoCode?.length) {
			return loanSearchState.countryIsoCode.map(iso => {
				return allFacets.countryFacets?.find(facet => {
					return facet.country.isoCode === iso;
				})?.country;
			});
		}
		return [];
	},
	getRemovedFacet: (loanSearchState, facet) => ({
		countryIsoCode: [...loanSearchState.countryIsoCode?.filter(iso => {
			return facet.isoCode !== iso;
		})]
	}),
	getSavedSearch: loanSearchState => ({ country: loanSearchState?.countryIsoCode }),
	getFlssFilter: loanSearchState => ({
		...(loanSearchState?.countryIsoCode?.length && { countryIsoCode: { any: loanSearchState.countryIsoCode } })
	}),
	getValidatedSearchState: (loanSearchState, allFacets) => ({
		countryIsoCode: loanSearchState?.countryIsoCode
			?.filter(c => allFacets.countryIsoCodes.includes(c.toUpperCase())) ?? []
	}),
	getFilterFromQuery: (query, allFacets) => ({
		countryIsoCode: getCountryIsoCodesFromQueryParam(query.country || query.countries, allFacets) ?? []
	}),
	getQueryFromFilter: loanSearchState => ({
		...(loanSearchState.countryIsoCode?.length && { country: loanSearchState.countryIsoCode.join() })
	}),
};
