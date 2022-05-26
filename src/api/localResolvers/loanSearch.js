import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';
// import gql from 'graphql-tag';

// eslint-disable-next-line no-underscore-dangle
const __typename = 'LoanSearchState';

// Using a fragment is an alternative way to access the cache, requires gql or a new fragment file
// const loanSearchStateFragment = gql`
// 	fragment loanSearchState on LoanSearchState @client {
// 		gender
// 		countryIsoCode
// 		sectorId
// 		sortBy
// 		attribute
// 	}
// `;

// export queries, resolvers and defaults for LoanSearchState
export default () => {
	return {
		defaults: {
			loanSearchState: {
				id: 'SearchData', // using a hard-coded id for now to enable cache
				gender: '', // expects a string
				countryIsoCode: [], // expects an array of strings
				sectorId: [], // expects an array of ints
				sortBy: '', // expects a string
				attribute: [], // expects an array of strings
				__typename,
			},
		},
		resolvers: {
			Query: {
				loanSearchState(_, args, { cache }) {
					// Retrieve current LoanSearchState from the Apollo cache
					// - If it's missing the default values will be used to create it
					const cachedData = cache.readQuery({ query: loanSearchStateQuery });
					return cachedData;
				},
			},
			Mutation: {
				updateLoanSearch(_, variables = {}, { cache }) {
					// For now we're using a fixed cache key
					// - this is built from the id and __typename of the object
					const id = 'LoanSearchState:SearchData';
					// Fetch previous state from the cache
					const previousState = cache.readQuery({ query: loanSearchStateQuery });
					// Patch the new params into the existing state
					const data = { ...previousState?.loanSearchState, ...variables.searchParams };
					// Write the new state to the cache
					cache.writeData({ data, id });
					// We could pull the data from the newly set cache and return that...
					// const newState = cache.readQuery({ query: loanSearchStateQuery });
					// console.log(newState);
					// Return the latest state
					return data;
				}
			}
		}
	};
};
