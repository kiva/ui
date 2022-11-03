import VueRouter from 'vue-router';
import filterConfig from '@/util/loanSearch/filterConfig';

/**
 * Check for excluded query params
 *
 * @param {Object} query
 * @returns {boolean}
 */
export function hasExcludedQueryParams(query) {
	// Handle temporary query param exclusions
	const excludedParams = [
		'activity',
		'city_state',
		'defaultRate',
		'loanTags',
		'state',
		'loanLimit',
	];
	// Check route.query for excluded params
	const queryContainsExcludedParams = Object.keys(query).filter(key => {
		return excludedParams.includes(key);
	});
	return queryContainsExcludedParams.length > 0;
}

/**
 * Converts the query string to loan search state
 *
 * @param {Object} query The Vue Router query object (this.$route.query)
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @param {number} pageLimit The limit/size of the page
 * @returns {Object} The loan search state
 */
export function convertQueryToFilters(query, allFacets, queryType, pageLimit) {
	return filterConfig.keys.reduce((prev, key) => {
		return { ...prev, ...filterConfig.config[key].getFilterFromQuery(query, allFacets, pageLimit, queryType) };
	}, {});
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

	// Create new query params object
	const newParams = {
		...filterConfig.keys.reduce((prev, key) => {
			return { ...prev, ...filterConfig.config[key].getQueryFromFilter(loanSearchState, queryType) };
		}, {}),
		...utmParams,
	};

	const newParamKeys = Object.keys(newParams);

	// Check if the query params differ from current route query params
	const doParamsMatch = [...newParamKeys, ...oldParamKeys]
		.reduce((prev, key) => prev && router.currentRoute.query[key] === newParams[key], true);

	// Vue throws duplicate navigation exception when identical paths are pushed to the router
	if (!doParamsMatch) {
		router.push({ ...router.currentRoute, query: newParams, params: { noScroll: true, noAnalytics: true } })
			.catch(e => {
				const { isNavigationFailure, NavigationFailureType } = VueRouter;

				// Ignore "navigation canceled" errors from clicking filter options quickly
				if (!isNavigationFailure(e, NavigationFailureType.cancelled)) {
					throw e;
				}
			});
	}
}
