import partners, { transformPartners } from '@/util/loanSearch/filters/partners';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('partners.js', () => {
	describe('partners', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(partners.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = partners.getFilterChips({ partnerId: [1] }, mockAllFacets);

				expect(result).toEqual([mockAllFacets.partnerFacets[0]]);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(partners.getRemovedFacet({ partnerId: [1] }, { id: 1 })).toEqual({ partnerId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
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
	});
});
