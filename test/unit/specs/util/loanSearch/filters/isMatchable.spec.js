import isMatchable from '#src/util/loanSearch/filters/isMatchable';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('isMatchable.js', () => {
	describe('isMatchable', () => {
		describe('getOptions', () => {
			it('should return matchable options', () => {
				const result = isMatchable.getOptions(mockAllFacets);

				expect(result).toEqual(expect.any(Array));
			});
		});

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

			it('should handle non-boolean isMatchable', () => {
				const state = { isMatchable: null };

				const result = isMatchable.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getSavedSearch', () => {
			it('should return isMatched as true when isMatchable is true', () => {
				const state = { isMatchable: true };

				const result = isMatchable.getSavedSearch(state);

				expect(result).toEqual({ isMatched: true });
			});

			it('should return isMatched as null when isMatchable is null', () => {
				const state = { isMatchable: null };

				const result = isMatchable.getSavedSearch(state);

				expect(result).toEqual({ isMatched: null });
			});

			it('should return isMatched as false when isMatchable is false', () => {
				const state = { isMatchable: false };

				const result = isMatchable.getSavedSearch(state);

				expect(result).toEqual({ isMatched: false });
			});
		});

		describe('getFlssFilter edge cases', () => {
			it('should handle undefined isMatchable', () => {
				expect(isMatchable.getFlssFilter({ isMatchable: undefined })).toEqual({});
			});

			it('should return filters for false value', () => {
				expect(isMatchable.getFlssFilter({ isMatchable: false }))
					.toEqual({ isMatchable: { eq: false } });
			});
		});

		describe('getQueryFromFilter edge cases', () => {
			it('should return empty object when isMatchable is undefined', () => {
				const state = {};

				const result = isMatchable.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});

			it('should handle isMatchable false', () => {
				const state = { isMatchable: false };

				const result = isMatchable.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ matchedOnly: 'false' });
			});
		});
	});
});
