import {
	getIsoCodes,
	getFlssFilters,
	getUpdatedRegions,
	transformIsoCodes,
	updateSearchState,
	sortRegions,
	runFacetsQueries,
	runLoansQuery,
	fetchLoanFacets,
	transformThemes,
	getUpdatedThemes,
	getCheckboxLabel,
} from '@/util/loanSearchUtils';
import * as flssUtils from '@/util/flssUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';

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

const mockATheme = (numLoansFundraising = 5) => ({ id: 6, name: 'a', numLoansFundraising });

const mockBTheme = (numLoansFundraising = 4) => ({ id: 3, name: 'b', numLoansFundraising });

const mockTransformedThemes = [mockATheme(), mockBTheme()];

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

		it('should transform ISO codes case insensitive', () => {
			const mockCountryFacets = [
				{
					country: {
						name: 'Zambia',
						isoCode: 'zm',
						numLoansFundraising: 100,
						region: 'Africa',
					},
				},
				{
					country: {
						name: 'Colombia',
						isoCode: 'co',
						numLoansFundraising: 100,
						region: 'South America',
					},
				},
				{
					country: {
						name: 'Chile',
						isoCode: 'cl',
						numLoansFundraising: 100,
						region: 'South America',
					},
				},
				{
					country: {
						name: 'Jordan',
						isoCode: 'jo',
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

	describe('transformThemes', () => {
		it('should handle empty', () => {
			expect(transformThemes([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockFilteredThemes = [
				{
					key: 'b',
					value: 4,
				},
				{
					key: 'a',
					value: 5,
				},
			];

			const mockAllThemes = [
				{
					id: 3,
					name: 'b',
				},
				{
					id: 7,
					name: 'c',
				},
				{
					id: 6,
					name: 'a',
				},
			];

			const result = transformThemes(mockFilteredThemes, mockAllThemes);

			expect(result).toEqual(mockTransformedThemes);
		});

		it('should filter transform themes case insensitive', () => {
			const mockFilteredThemes = [
				{
					key: 'b',
					value: 4,
				},
				{
					key: 'a',
					value: 5,
				},
			];

			const mockAllThemes = [
				{
					id: 3,
					name: 'B',
				},
				{
					id: 7,
					name: 'C',
				},
				{
					id: 6,
					name: 'A',
				},
			];

			const result = transformThemes(mockFilteredThemes, mockAllThemes);

			expect(result).toEqual(mockTransformedThemes);
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

	describe('getUpdatedThemes', () => {
		it('should handle undefined and empty', () => {
			expect(getUpdatedThemes(undefined, [])).toEqual([]);
			expect(getUpdatedThemes([], [])).toEqual([]);
		});

		it('should update numLoansFundraising', () => {
			const nextA = mockATheme(9);

			expect(getUpdatedThemes(mockTransformedThemes, [nextA])).toEqual([nextA, mockBTheme(0)]);
		});

		it('should add missing themes', () => {
			const a = mockATheme();
			const nextB = mockBTheme();

			expect(getUpdatedThemes([a], [a, nextB])).toEqual([a, nextB]);
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
				countryIsoCode: [],
				theme: [],
			};
			expect(getFlssFilters(state)).toEqual({});
		});

		it('should return filters', () => {
			const state = {
				gender: 'female',
				countryIsoCode: ['US'],
				theme: ['test'],
			};
			expect(getFlssFilters(state)).toEqual({
				gender: { any: 'female' },
				countryIsoCode: { any: ['US'] },
				theme: { any: ['test'] }
			});
		});
	});

	describe('runFacetsQueries', () => {
		let spyFetchFacets;
		const isoCode = [{ key: 'iso', value: 1 }];
		const themes = [{ key: 'theme', value: 1 }];

		beforeEach(() => {
			spyFetchFacets = jest.spyOn(flssUtils, 'fetchFacets')
				.mockImplementation(() => Promise.resolve({ isoCode, themes }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return facets', async () => {
			const apollo = {};
			const result = await runFacetsQueries(apollo);
			expect(spyFetchFacets).toHaveBeenCalledWith(apollo, { countryIsoCode: undefined });
			expect(spyFetchFacets).toHaveBeenCalledWith(apollo, { theme: undefined });
			expect(result).toEqual({ isoCodes: isoCode, themes });
		});
	});

	describe('runLoansQuery', () => {
		let spyFetchLoans;
		const apollo = {};
		const loans = [{ test: 'test' }];
		const totalCount = 5;

		beforeEach(() => {
			spyFetchLoans = jest.spyOn(flssUtils, 'fetchLoans')
				.mockImplementation(() => Promise.resolve({ values: loans, totalCount }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return loans', async () => {
			const result = await runLoansQuery(apollo);
			expect(spyFetchLoans).toHaveBeenCalledWith(apollo, {}, null);
			expect(result).toEqual({ loans, totalCount });
		});
	});

	describe('fetchLoanFacets', () => {
		const countryFacets = ['a'];
		const sector = ['b'];
		const loanThemeFilter = ['c'];
		const standardSorts = [];
		const flssSorts = [];

		it('should pass the correct query variables to apollo', async () => {
			const apollo = { query: jest.fn(() => Promise.resolve({})) };
			await fetchLoanFacets(apollo);
			const apolloVariables = { query: loanFacetsQuery, fetchPolicy: 'network-only' };
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should handle undefined', async () => {
			const dataObj = { data: { lend: { } } };
			const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
			const data = await fetchLoanFacets(apollo);
			expect(data).toEqual({
				countryFacets: [],
				sectorFacets: [],
				themeFacets: [],
				standardSorts: [],
				flssSorts: []
			});
		});

		it('should return the facets data', async () => {
			const dataObj = {
				data: {
					lend: {
						countryFacets,
						sector,
						loanThemeFilter,
						standardSorts,
						flssSorts
					}
				}
			};
			const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
			const data = await fetchLoanFacets(apollo);
			expect(data).toEqual({
				countryFacets,
				sectorFacets: sector,
				themeFacets: loanThemeFilter,
				standardSorts,
				flssSorts
			});
		});
	});

	describe('getCheckboxLabel', () => {
		it('should handle region', () => {
			expect(getCheckboxLabel({ region: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});

		it('should handle item', () => {
			expect(getCheckboxLabel({ name: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});
	});
});
