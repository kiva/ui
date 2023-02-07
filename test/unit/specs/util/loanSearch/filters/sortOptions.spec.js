import sortOptions, { visibleFLSSSortOptions, formatSortOptions } from '@/util/loanSearch/filters/sortOptions';
import { STANDARD_QUERY_TYPE, FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('sortOptions.js', () => {
	describe('sortOptions', () => {
		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
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
	});
});
