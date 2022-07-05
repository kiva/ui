import orderBy from 'lodash/orderBy';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import { fetchFacets, fetchLoans, getFlssFilters } from '@/util/flssUtils';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { isNumber } from '@/util/numberUtils';

/**
 * API query types, FLSS and lend (standard)
 */
export const FLSS_QUERY_TYPE = 'flss';
export const STANDARD_QUERY_TYPE = 'standard';

/**
 * Map used to convert lend <> FLSS sort option values
 */
const lendToFlssSort = new Map([
	['expiringSoon', 'expiringSoon'],
	['popularity', 'personalized'],
	['loanAmountDesc', 'amountHighToLow'],
	['loanAmount', 'amountLowToHigh'],
]);

/**
 * Used to map the sort value to display value
 */
export const sortByNameToDisplay = {
	// Shared
	expiringSoon: 'Ending soon',
	// Standard (lend)
	amountLeft: 'Amount left',
	loanAmount: 'Amount: Low to High',
	loanAmountDesc: 'Amount: High to Low',
	newest: 'Most recent',
	popularity: 'Trending now',
	random: 'Random',
	repaymentTerm: 'Loan length',
	// FLSS specific
	amountHighToLow: 'Amount: High to Low',
	amountLowToHigh: 'Amount: Low to High',
	personalized: 'Recommended'
};

export const visibleThemeIds = [2, 6, 8, 11, 14, 28, 29, 32, 36];

/**
 * Returns loan search state that has been validated against the available facets
 *
 * @param {Object} loanSearchState The current loan search state from Apollo cache
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @returns {Object} Validated search state, including default enum null values expected by GraphQL
 */
export function getValidatedSearchState(loanSearchState, allFacets, queryType) {
	const validSorts = queryType === FLSS_QUERY_TYPE ? allFacets.flssSorts : allFacets.standardSorts;

	const defaultLoanSearchState = getDefaultLoanSearchState();

	const validatedGender = allFacets.genders.includes(loanSearchState?.gender?.toUpperCase())
		? loanSearchState.gender : null;

	const validatedIsoCodes = loanSearchState?.countryIsoCode
		?.filter(c => allFacets.countryIsoCodes.includes(c.toUpperCase())) ?? [];

	const validatedSectorIds = loanSearchState?.sectorId?.filter(s => allFacets.sectorIds.includes(s)) ?? [];

	const validatedSortBy = validSorts.some(s => s.name === loanSearchState.sortBy) ? loanSearchState.sortBy : null;

	const validatedThemeIds = loanSearchState?.themeId?.filter(t => allFacets.themeIds.includes(t)) ?? [];

	const validatedPageOffset = isNumber(loanSearchState?.pageOffset)
		? loanSearchState.pageOffset
		: defaultLoanSearchState.pageOffset;

	const validatedPageLimit = isNumber(loanSearchState?.pageLimit)
		? loanSearchState.pageLimit
		: defaultLoanSearchState.pageLimit;

	return {
		gender: validatedGender,
		countryIsoCode: validatedIsoCodes,
		sectorId: validatedSectorIds,
		sortBy: validatedSortBy,
		themeId: validatedThemeIds,
		pageOffset: validatedPageOffset,
		pageLimit: validatedPageLimit,
	};
}

/**
 * Updates the search state using the provided apollo client and filters
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanQueryFilters The filters for the loan query
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @param {Object} previousState The previous search state
 * @returns {Promise<Array>} Promise for the results of the mutation
 */
export async function updateSearchState(apollo, loanQueryFilters, allFacets, queryType, previousState) {
	const validatedPreviousFilters = getValidatedSearchState(previousState, allFacets, queryType);
	const validatedFilters = getValidatedSearchState(loanQueryFilters, allFacets, queryType);

	// Quick JSON compare works because both states are results of getValidatedSearchState
	if (JSON.stringify(validatedPreviousFilters) === JSON.stringify(validatedFilters)) return;

	return apollo.mutate({
		mutation: updateLoanSearchMutation,
		variables: {
			searchParams: {
				...validatedFilters
			}
		}
	});
}

/**
 * Categorizes Sort Options
 *
 * @param {Array<Object>} standardSorts Sort options from the lend API
 * @param {Array<Object>} flssSorts Sort options from the FLSS API
 * @returns New formatted array
 */
export function formatSortOptions(standardSorts, flssSorts) {
	const labeledStandardSorts = standardSorts.map(sort => {
		return {
			name: sort.name,
			sortSrc: STANDARD_QUERY_TYPE,
		};
	});
	const labeledFlssSorts = flssSorts.reduce((prev, current) => {
		// The amountLeft sort is currently returned by the GraphQL enum but isn't fully supported
		if (current.name !== 'amountLeft') {
			prev.push({ name: current.name, sortSrc: FLSS_QUERY_TYPE });
		}

		return prev;
	}, []);
	return [...labeledStandardSorts, ...labeledFlssSorts];
}

/**
 * Sorts the provided regions and countries of regions
 *
 * @param {Array<Object>} regions The regions to sort
 * @returns {Array<Object>} New sorted array
 */
export function sortRegions(regions) {
	const sorted = orderBy(regions, 'region');

	// eslint-disable-next-line no-param-reassign
	sorted.forEach(region => { region.countries = orderBy(region.countries, 'name'); });

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
 * Transforms filtered sectors into a form usable by the filters
 *
 * @param {Array<Object>} filteredSectors The sector IDs from FLSS
 * @param {Array<Object>} allSectors The sectors from lend API
 * @returns {Array<Object>} Sectors with number of loans fundraising
 */
export function transformSectors(filteredSectors, allSectors = []) {
	const transformed = [];

	filteredSectors.forEach(({ key: id, value: numLoansFundraising }) => {
		const lookupSector = allSectors.find(s => s.id === +id);
		if (!lookupSector) return;
		const sector = { id: lookupSector.id, name: lookupSector.name, numLoansFundraising };
		transformed.push(sector);
	});

	return orderBy(transformed, 'name');
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

	// Always show certain themes regardless of whether there are applicable loans
	visibleThemeIds.forEach(id => {
		const themeFromLend = allThemes.find(a => a.id === id);

		if (!themeFromLend) return;

		// Case insensitive matching since lend and FLSS APIs can use different casing for themes
		const themeFromFlss = filteredThemes.find(t => t.key.toUpperCase() === themeFromLend.name.toUpperCase());

		const theme = { id, name: themeFromLend.name, numLoansFundraising: themeFromFlss?.value ?? 0 };

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
 * Gets an updated items list to display in the filter with updated numLoansFundraising. Expected items and next format:
 * [{
 *   id: 1,
 *   name: '',
 *   numLoansFundraising: 1,
 * }]
 *
 * @param {Array<Object>} items The items previously displayed in the filter
 * @param {Array<Object>} next The items returned by the FLSS facets query
 * @returns {Array<Object>} The updated items list
 */
export function getUpdatedNumLoansFundraising(items, next) {
	const updated = [];

	// Get updated numLoansFundraising
	items?.forEach(item => {
		const nextItem = next.find(a => a.id === item.id);
		const updatedItem = {
			...item,
			numLoansFundraising: nextItem?.numLoansFundraising || 0,
		};

		updated.push(updatedItem);
	});

	// Add missing items that have been added since previous query
	next?.forEach(item => {
		if (!updated.find(a => a.id === item.id)) {
			updated.push({ ...item });
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
 * Runs the query to get the filter facets
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The filter facets
 */
export async function runFacetsQueries(apollo, loanSearchState) {
	const isoCodeFilters = { ...getFlssFilters(loanSearchState), countryIsoCode: undefined };
	const themeFilters = { ...getFlssFilters(loanSearchState), themeId: undefined };
	const sectorFilters = { ...getFlssFilters(loanSearchState), sectorId: undefined };

	const facets = await fetchFacets(apollo, isoCodeFilters, themeFilters, sectorFilters);

	return {
		isoCodes: facets?.isoCodes?.facets?.isoCode ?? [],
		themes: facets?.themes?.facets?.themes ?? [],
		sectors: facets?.sectors?.facets?.sectorId ?? [],
	};
}

/**
 *	Runs the FLSS loan query
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The results of the loan query
 */
export async function runLoansQuery(apollo, loanSearchState) {
	const flssData = await fetchLoans(
		apollo,
		getFlssFilters(loanSearchState),
		loanSearchState?.sortBy,
		loanSearchState?.pageOffset,
		loanSearchState?.pageLimit
	);

	return { loans: flssData?.values ?? [], totalCount: flssData?.totalCount ?? 0 };
}

/**
 * Fetches the facets data for the lend and FLSS APIs
 *
 * @param {Object} apollo The apollo client instance
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchLoanFacets(apollo) {
	try {
		const result = await apollo.query({ query: loanFacetsQuery, fetchPolicy: 'network-only' });

		const countryFacets = result.data?.lend?.countryFacets ?? [];
		const sectorFacets = result.data?.lend?.sector ?? [];
		const themeFacets = result.data?.lend?.loanThemeFilter ?? [];
		const genderFacets = result.data?.genderOptions?.enumValues ?? [];

		return {
			countryFacets,
			countryIsoCodes: countryFacets.map(c => c.country.isoCode.toUpperCase()),
			countryNames: countryFacets.map(c => c.country.name.toUpperCase()),
			sectorFacets,
			sectorIds: sectorFacets.map(s => s.id),
			sectorNames: sectorFacets.map(s => s.name.toUpperCase()),
			themeFacets,
			themeIds: themeFacets.map(t => t.id),
			themeNames: themeFacets.map(t => t.name.toUpperCase()),
			genderFacets,
			genders: genderFacets.map(g => g.name.toUpperCase()),
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

/**
 * Returns the country ISO codes based on the query param. Handles FLSS/legacy and Algolia formats.
 *
 * @param {string} param The query param
 * @param {Object} allFacets All available facets from the APIs
 * @returns {Array} Valid sector IDs based on the query param
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
 * Returns the sector IDs based on the query param. Handles FLSS/legacy and Algolia formats.
 *
 * @param {string} param The query param
 * @param {Array} names Facet names from the APIs
 * @param {Array} facets Facets from the APIs
 * @returns {Array} Valid IDs based on the query param
 */
export function getIdsFromQueryParam(param, names, facets) {
	if (!param) return;

	// Handles FLSS and legacy query params, such as "1" and "1,2"
	if (param.includes(',') || isNumber(param)) {
		return param.split(',').filter(s => s !== '').map(s => +s);
	}

	// Handles Algolia query params, such as "Arts" and "Arts~Clothing"
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

/**
 * Pulls the query string params using the Vue Router and applies them to the search state
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} query The Vue Router query object (this.$route.query)
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @param {number} pageLimit The limit/size of the page
 * @param {Object} previousState The previous search state
 */
export async function applyQueryParams(apollo, query, allFacets, queryType, pageLimit, previousState = {}) {
	// Convert query param 1-based page to pager 0-based page and ensure page is an integer
	const page = isNumber(query.page) && query.page >= 1 ? Math.floor(query.page) - 1 : 0;

	const filters = {
		gender: query.gender,
		countryIsoCode: getCountryIsoCodesFromQueryParam(query.country || query.countries, allFacets),
		sectorId: getIdsFromQueryParam(query.sector, allFacets.sectorNames, allFacets.sectorFacets),
		sortBy: queryType === FLSS_QUERY_TYPE ? lendToFlssSort.get(query.sortBy) : query.sortBy,
		themeId: getIdsFromQueryParam(query.attribute || query.attributes, allFacets.themeNames, allFacets.themeFacets),
		pageOffset: page * pageLimit,
		pageLimit,
	};

	await updateSearchState(apollo, filters, allFacets, queryType, previousState);
}

/**
 * Pushes a new route to the Vue Router with the updated query string params, which ensures that Vue knows about the
 * route change, and it enables watching the browser navigation via back/forward buttons to update filters
 *
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @param {Object} router The Vue Router object
 * @param {string} queryType The current query type (lend vs FLSS)
 */
export function updateQueryParams(loanSearchState, router, queryType) {
	const oldParamKeys = Object.keys(router.currentRoute.query);

	// Preserve UTM params
	const utmParams = {};
	oldParamKeys.forEach(key => {
		if (key.includes('utm_')) {
			utmParams[key] = router.currentRoute.query[key];
		}
	});

	// The query param uses the standard sort values, so map from FLSS as needed
	const queryParamSortBy = queryType === FLSS_QUERY_TYPE
		// eslint-disable-next-line no-unused-vars
		? [...lendToFlssSort].find(([_, value]) => value === loanSearchState.sortBy)?.[0]
		: loanSearchState.sortBy;

	// Page query param is 1-based
	const page = (loanSearchState.pageOffset / loanSearchState.pageLimit) + 1;

	// Create new query params object
	const newParams = {
		...(loanSearchState.gender && { gender: loanSearchState.gender }),
		...(loanSearchState.countryIsoCode?.length && { country: loanSearchState.countryIsoCode.join() }),
		...(loanSearchState.sectorId?.length && { sector: loanSearchState.sectorId.join() }),
		...(loanSearchState.themeId?.length && { attribute: loanSearchState.themeId.join() }),
		...(queryParamSortBy && { sortBy: queryParamSortBy }),
		...(page > 1 && { page: page.toString() }),
		...utmParams,
	};

	const newParamKeys = Object.keys(newParams);

	// Check if the query params differ from current route query params
	const doParamsMatch = [...newParamKeys, ...oldParamKeys]
		.reduce((prev, key) => prev && router.currentRoute.query[key] === newParams[key], true);

	// Vue throws duplicate navigation exception when identical paths are pushed to the router
	if (!doParamsMatch) {
		router.push({ ...router.currentRoute, query: newParams, params: { noScroll: true, noAnalytics: true } });
	}
}
