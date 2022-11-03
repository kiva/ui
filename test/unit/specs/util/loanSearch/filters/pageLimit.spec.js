import pageLimit from '@/util/loanSearch/filters/pageLimit';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('pageLimit.js', () => {
	describe('pageLimit', () => {
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
		});
	});
});
