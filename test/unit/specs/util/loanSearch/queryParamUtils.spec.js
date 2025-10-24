import { convertQueryToFilters, updateQueryParams, hasExcludedQueryParams } from '#src/util/loanSearch/queryParamUtils';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import filterConfig from '#src/util/loanSearch/filterConfig';
import { mockState, mockAllFacets } from '../../../fixtures/mockLoanSearchData';

vi.mock('#src/util/loanSearch/filterConfig', () => ({
	default: {
		config: {
			a: {
				getFilterFromQuery: vi.fn().mockReturnValue({ a: 'a' }),
				getQueryFromFilter: vi.fn().mockReturnValue({ a: 'a' }),
			},
			b: {
				getFilterFromQuery: vi.fn().mockReturnValue({ b: 'b' }),
				getQueryFromFilter: vi.fn().mockReturnValue({ b: 'b' }),
			},
		},
		keys: ['a', 'b'],
	}
}));

describe('queryParamUtils.js', () => {
	beforeEach(vi.clearAllMocks);

	describe('hasExcludedQueryParams', () => {
		it('should return true', () => {
			expect(hasExcludedQueryParams({ city_state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanTags: [] })).toBe(true);
			expect(hasExcludedQueryParams({ state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanLimit: [] })).toBe(true);
		});

		it('should return false', () => {
			expect(hasExcludedQueryParams({ test: [] })).toBe(false);
		});

		it('should handle empty query object', () => {
			expect(hasExcludedQueryParams({})).toBe(false);
		});

		it('should handle multiple excluded params', () => {
			expect(hasExcludedQueryParams({ city_state: [], loanTags: [], test: [] })).toBe(true);
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
			currentRoute: { value: { name: 'name', query } },
			push: vi.fn().mockReturnValue({ catch: vi.fn() }),
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
				query: {
					a: 'a',
					b: 'b',
					noScroll: true,
					noAnalytics: true
				},
			});
		});

		it('should preserve UTM params', () => {
			const router = getRouter({ utm_test: 'test' });

			updateQueryParams({}, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: {
					a: 'a',
					b: 'b',
					utm_test: 'test',
					noScroll: true,
					noAnalytics: true
				},
			});
		});

		it('should preserve team params', () => {
			const router = getRouter({ team: 'test' });

			updateQueryParams({}, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: {
					a: 'a',
					b: 'b',
					team: 'test',
					noScroll: true,
					noAnalytics: true
				},
			});
		});

		it('should not push identical query string', () => {
			const router = getRouter({ a: 'a', b: 'b' });

			updateQueryParams({ a: 'a', b: 'b' }, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledTimes(0);
		});

		it('should catch and ignore cancelled navigation errors', async () => {
			const cancelledError = {
				type: 8 // NavigationFailureType.cancelled
			};
			const router = {
				currentRoute: { value: { name: 'name', query: {} } },
				push: vi.fn().mockReturnValue(Promise.reject(cancelledError)),
			};

			// Call the function and wait for promise to settle
			updateQueryParams({}, router, FLSS_QUERY_TYPE);

			// Wait for microtasks to complete
			await new Promise(resolve => {
				setTimeout(() => resolve(), 0);
			});

			// Should not throw - the error was caught
			expect(router.push).toHaveBeenCalled();
		});
	});
});
