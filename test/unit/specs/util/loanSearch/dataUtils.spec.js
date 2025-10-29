import {
	runFacetsQueries,
	runLoansQuery,
	fetchLoanFacets,
	runRecommendationsQuery
} from '../../../../../src/util/loanSearch/dataUtils';
import * as flssUtils from '../../../../../src/util/flssUtils';
import loanFacetsQuery from '../../../../../src/graphql/query/loanFacetsQuery.graphql';
import loanEnumsQuery from '../../../../../src/graphql/query/loanEnumsQuery.graphql';
import { getFlssFilters, FLSS_ORIGIN_NOT_SPECIFIED } from '../../../../../src/util/flssUtils';
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
			spyFetchFacets = vi.spyOn(flssUtils, 'fetchFacets')
				.mockImplementation(() => Promise.resolve({
					isoCodes,
					themes,
					sectors,
					tags,
				}));
		});

		afterEach(vi.restoreAllMocks);

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
			spyFetchLoans = vi.spyOn(flssUtils, 'fetchLoans')
				.mockImplementation(() => Promise.resolve({ values: loans, totalCount }));
		});

		afterEach(vi.restoreAllMocks);

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

	describe('runRecommendationsQuery', () => {
		let spyFetchRecommendedLoans;
		const apollo = {};
		const loans = [{ test: 'test' }];
		const totalCount = 5;
		const origin = FLSS_ORIGIN_NOT_SPECIFIED;
		const fakeUserId = 54321;
		const limit = 12;
		beforeEach(() => {
			spyFetchRecommendedLoans = vi.spyOn(flssUtils, 'fetchRecommendedLoans')
				.mockImplementation(() => Promise.resolve({ values: loans, totalCount }));
		});

		afterEach(vi.restoreAllMocks);

		it('should return recommended loans', async () => {
			const result = await runRecommendationsQuery(apollo, {
				origin,
				filterObject: null,
				sortBy: 'personalized',
				userId: fakeUserId,
				limit
			});
			expect(spyFetchRecommendedLoans).toHaveBeenCalledWith(
				apollo,
				origin,
				null,
				'personalized',
				fakeUserId,
				limit
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
		const activity = [{ id: 1, name: 'Test Activity' }];

		it('should pass the correct query variables to apollo', async () => {
			const apollo = { query: vi.fn(() => Promise.resolve({})) };
			await fetchLoanFacets(apollo);
			const apolloVariables = { query: loanFacetsQuery, fetchPolicy: 'network-only' };
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
			const apolloEnumsVariables = { query: loanEnumsQuery, fetchPolicy: 'network-only' };
			expect(apollo.query).toHaveBeenCalledWith(apolloEnumsVariables);
		});

		it('should handle error gracefully', async () => {
			const apollo = { query: vi.fn(() => Promise.reject(new Error('Query failed'))) };
			const data = await fetchLoanFacets(apollo);

			expect(data).toBeUndefined();
		});

		it('should handle undefined', async () => {
			const dataObj = { data: { } };
			const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
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
				activityFacets: [],
				activityIds: [],
				activityNames: [],
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
						activity,
					},
					general,
					genderOptions,
					flssSorts,
					standardSorts,
					distributionModelOptions,
				}
			};

			const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
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
				activityFacets: activity,
				activityIds: [1],
				activityNames: ['TEST ACTIVITY'],
			});
		});

		it('should handle partial data with empty facets', async () => {
			const dataObj = {
				data: {
					lend: {
						countryFacets: [],
						sector: [],
						loanThemeFilter: [],
						tag: [],
						activity: []
					},
					general: { partners: { values: [] } },
					genderOptions: { enumValues: [] },
					flssSorts: { enumValues: [] },
					standardSorts: { enumValues: [] },
					distributionModelOptions: { enumValues: [] }
				}
			};
			const apollo = { query: vi.fn(() => Promise.resolve(dataObj)) };
			const data = await fetchLoanFacets(apollo);

			expect(data.sectorFacets).toEqual([]);
			expect(data.partnerFacets).toEqual([]);
			expect(data.themeFacets).toEqual([]);
			expect(data.genders).toEqual([]);
		});
	});

	describe('runFacetsQueries edge cases', () => {
		it('should handle null facets response', async () => {
			const spyFetchFacets = vi.spyOn(flssUtils, 'fetchFacets')
				.mockResolvedValue(null);

			const apollo = {};
			const result = await runFacetsQueries(apollo, {});

			expect(result).toEqual({
				isoCodes: [],
				themes: [],
				sectors: [],
				tags: []
			});

			spyFetchFacets.mockRestore();
		});

		it('should handle facets with missing nested properties', async () => {
			const spyFetchFacets = vi.spyOn(flssUtils, 'fetchFacets')
				.mockResolvedValue({
					isoCodes: {},
					themes: { facets: {} },
					sectors: null,
					tags: undefined
				});

			const apollo = {};
			const result = await runFacetsQueries(apollo, {});

			expect(result).toEqual({
				isoCodes: [],
				themes: [],
				sectors: [],
				tags: []
			});

			spyFetchFacets.mockRestore();
		});
	});

	describe('runLoansQuery edge cases', () => {
		it('should filter out null loans from results', async () => {
			const spyFetchLoans = vi.spyOn(flssUtils, 'fetchLoans')
				.mockResolvedValue({
					values: [{ id: 1 }, null, { id: 2 }, null, { id: 3 }],
					totalCount: 5
				});

			const apollo = {};
			const result = await runLoansQuery(apollo, mockState, 'web:test');

			expect(result.loans).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
			expect(result.totalCount).toBe(5);

			spyFetchLoans.mockRestore();
		});

		it('should handle null response from fetchLoans', async () => {
			const spyFetchLoans = vi.spyOn(flssUtils, 'fetchLoans')
				.mockResolvedValue(null);

			const apollo = {};
			const result = await runLoansQuery(apollo, mockState, 'web:test');

			expect(result).toEqual({ loans: [], totalCount: 0 });

			spyFetchLoans.mockRestore();
		});
	});

	describe('runRecommendationsQuery edge cases', () => {
		it('should filter out null loans from recommendations', async () => {
			const spyFetchRecommended = vi.spyOn(flssUtils, 'fetchRecommendedLoans')
				.mockResolvedValue({
					values: [{ id: 10 }, null, { id: 20 }],
					totalCount: 3
				});

			const apollo = {};
			const result = await runRecommendationsQuery(apollo, { userId: 123 });

			expect(result.loans).toEqual([{ id: 10 }, { id: 20 }]);
			expect(result.totalCount).toBe(3);

			spyFetchRecommended.mockRestore();
		});

		it('should handle null response from fetchRecommendedLoans', async () => {
			const spyFetchRecommended = vi.spyOn(flssUtils, 'fetchRecommendedLoans')
				.mockResolvedValue(null);

			const apollo = {};
			const result = await runRecommendationsQuery(apollo, {});

			expect(result).toEqual({ loans: [], totalCount: 0 });

			spyFetchRecommended.mockRestore();
		});

		it('should use default parameters when options not provided', async () => {
			const spyFetchRecommended = vi.spyOn(flssUtils, 'fetchRecommendedLoans')
				.mockResolvedValue({ values: [], totalCount: 0 });

			const apollo = {};
			await runRecommendationsQuery(apollo);

			expect(spyFetchRecommended).toHaveBeenCalledWith(
				apollo,
				FLSS_ORIGIN_NOT_SPECIFIED,
				null,
				'personalized',
				null,
				null
			);

			spyFetchRecommended.mockRestore();
		});
	});
});
