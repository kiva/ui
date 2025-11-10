import sortOptions, { visibleFLSSSortOptions, formatSortOptions } from '#src/util/loanSearch/filters/sortOptions';
import { STANDARD_QUERY_TYPE, FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('sortOptions.js', () => {
	describe('sortOptions', () => {
		describe('getOptions', () => {
			it('should return formatted sort options', () => {
				const allFacets = {
					standardSorts: [{ name: 'popularity' }],
					flssSorts: [{ name: 'expiringSoon' }, { name: 'personalized' }]
				};

				const result = sortOptions.getOptions(allFacets, {}, false);

				expect(result.length).toBeGreaterThan(0);
				expect(result.findIndex(s => s.name === 'personalized')).toBe(result.length - 1);
			});

			it('should handle empty facets', () => {
				const result = sortOptions.getOptions({}, {}, false);

				expect(result).toEqual([]);
			});
		});

		describe('getSavedSearch', () => {
			it('should return undefined', () => {
				const result = sortOptions.getSavedSearch();

				expect(result).toBeUndefined();
			});
		});

		describe('showSavedSearch', () => {
			it('should return false', () => {
				expect(sortOptions.showSavedSearch()).toBe(false);
			});
		});

		describe('getFilterChips', () => {
			it('should return empty array', () => {
				expect(sortOptions.getFilterChips()).toEqual([]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should return empty object', () => {
				expect(sortOptions.getRemovedFacet()).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should return empty object', () => {
				expect(sortOptions.getFlssFilter()).toEqual({});
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = sortOptions.getValidatedSearchState({}, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sortBy: null });
			});

			it('should handle empty', () => {
				const result = sortOptions.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sortBy: null });
			});

			it('should validate FLSS sortBy', () => {
				const state = { sortBy: 'asd' };

				const result = sortOptions.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sortBy: null });
			});

			it('should validate standard sortBy', () => {
				const state = { sortBy: 'asd' };

				const result = sortOptions.getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

				expect(result).toEqual({ sortBy: null });
			});

			it('should return valid FLSS sortBy when found in allFacets', () => {
				const state = { sortBy: 'expiringSoon' };
				const allFacets = { flssSorts: [{ name: 'expiringSoon' }, { name: 'popularityScore' }] };

				const result = sortOptions.getValidatedSearchState(state, allFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sortBy: 'expiringSoon' });
			});

			it('should return valid standard sortBy when found in allFacets', () => {
				const state = { sortBy: 'popularity' };
				const allFacets = { standardSorts: [{ name: 'popularity' }, { name: 'newest' }] };

				const result = sortOptions.getValidatedSearchState(state, allFacets, STANDARD_QUERY_TYPE);

				expect(result).toEqual({ sortBy: 'popularity' });
			});
		});

		describe('getFilterFromQuery', () => {
			it('should map lend to FLSS sort', () => {
				const query = { sortBy: 'popularity' };

				const result = sortOptions.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ sortBy: 'popularityScore' });
			});

			it('should support standard sort', () => {
				const query = { sortBy: 'popularity' };

				const result = sortOptions.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					STANDARD_QUERY_TYPE
				);

				expect(result).toEqual({ sortBy: 'popularity' });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push mapped FLSS sort value', () => {
				const state = { sortBy: 'popularityScore' };

				const result = sortOptions.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sortBy: 'popularity' });
			});

			it('should push standard sort value', () => {
				const state = { sortBy: 'personalized' };

				const result = sortOptions.getQueryFromFilter(state, STANDARD_QUERY_TYPE);

				expect(result).toEqual({ sortBy: 'personalized' });
			});

			it('should return empty object when sortBy is null', () => {
				const state = { sortBy: null };

				const result = sortOptions.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});

			it('should return empty object when FLSS sort is not found in map', () => {
				const state = { sortBy: 'unknownSort' };

				const result = sortOptions.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});
	});

	describe('formatSortOptions', () => {
		const mockStandardSorts = [{ name: 'a' }, { name: 'b' }];
		const mockFLSSSorts = visibleFLSSSortOptions.map(f => ({ name: f, sortSrc: FLSS_QUERY_TYPE }));

		it('should handle empty', () => {
			expect(formatSortOptions()).toEqual([]);
			expect(formatSortOptions([])).toEqual([]);
			expect(formatSortOptions([], [])).toEqual([]);
		});

		it('should format', () => {
			expect(formatSortOptions(mockStandardSorts, mockFLSSSorts)).toEqual([
				{ name: 'a', sortSrc: STANDARD_QUERY_TYPE },
				{ name: 'b', sortSrc: STANDARD_QUERY_TYPE },
				...mockFLSSSorts
			]);
		});

		it('should exclude non-visible sort options', () => {
			expect(formatSortOptions(mockStandardSorts, [
				...mockFLSSSorts,
				{ name: 'researchScore' }
			]))
				.toEqual([
					{ name: 'a', sortSrc: STANDARD_QUERY_TYPE },
					{ name: 'b', sortSrc: STANDARD_QUERY_TYPE },
					...mockFLSSSorts
				]);
		});

		it('should place personalized at the end of the returned list', () => {
			// Put personalized at the beginning to ensure it gets moved to the end
			const originalMockSorts = [...mockFLSSSorts];
			const sorts = [
				...originalMockSorts.splice(originalMockSorts.findIndex(s => s.name === 'personalized'), 1),
				...originalMockSorts
			];

			const result = formatSortOptions(mockStandardSorts, sorts);

			expect(sorts.findIndex(s => s.name === 'personalized')).not.toBe(sorts.length - 1);
			expect(result.findIndex(s => s.name === 'personalized')).toBe(result.length - 1);
		});

		it('should include extended FLSS sort options when extendFlssFilters is true', () => {
			const allFLSSSorts = [
				{ name: 'expiringSoon' },
				{ name: 'amountHighToLow' },
				{ name: 'amountLowToHigh' },
				{ name: 'personalized' },
				{ name: 'amountLeft' },
				{ name: 'popularityScore' },
				{ name: 'repaymentTerm' },
				{ name: 'mostRecent' },
			];

			const result = formatSortOptions([], allFLSSSorts, true);

			// Should include all the extended options
			expect(result.length).toBe(8);
			expect(result.findIndex(s => s.name === 'amountLeft')).toBeGreaterThan(-1);
			expect(result.findIndex(s => s.name === 'popularityScore')).toBeGreaterThan(-1);
			expect(result.findIndex(s => s.name === 'repaymentTerm')).toBeGreaterThan(-1);
		});

		it('should not include research score even with extendFlssFilters', () => {
			const allFLSSSorts = [
				{ name: 'expiringSoon' },
				{ name: 'researchScore' }, // Should be filtered out
				{ name: 'personalized' },
			];

			const result = formatSortOptions([], allFLSSSorts, true);

			expect(result.findIndex(s => s.name === 'researchScore')).toBe(-1);
		});
	});
});
