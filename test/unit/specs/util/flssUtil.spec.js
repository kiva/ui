// import { it } from 'date-fns/locale';
import gql from 'graphql-tag';
import * as flssUtils from '@/util/flssUtils';
import flssLoanQuery from '@/graphql/query/flssLoansQuery.graphql';

describe('flssUtils.js', () => {
	describe('fetchData', () => {
		const result = { values: [], totalCount: 0 };
		const dataObj = {
			data: { fundraisingLoans: result }
		};

		const apollo = {
			query: jest.fn(() => Promise.resolve(dataObj)),
		};

		const loanQueryFilters = { any: ['US'] };

		const apolloVariables = {
			query: flssLoanQuery,
			variables: {
				filterObject: loanQueryFilters,
				limit: 20
			},
			fetchPolicy: 'network-only',
		};

		it('Checks if the query filters are run through apollo', () => {
			flssUtils.fetchData(loanQueryFilters, apollo);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('Returns the currently fundraising loans data', done => {
			flssUtils.fetchData(loanQueryFilters, apollo).then(data => {
				expect(data).toBe(result);
				done();
			});
		});
	});

	describe('filterGender', () => {
		const bothGenders = { any: ['female', 'male'] };
		const singleGender = { any: ['female'] };

		it('Checks if the query filters for male and female are created', () => {
			const output = flssUtils.filterGender('both');
			expect(output).toEqual(bothGenders);
		});

		it('Checks if the query filters for a single gender are created', () => {
			const output = flssUtils.filterGender('female');
			expect(output).toEqual(singleGender);
		});

		it('Check invalid input and return empty filter', () => {
			expect(flssUtils.filterGender('nope')).toEqual({});
		});
	});

	describe('validateSectorInput', () => {
		const notValid = false;
		const isValid = true;
		const allSectors = [
			{ id: 1, name: 'Agriculture' },
			{ id: 3, name: 'Transportation' },
			{ id: 4, name: 'Services' },
			{ id: 5, name: 'Clothing' },
			{ id: 6, name: 'Health' },
			{ id: 7, name: 'Retail' },
			{ id: 8, name: 'Manufacturing' },
			{ id: 9, name: 'Arts' },
			{ id: 10, name: 'Housing' },
			{ id: 12, name: 'Food' },
			{ id: 13, name: 'Wholesale' },
			{ id: 14, name: 'Construction' },
			{ id: 15, name: 'Education' },
			{ id: 16, name: 'Personal Use' },
			{ id: 17, name: 'Entertainment' }
		];
		const sectorNames = allSectors.map(a => a.name);

		it('Checks if sectorList is empty', () => {
			const output = flssUtils.validateSectorInput([], sectorNames);
			expect(output).toEqual(notValid);
		});

		it('Checks if sectorList element is not valid', () => {
			const output = flssUtils.validateSectorInput(['Food', 'dairy'], sectorNames);
			expect(output).toEqual(notValid);
		});

		it('Checks if sectorList elements are all valid', () => {
			const output = flssUtils.validateSectorInput(['Food', 'Education'], sectorNames);
			expect(output).toEqual(isValid);
		});
	});

	describe('filterSector', () => {
		const isValid = { any: ['Food', 'Education'] };
		const notValid = { none: [] };
		const allSectors = [
			{ id: 1, name: 'Agriculture' },
			{ id: 3, name: 'Transportation' },
			{ id: 4, name: 'Services' },
			{ id: 5, name: 'Clothing' },
			{ id: 6, name: 'Health' },
			{ id: 7, name: 'Retail' },
			{ id: 8, name: 'Manufacturing' },
			{ id: 9, name: 'Arts' },
			{ id: 10, name: 'Housing' },
			{ id: 12, name: 'Food' },
			{ id: 13, name: 'Wholesale' },
			{ id: 14, name: 'Construction' },
			{ id: 15, name: 'Education' },
			{ id: 16, name: 'Personal Use' },
			{ id: 17, name: 'Entertainment' }
		];
		const sectorNames = allSectors.map(a => a.name);

		it('Checks if filterSector is constructed as no filter with empty sector list', () => {
			const input = [];
			const output = flssUtils.filterSector(input, sectorNames);
			expect(output).toEqual(notValid);
		});

		it('Checks if filterSector is constructed as no filter with invalid sector', () => {
			const input = ['Food', 'education'];
			const output = flssUtils.filterSector(input, sectorNames);
			expect(output).toEqual(notValid);
		});

		it('Checks if filterSector is constructed correctly with valid input', () => {
			const input = ['Food', 'Education'];
			const output = flssUtils.filterSector(input, sectorNames);
			expect(output).toEqual(isValid);
		});
	});

	describe('fetchSectors', () => {
		const dataObj = [
			{ id: 1, name: 'Agriculture' },
			{ id: 3, name: 'Transportation' },
			{ id: 4, name: 'Services' },
			{ id: 5, name: 'Clothing' }
		];

		const sectorQuery = gql`query sectors {lend { sector { id name } } }`;

		const apollo = {
			query: jest.fn(() => Promise.resolve(dataObj)),
		};

		const apolloVars = {
			query: sectorQuery,
		};

		it('Checks if fetchSector calls the correct query variables to apollo', () => {
			flssUtils.fetchSectors(apollo);
			expect(apollo.query).toHaveBeenCalledWith(apolloVars);
		});
	});

	describe('fetchCountryFacets', () => {
		const dataObj = [
			{
				country: {
					name: 'Cambodia',
					isoCode: 'KH',
					geocode: {
						latitude: 13,
						longitude: 105
					},
					fundsLentInCountry: 67608825,
					numLoansFundraising: 18,
					region: 'Asia'
				},
				count: 18
			},
		];

		const countryQuery = gql`
query countryFacets {
	lend {
		countryFacets {
			country {
				name
				isoCode
				geocode {latitude longitude}
				fundsLentInCountry
				numLoansFundraising
				region }
				count }
			}
	}`;

		const apollo = {
			query: jest.fn(() => Promise.resolve(dataObj)),
		};

		const apolloVars = {
			query: countryQuery,
		};

		it('Checks if fetchCountryFacets calls the correct query variables to apollo', () => {
			flssUtils.fetchCountryFacets(apollo);
			expect(apollo.query).toHaveBeenCalledWith(apolloVars);
		});
	});

	describe('filterCountry', () => {
		const isValid = { any: ['TZ', 'KE'] };
		const notValid = { none: [] };

		const country = ['TZ', 'KE'];
		const allCountries = ['TZ', 'KE', 'US'];

		it('Checks if filterCountry forms the correct loan filter query format ', () => {
			const output = flssUtils.filterCountry(country, allCountries);
			expect(output).toEqual(isValid);
		});

		it('Checks if filterCountry forms any empty loan filter query format with empty array', () => {
			const output = flssUtils.filterCountry([], allCountries);
			expect(output).toEqual(notValid);
		});

		it('Checks if filterCountry forms any empty loan filter query format with invalid country input', () => {
			const output = flssUtils.filterCountry(['Constantinople'], allCountries);
			expect(output).toEqual(notValid);
		});
	});
});
