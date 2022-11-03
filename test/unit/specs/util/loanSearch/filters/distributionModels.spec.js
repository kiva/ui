import distributionModels, {
	transformDistributionModelOptions,
	DIRECT_KEY,
	FIELDPARTNER_KEY,
	distributionModelDisplayMap
} from '@/util/loanSearch/filters/distributionModels';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('distributionModels.js', () => {
	describe('distributionModels', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(distributionModels.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = distributionModels.getFilterChips({ distributionModel: 'DIRECT' }, mockAllFacets);

				const expected = [{ name: 'Direct', __typename: 'DistributionModel' }];

				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(distributionModels.getRemovedFacet()).toEqual({ distributionModel: null });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = distributionModels.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: null });
			});

			it('should validate distribution model', () => {
				const state = { distributionModel: 'asd' };

				const result = distributionModels.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: null });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { distributionModel: 'DIRECT' };

				const result = distributionModels.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: 'DIRECT' });
			});

			it('should handle different distribution model casing', () => {
				const query = { distributionModel: 'direct' };

				const result = distributionModels.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: 'DIRECT' });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push distribution model', () => {
				const state = { distributionModel: 'DIRECT' };

				const result = distributionModels.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: 'DIRECT' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(distributionModels.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(distributionModels.getFlssFilter({ distributionModel: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(distributionModels.getFlssFilter({ distributionModel: 'DIRECT' }))
					.toEqual({ distributionModel: { eq: 'DIRECT' } });
			});
		});
	});

	describe('transformDistributionModelOptions', () => {
		it('should handle empty', () => {
			expect(transformDistributionModelOptions([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const options = [{ name: DIRECT_KEY }, { name: FIELDPARTNER_KEY }];

			const result = transformDistributionModelOptions(options);

			expect(result).toEqual([
				{
					name: FIELDPARTNER_KEY,
					title: distributionModelDisplayMap[FIELDPARTNER_KEY],
					value: FIELDPARTNER_KEY
				},
				{ name: DIRECT_KEY, title: distributionModelDisplayMap[DIRECT_KEY], value: DIRECT_KEY },
			]);
		});
	});
});
