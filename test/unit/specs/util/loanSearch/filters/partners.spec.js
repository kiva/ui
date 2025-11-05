import partners, { transformPartners } from '#src/util/loanSearch/filters/partners';
import { FLSS_QUERY_TYPE } from '#src/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('partners.js', () => {
	describe('partners', () => {
		describe('getOptions', () => {
			it('should return transformed partners', () => {
				const result = partners.getOptions(mockAllFacets);

				expect(result.length).toBeGreaterThan(0);
				expect(result[0]).toHaveProperty('id');
				expect(result[0]).toHaveProperty('name');
				expect(result[0]).toHaveProperty('region');
			});

			it('should handle empty facets', () => {
				const result = partners.getOptions({});

				expect(result).toEqual([]);
			});
		});

		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(partners.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = partners.getFilterChips({ partnerId: [1] }, mockAllFacets);

				expect(result).toEqual([mockAllFacets.partnerFacets[0]]);
			});

			it('should filter out partner not found in facets', () => {
				const result = partners.getFilterChips({ partnerId: [999] }, mockAllFacets);

				expect(result).toEqual([]);
			});

			it('should filter out invalid partners but keep valid ones', () => {
				const result = partners.getFilterChips({ partnerId: [1, 999, 2] }, mockAllFacets);

				expect(result).toEqual([
					mockAllFacets.partnerFacets[0],
					mockAllFacets.partnerFacets[1]
				]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(partners.getRemovedFacet({ partnerId: [1] }, { id: 1 })).toEqual({ partnerId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = partners.getValidatedSearchState({ partnerId: [1] }, undefined, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerId: [] });
			});

			it('should handle empty', () => {
				const result = partners.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerId: [] });
			});

			it('should validate partner IDs', () => {
				let result = partners.getValidatedSearchState({ partnerId: [-1] }, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerId: [] });

				result = partners.getValidatedSearchState({ partnerId: undefined }, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partnerId: [] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should handle undefined facets', () => {
				const query = { partner: '1,2' };

				const result = partners.getFilterFromQuery(
					query,
					undefined,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ partnerId: [1, 2] });
			});

			it('it should get filter', () => {
				const query = { partner: '1,2' };

				const result = partners.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ partnerId: [1, 2] });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push partner IDs', () => {
				const state = { partnerId: [1, 2] };

				const result = partners.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ partner: '1,2' });
			});

			it('should not push empty partner IDs', () => {
				const state = { partnerId: [] };

				const result = partners.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getSavedSearch', () => {
			it('should return partner from state', () => {
				const state = { partnerId: [1, 2] };

				const result = partners.getSavedSearch(state);

				expect(result).toEqual({ partner: [1, 2] });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(partners.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(partners.getFlssFilter({ partnerId: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(partners.getFlssFilter({ partnerId: [1] })).toEqual({ partnerId: { any: [1] } });
			});
		});
	});

	describe('transformPartners', () => {
		it('should transform and sort', () => {
			const result = transformPartners(mockAllFacets.partnerFacets);

			expect(result).toEqual([
				{
					id: 3,
					name: 'Aaa',
					region: 'Central America'
				},
				{
					id: 2,
					name: 'Bbb',
					region: 'Central America'
				},
				{
					id: 1,
					name: 'Ccc',
					region: 'Africa'
				},
			]);
		});

		it('should handle partners with no countries', () => {
			const partnerList = [
				{ id: 1, name: 'Partner 1', countries: null },
				{ id: 2, name: 'Partner 2', countries: [] },
			];

			const result = transformPartners(partnerList);

			expect(result).toEqual([
				{ id: 1, name: 'Partner 1', region: '' },
				{ id: 2, name: 'Partner 2', region: '' },
			]);
		});

		it('should handle partners with region not in order array', () => {
			const partnerList = [
				{ id: 1, name: 'Zebra', countries: [{ region: 'UNKNOWN REGION' }] },
				{ id: 2, name: 'Apple', countries: [{ region: 'UNKNOWN REGION' }] },
			];

			const result = transformPartners(partnerList);

			// Should sort by name when regions are the same
			expect(result).toEqual([
				{ id: 2, name: 'Apple', region: 'UNKNOWN REGION' },
				{ id: 1, name: 'Zebra', region: 'UNKNOWN REGION' },
			]);
		});

		it('should handle empty partners array', () => {
			const result = transformPartners([]);

			expect(result).toEqual([]);
		});
	});
});
