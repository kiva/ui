import genders, {
	transformGenderOptions,
	MALE_KEY,
	FEMALE_KEY,
	NON_BINARY_KEY,
	genderDisplayMap
} from '#src/util/loanSearch/filters/genders';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('genders.js', () => {
	describe('genders', () => {
		describe('getOptions', () => {
			it('should return transformed gender options', () => {
				const result = genders.getOptions(mockAllFacets);

				expect(result).toEqual(expect.any(Array));
				expect(result.length).toBeGreaterThan(0);
			});

			it('should handle empty facets', () => {
				const result = genders.getOptions({});

				expect(result).toEqual([]);
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(genders.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = genders.getFilterChips({ gender: 'female' }, mockAllFacets);

				const expected = [{ name: 'Women', __typename: 'Gender' }];

				expect(result).toEqual(expected);
			});

			it('should filter out gender not found in facets', () => {
				const result = genders.getFilterChips({ gender: 'unknown' }, mockAllFacets);

				expect(result).toEqual([]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(genders.getRemovedFacet()).toEqual({ gender: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = genders.getValidatedSearchState({}, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: null });
			});

			it('should handle empty', () => {
				const result = genders.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: null });
			});

			it('should validate gender', () => {
				const state = { gender: 'asd' };

				const result = genders.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: null });
			});

			it('should return valid gender in lowercase', () => {
				const state = { gender: 'female' };

				const result = genders.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: 'female' });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should handle undefined facets', () => {
				const query = { gender: 'female' };

				const result = genders.getFilterFromQuery(
					query,
					undefined,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ gender: null });
			});

			it('it should get filter', () => {
				const query = { gender: 'female' };

				const result = genders.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ gender: 'female' });
			});

			it('should handle different gender casing', () => {
				const query = { gender: 'FEMALE' };

				const result = genders.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: 'female' });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push gender', () => {
				const state = { gender: 'female' };

				const result = genders.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: 'female' });
			});
		});

		describe('getSavedSearch', () => {
			it('should return gender from state', () => {
				const state = { gender: 'female' };

				const result = genders.getSavedSearch(state);

				expect(result).toEqual({ gender: 'female' });
			});
		});

		describe('showSavedSearch', () => {
			it('should return true when gender is set', () => {
				const result = genders.showSavedSearch({ gender: 'female' });
				expect(result).toBe(true);
			});

			it('should return false when gender is null', () => {
				const result = genders.showSavedSearch({ gender: null });
				// Line 46: !!null -> false
				expect(result).toBe(false);
			});

			it('should return false when gender is undefined', () => {
				const result = genders.showSavedSearch({});
				// Line 46: !!undefined -> false
				expect(result).toBe(false);
			});

			it('should return false when gender is empty string', () => {
				const result = genders.showSavedSearch({ gender: '' });
				// Line 46: !!'' -> false (covers the uncovered branch)
				expect(result).toBe(false);
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(genders.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(genders.getFlssFilter({ gender: '' })).toEqual({});
			});

			it('should return filters', () => {
				expect(genders.getFlssFilter({ gender: 'female' })).toEqual({ gender: { any: 'female' } });
			});

			it('should handle null gender', () => {
				expect(genders.getFlssFilter({ gender: null })).toEqual({});
			});

			it('should handle undefined gender', () => {
				expect(genders.getFlssFilter({ gender: undefined })).toEqual({});
			});
		});

		describe('getQueryFromFilter edge cases', () => {
			it('should return empty object when gender is null', () => {
				const state = { gender: null };

				const result = genders.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});

			it('should return empty object when gender is undefined', () => {
				const state = {};

				const result = genders.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});
	});

	describe('transformGenderOptions', () => {
		it('should handle undefined', () => {
			expect(transformGenderOptions(undefined)).toEqual([]);
		});

		it('should handle empty', () => {
			expect(transformGenderOptions([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const options = [{ name: MALE_KEY }, { name: FEMALE_KEY }, { name: NON_BINARY_KEY }];

			const result = transformGenderOptions(options);

			expect(result).toEqual([
				{ name: FEMALE_KEY, title: genderDisplayMap[FEMALE_KEY], value: FEMALE_KEY },
				{ name: MALE_KEY, title: genderDisplayMap[MALE_KEY], value: MALE_KEY },
				{ name: NON_BINARY_KEY, title: genderDisplayMap[NON_BINARY_KEY], value: NON_BINARY_KEY },
			]);
		});
	});
});
