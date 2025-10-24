import partnerDefaultRate, { MIN, MAX } from '#src/util/loanSearch/filters/partnerDefaultRate';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { createMinMaxRange } from '#src/util/loanSearch/minMaxRange';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('partnerDefaultRate.js', () => {
	describe('partnerDefaultRate', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(partnerDefaultRate.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = partnerDefaultRate.getFilterChips({
					partnerDefaultRate: { min: 1, max: 2 }
				}, mockAllFacets);

				expect(result).toEqual([{ name: 'Default rate: 100% to 200%', __typename: 'PartnerDefaultRate' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(partnerDefaultRate.getRemovedFacet()).toEqual({ partnerDefaultRate: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = partnerDefaultRate.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerDefaultRate: null });
			});

			it('should validate default rate', () => {
				const state = { partnerDefaultRate: { min: -1, max: 6 } };

				const result = partnerDefaultRate.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerDefaultRate: { min: MIN, max: MAX, __typename: 'MinMaxRange' } });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { defaultRate: '1,2' };

				const result = partnerDefaultRate.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ partnerDefaultRate: createMinMaxRange(1, 2) });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push default rate', () => {
				const state = { partnerDefaultRate: { min: 1, max: 2 } };

				const result = partnerDefaultRate.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ defaultRate: '1,2' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(partnerDefaultRate.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(partnerDefaultRate.getFlssFilter({ partnerDefaultRate: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(partnerDefaultRate
					.getFlssFilter({ partnerDefaultRate: { min: 1, max: 2, __typename: 'MinMaxRange' } }))
					.toEqual({ partnerDefaultRate: { range: { gte: 1, lte: 2 } } });
			});
		});

		describe('getSavedSearch', () => {
			it('should return defaultRate object', () => {
				const state = { partnerDefaultRate: { min: 0, max: 3 } };
				const result = partnerDefaultRate.getSavedSearch(state);
				expect(result).toEqual({ defaultRate: { min: 0, max: 3 } });
			});

			it('should return null when partnerDefaultRate is null', () => {
				const state = { partnerDefaultRate: null };
				const result = partnerDefaultRate.getSavedSearch(state);
				expect(result).toEqual({ defaultRate: null });
			});
		});

		describe('getOptions', () => {
			it('should return min, max, and step', () => {
				const result = partnerDefaultRate.getOptions();
				expect(result).toEqual({ min: MIN, max: MAX, step: 0.001 });
			});
		});
	});
});
