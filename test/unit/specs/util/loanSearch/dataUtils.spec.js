import { runFacetsQueries, runLoansQuery, fetchLoanFacets } from '@/util/loanSearch/dataUtils';
import * as flssUtils from '@/util/flssUtils';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import { getFlssFilters, FLSS_ORIGIN_NOT_SPECIFIED } from '@/util/flssUtils';
import { mockState } from '../../../fixtures/mockLoanSearchData';

describe('dataUtils.js', () => {
	describe('runFacetsQueries', () => {
		let spyFetchFacets;
		const isoCodeFacets = [{ key: 'iso', value: 1 }];
		const themeFacets = [{ key: 'theme', value: 1 }];
		const sectorFacets = [{ key: 'sector', value: 1 }];
		const tagFacets = [{ key: 'tag', value: 1 }];
		const isoCodes = { facets: { isoCode: isoCodeFacets } };
		const themes = { facets: { themes: themeFacets } };
		const sectors = { facets: { sectorId: sectorFacets } };
		const tags = { facets: { tagsIds: tagFacets } };
		const origin = FLSS_ORIGIN_NOT_SPECIFIED;

		beforeEach(() => {
			spyFetchFacets = jest.spyOn(flssUtils, 'fetchFacets')
				.mockImplementation(() => Promise.resolve({
					isoCodes,
					themes,
					sectors,
					tags,
				}));
		});

		afterEach(jest.restoreAllMocks);

		it('should return facets', async () => {
			const apollo = {};
			const result = await runFacetsQueries(apollo, {}, origin);
			expect(spyFetchFacets).toHaveBeenCalledWith(
				apollo,
				origin,
				{ countryIsoCode: undefined },
				{ themeId: undefined },
				{ sectorId: undefined },
				{ tagId: undefined },
			);
			expect(spyFetchFacets).toHaveBeenCalledTimes(1);
			expect(result).toEqual({
				isoCodes: isoCodeFacets,
				themes: themeFacets,
				sectors: sectorFacets,
				tags: tagFacets,
			});
		});

		it('should return apply filters', async () => {
			const apollo = {};
			const result = await runFacetsQueries(
				apollo,
				{
					countryIsoCode: ['US'],
					themeId: [2],
					sectorId: [1],
					tagId: [3],
				},
				origin
			);
			expect(spyFetchFacets).toHaveBeenCalledWith(
				apollo,
				origin,
				{
					themeId: { any: [2] },
					sectorId: { any: [1] },
					tagId: { any: [3] },
					countryIsoCode: undefined,
				},
				{
					countryIsoCode: { any: ['US'] },
					sectorId: { any: [1] },
					tagId: { any: [3] },
					themeId: undefined,
				},
				{
					countryIsoCode: { any: ['US'] },
					themeId: { any: [2] },
					tagId: { any: [3] },
					sectorId: undefined,
				},
				{
					countryIsoCode: { any: ['US'] },
					themeId: { any: [2] },
					sectorId: { any: [1] },
					tagId: undefined,
				},
			);
			expect(spyFetchFacets).toHaveBeenCalledTimes(1);
			expect(result).toEqual({
				isoCodes: isoCodeFacets,
				themes: themeFacets,
				sectors: sectorFacets,
				tags: tagFacets,
			});
		});
	});

	describe('runLoansQuery', () => {
		let spyFetchLoans;
		const apollo = {};
		const loans = [{ test: 'test' }];
		const totalCount = 5;
		const origin = FLSS_ORIGIN_NOT_SPECIFIED;

		beforeEach(() => {
			spyFetchLoans = jest.spyOn(flssUtils, 'fetchLoans')
				.mockImplementation(() => Promise.resolve({ values: loans, totalCount }));
		});

		afterEach(jest.restoreAllMocks);

		it('should return loans', async () => {
			const result = await runLoansQuery(apollo, mockState, origin);
			expect(spyFetchLoans).toHaveBeenCalledWith(
				apollo,
				getFlssFilters(mockState),
				mockState.sortBy,
				mockState.pageOffset,
				mockState.pageLimit,
				origin,
			);
			expect(result).toEqual({ loans, totalCount });
		});
	});

	describe('fetchLoanFacets', () => {
		const countryFacets = [{ country: { isoCode: 'a', name: 'Country' } }];
		const sector = [{ id: 1, name: 'Test Sector' }];
		const loanThemeFilter = [{ id: 1, name: 'c' }];
		const tag = [{ id: 1, name: 'tag' }];
		const genderOptions = { enumValues: [{ name: 'female' }] };
		const flssSorts = { enumValues: [{ name: 'expiringSoon' }] };
		const standardSorts = { enumValues: [{ name: 'expiringSoon' }] };
		const distributionModelOptions = { enumValues: [{ name: 'direct' }] };
		const partners = [{ id: 1, name: 'Asd', region: 'Africa' }];
		const general = { partners: { values: partners } };

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
				tagFacets: [],
				tagIds: [],
				tagNames: [],
				genderFacets: [],
				genders: [],
				flssSorts: [],
				standardSorts: [],
				distributionModelFacets: [],
				distributionModels: [],
				partnerFacets: [],
				partnerIds: [],
				partnerNames: [],
			});
		});

		it('should return the facets data', async () => {
			const dataObj = {
				data: {
					lend: {
						countryFacets,
						sector,
						loanThemeFilter,
						tag,
					},
					general,
					genderOptions,
					flssSorts,
					standardSorts,
					distributionModelOptions,
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
				tagFacets: tag,
				tagIds: [1],
				tagNames: ['TAG'],
				genderFacets: [{ name: 'female' }],
				genders: ['FEMALE'],
				flssSorts: [{ name: 'expiringSoon' }],
				standardSorts: [{ name: 'expiringSoon' }],
				distributionModelFacets: [{ name: 'direct' }],
				distributionModels: ['DIRECT'],
				partnerFacets: partners,
				partnerIds: [1],
				partnerNames: ['ASD'],
			});
		});
	});
});
