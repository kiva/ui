import {
	fetchFacets,
	fetchLoans,
	getFlssFilters,
	getLoanChannelVariables,
	fetchLoanChannel,
	getCachedLoanChannel,
	watchLoanChannel,
} from '@/util/flssUtils';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';
import flssLoanFacetsQuery from '@/graphql/query/flssLoanFacetsQuery.graphql';
import flssLoanChannelQuery from '@/graphql/query/flssLoanChannel.graphql';

describe('flssUtils.js', () => {
	describe('getFlssFilters', () => {
		it('should handle missing', () => {
			expect(getFlssFilters({})).toEqual({});
		});

		it('should handle empty', () => {
			const state = {
				gender: '',
				countryIsoCode: [],
				themeId: [],
				tagId: [],
				sectorId: [],
				distributionModel: null,
				isIndividual: null,
				description: null,
			};

			expect(getFlssFilters(state)).toEqual({});
		});

		it('should return filters', () => {
			const state = {
				gender: 'female',
				countryIsoCode: ['US'],
				themeId: [1],
				tagId: [1],
				sectorId: [1],
				distributionModel: 'DIRECT',
				isIndividual: false,
				lenderRepaymentTerm: { min: 0, max: 8, __typename: 'MinMaxRange' },
				description: 'desc',
			};

			expect(getFlssFilters(state)).toEqual({
				gender: { any: 'female' },
				countryIsoCode: { any: ['US'] },
				themeId: { any: [1] },
				tagId: { any: [1] },
				sectorId: { any: [1] },
				distributionModel: { eq: 'DIRECT' },
				isIndividual: { eq: false },
				lenderRepaymentTerm: { range: { gte: 0, lte: 8 } },
				description: { eq: 'desc' },
			});
		});
	});

	describe('fetchFacets', () => {
		const result = {};
		const dataObj = { data: result };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
		const filters = { gender: { any: ['FEMALE'] } };
		const variables = {
			isoCodeFilters: filters,
			themeFilters: filters,
			sectorFilters: filters,
			origin: 'web:test-context'
		};
		const apolloVariables = { query: flssLoanFacetsQuery, variables, fetchPolicy: 'network-only' };

		it('should pass the correct query variables to apollo', async () => {
			await fetchFacets(apollo, 'web:test-context', filters, filters, filters);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the fundraising facets data', async () => {
			const data = await fetchFacets(apollo, 'web:test-context', filters, filters, filters);
			expect(data).toBe(result);
		});
	});

	describe('fetchLoans', () => {
		const result = { values: [], totalCount: 0 };
		const dataObj = { data: { fundraisingLoans: result } };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
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
	});

	describe('fetchLoanChannel', () => {
		const result = {};
		const dataObj = { data: result };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
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
		const apollo = { readQuery: jest.fn(() => result) };
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
		const apollo = { watchQuery: jest.fn(() => result) };
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
});
