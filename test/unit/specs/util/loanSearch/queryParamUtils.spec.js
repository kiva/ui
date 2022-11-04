import { convertQueryToFilters, updateQueryParams, hasExcludedQueryParams } from '@/util/loanSearch/queryParamUtils';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import filterConfig from '@/util/loanSearch/filterConfig';
import { mockState, mockAllFacets } from '../../../fixtures/mockLoanSearchData';

jest.mock('@/util/loanSearch/filterConfig', () => {
	return {
		config: {
			a: {
				getFilterFromQuery: jest.fn().mockReturnValue({ a: 'a' }),
				getQueryFromFilter: jest.fn().mockReturnValue({ a: 'a' }),
			},
			b: {
				getFilterFromQuery: jest.fn().mockReturnValue({ b: 'b' }),
				getQueryFromFilter: jest.fn().mockReturnValue({ b: 'b' }),
			},
		},
		keys: ['a', 'b'],
	};
});

describe('queryParamUtils.js', () => {
	beforeEach(jest.clearAllMocks);

	describe('hasExcludedQueryParams', () => {
		it('should return true', () => {
			expect(hasExcludedQueryParams({ activity: [] })).toBe(true);
			expect(hasExcludedQueryParams({ city_state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanTags: [] })).toBe(true);
			expect(hasExcludedQueryParams({ state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanLimit: [] })).toBe(true);
		});

		it('should return false', () => {
			expect(hasExcludedQueryParams({ test: [] })).toBe(false);
		});
	});

	describe('convertQueryToFilters', () => {
		it('should call filterConfig', () => {
			const result = convertQueryToFilters({}, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit);

			expect(result).toEqual({ a: 'a', b: 'b' });
			expect(filterConfig.config.a.getFilterFromQuery).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.a.getFilterFromQuery)
				.toHaveBeenCalledWith({}, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);
			expect(filterConfig.config.b.getFilterFromQuery).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.b.getFilterFromQuery)
				.toHaveBeenCalledWith({}, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);
		});
	});

	describe('updateQueryParams', () => {
		const getRouter = (query = {}) => ({
			currentRoute: { name: 'name', query },
			push: jest.fn().mockReturnValue({ catch: jest.fn() }),
		});

		it('should call filterConfig', () => {
			const router = getRouter();

			updateQueryParams({}, router, FLSS_QUERY_TYPE);

			expect(filterConfig.config.a.getQueryFromFilter).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.a.getQueryFromFilter).toHaveBeenCalledWith({}, FLSS_QUERY_TYPE);
			expect(filterConfig.config.b.getQueryFromFilter).toHaveBeenCalledTimes(1);
			expect(filterConfig.config.b.getQueryFromFilter).toHaveBeenCalledWith({}, FLSS_QUERY_TYPE);
			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { a: 'a', b: 'b' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should preserve UTM params', () => {
			const router = getRouter({ utm_test: 'test' });

			updateQueryParams({}, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { a: 'a', b: 'b', utm_test: 'test' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push identical query string', () => {
			const router = getRouter({ a: 'a', b: 'b' });

			updateQueryParams({ a: 'a', b: 'b' }, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledTimes(0);
		});
	});
});
