import partnerRiskRating, { MIN, MAX } from '@/util/loanSearch/filters/partnerRiskRating';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('partnerRiskRating.js', () => {
	describe('partnerRiskRating', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(partnerRiskRating.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = partnerRiskRating.getFilterChips({
					partnerRiskRating: { min: 1, max: 2 }
				}, mockAllFacets);

				expect(result).toEqual([{ name: 'Risk rating: 1 to 2', __typename: 'PartnerRiskRating' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(partnerRiskRating.getRemovedFacet()).toEqual({ partnerRiskRating: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = partnerRiskRating.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerRiskRating: null });
			});

			it('should validate risk rating', () => {
				const state = { partnerRiskRating: { min: -1, max: 6 } };

				const result = partnerRiskRating.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerRiskRating: { min: MIN, max: MAX, __typename: 'MinMaxRange' } });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { riskRating: '1,2' };

				const result = partnerRiskRating.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ partnerRiskRating: createMinMaxRange(1, 2) });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push risk rating', () => {
				const state = { partnerRiskRating: { min: 1, max: 2 } };

				const result = partnerRiskRating.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ riskRating: '1,2' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(partnerRiskRating.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(partnerRiskRating.getFlssFilter({ partnerRiskRating: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(partnerRiskRating
					.getFlssFilter({ partnerRiskRating: { min: 1, max: 2, __typename: 'MinMaxRange' } }))
					.toEqual({ partnerRiskRating: { range: { gte: 1, lte: 2 } } });
			});
		});
	});
});
