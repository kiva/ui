import orderBy from 'lodash/orderBy';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import { fetchFacets, fetchLoans } from '@/util/flssUtils';

/**
 * Updates the search state using the provided apollo client and filters
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanQueryFilters The filters for the loan query
 * @returns {Promise<Array>} Promise for the results of the mutation
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
 * Categorizes Sort Options
 *
 * @param {Array<Object>} standardSorts
 * @param {Array<Object>} flssSorts
 * @returns New formatted array
 */
export function formatSortOptions(standardSorts, flssSorts) {
	const labeledStandardSorts = standardSorts.map(sort => {
		return {
			name: sort.name,
			sortSrc: 'standard',
		};
	});
	const labeledFlssSorts = flssSorts.map(sort => {
		return {
			name: sort.name,
			sortSrc: 'flss',
		};
	});
	return [...labeledStandardSorts, ...labeledFlssSorts];
}

/**
 * Sorts the provided regions and countries of regions
 *
 * @param {Array<Object>} regions The regions to sort
 * @returns New sorted array
 */
export function sortRegions(regions) {
	const sorted = orderBy(regions, 'region');

	// eslint-disable-next-line no-param-reassign
	sorted.forEach(region => { region.countries = orderBy(region.countries, 'name'); });

	return sorted;
}

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
		const lookupCountry = allCountryFacets.find(({ country }) => country.isoCode === isoCode);
		if (!lookupCountry) return;
		const country = { ...lookupCountry.country, numLoansFundraising };

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
 * Transforms filtered themes into a form usable by the filters
 *
 * @param {Array<Object>} filteredThemes The themes from FLSS
 * @param {Array<Object>} allThemes The themes from lend API
 * @returns {Array<Object>} Themes with number of loans fundraising
 */
export function transformThemes(filteredThemes, allThemes = []) {
	const transformed = [];

	filteredThemes.forEach(({ key: name, value: numLoansFundraising }) => {
		const lookupTheme = allThemes.find(a => a.name === name);
		if (!lookupTheme) return;
		const theme = { ...lookupTheme, numLoansFundraising };
		transformed.push(theme);
	});

	return orderBy(transformed, 'name');
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

/**
 * Gets an updated themes list to display in the filter with updated numLoansFundraising
 *
 * @param {Array<Object>} themes The themes previously displayed in the filter
 * @param {Array<Object>} nextThemes The themes returned by the FLSS facets query
 * @returns {Array<Object>} The updated themes list
 */
export function getUpdatedThemes(themes, nextThemes) {
	// Default to next
	if (!themes) return nextThemes;

	const updated = [];

	// Get updated numLoansFundraising
	themes.forEach(theme => {
		const nextTheme = nextThemes.find(a => a.id === theme.id);
		const updatedTheme = {
			...theme,
			numLoansFundraising: nextTheme?.numLoansFundraising || 0,
		};

		updated.push(updatedTheme);
	});

	// Add missing themes that have been added since previous query
	nextThemes.forEach(theme => {
		if (!updated.find(a => a.id === theme.id)) {
			updated.push({ ...theme });
		}
	});

	return orderBy(updated, 'name');
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

/**
 * Gets the filters for FLSS
 *
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The filters in the correct FLSS format
 */
export function getFlssFilters(loanSearchState) {
	return {
		...(loanSearchState?.gender && { gender: { any: loanSearchState.gender } }),
		...(loanSearchState?.countryIsoCode?.length && {
			countryIsoCode: { any: loanSearchState.countryIsoCode }
		}),
		...(loanSearchState?.theme?.length && {
			theme: { any: loanSearchState.theme }
		}),
	};
}

/**
 * Runs the query to get the filter facets
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The filter facets
 */
export async function runFacetsQueries(apollo, loanSearchState = {}) {
	// Filtered ISO codes that match loan results without filtering on ISO code
	const isoCodeFilters = { ...getFlssFilters(loanSearchState), countryIsoCode: undefined };
	const isoCodes = (await fetchFacets(apollo, isoCodeFilters))?.isoCode || [];

	const themeFilters = { ...getFlssFilters(loanSearchState), theme: undefined };
	const themes = (await fetchFacets(apollo, themeFilters))?.themes || [];

	return { isoCodes, themes };
}

/**
 *	Runs the FLSS loan query
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The results of the loan query
 */
export async function runLoansQuery(apollo, loanSearchState = {}) {
	const flssData = await fetchLoans(
		apollo,
		getFlssFilters(loanSearchState),
		loanSearchState?.sortBy
	);

	return { loans: flssData?.values || [], totalCount: flssData?.totalCount || 0 };
}

/**
 * Fetches the facets data from the lend API
 *
 * @param {Object} apollo The apollo client instance
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchLoanFacets(apollo) {
	try {
		const result = await apollo.query({ query: loanFacetsQuery, fetchPolicy: 'network-only' });

		return {
			countryFacets: result.data?.lend?.countryFacets || [],
			sectorFacets: result.data?.lend?.sector || [],
			themeFacets: result.data?.lend?.loanThemeFilter || [],
			flssSorts: result.data?.flssSorts?.enumValues ?? [],
			standardSorts: result.data?.standardSorts?.enumValues ?? [],
		};
	} catch (e) {
		console.log('Fetching loan facets failed:', e.message);
	}
}

/**
 * Returns the item label with fundraising amount in parens
 *
 * @param {Object} item The item for generating the label
 * @returns {string} The item label
 */
export function getCheckboxLabel(item) {
	return `${item.name || item.region} (${item.numLoansFundraising})`;
}
