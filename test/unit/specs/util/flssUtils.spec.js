import {
	fetchFacets,
	fetchLoans,
	getFlssFilters,
	fetchRecommendedLoans,
} from '#src/util/flssUtils';
import flssLoanQuery from '#src/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '#src/graphql/query/flssLoanFacetsQuery.graphql';
import filterConfig from '#src/util/loanSearch/filterConfig';
import loanRecommendationsQuery from '#src/graphql/query/loanRecommendationsQuery.graphql';

vi.mock('#src/util/loanSearch/filterConfig', () => ({
	default: {
		config: {
			a: { getFlssFilter: vi.fn().mockReturnValue({ a: 'a' }) },
			b: { getFlssFilter: vi.fn().mockReturnValue({ b: 'b' }) },
		},
		keys: ['a', 'b'],
	}
}));

describe('flssUtils.js', () => {
	beforeEach(vi.clearAllMocks);

	describe('getFlssFilters', () => {
		it('should call filterConfig', () => {
			const result = getFlssFilters({ test: 'test' });

			expect(result).toEqual({ a: 'a', b: 'b' });
			expect(filterConfig.config.a.getFlssFilter).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.a.getFlssFilter).toHaveBeenCalledWith({ test: 'test' });
			expect(filterConfig.config.b.getFlssFilter).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.b.getFlssFilter).toHaveBeenCalledWith({ test: 'test' });
		});
	});

	describe('fetchFacets', () => {
		const result = {};
		const dataObj = { data: result };
		const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
		const filters = { gender: { any: ['FEMALE'] } };
		const variables = {
			isoCodeFilters: filters,
			themeFilters: filters,
			sectorFilters: filters,
			tagFilters: filters,
			origin: 'web:test-context'
		};
		const apolloVariables = { query: flssLoanFacetsQuery, variables, fetchPolicy: 'network-only' };

		it('should pass the correct query variables to apollo', async () => {
			await fetchFacets(apollo, 'web:test-context', filters, filters, filters, filters);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the fundraising facets data', async () => {
			const data = await fetchFacets(apollo, 'web:test-context', filters, filters, filters, filters);
			expect(data).toBe(result);
		});
	});

	describe('fetchLoans', () => {
		const result = { values: [], totalCount: 0 };
		const dataObj = { data: { fundraisingLoans: result } };
		const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
		const loanQueryFilters = { any: ['US'] };
		const sortBy = 'personalized';
		const pageOffset = 15;
		const pageLimit = 5;
		const apolloVariables = {
			query: flssLoanQuery,
			variables: {
				filterObject: loanQueryFilters,
				sortBy: 'personalized',
				pageNumber: 3,
				pageLimit,
				origin: 'web:no-context'
			},
			fetchPolicy: 'network-only',
		};

		it('should pass the correct query variables to apollo', async () => {
			await fetchLoans(apollo, loanQueryFilters, sortBy, pageOffset, pageLimit);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the fundraising loans data', async () => {
			const data = await fetchLoans(apollo, loanQueryFilters, sortBy, pageOffset, pageLimit);
			expect(data).toBe(result);
		});
	});

	describe('fetchRecommendedLoans', () => {
		const result = { values: [], totalCount: 0 };
		const dataObj = { data: { loanRecommendations: result } };
		const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
		const filters = { sector: ['Agriculture'] };
		const sortBy = 'personalized';
		const userId = 12345;
		const limit = 8;
		const apolloVariables = {
			query: loanRecommendationsQuery,
			variables: {
				filterObject: filters,
				sortBy,
				origin: 'web:no-context',
				userId,
				limit,
			},
			fetchPolicy: 'network-only',
		};

		beforeEach(() => {
			apollo.query.mockClear();
		});

		it('should pass the correct query variables to apollo', async () => {
			await fetchRecommendedLoans(apollo, 'web:no-context', filters, sortBy, userId, limit);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the loan recommendations data', async () => {
			const data = await fetchRecommendedLoans(apollo, 'web:no-context', filters, sortBy, userId, limit);
			expect(data).toBe(result);
		});

		it('should handle null/undefined optional parameters', async () => {
			await fetchRecommendedLoans(apollo);
			expect(apollo.query).toHaveBeenCalledWith({
				query: loanRecommendationsQuery,
				variables: {
					filterObject: null,
					sortBy: 'personalized',
					origin: 'web:no-context',
					userId: null,
					limit: null,
				},
				fetchPolicy: 'network-only',
			});
		});

		it('should handle apollo query errors gracefully', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Network error')) };
			const data = await fetchRecommendedLoans(apolloWithError);
			expect(data).toBeUndefined();
		});
	});

	describe('error handling', () => {
		it('fetchFacets should handle apollo query errors', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Query failed')) };
			const data = await fetchFacets(apolloWithError);
			expect(data).toBeUndefined();
		});

		it('fetchLoans should handle apollo query errors', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Query failed')) };
			const data = await fetchLoans(apolloWithError, {});
			expect(data).toBeUndefined();
		});
	});
});
