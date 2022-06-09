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
	transformSectors,
	getUpdatedNumLoansFundraising,
	getCheckboxLabel,
	applyQueryParams,
	updateQueryParams,
	getValidatedSearchState,
	FLSS_QUERY_TYPE,
	STANDARD_QUERY_TYPE,
	getSectorIdsFromQueryParam,
	getThemeNamesQueryParam,
} from '@/util/loanSearchUtils';
import * as flssUtils from '@/util/flssUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';

const mockState = {
	gender: 'female',
	countryIsoCode: ['US'],
	sectorId: [1],
	sortBy: 'expiringSoon',
	theme: ['THEME 1']
};

const mockAllFacets = {
	countryFacets: [{ country: { isoCode: 'US' } }],
	countryIsoCodes: ['US'],
	sectorFacets: [{ id: 1, name: 'Sector 1' }, { id: 2, name: 'Sector 2' }],
	sectorIds: [1],
	sectorNames: ['SECTOR 1', 'SECTOR 2'],
	themeFacets: [{ id: 1, name: 'Theme 1' }, { id: 2, name: 'Theme 2' }],
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

const mockTransformedThemes = [mockATheme(), mockBTheme()];

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
			const state = { ...mockState, theme: ['asd'] };

			const result = getValidatedSearchState(state, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(result).toEqual({ ...mockState, theme: [] });
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

	describe('getUpdatedNumLoansFundraising', () => {
		it('should handle undefined and empty', () => {
			expect(getUpdatedNumLoansFundraising(undefined, [])).toEqual([]);
			expect(getUpdatedNumLoansFundraising([], [])).toEqual([]);
		});

		it('should update theme numLoansFundraising', () => {
			const nextA = mockATheme(9);

			expect(getUpdatedNumLoansFundraising(mockTransformedThemes, [nextA])).toEqual([nextA, mockBTheme(0)]);
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
				{ theme: undefined },
				{ sectorId: undefined }
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
			const result = await runLoansQuery(apollo);
			expect(spyFetchLoans).toHaveBeenCalledWith(apollo, {}, null);
			expect(result).toEqual({ loans, totalCount });
		});
	});

	describe('fetchLoanFacets', () => {
		const countryFacets = [{ country: { isoCode: 'a' } }];
		const sector = [{ id: 1, name: 'Test Sector' }];
		const loanThemeFilter = [{ name: 'c' }];
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
				sectorFacets: [],
				sectorIds: [],
				sectorNames: [],
				themeFacets: [],
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
				sectorFacets: sector,
				sectorIds: [1],
				sectorNames: ['TEST SECTOR'],
				themeFacets: loanThemeFilter,
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

	describe('getSectorIdsFromQueryParam', () => {
		it('should handle empty', () => {
			expect(getSectorIdsFromQueryParam()).toBe(undefined);
			expect(getSectorIdsFromQueryParam('')).toBe(undefined);
		});

		it('should handle FLSS and legacy single sector', () => {
			const sector = '1';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1]);
		});

		it('should handle FLSS and legacy list', () => {
			const sector = '1,2';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle FLSS and legacy list trailing separator', () => {
			const sector = '1,2,';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle Algolia single sector', () => {
			const sector = 'Sector 1';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1]);
		});

		it('should handle Algolia single list', () => {
			const sector = 'Sector 1~Sector 2';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle Algolia single list trailing separator', () => {
			const sector = 'Sector 1~Sector 2~';

			const result = getSectorIdsFromQueryParam(sector, mockAllFacets);

			expect(result).toEqual([1, 2]);
		});
	});

	describe('getThemeNamesQueryParam', () => {
		it('should handle empty', () => {
			expect(getThemeNamesQueryParam()).toBe(undefined);
			expect(getThemeNamesQueryParam('')).toBe(undefined);
		});

		it('should handle FLSS and legacy single sector', () => {
			const attribute = '1';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1']);
		});

		it('should handle FLSS and legacy list', () => {
			const attribute = '1,2';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1', 'Theme 2']);
		});

		it('should handle FLSS and legacy list trailing separator', () => {
			const attribute = '1,2,';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1', 'Theme 2']);
		});

		it('should handle Algolia single sector', () => {
			const attribute = 'Theme 1';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1']);
		});

		it('should handle Algolia single list', () => {
			const attribute = 'Theme 1~Theme 2';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1', 'Theme 2']);
		});

		it('should handle Algolia single list trailing separator', () => {
			const attribute = 'Theme 1~Theme 2~';

			const result = getThemeNamesQueryParam(attribute, mockAllFacets.themeFacets);

			expect(result).toEqual(['Theme 1', 'Theme 2']);
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
						countryIsoCode: [],
						sectorId: [1],
						sortBy: 'expiringSoon',
						theme: ['THEME 1']
					}
				}
			};
			const query = { ...mockState, sector: mockState.sectorId.toString(), attribute: '1' };

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should fallback to previous state', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						...mockState,
						gender: 'male',
						sortBy: 'personalized',
						sectorId: [1],
						theme: ['THEME 1'],
					}
				},
			};
			const query = {
				gender: 'male',
				sortBy: 'popularity',
				sector: '1',
				attribute: '1'
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should map lend to FLSS sort', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						...mockState,
						gender: null,
						sortBy: 'personalized',
						sectorId: [],
						theme: [],
					}
				},
			};
			const query = { sortBy: 'popularity' };

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should support standard sort', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const params = {
				mutation: updateLoanSearchMutation,
				variables: {
					searchParams: {
						...mockState,
						gender: null,
						sortBy: 'popularity',
						sectorId: [],
						theme: [],
					}
				},
			};
			const query = { sortBy: 'popularity' };

			await applyQueryParams(apollo, query, mockAllFacets, STANDARD_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should not update cache when state unchanged', async () => {
			const apollo = { mutate: jest.fn(() => Promise.resolve()) };
			const query = { ...mockState, sector: mockState.sectorId.toString(), attribute: '1' };

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState);

			expect(apollo.mutate).toHaveBeenCalledTimes(0);
		});
	});

	describe('updateQueryParams', () => {
		it('should preserve UTM params', async () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: { utm_test: 'test' } }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { ...state, utm_test: 'test' },
				params: { noScroll: true }
			});
		});

		it('should push gender', async () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({ name: 'name', query: state, params: { noScroll: true } });
		});

		it('should push sector IDs', async () => {
			const state = { sectorId: [1, 2] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sector: '1,2' },
				params: { noScroll: true }
			});
		});

		it('should not push empty sector ID', async () => {
			const state = { gender: 'female', sectorId: [] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true }
			});
		});

		it('should push theme IDs', async () => {
			const state = { theme: ['THEME 1', 'THEME 2'] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { attribute: '1,2' },
				params: { noScroll: true }
			});
		});

		it('should not push empty theme ID', async () => {
			const state = { gender: 'female', theme: [] };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true }
			});
		});

		it('should push mapped FLSS sort value', async () => {
			const state = { sortBy: 'personalized' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'popularity' },
				params: { noScroll: true }
			});
		});

		it('should push standard sort value', async () => {
			const state = { sortBy: 'personalized' };
			const router = { currentRoute: { name: 'name', query: {} }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'personalized' },
				params: { noScroll: true }
			});
		});

		it('should not push identical query string', async () => {
			const state = { gender: 'female' };
			const router = { currentRoute: { name: 'name', query: { gender: 'female' } }, push: jest.fn() };

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledTimes(0);
		});
	});
});
