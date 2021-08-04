import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export default function fetchData(loanQueryFilters, apollo) {
	return apollo.query({
		query: flssLoanQuery,
		variables: {
			filterObject: loanQueryFilters,
			limit: 20
		},
		fetchPolicy: 'network-only',
	})
		.then(({ data }) => {
			return data.fundraisingLoans;
		});
}
