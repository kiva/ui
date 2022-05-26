import { fetchFacets, fetchLoan } from '@/util/flssUtils';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '@/graphql/query/flssLoanFacetsQuery.graphql';

describe('flssUtils.js', () => {
	describe('fetchFacets', () => {
		const result = { isoCode: [] };
		const dataObj = { data: { fundraisingLoans: { facets: result } } };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
		const loanQueryFilters = { any: ['US'] };
		const apolloVariables = {
			query: flssLoanFacetsQuery,
			variables: { filterObject: loanQueryFilters },
			fetchPolicy: 'network-only',
		};

		it('should pass the correct query variables to apollo', async () => {
			await fetchFacets(apollo, loanQueryFilters);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the fundraising facets data', async () => {
			const data = await fetchFacets(apollo, loanQueryFilters);
			expect(data).toBe(result);
		});
	});

	describe('fetchLoan', () => {
		const result = { values: [], totalCount: 0 };
		const dataObj = { data: { fundraisingLoans: result } };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
		const loanQueryFilters = { any: ['US'] };
		const apolloVariables = {
			query: flssLoanQuery,
			variables: {
				filterObject: loanQueryFilters,
				limit: 20
			},
			fetchPolicy: 'network-only',
		};

		it('should pass the correct query variables to apollo', async () => {
			await fetchLoan(apollo, loanQueryFilters);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the fundraising loans data', async () => {
			const data = await fetchLoan(apollo, loanQueryFilters, apollo);
			expect(data).toBe(result);
		});
	});
});
