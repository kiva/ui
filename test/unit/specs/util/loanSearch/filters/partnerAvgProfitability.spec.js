import partnerAvgProfitability, { MIN, MAX } from '@/util/loanSearch/filters/partnerAvgProfitability';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('partnerAvgProfitability.js', () => {
	describe('partnerAvgProfitability', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(partnerAvgProfitability.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = partnerAvgProfitability.getFilterChips({
					partnerAvgProfitability: { min: 1, max: 2 }
				}, mockAllFacets);

				expect(result).toEqual([{
					name: 'Profitability: 1% to 2%',
					__typename: 'PartnerAvgProfitability'
				}]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(partnerAvgProfitability.getRemovedFacet()).toEqual({ partnerAvgProfitability: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = partnerAvgProfitability.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerAvgProfitability: null });
			});

			it('should validate average profitability', () => {
				const state = { partnerAvgProfitability: { min: -1000, max: 600 } };

				const result = partnerAvgProfitability.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerAvgProfitability: { min: MIN, max: MAX, __typename: 'MinMaxRange' } });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { profitability: '1,2' };

				const result = partnerAvgProfitability.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ partnerAvgProfitability: createMinMaxRange(1, 2) });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push average profitability', () => {
				const state = { partnerAvgProfitability: { min: 1, max: 2 } };

				const result = partnerAvgProfitability.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ profitability: '1,2' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(partnerAvgProfitability.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(partnerAvgProfitability.getFlssFilter({ partnerAvgProfitability: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(partnerAvgProfitability
					.getFlssFilter({ partnerAvgProfitability: { min: 1, max: 2, __typename: 'MinMaxRange' } }))
					.toEqual({ partnerAvgProfitability: { range: { gte: 1, lte: 2 } } });
			});
		});
	});
});
