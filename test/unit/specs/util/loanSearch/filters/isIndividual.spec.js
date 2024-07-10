import isIndividual, {
	transformIsIndividualOptions,
	getIsIndividualFromQueryParam,
	INDIVIDUAL_KEY,
	GROUP_KEY,
	isIndividualDisplayMap
} from '@/util/loanSearch/filters/isIndividual';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('isIndividual.js', () => {
	describe('isIndividual', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(isIndividual.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should handle null', () => {
				expect(isIndividual.getFilterChips({ isIndividual: null }, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = isIndividual.getFilterChips({ isIndividual: false }, mockAllFacets);

				expect(result).toEqual([{ name: 'Group', __typename: 'IsIndividual' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(isIndividual.getRemovedFacet()).toEqual({ isIndividual: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = isIndividual.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isIndividual: null });
			});

			it('should validate is individual', () => {
				const state = { isIndividual: 'asd' };

				const result = isIndividual.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isIndividual: null });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { isGroup: 'true' };

				const result = isIndividual.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ isIndividual: false });
			});

			it('should handle different is group casing', () => {
				const query = { isGroup: 'TRUE' };

				const result = isIndividual.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ isIndividual: false });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push is group', () => {
				const state = { isIndividual: false };

				const result = isIndividual.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ isGroup: 'true' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(isIndividual.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(isIndividual.getFlssFilter({ isIndividual: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(isIndividual.getFlssFilter({ isIndividual: false }))
					.toEqual({ isIndividual: { eq: false } });
			});
		});
	});

	describe('transformIsIndividualOptions', () => {
		it('should transform and sort', () => {
			const result = transformIsIndividualOptions();

			expect(result).toEqual([
				{ name: INDIVIDUAL_KEY, title: isIndividualDisplayMap[INDIVIDUAL_KEY], value: true },
				{ name: GROUP_KEY, title: isIndividualDisplayMap[GROUP_KEY], value: false },
			]);
		});
	});

	describe('getIsIndividualFromQueryParam', () => {
		it('should handle bad param', () => {
			expect(getIsIndividualFromQueryParam()).toBe(null);
			expect(getIsIndividualFromQueryParam('')).toBe(null);
			expect(getIsIndividualFromQueryParam('asd')).toBe(null);
		});

		it('should get is individual', () => {
			expect(getIsIndividualFromQueryParam('true')).toBe(false);
			expect(getIsIndividualFromQueryParam('false')).toBe(true);
		});
	});
});
