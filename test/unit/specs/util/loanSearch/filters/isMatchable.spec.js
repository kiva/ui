import isMatchable from '@/util/loanSearch/filters/isMatchable';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('isMatchable.js', () => {
	describe('isMatchable', () => {
		describe('showSavedSearch', () => {
			it('should get whether to undefined', () => {
				expect(isMatchable.showSavedSearch({})).toBe(false);
				expect(isMatchable.showSavedSearch({ isMatchable: null })).toBe(false);
			});

			it('should get whether to show saved search', () => {
				expect(isMatchable.showSavedSearch({ isMatchable: true })).toBe(true);
				expect(isMatchable.showSavedSearch({ isMatchable: false })).toBe(true);
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(isMatchable.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should handle null', () => {
				expect(isMatchable.getFilterChips({ isMatchable: null }, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = isMatchable.getFilterChips({ isMatchable: true }, mockAllFacets);

				expect(result).toEqual([{ name: 'Matched loans', __typename: 'isMatchable' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(isMatchable.getRemovedFacet()).toEqual({ isMatchable: null });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(isMatchable.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(isMatchable.getFlssFilter({ isMatchable: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(isMatchable.getFlssFilter({ isMatchable: true })).toEqual({ isMatchable: { eq: true } });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = isMatchable.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isMatchable: null });
			});

			it('should validate bad is matchable', () => {
				const state = { isMatchable: 'asd' };

				const result = isMatchable.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isMatchable: null });
			});

			it('should validate is matchable', () => {
				const state = { isMatchable: true };

				const result = isMatchable.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isMatchable: true });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { matchedOnly: 'true' };

				const result = isMatchable.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ isMatchable: true });
			});

			it('should handle different is query casing', () => {
				const query = { matchedOnly: 'TRUE' };

				const result = isMatchable.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ isMatchable: true });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push is matchable', () => {
				const state = { isMatchable: true };

				const result = isMatchable.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ matchedOnly: 'true' });
			});
		});
	});
});
