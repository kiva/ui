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
 * @param {Object} loanQueryFilters The filters for the loan query
 * @param {String} sortOrder Sort option for the loan query
 * @param {String} pageOffset PageNumber or Offset (FLSS uses a page number, Lend Loans uses a count offset)
 * @returns {Promise<Array<Object>>} Promise for loan data
 */
export async function fetchLoans(apollo, loanQueryFilters, sortBy = null, pageOffset = 0) {
	try {
		const result = await apollo.query({
			query: flssLoanQuery,
			variables: {
				filterObject: loanQueryFilters,
				sortBy,
				pageNumber: pageOffset,
				limit: 20
			},
			fetchPolicy: 'network-only',
		});
		return result.data?.fundraisingLoans;
	} catch (e) {
		console.log('Fetching loan failed:', e.message);
	}
}
