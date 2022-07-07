import {
	getIsoCodes,
	getUpdatedRegions,
	isoToCountryName,
	mapIsoCodesToCountryNames,
	transformIsoCodes,
	updateSearchState,
	sortRegions,
	runFacetsQueries,
	runLoansQuery,
	fetchLoanFacets,
	transformThemes,
	transformSectors,
	getUpdatedNumLoansFundraising,
	getCheckboxLabel,
	applyQueryParams,
	updateQueryParams,
	getValidatedSearchState,
	FLSS_QUERY_TYPE,
	STANDARD_QUERY_TYPE,
	getIdsFromQueryParam,
	visibleThemeIds,
	getCountryIsoCodesFromQueryParam,
} from '@/util/loanSearchUtils';
import * as flssUtils from '@/util/flssUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import orderBy from 'lodash/orderBy';
import { getFlssFilters } from '@/util/flssUtils';

const mockState = {
	gender: 'female',
	countryIsoCode: ['US'],
	sectorId: [1],
	sortBy: 'expiringSoon',
	themeId: [1],
	pageOffset: 10,
	pageLimit: 5,
};

const mockAllFacets = {
	countryFacets: [
		{ country: { isoCode: 'US', name: 'United States', region: 'North America' } },
		{ country: { isoCode: 'CA', name: 'Canada', region: 'North America' } }
	],
	countryIsoCodes: ['US', 'CA'],
	countryNames: ['UNITED STATES', 'CANADA'],
	sectorFacets: [{ id: 1, name: 'Sector 1' }, { id: 2, name: 'Sector 2' }],
	sectorIds: [1],
	sectorNames: ['SECTOR 1', 'SECTOR 2'],
	themeFacets: [{ id: 1, name: 'Theme 1' }, { id: 2, name: 'Theme 2' }],
	themeIds: [1, 2],
	themeNames: ['THEME 1', 'THEME 2'],
	genderFacets: [{ name: 'female' }, { name: 'male' }],
	genders: ['FEMALE', 'MALE'],
	flssSorts: [{ name: 'expiringSoon' }, { name: 'personalized' }],
	standardSorts: [{ name: 'expiringSoon' }, { name: 'popularity' }],
};

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

const mockASector = (numLoansFundraising = 6) => ({ id: 7, name: 'c', numLoansFundraising });

const mockBSector = (numLoansFundraising = 3) => ({ id: 2, name: 'd', numLoansFundraising });

const mockTransformedSectors = [mockASector(), mockBSector()];

const mockATheme = (numLoansFundraising = 5) => ({ id: 6, name: 'a', numLoansFundraising });

const mockBTheme = (numLoansFundraising = 4) => ({ id: 3, name: 'b', numLoansFundraising });

describe('loanSearchUtils.js', () => {
	describe('getValidatedSearchState', () => {
		it('should return valid state', () => {
			const result = getValidatedSearchState(mockState, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual(mockState);
		});

		it('should validate gender', () => {
			const state = { ...mockState, gender: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, gender: null });
		});

		it('should validate country ISO code', () => {
			const state = { ...mockState, countryIsoCode: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, countryIsoCode: [] });
		});

		it('should validate sector ID', () => {
			const state = { ...mockState, sectorId: [-1] };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sectorId: [] });
		});

		it('should validate FLSS sortBy', () => {
			const state = { ...mockState, sortBy: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sortBy: null });
		});

		it('should validate standard sortBy', () => {
			const state = { ...mockState, sortBy: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, sortBy: null });
		});

		it('should validate theme', () => {
			const state = { ...mockState, themeId: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, themeId: [] });
		});

		it('should validate pageOffset', () => {
			const state = { ...mockState, pageOffset: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, pageOffset: 0 });
		});

		it('should validate pageLimit', () => {
			const state = { ...mockState, pageLimit: 'asd' };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, pageLimit: 15 });
		});
	});

	describe('updateSearchState', () => {
		const mockResult = 1;
		const apollo = { mutate: jest.fn(() => Promise.resolve(mockResult)) };
		const params = {
			mutation: updateLoanSearchMutation,
			variables: { searchParams: mockState }
		};

		afterEach(jest.clearAllMocks);

		it('should call apollo with the provided filters and return results', async () => {
			const result = await updateSearchState(apollo, mockState, mockAllFacets, FLSS_QUERY_TYPE, {});

			expect(apollo.mutate).toHaveBeenCalledWith(params);
			expect(result).toBe(mockResult);
		});

		it('should check if state has changed', async () => {
			await updateSearchState(apollo, mockState, mockAllFacets, FLSS_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledTimes(0);
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

	describe('transformSectors', () => {
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

		it('should filter transform themes with number casting', () => {
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

	describe('transformThemes', () => {
		it('should handle empty', () => {
			expect(transformThemes([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.map((t, i) => ({ key: t.name, value: i }));

			const expected = orderBy(mockThemes.map((t, i) => ({ ...t, numLoansFundraising: i })), 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should filter transform themes case insensitive', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.map((t, i) => ({ key: t.name.toUpperCase(), value: i }));

			const expected = orderBy(mockThemes.map((t, i) => ({ ...t, numLoansFundraising: i })), 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should always show certain themes', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.slice(0, 2).map((t, i) => ({ key: t.name, value: i }));

			const expected = orderBy([
				...mockThemes.slice(0, 2).map((t, i) => ({ ...t, numLoansFundraising: i })),
				...mockThemes.slice(2).map(t => ({ ...t, numLoansFundraising: 0 }))], 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
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

	describe('getUpdatedNumLoansFundraising', () => {
		it('should handle undefined and empty', () => {
			expect(getUpdatedNumLoansFundraising(undefined, [])).toEqual([]);
			expect(getUpdatedNumLoansFundraising([], [])).toEqual([]);
		});

		it('should update theme numLoansFundraising', () => {
			const nextA = mockATheme(9);

			const results = getUpdatedNumLoansFundraising([mockATheme(), mockBTheme()], [nextA]);

			expect(results).toEqual([nextA, mockBTheme(0)]);
		});

		it('should add missing themes', () => {
			const a = mockATheme();
			const nextB = mockBTheme();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
		});

		it('should update sector numLoansFundraising', () => {
			const nextA = mockASector(9);

			expect(getUpdatedNumLoansFundraising(mockTransformedSectors, [nextA])).toEqual([nextA, mockBSector(0)]);
		});

		it('should add missing sectors', () => {
			const a = mockASector();
			const nextB = mockBSector();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
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

	describe('isoToCountryName', () => {
		it('should return corresponding country name', () => {
			const mappedName = isoToCountryName('JO', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe('Jordan');
		});

		it('should return null if no matching country name', () => {
			const mappedName = isoToCountryName('MS', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe(null);
		});
	});

	describe('mapIsoCodesToCountryNames', () => {
		const targetIsos = ['JO', 'CL', 'CO'];

		it('should return an empty object if no ISO codes are passed', () => {
			expect(mapIsoCodesToCountryNames(undefined, mockTransformedRegions)).toEqual({});
			expect(mapIsoCodesToCountryNames([], mockTransformedRegions)).toEqual({});
		});

		it('should return an empty object if no regions are passed', () => {
			expect(mapIsoCodesToCountryNames(targetIsos, undefined)).toEqual({});
			expect(mapIsoCodesToCountryNames(targetIsos, [])).toEqual({});
		});

		it('should return region keyed object with array of country names', () => {
			const selectedCountries = mapIsoCodesToCountryNames(targetIsos, mockTransformedRegions);
			expect(selectedCountries).toEqual({
				'Middle East': ['Jordan'],
				'South America': ['Chile', 'Colombia']
			});
		});
	});

	describe('runFacetsQueries', () => {
		let spyFetchFacets;
		const isoCodeFacets = [{ key: 'iso', value: 1 }];
		const themeFacets = [{ key: 'theme', value: 1 }];
		const sectorFacets = [{ key: 'sector', value: 1 }];
		const isoCodes = { facets: { isoCode: isoCodeFacets } };
		const themes = { facets: { themes: themeFacets } };
		const sectors = { facets: { sectorId: sectorFacets } };

		beforeEach(() => {
			spyFetchFacets = jest.spyOn(flssUtils, 'fetchFacets')
				.mockImplementation(() => Promise.resolve({ isoCodes, themes, sectors }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return facets', async () => {
			const apollo = {};
			const result = await runFacetsQueries(apollo);
			expect(spyFetchFacets).toHaveBeenCalledWith(
				apollo,
				{ countryIsoCode: undefined },
				{ themeId: undefined },
				{ sectorId: undefined }
			);
			expect(spyFetchFacets).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ isoCodes: isoCodeFacets, themes: themeFacets, sectors: sectorFacets });
		});

		it('should return apply filters', async () => {
			const apollo = {};
			const result = await runFacetsQueries(apollo, { countryIsoCode: ['US'], themeId: [2], sectorId: [1] });
			expect(spyFetchFacets).toHaveBeenCalledWith(
				apollo,
				{ themeId: { any: [2] }, sectorId: { any: [1] }, countryIsoCode: undefined },
				{ countryIsoCode: { any: ['US'] }, sectorId: { any: [1] }, themeId: undefined },
				{ countryIsoCode: { any: ['US'] }, themeId: { any: [2] }, sectorId: undefined }
			);
			expect(spyFetchFacets).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ isoCodes: isoCodeFacets, themes: themeFacets, sectors: sectorFacets });
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
			const result = await runLoansQuery(apollo, mockState);
			expect(spyFetchLoans).toHaveBeenCalledWith(
				apollo,
				getFlssFilters(mockState),
				mockState.sortBy,
				mockState.pageOffset,
				mockState.pageLimit
			);
			expect(result).toEqual({ loans, totalCount });
		});
	});

	describe('fetchLoanFacets', () => {
		const countryFacets = [{ country: { isoCode: 'a', name: 'Country' } }];
		const sector = [{ id: 1, name: 'Test Sector' }];
		const loanThemeFilter = [{ id: 1, name: 'c' }];
		const genderOptions = { enumValues: [{ name: 'female' }] };
		const flssSorts = { enumValues: [{ name: 'expiringSoon' }] };
		const standardSorts = { enumValues: [{ name: 'expiringSoon' }] };

		it('should pass the correct query variables to apollo', async () => {
			const apollo = { query: jest.fn(() => Promise.resolve({})) };
			await fetchLoanFacets(apollo);
			const apolloVariables = { query: loanFacetsQuery, fetchPolicy: 'network-only' };
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should handle undefined', async () => {
			const dataObj = { data: { } };
			const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
			const data = await fetchLoanFacets(apollo);

			expect(data).toEqual({
				countryFacets: [],
				countryIsoCodes: [],
				countryNames: [],
				sectorFacets: [],
				sectorIds: [],
				sectorNames: [],
				themeFacets: [],
				themeIds: [],
				themeNames: [],
				genderFacets: [],
				genders: [],
				flssSorts: [],
				standardSorts: []
			});
		});

		it('should return the facets data', async () => {
			const dataObj = {
				data: {
					lend: {
						countryFacets,
						sector,
						loanThemeFilter,
					},
					genderOptions,
					flssSorts,
					standardSorts,
				}
			};

			const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
			const data = await fetchLoanFacets(apollo);

			expect(data).toEqual({
				countryFacets,
				countryIsoCodes: ['A'],
				countryNames: ['COUNTRY'],
				sectorFacets: sector,
				sectorIds: [1],
				sectorNames: ['TEST SECTOR'],
				themeFacets: loanThemeFilter,
				themeIds: [1],
				themeNames: ['C'],
				genderFacets: [{ name: 'female' }],
				genders: ['FEMALE'],
				flssSorts: [{ name: 'expiringSoon' }],
				standardSorts: [{ name: 'expiringSoon' }],
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

	describe('getCountryIsoCodesFromQueryParam', () => {
		it('should handle empty', () => {
			expect(getCountryIsoCodesFromQueryParam()).toBe(undefined);
			expect(getCountryIsoCodesFromQueryParam('')).toBe(undefined);
		});

		it('should handle FLSS and legacy single sector', () => {
			const param = 'us';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US']);
		});

		it('should handle FLSS and legacy list', () => {
			const param = 'us,ca';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US', 'CA']);
		});

		it('should handle FLSS and legacy list trailing separator', () => {
			const param = 'us,ca,';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US', 'CA']);
		});

		it('should handle Algolia single sector', () => {
			const param = 'north%20america%20>%20united%20states';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US']);
		});

		it('should handle Algolia single list', () => {
			const param = 'north%20america%20>%20united%20states~north%20america%20>%20canada';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US', 'CA']);
		});

		it('should handle Algolia single list trailing separator', () => {
			const param = 'north%20america%20>%20united%20states~north%20america%20>%20canada~';

			const result = getCountryIsoCodesFromQueryParam(param, mockAllFacets);

			expect(result).toEqual(['US', 'CA']);
		});
	});

	describe('getIdsFromQueryParam', () => {
		it('should handle empty', () => {
			expect(getIdsFromQueryParam()).toBe(undefined);
			expect(getIdsFromQueryParam('')).toBe(undefined);
		});

		it('should handle sector FLSS and legacy single sector', () => {
			const sector = '1';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1]);
		});

		it('should handle sector FLSS and legacy list', () => {
			const sector = '1,2';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector FLSS and legacy list trailing separator', () => {
			const sector = '1,2,';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector Algolia single sector', () => {
			const sector = 'Sector 1';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1]);
		});

		it('should handle sector Algolia list', () => {
			const sector = 'Sector 1~Sector 2';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle sector Algolia list trailing separator', () => {
			const sector = 'Sector 1~Sector 2~';

			const result = getIdsFromQueryParam(sector, mockAllFacets.sectorNames, mockAllFacets.sectorFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme FLSS and legacy single sector', () => {
			const attribute = '1';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme FLSS and legacy list', () => {
			const attribute = '1,2';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme FLSS and legacy list trailing separator', () => {
			const attribute = '1,2,';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme Algolia single sector', () => {
			const attribute = 'Theme 1';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme Algolia list', () => {
			const attribute = 'Theme 1~Theme 2';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle theme Algolia list trailing separator', () => {
			const attribute = 'Theme 1~Theme 2~';

			const result = getIdsFromQueryParam(attribute, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});
	});

	describe('applyQueryParams', () => {
		it('should update cache', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: 'female',
						countryIsoCode: ['US'],
						sectorId: [1],
						sortBy: 'expiringSoon',
						themeId: [1],
						pageOffset: 5,
						pageLimit: 5,
					}
				}
			};
			const query = {
				gender: 'female',
				country: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attribute: '1',
				page: '2',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should map lend to FLSS sort', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: 'personalized',
						sectorId: [],
						themeId: [],
						pageOffset: 0,
						pageLimit: 5,
					}
				},
			};
			const query = { sortBy: 'popularity' };

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should support standard sort', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: 'popularity',
						sectorId: [],
						themeId: [],
						pageOffset: 0,
						pageLimit: 5,
					}
				},
			};
			const query = { sortBy: 'popularity' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should support page', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: null,
						sectorId: [],
						themeId: [],
						pageOffset: 15,
						pageLimit: 5,
					}
				},
			};
			const query = { page: '4' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle negative page', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: null,
						sectorId: [],
						themeId: [],
						pageOffset: 0,
						pageLimit: 5,
					}
				},
			};
			const query = { page: '-1' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle decimal page', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: null,
						sectorId: [],
						themeId: [],
						pageOffset: 5,
						pageLimit: 5,
					}
				},
			};
			const query = { page: '2.5' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle non-number page', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: null,
						countryIsoCode: [],
						sortBy: null,
						sectorId: [],
						themeId: [],
						pageOffset: 0,
						pageLimit: 5,
					}
				},
			};
			const query = { page: 'asd' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should not update cache when state unchanged', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const query = {
				gender: 'female',
				country: 'us',
				sortBy: 'expiringSoon',
				sector: mockState.sectorId.toString(),
				attribute: '1',
				page: '3',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledTimes(0);
		});

		it('should handle Algolia countries param', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: 'female',
						countryIsoCode: ['US'],
						sectorId: [1],
						sortBy: 'expiringSoon',
						themeId: [1],
						pageOffset: 5,
						pageLimit: 5,
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attribute: '1',
				page: '2',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle Algolia attributes param', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						gender: 'female',
						countryIsoCode: ['US'],
						sectorId: [1],
						sortBy: 'expiringSoon',
						themeId: [1],
						pageOffset: 5,
						pageLimit: 5,
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attributes: 'theme 1',
				page: '2',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});
	});

	describe('updateQueryParams', () => {
		it('should preserve UTM params', () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: { utm_test: 'test' } }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { ...state, utm_test: 'test' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push gender', () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: state,
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push sector IDs', () => {
			const state = { sectorId: [1, 2] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sector: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty sector ID', () => {
			const state = { gender: 'female', sectorId: [] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push theme IDs', () => {
			const state = { themeId: [1, 2] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { attribute: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty theme ID', () => {
			const state = { gender: 'female', themeId: [] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push mapped FLSS sort value', () => {
			const state = { sortBy: 'personalized' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'popularity' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push standard sort value', () => {
			const state = { sortBy: 'personalized' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'personalized' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push page', () => {
			const state = { pageOffset: 10, pageLimit: 2 };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { page: '6' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should remove page if first page', () => {
			const state = { pageOffset: 0, pageLimit: 2 };
			const router = { currentRoute: { name: 'name', query: { page: '1' } }, push: jest.fn() };

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push ISO code', () => {
			const state = { countryIsoCode: ['US', 'CA'] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { country: 'US,CA' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push identical query string', () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: { gender: 'female' } }, push: jest.fn() };

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledTimes(0);
		});
	});
});
