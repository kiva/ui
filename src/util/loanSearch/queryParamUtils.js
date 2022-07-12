import { isNumber } from '@/util/numberUtils';
import { updateSearchState } from '@/util/loanSearch/searchStateUtils';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';

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
