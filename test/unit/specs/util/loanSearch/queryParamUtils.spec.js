import {
	applyQueryParams,
	updateQueryParams,
	getIdsFromQueryParam,
	getCountryIsoCodesFromQueryParam,
	hasExcludedQueryParams,
	getEnumNameFromQueryParam,
	getBooleanValueFromQueryParam,
	getMinMaxRangeFromQueryParam,
	getIsIndividualFromQueryParam,
} from '@/util/loanSearch/queryParamUtils';
import {
	FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE, lenderRepaymentTermValueMap, SIXTEEN_MONTHS_KEY
} from '@/util/loanSearch/filterUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';
import { createMinMaxRange } from '@/util/loanSearch/minMaxRange';
import { mockState, mockAllFacets } from '../../../fixtures/mockLoanSearchData';

describe('queryParamUtils.js', () => {
	describe('hasExcludedQueryParams', () => {
		it('should return true', () => {
			expect(hasExcludedQueryParams({ activity: [] })).toBe(true);
			expect(hasExcludedQueryParams({ city_state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ defaultRate: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanTags: [] })).toBe(true);
			expect(hasExcludedQueryParams({ riskRating: [] })).toBe(true);
			expect(hasExcludedQueryParams({ state: [] })).toBe(true);
			expect(hasExcludedQueryParams({ loanLimit: [] })).toBe(true);
		});

		it('should return false', () => {
			expect(hasExcludedQueryParams({ test: [] })).toBe(false);
		});
	});

	describe('getEnumNameFromQueryParam', () => {
		const facets = [{ name: 'a' }, { name: 'b' }];

		it('should handle empty', () => {
			expect(getEnumNameFromQueryParam(undefined, [])).toBe(undefined);
			expect(getEnumNameFromQueryParam('', [])).toBe(undefined);
		});

		it('should return undefined when no match', () => {
			expect(getEnumNameFromQueryParam('asd', [])).toBe(undefined);
			expect(getEnumNameFromQueryParam('', [{ name: 'asd' }])).toBe(undefined);
		});

		it('should get name', () => {
			expect(getEnumNameFromQueryParam('a', facets)).toBe('a');
		});

		it('should get name regardless of casing', () => {
			expect(getEnumNameFromQueryParam('A', facets)).toBe('a');
			expect(getEnumNameFromQueryParam('a', facets.map(f => ({ name: f.name.toUpperCase() })))).toBe('A');
		});
	});

	describe('getBooleanValueFromQueryParam', () => {
		it('should handle non-boolean', () => {
			expect(getBooleanValueFromQueryParam('')).toBe(null);
			expect(getBooleanValueFromQueryParam('asd')).toBe(null);
		});

		it('should get boolean', () => {
			expect(getBooleanValueFromQueryParam('true')).toBe(true);
			expect(getBooleanValueFromQueryParam('false')).toBe(false);
		});

		it('should get boolean regardless of casing', () => {
			expect(getBooleanValueFromQueryParam('True')).toBe(true);
			expect(getBooleanValueFromQueryParam('FALSE')).toBe(false);
		});
	});

	describe('getMinMaxRangeFromQueryParam', () => {
		it('should handle bad param', () => {
			expect(getMinMaxRangeFromQueryParam()).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam('')).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam('1,')).toBe(undefined);
			expect(getMinMaxRangeFromQueryParam(',1')).toBe(undefined);
		});

		it('should get range', () => {
			expect(getMinMaxRangeFromQueryParam('1,3')).toEqual(createMinMaxRange(1, 3));
			expect(getMinMaxRangeFromQueryParam('0,400')).toEqual(createMinMaxRange(0, 400));
		});
	});

	describe('getIsIndividualFromQueryParam', () => {
		it('should handle bad param', () => {
			expect(getIsIndividualFromQueryParam()).toBe(null);
			expect(getIsIndividualFromQueryParam('')).toBe(null);
			expect(getIsIndividualFromQueryParam('asd')).toBe(null);
		});

		it('should get is individual', () => {
			expect(getIsIndividualFromQueryParam('true')).toBe(false);
			expect(getIsIndividualFromQueryParam('false')).toBe(true);
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

		it('should handle theme name single sector', () => {
			const query = 'Theme 1';

			const result = getIdsFromQueryParam(query, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1]);
		});

		it('should handle theme name list', () => {
			const query = 'Theme 1,Theme 2';

			const result = getIdsFromQueryParam(query, mockAllFacets.themeNames, mockAllFacets.themeFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag FLSS and legacy single sector', () => {
			const tag = '1';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1]);
		});

		it('should handle tag FLSS and legacy list', () => {
			const tag = '1,2';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag FLSS and legacy list trailing separator', () => {
			const tag = '1,2,';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag Algolia single sector', () => {
			const tag = 'Tag 1';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1]);
		});

		it('should handle tag Algolia list', () => {
			const tag = 'Tag 1~Tag 2';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

			expect(result).toEqual([1, 2]);
		});

		it('should handle tag Algolia list trailing separator', () => {
			const tag = 'Tag 1~Tag 2~';

			const result = getIdsFromQueryParam(tag, mockAllFacets.tagNames, mockAllFacets.tagFacets);

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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: false,
						lenderRepaymentTerm: {
							...lenderRepaymentTermValueMap[SIXTEEN_MONTHS_KEY],
							__typename: 'MinMaxRange'
						},
						keywordSearch: 'search',
						partnerId: [1],
					}
				}
			};
			const query = {
				gender: 'female',
				country: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attribute: '1',
				tag: '1',
				page: '2',
				distributionModel: 'DIRECT',
				isGroup: 'true',
				lenderTerm: '0,16',
				queryString: 'search',
				partner: '1',
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
						sortBy: 'popularityScore',
						sectorId: [],
						themeId: [],
						tagId: [],
						pageOffset: 0,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
						tagId: [],
						pageOffset: 0,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
						tagId: [],
						pageOffset: 15,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
						tagId: [],
						pageOffset: 0,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
						tagId: [],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
						tagId: [],
						pageOffset: 0,
						pageLimit: 5,
						distributionModel: null,
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
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
				tag: '1',
				page: '3',
				distributionModel: 'DIRECT',
				isGroup: 'true',
				lenderTerm: '0,8',
				queryString: 'search',
				partner: '1',
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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attribute: '1',
				tag: '1',
				page: '2',
				distributionModel: 'DIRECT',
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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attributes: 'theme 1',
				tag: 'tag 1',
				page: '2',
				distributionModel: 'DIRECT',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle different gender casing', async () => {
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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
					}
				}
			};
			const query = {
				gender: 'FEMALE',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attributes: 'theme 1',
				tag: 'tag 1',
				page: '2',
				distributionModel: 'DIRECT',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle different distribution model casing', async () => {
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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: null,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attributes: 'theme 1',
				tag: 'tag 1',
				page: '2',
				distributionModel: 'direct',
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});

		it('should handle different is group casing', async () => {
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
						tagId: [1],
						pageOffset: 5,
						pageLimit: 5,
						distributionModel: 'DIRECT',
						isIndividual: false,
						lenderRepaymentTerm: null,
						keywordSearch: null,
						partnerId: [],
					}
				}
			};
			const query = {
				gender: 'female',
				countries: 'us',
				sector: mockState.sectorId.toString(),
				sortBy: 'expiringSoon',
				attributes: 'theme 1',
				tag: 'tag 1',
				page: '2',
				distributionModel: 'direct',
				isGroup: 'TRUE'
			};

			await applyQueryParams(apollo, query, mockAllFacets, FLSS_QUERY_TYPE, mockState.pageLimit, mockState);

			expect(apollo.mutate).toHaveBeenCalledWith(params);
		});
	});

	describe('updateQueryParams', () => {
		const getRouter = (query = {}) => ({
			currentRoute: { name: 'name', query },
			push: jest.fn().mockReturnValue({ catch: jest.fn() }),
		});

		it('should preserve UTM params', () => {
			const state = { gender: 'female' };
			const router = getRouter({ utm_test: 'test' });

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { ...state, utm_test: 'test' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push gender', () => {
			const state = { gender: 'female' };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: state,
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push sector IDs', () => {
			const state = { sectorId: [1, 2] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sector: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty sector ID', () => {
			const state = { gender: 'female', sectorId: [] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push theme IDs', () => {
			const state = { themeId: [1, 2] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { attribute: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty theme ID', () => {
			const state = { gender: 'female', themeId: [] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push tag IDs', () => {
			const state = { tagId: [1, 2] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { tag: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty tag ID', () => {
			const state = { gender: 'female', tagId: [] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push mapped FLSS sort value', () => {
			const state = { sortBy: 'popularityScore' };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'popularity' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push standard sort value', () => {
			const state = { sortBy: 'personalized' };
			const router = getRouter();

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { sortBy: 'personalized' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push page', () => {
			const state = { pageOffset: 10, pageLimit: 2 };
			const router = getRouter();

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { page: '6' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should remove page if first page', () => {
			const state = { pageOffset: 0, pageLimit: 2 };
			const router = getRouter({ page: '1' });

			updateQueryParams(state, router, STANDARD_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push ISO code', () => {
			const state = { countryIsoCode: ['US', 'CA'] };
			const router = getRouter();

			updateQueryParams(state, router, mockAllFacets, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { country: 'US,CA' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push identical query string', () => {
			const state = { gender: 'female' };
			const router = getRouter({ gender: 'female' });

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledTimes(0);
		});

		it('should push distribution model', () => {
			const state = { distributionModel: 'DIRECT' };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: state,
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push is group', () => {
			const state = { isIndividual: false };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { isGroup: 'true' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push lender term', () => {
			const state = { lenderRepaymentTerm: { min: 0, max: 8, __typename: 'MinMaxRange' } };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { lenderTerm: '0,8' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push queryString', () => {
			const state = { keywordSearch: 'search' };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { queryString: 'search' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should push partner IDs', () => {
			const state = { partnerId: [1, 2] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { partner: '1,2' },
				params: { noScroll: true, noAnalytics: true }
			});
		});

		it('should not push empty partner IDs', () => {
			const state = { gender: 'female', partnerId: [] };
			const router = getRouter();

			updateQueryParams(state, router, FLSS_QUERY_TYPE);

			expect(router.push).toHaveBeenCalledWith({
				name: 'name',
				query: { gender: 'female' },
				params: { noScroll: true, noAnalytics: true }
			});
		});
	});
});
