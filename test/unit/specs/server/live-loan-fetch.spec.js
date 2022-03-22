const fetch = require('../../../../server/util/fetch');
const fetchLoansByType = require('../../../../server/util/live-loan/live-loan-fetch');

// mock out the fetch module so that no real requests are made
jest.mock('../../../../server/util/fetch');

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
jest.mock('../../../../server/util/argv', () => {
	return {};
});

describe('live-loan-fetch', () => {
	describe('fetchRecommendationsByLegacyFilter', () => {
		// Extract the variables used in the graphql query performed by fetchLoansByType when given inputString
		async function readParsedVariable(inputString) {
			// Reset fetch mock and make it return a resolved promise when called
			fetch.mockClear();
			fetch.mockResolvedValue({ json: () => {} });

			// Run the filter parsing
			await fetchLoansByType('filter', inputString);

			// Extract the grahpql query variables
			const { variables } = JSON.parse(fetch.mock.calls[0][1].body);
			return variables;
		}

		// Test that expectedFilters are used for the graphql query that's based on the inputString
		async function testFilterParsing(inputString, expectedFilters) {
			const { filters } = await readParsedVariable(inputString);
			expect(filters).toEqual(expectedFilters);
		}

		// Test that expectedSort is used for the graphql query that's based on the inputString
		async function testSortParsing(inputString, expectedSort) {
			const { sort } = await readParsedVariable(inputString);
			expect(sort).toEqual(expectedSort);
		}

		it('converts input strings to valid LoanSearchFiltersInput objects', async () => {
			await testFilterParsing('gender_male,sector_education', { gender: 'male', sector: [15] });
			await testFilterParsing('sector_retail', { sector: [7] });
			await testFilterParsing('gender_female', { gender: 'female' });
			await testFilterParsing('country_us,country_pr', { country: ['us', 'pr'] });
			await testFilterParsing('country_co,country_ke', { country: ['co', 'ke'] });
			await testFilterParsing('gender_female,country_us', { gender: 'female', country: ['us'] });
			await testFilterParsing('gender_male,sector_arts,sector_agriculture', { gender: 'male', sector: [9, 1] });
			await testFilterParsing('sector_personal use', { sector: [16] });
			await testFilterParsing('sort_expiringSoon,gender_female', { gender: 'female' });
			await testFilterParsing('theme_green', { theme: ['Green'] });
			await testFilterParsing('theme_disaster recovery', { theme: ['Disaster recovery'] });
			await testFilterParsing('theme_refugees/displaced', { theme: ['Refugees/Displaced'] });
			await testFilterParsing('theme_start-up', { theme: ['Start-Up'] });
			await testFilterParsing('theme_youth,theme_green', { theme: ['Youth', 'Green'] });
			await testFilterParsing('tag_u.s. black-owned businesses',
				{ tag: ['U.S. Black-owned Businesses'] });
			await testFilterParsing('tag_u.s. black-owned businesses,theme_green',
				{ tag: ['U.S. Black-owned Businesses'], theme: ['Green'] });
			await testFilterParsing('tag_latinx/hispanic owned business,tag_u.s. black-owned businesses',
				{ tag: ['Latinx/Hispanic Owned Business', 'U.S. Black-owned Businesses'] });

			await testFilterParsing('notafilter_value', {});
			await testFilterParsing('sector_notasector', {});
			await testFilterParsing('theme_notatheme', {});
			await testFilterParsing('', {});
			await testFilterParsing('1234', {});
		});

		it('converts input strings to valid LoanSearchSortByEnum values', async () => {
			await testSortParsing('sort_newest', 'newest');
			await testSortParsing('sort_expiringSoon,gender_female', 'expiringSoon');

			await testSortParsing('sort_notasort', null);
			await testSortParsing('gender_female', null);
			await testSortParsing('', null);
			await testSortParsing('1234', null);
		});

		// TODO: activate this test (by removing .skip) once FLSS is used for live loan searching
		it.skip('converts input strings to valid [FundraisingLoanSearchFilterInput!] arrays', async () => {
			await testFilterParsing('gender_male,sector_education', [
				{ gender: { eq: 'male' } },
				{ sector: { eq: 'education' } }
			]);
			await testFilterParsing('sector_retail', [
				{ sector: { eq: 'retail' } }
			]);
			await testFilterParsing('country_us,country_pr', [
				{ countryIsoCode: { eq: 'us' } },
				{ countryIsoCode: { eq: 'pr' } }
			]);

			await testFilterParsing('notafilter_value', []);
			await testFilterParsing('', []);
			await testFilterParsing('1234', []);
		});
	});
});
