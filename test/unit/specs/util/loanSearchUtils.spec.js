import {
	getIsoCodes,
	getFlssFilters,
	getUpdatedRegions,
	transformIsoCodes,
	updateSearchState,
	sortRegions,
	runFacetsQueries,
	runLoansQuery
} from '@/util/loanSearchUtils';
import * as flssUtils from '@/util/flssUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';

const mockTransformedMiddleEast = (numLoansFundraising = 44) => ({
	region: 'Middle East',
	numLoansFundraising,
	countries: [
		{
			name: 'Jordan',
			isoCode: 'JO',
			numLoansFundraising,
			region: 'Middle East',
		},
	]
});

const mockTransformedChile = (numLoansFundraising = 20) => ({
	name: 'Chile',
	isoCode: 'CL',
	numLoansFundraising,
	region: 'South America',
});

const mockTransformedColombia = (numLoansFundraising = 152) => ({
	name: 'Colombia',
	isoCode: 'CO',
	numLoansFundraising,
	region: 'South America',
});

const mockTransformedSouthAmerica = (
	countries = [mockTransformedChile(), mockTransformedColombia()],
	numLoansFundraising = 172
) => ({
	region: 'South America',
	numLoansFundraising,
	countries,
});

const mockTransformedRegions = [mockTransformedMiddleEast(), mockTransformedSouthAmerica()];

describe('loanSearchUtils.js', () => {
	describe('updateSearchState', () => {
		it('should call apollo with the provided filters and return results', async () => {
			const mockResult = 1;
			const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
			const filters = { countryIsoCode: ['US'], sectorId: [9] };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: { searchParams: filters }
			};

			const result = await updateSearchState(apollo, filters);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
			expect(result).toBe(mockResult);
		});
	});

	describe('sortRegions', () => {
		it('should handle empty', () => {
			expect(sortRegions([])).toEqual([]);
		});

		it('should sort', () => {
			const regions = [
				mockTransformedSouthAmerica([mockTransformedColombia(), mockTransformedChile()]),
				mockTransformedMiddleEast()
			];
			expect(sortRegions(regions)).toEqual(mockTransformedRegions);
		});
	});

	describe('transformIsoCodes', () => {
		it('should handle empty', () => {
			expect(transformIsoCodes([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockCountryFacets = [
				{
					country: {
						name: 'Zambia',
						isoCode: 'ZM',
						numLoansFundraising: 100,
						region: 'Africa',
					},
				},
				{
					country: {
						name: 'Colombia',
						isoCode: 'CO',
						numLoansFundraising: 100,
						region: 'South America',
					},
				},
				{
					country: {
						name: 'Chile',
						isoCode: 'CL',
						numLoansFundraising: 100,
						region: 'South America',
					},
				},
				{
					country: {
						name: 'Jordan',
						isoCode: 'JO',
						numLoansFundraising: 100,
						region: 'Middle East',
					},
				}
			];

			const filteredIsoCodes = [{ key: 'JO', value: 44 }, { key: 'CO', value: 152 }, { key: 'CL', value: 20 }];

			const result = transformIsoCodes(filteredIsoCodes, mockCountryFacets);

			expect(result).toEqual(mockTransformedRegions);
		});
	});

	describe('getUpdatedRegions', () => {
		it('should handle undefined and empty', () => {
			expect(getUpdatedRegions(undefined, [])).toEqual([]);
			expect(getUpdatedRegions([], [])).toEqual([]);
		});

		it('should update numLoansFundraising', () => {
			// Next regions have no Middle East and different fundraising numbers
			const nextSouthAmerica = mockTransformedSouthAmerica(
				[mockTransformedChile(1), mockTransformedColombia(2)], 3
			);

			expect(getUpdatedRegions(mockTransformedRegions, [nextSouthAmerica])).toEqual([
				mockTransformedMiddleEast(0),
				nextSouthAmerica
			]);
		});

		it('should add missing regions', () => {
			const southAmerica = mockTransformedSouthAmerica();
			const middleEast = mockTransformedMiddleEast();
			const updatedSouthAmerica = mockTransformedSouthAmerica(
				[mockTransformedChile(0), mockTransformedColombia(0)], 0
			);

			expect(getUpdatedRegions([southAmerica], [middleEast])).toEqual([middleEast, updatedSouthAmerica]);
		});
	});

	describe('getIsoCodes', () => {
		it('should handle empty', () => {
			expect(getIsoCodes([], {})).toEqual([]);
			expect(getIsoCodes([], { test: 'test' })).toEqual([]);
		});

		it('should return codes', () => {
			expect(getIsoCodes(mockTransformedRegions, { 'South America': ['Chile'] })).toEqual(['CL']);
			expect(getIsoCodes(mockTransformedRegions, {
				'Middle East': ['Jordan'],
				'South America': ['Chile'],
			}).sort()).toEqual(['JO', 'CL'].sort());
		});
	});

	describe('getFlssFilters', () => {
		it('should handle missing', () => {
			expect(getFlssFilters({})).toEqual({});
		});

		it('should handle empty', () => {
			const state = {
				gender: '',
				countryIsoCode: []
			};
			expect(getFlssFilters(state)).toEqual({});
		});

		it('should return filters', () => {
			const state = {
				gender: 'female',
				countryIsoCode: ['US']
			};
			expect(getFlssFilters(state)).toEqual({
				gender: { any: 'female' },
				countryIsoCode: { any: ['US'] }
			});
		});
	});

	describe('runFacetsQueries', () => {
		let spyFetchFacets;
		const apollo = {};
		const isoCode = [{ key: 'key', value: 1 }];

		beforeEach(() => {
			spyFetchFacets = jest.spyOn(flssUtils, 'fetchFacets')
				.mockImplementation(() => Promise.resolve({ isoCode }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return facets', async () => {
			const result = await runFacetsQueries(apollo);
			expect(spyFetchFacets).toHaveBeenCalledWith(apollo, { countryIsoCode: undefined });
			expect(result).toEqual({ isoCodes: isoCode });
		});
	});

	describe('runLoansQuery', () => {
		let spyFetchLoan;
		const apollo = {};
		const loans = [{ test: 'test' }];
		const totalCount = 5;

		beforeEach(() => {
			spyFetchLoan = jest.spyOn(flssUtils, 'fetchLoan')
				.mockImplementation(() => Promise.resolve({ values: loans, totalCount }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return loans', async () => {
			const result = await runLoansQuery(apollo);
			expect(spyFetchLoan).toHaveBeenCalledWith(apollo, {});
			expect(result).toEqual({ loans, totalCount });
		});
	});
});
