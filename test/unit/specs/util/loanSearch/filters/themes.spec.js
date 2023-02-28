import themes, { transformThemes } from '@/util/loanSearch/filters/themes';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('themes.js', () => {
	describe('themes', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(themes.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = themes.getFilterChips({ themeId: [1] }, mockAllFacets);

				const expected = [{ id: 1, name: 'Theme 1', __typename: 'LoanThemeFilter' }];

				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(themes.getRemovedFacet({ themeId: [1] }, { id: 1 })).toEqual({ themeId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = themes.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [] });
			});

			it('should validate theme', () => {
				const state = { themeId: ['asd'] };

				const result = themes.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should handle undefined facets', () => {
				const query = { attributes: '1' };

				const result = themes.getFilterFromQuery(query, undefined, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [1] });
			});

			it('it should get filter', () => {
				const query = { attributes: '1' };

				const result = themes.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [1] });
			});

			it('it should get filter from attribute query param', () => {
				const query = { attribute: '1' };

				const result = themes.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [1] });
			});

			it('it should get filter from attribute theme param', () => {
				const query = { attribute: '1' };

				const result = themes.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [1] });
			});

			it('should handle Algolia attributes param', () => {
				const query = { attributes: 'theme 1' };

				const result = themes.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ themeId: [1] });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push theme IDs', () => {
				const state = { themeId: [1, 2] };

				const result = themes.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ attribute: '1,2' });
			});

			it('should not push empty theme ID', () => {
				const state = { themeId: [] };

				const result = themes.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(themes.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(themes.getFlssFilter({ themeId: [] })).toEqual({});
			});

			it('should return filters', () => {
				expect(themes.getFlssFilter({ themeId: [1] })).toEqual({ themeId: { any: [1] } });
			});
		});
	});

	describe('transformThemes', () => {
		it('should handle empty', () => {
			expect(transformThemes([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockThemes = [{ id: 6, name: 'b' }, { id: 8, name: 'c' }, { id: 2, name: 'a' }];

			const mockFilteredThemes = [{ key: 'a', value: 10 }, { key: 'b', value: 30 }, { key: 'c', value: 20 }];

			const expected = [
				{ id: 2, name: 'a', numLoansFundraising: 10 },
				{ id: 6, name: 'b', numLoansFundraising: 30 },
				{ id: 8, name: 'c', numLoansFundraising: 20 }
			];

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should filter transform themes case insensitive', () => {
			const mockThemes = [{ id: 8, name: 'c' }, { id: 2, name: 'a' }];

			const mockFilteredThemes = [{ key: 'A', value: 10 }, { key: 'C', value: 20 }];

			const expected = [
				{ id: 2, name: 'a', numLoansFundraising: 10 },
				{ id: 8, name: 'c', numLoansFundraising: 20 }
			];

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should always show certain themes if provided by lend API', () => {
			const mockThemes = [{ id: 6, name: 'b' }, { id: 8, name: 'c' }, { id: 2, name: 'a' }];

			const mockFilteredThemes = [{ key: 'A', value: 10 }, { key: 'C', value: 20 }];

			const expected = [
				{ id: 2, name: 'a', numLoansFundraising: 10 },
				{ id: 6, name: 'b', numLoansFundraising: 0 },
				{ id: 8, name: 'c', numLoansFundraising: 20 }
			];
			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});
	});
});
