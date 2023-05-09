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
	partnerRiskRating: null, // Expects a MinMaxRange
	partnerDefaultRate: null, // Expects a MinMaxRange
	partnerAvgProfitability: null, // Expects a MinMaxRange
	isMatchable: null, // Expects a boolean
	category: null, // Expects an int
});

// export queries, resolvers and defaults for LoanSearchState
export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query: loanSearchStateQuery,
				data: {
					loanSearchState: {
						id: 'SearchData', // Using a hard-coded id for now to enable cache
						__typename,
						...getDefaultLoanSearchState(),
					}
				},
			});
		},
		resolvers: {
			Mutation: {
				updateLoanSearch(_, { searchParams }, { cache }) {
					// Patch the new params into the existing state in the cache
					const data = cache.readQuery({ query: loanSearchStateQuery });
					cache.writeQuery({
						query: loanSearchStateQuery,
						data: {
							loanSearchState: {
								...data.loanSearchState,
								...searchParams
							}
						}
					});
				}
			}
		}
	};
};
