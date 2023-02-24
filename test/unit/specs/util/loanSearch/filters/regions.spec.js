import regions, {
	transformIsoCodes,
	getCountryIsoCodesFromQueryParam,
	getUpdatedRegions
} from '@/util/loanSearch/filters/regions';
import { FLSS_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import {
	mockTransformedRegions,
	mockAllFacets,
	mockTransformedMiddleEast,
	mockTransformedChile,
	mockTransformedColombia,
	mockTransformedSouthAmerica,
	mockState,
} from '../../../../fixtures/mockLoanSearchData';

describe('regions.js', () => {
	describe('regions', () => {
		describe('getFilterChips', () => {
			it('should handle undefined', () => {
				expect(regions.getFilterChips({}, mockAllFacets)).toEqual([]);
			});

			it('should return chips', () => {
				const result = regions.getFilterChips({ countryIsoCode: ['US'] }, mockAllFacets);

				const expected = [mockAllFacets.countryFacets[0].country];

				expect(result).toEqual(expected);
			});
		});

		describe('getRemovedFacet', () => {
			it('should remove facet', () => {
				expect(regions.getRemovedFacet({ countryIsoCode: ['US'] }, { isoCode: 'US' }))
					.toEqual({ countryIsoCode: [] });
			});
		});

		describe('getValidatedSearchState', () => {
			it('should handle undefined', () => {
				const result = regions.getValidatedSearchState({}, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ countryIsoCode: [] });
			});

			it('should validate country ISO code', () => {
				const state = { countryIsoCode: ['asd'] };

				const result = regions.getValidatedSearchState(state, mockAllFacets, FLSS_QUERY_TYPE);

				expect(result).toEqual({ countryIsoCode: [] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('it should get filter', () => {
				const query = { countries: 'US' };

				const result = regions.getFilterFromQuery(
					query,
					mockAllFacets,
					mockState.pageLimit,
					FLSS_QUERY_TYPE
				);

				expect(result).toEqual({ countryIsoCode: ['US'] });
			});
		});

		describe('getFilterFromQuery', () => {
			it('should handle Algolia countries param', () => {
				const query = { countries: 'us' };

				const result = regions.getFilterFromQuery(query, mockAllFacets, mockState.pageLimit, FLSS_QUERY_TYPE);

				expect(result).toEqual({ countryIsoCode: ['US'] });
			});

			it('should push ISO code', () => {
				const state = { countryIsoCode: ['US', 'CA'] };

				const result = regions.getQueryFromFilter(state, FLSS_QUERY_TYPE);

				expect(result).toEqual({ country: 'US,CA' });
			});
		});

		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(regions.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(regions.getFlssFilter({ countryIsoCode: [] })).toEqual({});
			});

			it('should return filters', () => {
				expect(regions.getFlssFilter({ countryIsoCode: ['US'] })).toEqual({ countryIsoCode: { any: ['US'] } });
			});
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

	describe('getCountryIsoCodesFromQueryParam', () => {
		it('should handle empty', () => {
			expect(getCountryIsoCodesFromQueryParam()).toBe(undefined);
			expect(getCountryIsoCodesFromQueryParam('')).toBe(undefined);
			expect(getCountryIsoCodesFromQueryParam('asd', undefined)).toEqual([]);
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
});
