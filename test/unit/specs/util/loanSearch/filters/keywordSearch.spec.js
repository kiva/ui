import keywordSearch from '../../../../../../src/util/loanSearch/filters/keywordSearch';
import { FLSS_QUERY_TYPE } from '../../../../../../src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('keywordSearch.js', () => {
	describe('keywordSearch', () => {
		describe('getOptions', () => {
			it('should return empty array', () => {
				const result = keywordSearch.getOptions(mockAllFacets);

				expect(result).toEqual([]);
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(keywordSearch.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = keywordSearch.getFilterChips({ keywordSearch: 'search' }, mockAllFacets);

				expect(result).toEqual([{ name: 'search', __typename: 'KeywordSearch' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(keywordSearch.getRemovedFacet()).toEqual({ keywordSearch: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = keywordSearch.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ keywordSearch: null });
			});

			it('should validate keyword search and trim', () => {
				const state = { keywordSearch: 'test ' };

				const result = keywordSearch.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ keywordSearch: 'test' });
			});

			it('should validate keyword search empty string', () => {
				const state = { keywordSearch: ' ' };

				const result = keywordSearch.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ keywordSearch: null });
			});

			it('should validate keyword search undefined', () => {
				const state = { keywordSearch: undefined };

				const result = keywordSearch.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ keywordSearch: null });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { queryString: 'search' };

				const result = keywordSearch.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ keywordSearch: 'search' });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push queryString', () => {
				const state = { keywordSearch: 'search' };

				const result = keywordSearch.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ queryString: 'search' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(keywordSearch.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(keywordSearch.getFlssFilter({ keywordSearch: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(keywordSearch.getFlssFilter({ keywordSearch: 'search' }))
					.toEqual({ description: { eq: 'search' } });
			});
		});

		describe('showSavedSearch', () => {
			it('should return false when keywordSearch is empty', () => {
				expect(keywordSearch.showSavedSearch({})).toBe(false);
				expect(keywordSearch.showSavedSearch({ keywordSearch: null })).toBe(false);
			});

			it('should return true when keywordSearch has value', () => {
				expect(keywordSearch.showSavedSearch({ keywordSearch: 'test' })).toBe(true);
			});
		});

		describe('getSavedSearch', () => {
			it('should return undefined when keywordSearch is null', () => {
				const state = { keywordSearch: null };

				const result = keywordSearch.getSavedSearch(state);

				expect(result).toBeUndefined();
			});

			it('should return undefined for any keywordSearch value', () => {
				const state = { keywordSearch: 'agriculture' };

				const result = keywordSearch.getSavedSearch(state);

				expect(result).toBeUndefined();
			});
		});

		describe('getFlssFilter edge cases', () => {
			it('should pass keyword as-is to FLSS filter (not trimmed)', () => {
				expect(keywordSearch.getFlssFilter({ keywordSearch: '  test  ' }))
					.toEqual({ description: { eq: '  test  ' } });
			});

			it('should handle empty string', () => {
				expect(keywordSearch.getFlssFilter({ keywordSearch: '' })).toEqual({});
			});
		});

		describe('getQueryFromFilter edge cases', () => {
			it('should return empty object when keywordSearch is null', () => {
				const state = { keywordSearch: null };

				const result = keywordSearch.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});

			it('should pass keyword as-is to query (not trimmed)', () => {
				const state = { keywordSearch: '  farming  ' };

				const result = keywordSearch.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ queryString: '  farming  ' });
			});
		});
	});
});
