// import { it } from 'date-fns/locale';
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

		it('Checks if sectorList is empty', () => {
			const output = flssUtils.validateSectorInput([]);
			expect(output).toEqual(notValid);
		});

		it('Checks if sectorList element is not valid', () => {
			const output = flssUtils.validateSectorInput(['Food', 'dairy']);
			expect(output).toEqual(notValid);
		});

		it('Checks if sectorList elements are all valid', () => {
			const output = flssUtils.validateSectorInput(['Food', 'Education']);
			expect(output).toEqual(isValid);
		});
	});

	describe('filterSector', () => {
		const isValid = { any: ['Food', 'Education'] };
		const notValid = { none: [] };

		it('Checks if filterSector is constructed as no filter with empty sector list', () => {
			const output = flssUtils.filterSector(['Food', 'education']);
			expect(output).toEqual(notValid);
		});

		it('Checks if filterSector is constructed as no filter with invalid sector', () => {
			const output = flssUtils.filterSector(['Food', 'education']);
			expect(output).toEqual(notValid);
		});

		it('Checks if filterSector is constructed correctly with valid input', () => {
			const output = flssUtils.filterSector(['Food', 'Education']);
			expect(output).toEqual(isValid);
		});
	});
});
