import pageOffset from '@/util/loanSearch/filters/pageOffset';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { getDefaultLoanSearchState } from '@/api/localResolvers/loanSearch';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('pageOffset.js', () => {
	describe('pageOffset', () => {
		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = pageOffset.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: getDefaultLoanSearchState().pageOffset });
			});

			it('should validate pageOffset', () => {
				const state = { pageOffset: 'asd' };

				const result = pageOffset.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ pageOffset: 0 });
			});
		});

		describe('getFilterFromQuery', () => {
			it('should support page', () => {
				const query = { page: '4' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 15 });
			});

			it('should handle negative page', () => {
				const query = { page: '-1' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 0 });
			});

			it('should handle decimal page', () => {
				const query = { page: '2.5' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 5 });
			});

			it('should handle non-number page', () => {
				const query = { page: 'asd' };

				const result = pageOffset.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ pageOffset: 0 });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push page', () => {
				const state = { pageOffset: 10, pageLimit: 2 };

				const result = pageOffset.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ page: '6' });
			});

			it('should remove page if first page', () => {
				const state = { pageOffset: 0, pageLimit: 2 };

				const result = pageOffset.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});
	});
});
