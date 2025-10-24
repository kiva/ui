import pageOffset from '#src/util/loanSearch/filters/pageOffset';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { getDefaultLoanSearchState } from '#src/api/localResolvers/loanSearch';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('pageOffset.js', () => {
	describe('pageOffset', () => {
		describe('getOptions', () => {
			it('should return empty array', () => {
				const result = pageOffset.getOptions(mockAllFacets);

				expect(result).toEqual([]);
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = pageOffset.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: getDefaultLoanSearchState().pageOffset });
			});

			it('should validate pageOffset', () => {
				const state = { pageOffset: 'asd' };

				const result = pageOffset.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 0 });
			});

			it('should return valid pageOffset when number provided', () => {
				const state = { pageOffset: 10 };

				const result = pageOffset.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 10 });
			});
		});

		describe('getFilterFromQuery', () => {
			it('should support page', () => {
				const query = { page: '4' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 15 });
			});

			it('should handle negative page', () => {
				const query = { page: '-1' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 0 });
			});

			it('should handle decimal page', () => {
				const query = { page: '2.5' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 5 });
			});

			it('should handle non-number page', () => {
				const query = { page: 'asd' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 0 });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push page', () => {
				const state = { pageOffset: 10, pageLimit: 2 };

				const result = pageOffset.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ page: '6' });
			});

			it('should remove page if first page', () => {
				const state = { pageOffset: 0, pageLimit: 2 };

				const result = pageOffset.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should return empty object', () => {
				expect(pageOffset.getFlssFilter({})).toEqual({});
			});
		});

		describe('getFilterChips', () => {
			it('should return empty array', () => {
				expect(pageOffset.getFilterChips({})).toEqual([]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should return empty object', () => {
				expect(pageOffset.getRemovedFacet({})).toEqual({});
			});
		});

		describe('showSavedSearch', () => {
			it('should return false', () => {
				expect(pageOffset.showSavedSearch()).toBe(false);
			});
		});

		describe('getSavedSearch', () => {
			it('should return empty object', () => {
				expect(pageOffset.getSavedSearch()).toEqual({});
			});
		});

		describe('getFilterFromQuery edge cases', () => {
			it('should handle page of 0', () => {
				const query = { page: '0' };
				const pageLimit = 5;

				const result = pageOffset.getFilterFromQuery(query, mockAllFacets, pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 0 });
			});

			it('should handle page of 1 (first page)', () => {
				const query = { page: '1' };
				const pageLimit = 5;

				const result = pageOffset.getFilterFromQuery(query, mockAllFacets, pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 0 });
			});

			it('should handle undefined query.page', () => {
				const query = {};
				const pageLimit = 5;

				const result = pageOffset.getFilterFromQuery(query, mockAllFacets, pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 0 });
			});
		});

		describe('getQueryFromFilter edge cases', () => {
			it('should handle decimal pageOffset values', () => {
				const state = { pageOffset: 7.5, pageLimit: 5 };

				const result = pageOffset.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				// 7.5 / 5 = 1.5, +1 = 2.5
				expect(result).toEqual({ page: '2.5' });
			});
		});
	});
});
