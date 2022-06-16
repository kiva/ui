import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '@/graphql/query/flssLoanFacetsQuery.graphql';

/**
 * Fetches the facets with number of fundraising loans from FLSS
 *
 * @param {Object} apollo The apollo client instance
 * @param {Object} isoCodeFilters The filters for the ISO code facets
 * @param {Object} themeFilters The filters for the theme facets
 * @param {Object} sectorFilters The filters for the sector facets
 * @returns {Promise<Array<Object>>} Promise for facets data
 */
export async function fetchFacets(apollo, isoCodeFilters, themeFilters, sectorFilters) {
	try {
		const result = await apollo.query({
			query: flssLoanFacetsQuery,
			variables: { isoCodeFilters, themeFilters, sectorFilters },
			fetchPolicy: 'network-only',
		});
		return result.data;
	} catch (e) {
		console.log('Fetching facets failed:', e.message);
	}
}

/**
 * Fetches the loan data from FLSS
 *
 * @param {Object} apollo The apollo client instance
 * @param {Object} filterObject The filters for the loan query
 * @param {String} sortOrder Sort option for the loan query
 * @param {Int} pageOffset The offset of the page
 * @param {Int} pageLimit The limit/size of the page
 * @returns {Promise<Array<Object>>} Promise for loan data
 */
export async function fetchLoans(apollo, filterObject, sortBy = null, pageOffset = 0, pageLimit = 15) {
	try {
		const result = await apollo.query({
			query: flssLoanQuery,
			variables: {
				filterObject,
				sortBy,
				pageNumber: pageOffset / pageLimit,
				pageLimit,
			},
			fetchPolicy: 'network-only',
		});
		return result.data?.fundraisingLoans;
	} catch (e) {
		console.log('Fetching loan failed:', e.message);
	}
}
