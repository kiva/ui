import keywordSearch from '@/util/loanSearch/filters/keywordSearch';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('keywordSearch.js', () => {
	describe('keywordSearch', () => {
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
	});
});
