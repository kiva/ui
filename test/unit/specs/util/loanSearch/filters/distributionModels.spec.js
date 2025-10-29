import distributionModels, {
	transformDistributionModelOptions,
	DIRECT_KEY,
	FIELDPARTNER_KEY,
	distributionModelDisplayMap
} from '../../../../../../src/util/loanSearch/filters/distributionModels';
import { FLSS_QUERY_TYPE } from '../../../../../../src/util/loanSearch/filterUtils';
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
				const result = distributionModels.getValidatedSearchState({}, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: null });
			});

			it('should handle empty', () => {
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
			it('it should handle undefined facets', () => {
				const query = { distributionModel: 'direct' };

				const result = distributionModels.getFilterFromQuery(
					query,
					undefined,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: null });
			});

			it('it should get filter', () => {
				const query = { distributionModel: 'direct' };

				const result = distributionModels.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: 'DIRECT' });
			});

			it('should handle different distribution model casing', () => {
				const query = { distributionModel: 'DIRECT' };

				const result = distributionModels.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: 'DIRECT' });
			});

			it('should handle legacy value', () => {
				const query = { distributionModel: 'field_partner' };

				const result = distributionModels.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ distributionModel: 'FIELDPARTNER' });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push distribution model', () => {
				const state = { distributionModel: 'DIRECT' };

				const result = distributionModels.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: 'direct' });
			});

			it('should push legacy distribution model', () => {
				const state = { distributionModel: 'FIELDPARTNER' };

				const result = distributionModels.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ distributionModel: 'field_partner' });
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

	describe('getSavedSearch', () => {
		it('should return mapped enum value for FIELDPARTNER', () => {
			const result = distributionModels.getSavedSearch({ distributionModel: 'FIELDPARTNER' });
			expect(result).toEqual({ distributionModel: 'fieldPartner' });
		});

		it('should return mapped enum value for DIRECT', () => {
			const result = distributionModels.getSavedSearch({ distributionModel: 'DIRECT' });
			expect(result).toEqual({ distributionModel: 'direct' });
		});

		it('should handle null distributionModel', () => {
			const result = distributionModels.getSavedSearch({ distributionModel: null });
			expect(result).toEqual({ distributionModel: undefined });
		});
	});

	describe('getOptions', () => {
		it('should return empty array when no facets', () => {
			expect(distributionModels.getOptions({})).toEqual([]);
		});

		it('should transform distribution model facets', () => {
			const allFacets = {
				distributionModelFacets: [
					{ name: FIELDPARTNER_KEY },
					{ name: DIRECT_KEY }
				]
			};
			const result = distributionModels.getOptions(allFacets);
			expect(result.length).toBe(2);
			expect(result[0].title).toBe('Partner');
			expect(result[1].title).toBe('Direct');
		});

		it('should handle undefined distributionModelFacets', () => {
			const allFacets = { distributionModelFacets: undefined };
			const result = distributionModels.getOptions(allFacets);
			expect(result).toEqual([]);
		});
	});

	describe('getValidatedSearchState', () => {
		it('should handle null loanSearchState.distributionModel', () => {
			// Line 80 - optional chaining with null distributionModel
			const loanSearchState = { distributionModel: null };
			const allFacets = { distributionModels: ['DIRECT', 'FIELDPARTNER'] };

			const result = distributionModels.getValidatedSearchState(loanSearchState, allFacets);

			expect(result).toEqual({ distributionModel: null });
		});
	});

	describe('showSavedSearch', () => {
		it('should return true when distributionModel is set', () => {
			const result = distributionModels.showSavedSearch({ distributionModel: 'DIRECT' });
			expect(result).toBe(true);
		});

		it('should return false when distributionModel is null', () => {
			const result = distributionModels.showSavedSearch({ distributionModel: null });
			// Line 60: !!null -> false
			expect(result).toBe(false);
		});

		it('should return false when distributionModel is undefined', () => {
			const result = distributionModels.showSavedSearch({});
			// Line 60: !!undefined -> false
			expect(result).toBe(false);
		});

		it('should return false when distributionModel is empty string', () => {
			const result = distributionModels.showSavedSearch({ distributionModel: '' });
			// Line 60: !!'' -> false (covers line 59-60 branches)
			expect(result).toBe(false);
		});
	});
});
