import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export default function fetchData(loanQueryFilters, apollo) {
	const zeroLoans = false;

	apollo.query({
		query: flssLoanQuery,
		variables: {
			filterObject: loanQueryFilters,
			limit: 20
		},
		fetchPolicy: 'network-only',
	})
		.then(({ data }) => {
			const newLoans = data.fundraisingLoans?.values ?? [];

			const totalCount = data.fundraisingLoans.totalCount ?? 0;

			if (totalCount === 0) {
				this.zeroLoans = true;
			}
			console.log('all the things:', newLoans, totalCount, zeroLoans);
			return (newLoans, totalCount, zeroLoans);
		});
}
