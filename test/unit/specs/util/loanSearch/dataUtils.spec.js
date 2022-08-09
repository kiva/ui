import { runFacetsQueries, runLoansQuery, fetchLoanFacets } from '@/util/loanSearch/dataUtils';
import * as flssUtils from '@/util/flssUtils';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';
import { getFlssFilters } from '@/util/flssUtils';
import { mockState } from './mockData';

describe('dataUtils.js', () => {
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
});
