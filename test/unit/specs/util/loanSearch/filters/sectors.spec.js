import sectors, { transformSectors } from '@/util/loanSearch/filters/sectors';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { mockAllFacets, mockState } from '../../../../fixtures/mockLoanSearchData';

describe('sectors.js', () => {
	describe('sectors', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(sectors.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = sectors.getFilterChips({ sectorId: [1] }, mockAllFacets);

				const expected = [mockAllFacets.sectorFacets[0]];

				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(sectors.getRemovedFacet({ sectorId: [1] }, { id: 1 })).toEqual({ sectorId: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = sectors.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sectorId: [] });
			});

			it('should validate sector ID', () => {
				const state = { sectorId: [-1] };

				const result = sectors.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sectorId: [] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { sector: '1,2' };

				const result = sectors.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ sectorId: [1, 2] });
			});
		});

		describe('getQueryFromFilter', () => {
			it('should push sector IDs', () => {
				const state = { sectorId: [1, 2] };

				const result = sectors.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ sector: '1,2' });
			});

			it('should not push empty sector ID', () => {
				const state = { sectorId: [] };

				const result = sectors.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({});
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(sectors.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(sectors.getFlssFilter({ sectorId: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(sectors.getFlssFilter({ sectorId: [1] })).toEqual({ sectorId: { any: [1] } });
			});
		});
	});

	describe('transformSectors', () => {
		const mockASector = (numLoansFundraising = 6) => ({ id: 7, name: 'c', numLoansFundraising });
		const mockBSector = (numLoansFundraising = 3) => ({ id: 2, name: 'd', numLoansFundraising });
		const mockTransformedSectors = [mockASector(), mockBSector()];

		it('should handle empty', () => {
			expect(transformSectors([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockFilteredSectors = [
				{
					key: 2,
					value: 3,
				},
				{
					key: 7,
					value: 6,
				},
			];

			const mockAllSectors = [
				{
					id: 2,
					name: 'd',
				},
				{
					id: 8,
					name: 'f',
				},
				{
					id: 7,
					name: 'c',
				},
			];

			const result = transformSectors(mockFilteredSectors, mockAllSectors);

			expect(result).toEqual(mockTransformedSectors);
		});

		it('should filter transform sectors with number casting', () => {
			const mockFilteredSectors = [
				{
					key: '2',
					value: 3,
				},
				{
					key: '7',
					value: 6,
				},
			];

			const mockAllSectors = [
				{
					id: 2,
					name: 'd',
				},
				{
					id: 8,
					name: 'f',
				},
				{
					id: 7,
					name: 'c',
				},
			];

			const result = transformSectors(mockFilteredSectors, mockAllSectors);

			expect(result).toEqual(mockTransformedSectors);
		});
	});
});
