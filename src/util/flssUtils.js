import flssLoanQuery from '#src/graphql/query/flssLoansQuery.graphql';
import loanRecommendationsQuery from '#src/graphql/query/loanRecommendationsQuery.graphql';
import flssLoanFacetsQuery from '#src/graphql/query/flssLoanFacetsQuery.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import filterConfig from '#src/util/loanSearch/filterConfig';

/**
 * FLSS Query Context Const lists
 * Each query that resolves loans from FLSS should provide a descriptive origin formatted as web:##page-context##
 */
export const FLSS_ORIGIN_NOT_SPECIFIED = 'web:no-context';
export const FLSS_ORIGIN_BP_FUNDED = 'web:bp-funded';
export const FLSS_ORIGIN_THANKS = 'web:thanks';
export const FLSS_ORIGIN_PORTFOLIO_OVERVIEW = 'web:portfolio-overview';
export const FLSS_ORIGIN_CHECKOUT = 'web:empty-checkout';
export const FLSS_ORIGIN_CHECKOUT_UPSELL = 'web:checkout-upsell';
export const FLSS_ORIGIN_GOAL_RECOMMENDED_LOAN = 'web:goal-recommended-loan';

/**
 * Gets the filters for FLSS
 *
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The filters in the correct FLSS format
 */
export function getFlssFilters(loanSearchState) {
	return filterConfig.keys.reduce((prev, key) => {
		return { ...prev, ...filterConfig.config[key].getFlssFilter(loanSearchState) };
	}, {});
}

/**
 * Fetches the facets with number of fundraising loans from FLSS
 *
 * @param {Object} apollo The Apollo client instance
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @param {Object} isoCodeFilters The filters for the ISO code facets
 * @param {Object} themeFilters The filters for the theme facets
 * @param {Object} sectorFilters The filters for the sector facets
 * @param {Object} tagFilters The filters for the tag facets
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchFacets(
	apollo,
	origin = FLSS_ORIGIN_NOT_SPECIFIED,
	isoCodeFilters = {},
	themeFilters = {},
	sectorFilters = {},
	tagFilters = {},
) {
	try {
		const result = await apollo.query({
			query: flssLoanFacetsQuery,
			variables: {
				isoCodeFilters,
				themeFilters,
				sectorFilters,
				tagFilters,
				origin,
			},
			fetchPolicy: 'network-only',
		});
		return result.data;
	} catch (e) {
		logReadQueryError(e, 'flssUtils fetchFacets flssLoanFacetsQuery');
	}
}

/**
 * Fetches the loan data from FLSS
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} filterObject The filters for the loan query
 * @param {String} sortOrder Sort option for the loan query
 * @param {Int} pageOffset The offset of the page
 * @param {Int} pageLimit The limit/size of the page
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @returns {Promise<Array<Object>>} Promise for loan data
 */
export async function fetchLoans(
	apollo,
	filterObject,
	sortBy = null,
	pageOffset = 0,
	pageLimit = 15,
	origin = FLSS_ORIGIN_NOT_SPECIFIED
) {
	try {
		const result = await apollo.query({
			query: flssLoanQuery,
			variables: {
				filterObject,
				sortBy,
				pageNumber: pageOffset / pageLimit,
				pageLimit,
				origin
			},
			fetchPolicy: 'network-only',
		});
		return result.data?.fundraisingLoans;
	} catch (e) {
		logReadQueryError(e, 'flssUtils fetchLoans flssLoanQuery');
	}
}

/**
 * Fetches recommended loans from the FLSS API
 *
 * @param {Object} apollo The Apollo client instance
 * @param {String} origin Origin of query formatted as web:##page-context##
 * @param {Object} filters Optional filters to apply to recommendations
 * @param {String} sortBy Sort option for recommendations (defaults to 'personalized')
 * @param {Number} userId Optional user ID to get personalized recommendations
 * @param {Number} limit Optional limit for the number of recommendations
 * @returns {Object} The results of the recommendations query
 */
export async function fetchRecommendedLoans(
	apollo,
	origin = FLSS_ORIGIN_NOT_SPECIFIED,
	filters = null,
	sortBy = 'personalized',
	userId = null,
	limit = null,
) {
	try {
		const result = await apollo.query({
			query: loanRecommendationsQuery,
			variables: {
				filterObject: filters,
				sortBy,
				origin,
				userId,
				limit,
			},
			fetchPolicy: 'network-only',
		});
		return result.data?.loanRecommendations;
	} catch (e) {
		logReadQueryError(e, 'flssUtils fetchRecommendedLoans');
	}
}
