import {
	fetchFacets,
	fetchLoans,
	fetchCategories,
	getFlssFilters,
	getLoanChannelVariables,
	fetchLoanChannel,
	getCachedLoanChannel,
	watchLoanChannel,
	fetchRecommendedLoans,
} from '../../../../src/util/flssUtils';
import flssLoanQuery from '../../../../src/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '../../../../src/graphql/query/flssLoanFacetsQuery.graphql';
import flssLoanChannelQuery from '../../../../src/graphql/query/flssLoanChannel.graphql';
import categoryListFlssQuery from '../../../../src/graphql/query/loanFinding/categoryListFlss.graphql';
import filterConfig from '../../../../src/util/loanSearch/filterConfig';
import loanRecommendationsQuery from '../../../../src/graphql/query/loanRecommendationsQuery.graphql';

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

	describe('fetchCategories', () => {
		const result = {};
		const dataObj = { data: result };
		const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
		const apolloVariables = { query: categoryListFlssQuery, fetchPolicy: 'network-only' };

		it('should pass the correct query variables to apollo', async () => {
			await fetchCategories(apollo);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the categories data', async () => {
			const data = await fetchCategories(apollo);
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

	describe('getLoanChannelVariables', () => {
		it('should return variables', () => {
			const queryMap = { sector: [1, 2, 3], sortBy: 'expiringSoon' };
			const loanQueryVars = {
				ids: [3],
				offset: 10,
				limit: 5,
				basketId: 'asd'
			};

			const result = getLoanChannelVariables(queryMap, loanQueryVars);

			expect(result.ids).toEqual(loanQueryVars.ids);
			expect(result.filterObject).toEqual(getFlssFilters(queryMap));
			expect(result.sortBy).toEqual(queryMap.sortBy);
			expect(result.pageNumber).toBe(loanQueryVars.offset / loanQueryVars.limit);
			expect(result.pageLimit).toBe(loanQueryVars.limit);
			expect(result.basketId).toBe(loanQueryVars.basketId);
		});

		it('should use loanQueryVars as override', () => {
			const queryMap = { sector: [1, 2, 3], sortBy: 'expiringSoon' };
			const loanQueryVars = {
				ids: [3],
				offset: 10,
				limit: 5,
				basketId: 'asd',
				sector: [1],
				sortBy: 'personalized'
			};

			const result = getLoanChannelVariables(queryMap, loanQueryVars);

			expect(result.ids).toEqual(loanQueryVars.ids);
			expect(result.filterObject).toEqual(getFlssFilters(queryMap, loanQueryVars));
			expect(result.sortBy).toEqual(loanQueryVars.sortBy);
			expect(result.pageNumber).toBe(loanQueryVars.offset / loanQueryVars.limit);
			expect(result.pageLimit).toBe(loanQueryVars.limit);
			expect(result.basketId).toBe(loanQueryVars.basketId);
		});

		it('should use correct sortBy fallback', () => {
			const queryMap = { sector: [1, 2, 3], sortBy: 'expiringSoon' };
			const loanQueryVars = {
				ids: [3],
				offset: 10,
				limit: 5,
				basketId: 'asd',
				sector: [1],
				sortBy: null
			};

			const result = getLoanChannelVariables(queryMap, loanQueryVars);

			expect(result.ids).toEqual(loanQueryVars.ids);
			expect(result.filterObject).toEqual(getFlssFilters(queryMap, loanQueryVars));
			expect(result.sortBy).toEqual(queryMap.sortBy);
			expect(result.pageNumber).toBe(loanQueryVars.offset / loanQueryVars.limit);
			expect(result.pageLimit).toBe(loanQueryVars.limit);
			expect(result.basketId).toBe(loanQueryVars.basketId);
		});
	});

	describe('fetchLoanChannel', () => {
		const result = {};
		const dataObj = { data: result };
		const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
		const queryMap = { sector: [1, 2, 3] };
		const loanQueryVars = {
			ids: [3],
			offset: 10,
			limit: 5,
			basketId: 'asd'
		};
		const variables = getLoanChannelVariables(queryMap, loanQueryVars);
		const apolloVariables = { query: flssLoanChannelQuery, variables };

		it('should pass the correct query variables to apollo', async () => {
			await fetchLoanChannel(apollo, queryMap, loanQueryVars);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the expected data', async () => {
			const data = await fetchLoanChannel(apollo, queryMap, loanQueryVars);
			expect(data).toBe(result);
		});
	});

	describe('getCachedLoanChannel', () => {
		const result = {};
		const apollo = { readQuery: vi.fn(() => result) };
		const queryMap = { sector: [1, 2, 3] };
		const loanQueryVars = {
			ids: [3],
			offset: 10,
			limit: 5,
			basketId: 'asd'
		};
		const variables = getLoanChannelVariables(queryMap, loanQueryVars);
		const apolloVariables = { query: flssLoanChannelQuery, variables };

		it('should pass the correct query variables to apollo', () => {
			getCachedLoanChannel(apollo, queryMap, loanQueryVars);
			expect(apollo.readQuery).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the expected data', () => {
			const data = getCachedLoanChannel(apollo, queryMap, loanQueryVars);
			expect(data).toBe(result);
		});
	});

	describe('watchLoanChannel', () => {
		const result = {};
		const apollo = { watchQuery: vi.fn(() => result) };
		const queryMap = { sector: [1, 2, 3] };
		const loanQueryVars = {
			ids: [3],
			offset: 10,
			limit: 5,
			basketId: 'asd'
		};
		const variables = getLoanChannelVariables(queryMap, loanQueryVars);
		const apolloVariables = { query: flssLoanChannelQuery, variables };

		it('should pass the correct query variables to apollo', () => {
			watchLoanChannel(apollo, queryMap, loanQueryVars);
			expect(apollo.watchQuery).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the expected observer', () => {
			const observer = watchLoanChannel(apollo, queryMap, loanQueryVars);
			expect(observer).toBe(result);
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

		it('fetchCategories should handle apollo query errors', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Query failed')) };
			const data = await fetchCategories(apolloWithError);
			expect(data).toBeUndefined();
		});

		it('fetchLoans should handle apollo query errors', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Query failed')) };
			const data = await fetchLoans(apolloWithError, {});
			expect(data).toBeUndefined();
		});

		it('fetchLoanChannel should handle apollo query errors', async () => {
			const apolloWithError = { query: vi.fn().mockRejectedValue(new Error('Query failed')) };
			const data = await fetchLoanChannel(apolloWithError, {}, {
				ids: [], offset: 0, limit: 5
			});
			expect(data).toBeUndefined();
		});

		it('getCachedLoanChannel should handle readQuery errors', () => {
			const apolloWithError = {
				readQuery: vi.fn().mockImplementation(() => {
					throw new Error('Cache miss');
				})
			};
			const data = getCachedLoanChannel(apolloWithError, {}, {
				ids: [], offset: 0, limit: 5
			});
			expect(data).toBeUndefined();
		});

		it('watchLoanChannel should handle watchQuery errors', () => {
			const apolloWithError = {
				watchQuery: vi.fn().mockImplementation(() => {
					throw new Error('Watch failed');
				})
			};
			const data = watchLoanChannel(apolloWithError, {}, {
				ids: [], offset: 0, limit: 5
			});
			expect(data).toBeUndefined();
		});
	});

	describe('getLoanChannelVariables edge cases', () => {
		it('should handle missing origin and use default', () => {
			const queryMap = { sector: [1] };
			const loanQueryVars = {
				ids: [],
				offset: 0,
				limit: 5,
				basketId: 'test'
			};

			const vars = getLoanChannelVariables(queryMap, loanQueryVars);

			expect(vars.origin).toBe('web:no-context');
		});

		it('should use provided origin from loanQueryVars', () => {
			const queryMap = { sector: [1] };
			const loanQueryVars = {
				ids: [],
				offset: 0,
				limit: 5,
				basketId: 'test',
				origin: 'web:custom-context'
			};

			const vars = getLoanChannelVariables(queryMap, loanQueryVars);

			expect(vars.origin).toBe('web:custom-context');
		});
	});
});
