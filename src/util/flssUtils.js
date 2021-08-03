/* eslint-disable import/prefer-default-export */
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export function fetchData(loanQueryFilters) {
	const zeroLoans = false;
	const newLoans = [];
	const totalCount = 0;

	this.apollo.query({
		query: flssLoanQuery,
		variables: {
			filterObject: loanQueryFilters,
			limit: 20
		},
		fetchPolicy: 'network-only',
	})
		.then(({ data }) => {
			this.newLoans = data.fundraisingLoans?.values ?? [];

			this.totalCount = data.fundraisingLoans.totalCount ?? 0;
			if (totalCount === 0) {
				this.zeroLoans = true;
			}
		});
	console.log('newLoans', newLoans);
	console.log('totalCount', totalCount);
	console.log('zeroLoans', zeroLoans);
	return (newLoans, totalCount, zeroLoans);
}
