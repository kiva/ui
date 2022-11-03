import lenderRepaymentTerms, {
	transformLenderRepaymentTermOptions,
	EIGHT_MONTHS_KEY,
	SIXTEEN_MONTHS_KEY,
	TWO_YEARS_KEY,
	MORE_THAN_TWO_YEARS_KEY,
	lenderRepaymentTermDisplayMap,
	lenderRepaymentTermValueMap,
} from '@/util/loanSearch/filters/lenderRepaymentTerms';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('lenderRepaymentTerms.js', () => {
	describe('lenderRepaymentTerms', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(lenderRepaymentTerms.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = lenderRepaymentTerms.getFilterChips({
					lenderRepaymentTerm: { min: 0, max: 8 }
				}, mockAllFacets);

				expect(result).toEqual([{ name: '8 mths or less', __typename: 'LenderRepaymentTerm' }]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(lenderRepaymentTerms.getRemovedFacet()).toEqual({ lenderRepaymentTerm: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = lenderRepaymentTerms.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ lenderRepaymentTerm: null });
			});

			it('should validate lender repayment term', () => {
				const state = { lenderRepaymentTerm: { min: -1, max: 100 } };

				const result = lenderRepaymentTerms.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ lenderRepaymentTerm: null });
			});

			it('should add lender repayment term typename', () => {
				const state = { lenderRepaymentTerm: { min: 0, max: 8 } };

				const result = lenderRepaymentTerms.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({
					lenderRepaymentTerm: { ...state.lenderRepaymentTerm, __typename: 'MinMaxRange' }
				});
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { lenderTerm: '0,8' };

				const result = lenderRepaymentTerms.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ lenderRepaymentTerm: createMinMaxRange(0, 8) });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push lender term', () => {
				const state = { lenderRepaymentTerm: { min: 0, max: 8, __typename: 'MinMaxRange' } };

				const result = lenderRepaymentTerms.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ lenderTerm: '0,8' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(lenderRepaymentTerms.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(lenderRepaymentTerms.getFlssFilter({ lenderRepaymentTerm: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(lenderRepaymentTerms
					.getFlssFilter({ lenderRepaymentTerm: { min: 0, max: 8, __typename: 'MinMaxRange' } }))
					.toEqual({ lenderRepaymentTerm: { range: { gte: 0, lte: 8 } } });
			});
		});
	});

	describe('transformLenderRepaymentTermOptions', () => {
		it('should transform and sort', () => {
			const result = transformLenderRepaymentTermOptions();

			expect(result).toEqual([
				{
					name: EIGHT_MONTHS_KEY,
					title: lenderRepaymentTermDisplayMap[EIGHT_MONTHS_KEY],
					value: lenderRepaymentTermValueMap[EIGHT_MONTHS_KEY]
				},
				{
					name: SIXTEEN_MONTHS_KEY,
					title: lenderRepaymentTermDisplayMap[SIXTEEN_MONTHS_KEY],
					value: lenderRepaymentTermValueMap[SIXTEEN_MONTHS_KEY]
				},
				{
					name: TWO_YEARS_KEY,
					title: lenderRepaymentTermDisplayMap[TWO_YEARS_KEY],
					value: lenderRepaymentTermValueMap[TWO_YEARS_KEY]
				},
				{
					name: MORE_THAN_TWO_YEARS_KEY,
					title: lenderRepaymentTermDisplayMap[MORE_THAN_TWO_YEARS_KEY],
					value: lenderRepaymentTermValueMap[MORE_THAN_TWO_YEARS_KEY]
				},
			]);
		});
	});
});
