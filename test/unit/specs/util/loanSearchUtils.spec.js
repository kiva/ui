import { getIsoCodes, transformCountryFacets, updateSearchState } from '@/util/loanSearchUtils';
import updateLoanSearchMutation from '@/graphql/mutation/updateLoanSearchState.graphql';

const mockTransformedRegions = [
	{
		region: 'Middle East',
		numLoansFundraising: 44,
		countries: [
			{
				name: 'Jordan',
				isoCode: 'JO',
				geocode: {
					latitude: 31,
					longitude: 36,
					__typename: 'Geocode'
				},
				numLoansFundraising: 44,
				region: 'Middle East',
				__typename: 'Country'
			}
		]
	},
	{
		region: 'South America',
		numLoansFundraising: 172,
		countries: [
			{
				name: 'Chile',
				isoCode: 'CL',
				geocode: {
					latitude: -30,
					longitude: -71,
					__typename: 'Geocode'
				},
				numLoansFundraising: 20,
				region: 'South America',
				__typename: 'Country'
			},
			{
				name: 'Colombia',
				isoCode: 'CO',
				geocode: {
					latitude: 4,
					longitude: -72,
					__typename: 'Geocode'
				},
				numLoansFundraising: 152,
				region: 'South America',
				__typename: 'Country'
			},
		]
	}
];

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

	describe('transformCountryFacets', () => {
		it('should handle empty', () => {
			const result = transformCountryFacets([]);
			expect(result).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockCountryFacets = [
				{
					country: {
						name: 'Zambia',
						isoCode: 'ZM',
						geocode: {
							latitude: -15,
							longitude: 30,
							__typename: 'Geocode'
						},
						numLoansFundraising: 0,
						region: 'Africa',
						__typename: 'Country'
					},
					__typename: 'CountryFacet'
				},
				{
					country: {
						name: 'Colombia',
						isoCode: 'CO',
						geocode: {
							latitude: 4,
							longitude: -72,
							__typename: 'Geocode'
						},
						numLoansFundraising: 152,
						region: 'South America',
						__typename: 'Country'
					},
					__typename: 'CountryFacet'
				},
				{
					country: {
						name: 'Chile',
						isoCode: 'CL',
						geocode: {
							latitude: -30,
							longitude: -71,
							__typename: 'Geocode'
						},
						numLoansFundraising: 20,
						region: 'South America',
						__typename: 'Country'
					},
					__typename: 'CountryFacet'
				},
				{
					country: {
						name: 'Jordan',
						isoCode: 'JO',
						geocode: {
							latitude: 31,
							longitude: 36,
							__typename: 'Geocode'
						},
						numLoansFundraising: 44,
						region: 'Middle East',
						__typename: 'Country'
					},
					__typename: 'CountryFacet'
				}
			];

			const result = transformCountryFacets(mockCountryFacets);

			expect(result).toEqual(mockTransformedRegions);
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
				'South America': ['Colombia', 'Chile'],
			}).sort()).toEqual(['JO', 'CL', 'CO'].sort());
		});
	});
});
