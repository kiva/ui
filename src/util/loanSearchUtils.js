// TODO: remove this disabled eslint rule once there's another function
/* eslint-disable import/prefer-default-export */
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';

/**
 * Updates the search state using the provided apollo client and filters
 *
 * @param {Object} apollo The apollo client instance
 * @param {Object} loanQueryFilters The filters for the loan query
 * @returns Returns Promise for the results of the mutation
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
