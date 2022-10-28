import loanSearchStateQuery from '@/graphql/query/loanSearchState.graphql';

// eslint-disable-next-line no-underscore-dangle
const __typename = 'LoanSearchState';

export const getDefaultLoanSearchState = () => ({
	gender: null, // Expects a string
	countryIsoCode: [], // Expects an array of strings
	sectorId: [], // Expects an array of ints
	sortBy: null, // Expects a string that matches the SortEnum
	themeId: [], // Expects an array of ints
	tagId: [], // Expects an array of ints
	pageOffset: 0, // Expects a number
	pageLimit: 15, // Expects a number
	distributionModel: null, // Expects DIRECT or FIELDPARTNER
	isIndividual: null, // Expects a boolean
	lenderRepaymentTerm: null, // Expects a MinMaxRange
	keywordSearch: null, // Expects a string
	partnerId: [], // Expects an array of ints
});

// export queries, resolvers and defaults for LoanSearchState
export default () => {
	return {
		defaults: {
			loanSearchState: {
				id: 'SearchData', // Using a hard-coded id for now to enable cache
				__typename,
				...getDefaultLoanSearchState(),
			},
		},
		resolvers: {
			Query: {
				loanSearchState(_, _args, { cache }) {
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
