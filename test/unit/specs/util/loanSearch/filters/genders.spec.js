import genders, {
	transformGenderOptions,
	MALE_KEY,
	FEMALE_KEY,
	NON_BINARY_KEY,
	genderDisplayMap
} from '@/util/loanSearch/filters/genders';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('genders.js', () => {
	describe('genders', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(genders.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = genders.getFilterChips({ gender: 'female' }, mockAllFacets);

				const expected = [{ name: 'Women', __typename: 'Gender' }];

				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(genders.getRemovedFacet()).toEqual({ gender: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = genders.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: null });
			});

			it('should validate gender', () => {
				const state = { gender: 'asd' };

				const result = genders.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ gender: null });
			});
		});

		describe('getFilterFromQuery', () => {
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
		});
	});

	describe('transformGenderOptions', () => {
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
