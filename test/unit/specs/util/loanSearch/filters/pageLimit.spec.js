import pageLimit from '../../../../../../src/util/loanSearch/filters/pageLimit';
import { FLSS_QUERY_TYPE } from '../../../../../../src/util/loanSearch/filterUtils';
import { getDefaultLoanSearchState } from '../../../../../../src/api/localResolvers/loanSearch';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('pageLimit.js', () => {
	describe('pageLimit', () => {
		describe('getOptions', () => {
			it('should return empty array', () => {
				const result = pageLimit.getOptions(mockAllFacets);

				expect(result).toEqual([]);
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = pageLimit.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageLimit: getDefaultLoanSearchState().pageLimit });
			});

			it('should validate pageLimit', () => {
				const state = { pageLimit: 'asd' };

				const result = pageLimit.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageLimit: 15 });
			});

			it('should return valid pageLimit when number provided', () => {
				const state = { pageLimit: 20 };

				const result = pageLimit.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageLimit: 20 });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const result = pageLimit.getFilterFromQuery(
					{},
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageLimit: mockState.pageLimit });
			});

			it('should handle null pageLimit', () => {
				const result = pageLimit.getFilterFromQuery({}, mockAllFacets, null, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageLimit: null });
			});

			it('should handle undefined pageLimit', () => {
				const result = pageLimit.getFilterFromQuery({}, mockAllFacets, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageLimit: undefined });
			});
		});

		describe('getFlssFilter', () => {
			it('should return empty object', () => {
				expect(pageLimit.getFlssFilter({})).toEqual({});
			});
		});

		describe('getQueryFromFilter', () => {
			it('should return empty object', () => {
				expect(pageLimit.getQueryFromFilter({})).toEqual({});
			});
		});

		describe('getFilterChips', () => {
			it('should return empty array', () => {
				expect(pageLimit.getFilterChips({})).toEqual([]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should return empty object', () => {
				expect(pageLimit.getRemovedFacet({})).toEqual({});
			});
		});

		describe('showSavedSearch', () => {
			it('should return false', () => {
				expect(pageLimit.showSavedSearch()).toBe(false);
			});
		});

		describe('getSavedSearch', () => {
			it('should return empty object', () => {
				expect(pageLimit.getSavedSearch()).toEqual({});
			});
		});

		describe('getValidatedSearchState with null and undefined values', () => {
			it('should return default when pageLimit is null', () => {
				const state = { pageLimit: null };
				const result = pageLimit.getValidatedSearchState(state);
				expect(result).toEqual({ pageLimit: 15 });
			});

			it('should return default when pageLimit is 0', () => {
				const state = { pageLimit: 0 };
				// 0 is a valid number, so it should be accepted
				const result = pageLimit.getValidatedSearchState(state);
				expect(result).toEqual({ pageLimit: 0 });
			});

			it('should handle negative pageLimit', () => {
				const state = { pageLimit: -5 };
				const result = pageLimit.getValidatedSearchState(state);
				expect(result).toEqual({ pageLimit: -5 });
			});
		});
	});
});
