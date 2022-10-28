import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '@/graphql/query/flssLoanFacetsQuery.graphql';
import flssLoanChannelQuery from '@/graphql/query/flssLoanChannel.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import { getMinMaxRangeFilter } from '@/util/loanSearch/minMaxRange';

/**
 * FLSS Query Context Const lists
 * Each query that resolves loans from FLSS should provide a descriptive origin formatted as web:##page-context##
 */
export const FLSS_ORIGIN_NOT_SPECIFIED = 'web:no-context';
export const FLSS_ORIGIN_CATEGORY = 'web:category';
export const FLSS_ORIGIN_LEND_BY_CATEGORY = 'web:lend-by-category';
export const FLSS_ORIGIN_LEND_FILTER = 'web:lend-filter';
export const FLSS_ORIGIN_BP_FUNDED = 'web:bp-funded';
export const FLSS_ORIGIN_THANKS = 'web:thanks';

/**
 * Gets the filters for FLSS
 *
 * @param {Object} loanSearchState The current loan search state from Apollo
 * @returns {Object} The filters in the correct FLSS format
 */
export function getFlssFilters(loanSearchState) {
	return {
		...(loanSearchState?.gender && { gender: { any: loanSearchState.gender } }),
		...(loanSearchState?.countryIsoCode?.length && { countryIsoCode: { any: loanSearchState.countryIsoCode } }),
		...(loanSearchState?.themeId?.length && { themeId: { any: loanSearchState.themeId } }),
		...(loanSearchState?.sectorId?.length && { sectorId: { any: loanSearchState.sectorId } }),
		...(loanSearchState?.distributionModel && { distributionModel: { eq: loanSearchState.distributionModel } }),
		...(loanSearchState?.tagId?.length && { tagId: { any: loanSearchState.tagId } }),
		...(loanSearchState?.keywordSearch && { description: { eq: loanSearchState.keywordSearch } }),
		...(typeof loanSearchState?.isIndividual !== 'undefined' && loanSearchState.isIndividual !== null && {
			isIndividual: { eq: loanSearchState.isIndividual }
		}),
		...(loanSearchState?.lenderRepaymentTerm && {
			lenderRepaymentTerm: { range: getMinMaxRangeFilter(loanSearchState.lenderRepaymentTerm) }
		}),
		...(loanSearchState?.partnerId?.length && { partnerId: { any: loanSearchState.partnerId } }),
	};
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
	isoCodeFilters,
	themeFilters,
	sectorFilters,
	tagFilters,
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
 * Gets the variables for the loan channel query
 *
 * @param {Array} queryMapFLSS The query map entry for the channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The variables for the loan channel query
 */
export function getLoanChannelVariables(queryMapFLSS, loanQueryVars) {
	return {
		ids: [...loanQueryVars.ids],
		filterObject: getFlssFilters(queryMapFLSS),
		sortBy: queryMapFLSS.sortBy,
		pageNumber: loanQueryVars.offset / loanQueryVars.limit,
		pageLimit: loanQueryVars.limit,
		basketId: loanQueryVars.basketId,
		origin: loanQueryVars?.origin ?? FLSS_ORIGIN_NOT_SPECIFIED
	};
}

/**
 * 	Fetches the data for the loan channel from FLSS
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMapFLSS The query map entry for the channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The loan channel data
 */
export async function fetchLoanChannel(apollo, queryMapFLSS, loanQueryVars) {
	try {
		return (await apollo.query({
			query: flssLoanChannelQuery,
			variables: getLoanChannelVariables(queryMapFLSS, loanQueryVars),
		})).data;
	} catch (e) {
		logReadQueryError(e, 'flssUtils fetchLoanChannel flssLoanChannelQuery');
	}
}

/**
 * Gets the cached data for the loan channel
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMapFLSS The query map entry for the channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The loan channel data
 */
export function getCachedLoanChannel(apollo, queryMapFLSS, loanQueryVars) {
	try {
		return apollo.readQuery({
			query: flssLoanChannelQuery,
			variables: getLoanChannelVariables(queryMapFLSS, loanQueryVars),
		});
	} catch (e) {
		logReadQueryError(e, 'flssUtils getCachedLoanChannel flssLoanChannelQuery');
	}
}

/**
 * Watches the loan channel query
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Array} queryMapFLSS The query map entry for the channel
 * @param {Object} loanQueryVars The loan channel query variables
 * @returns {Object} The Apollo observer
 */
export function watchLoanChannel(apollo, queryMapFLSS, loanQueryVars) {
	try {
		return apollo.watchQuery({
			query: flssLoanChannelQuery,
			variables: getLoanChannelVariables(queryMapFLSS, loanQueryVars),
		});
	} catch (e) {
		logReadQueryError(e, 'flssUtils watchLoanChannel flssLoanChannelQuery');
	}
}
