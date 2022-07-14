import {
	applyQueryParams,
	updateQueryParams,
	getIdsFromQueryParam,
	getCountryIsoCodesFromQueryParam,
} from '@/util/loanSearch/queryParamUtils';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import { mockState, mockAllFacets } from './mockData';

describe('queryParamUtils.js', () => {
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
