import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';
import privateLendMenuQuery from '@/graphql/query/lendMenuPrivateData.graphql';
import filterConfig from '@/util/loanSearch/filterConfig';

/**
 * Returns loan search state that has been validated against the available facets
 *
 * @param {Object} loanSearchState The current loan search state from Apollo cache
 * @param {Object} allFacets All available facets from the APIs
 * @param {string} queryType The current query type (lend vs FLSS)
 * @returns {Object} Validated search state, including default enum null values expected by GraphQL
 */
export function getValidatedSearchState(loanSearchState, allFacets, queryType) {
	return filterConfig.keys.reduce((prev, key) => {
		return { ...prev, ...filterConfig.config[key].getValidatedSearchState(loanSearchState, allFacets, queryType) };
	}, {});
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
 * Creates a saved search with a name and set of filters
 * TODO: Move to own file if we move forward with Saved Search exp
 *
 * @param {Object} apollo The Apollo client instance
 * @param {Object} loanQueryFilters The filters for the saved search
 * @param {string} savedSearchName The name of the saved search
 * @returns {Promise<Array>} Promise for the results of the mutation
 */
export async function createSavedSearch(apollo, loanQueryFilters, queryString, savedSearchName) {
	return apollo.mutate({
		mutation: createSavedSearchMutation,
		variables: {
			name: savedSearchName,
			queryString,
			filters: loanQueryFilters
		},
		refetchQueries: [{ query: privateLendMenuQuery }],
	});
}
