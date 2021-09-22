/* eslint-disable import/prefer-default-export */
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

export const allSectors = [
	{ id: 1, name: 'Agriculture' },
	{ id: 3, name: 'Transportation' },
	{ id: 4, name: 'Services' },
	{ id: 5, name: 'Clothing' },
	{ id: 6, name: 'Health' },
	{ id: 7, name: 'Retail' },
	{ id: 8, name: 'Manufacturing' },
	{ id: 9, name: 'Arts' },
	{ id: 10, name: 'Housing' },
	{ id: 12, name: 'Food' },
	{ id: 13, name: 'Wholesale' },
	{ id: 14, name: 'Construction' },
	{ id: 15, name: 'Education' },
	{ id: 16, name: 'Personal Use' },
	{ id: 17, name: 'Entertainment' }
];

export function fetchData(loanQueryFilters, apollo) {
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

export function filterGender(gender) {
	let genderFilter = {};
	if (!['both', 'male', 'female'].includes(gender)) {
		return genderFilter;
	}
	if (gender === 'both') {
		genderFilter = { any: ['female', 'male'] };
	} else {
		genderFilter = { any: [gender] };
	}

	return genderFilter;
}
