/* eslint-disable import/prefer-default-export */
import createSavedSearchMutation from '@/graphql/mutation/createSavedSearch.graphql';

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
		}
	});
}
