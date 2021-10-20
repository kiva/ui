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
		// Test that the given filterString results in the expectedFilters being used for the loan search query
		async function testFilterParsing(filterString, expectedFilters) {
			// Reset fetch mock and make it return a resolved promise when called
			fetch.mockClear();
			fetch.mockResolvedValue({ json: () => {} });

			// Run the filter parsing
			await fetchLoansByType('filter', filterString);

			// Check that the grahpql query variables match what is expected
			const { variables } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(variables.filters).toEqual(expectedFilters);
		}

		it('converts filter strings to valid LoanSearchFiltersInput objects', async () => {
			await testFilterParsing('gender_male,sector_education', { gender: 'male', sector: [15] });
			await testFilterParsing('sector_retail', { sector: [7] });
			await testFilterParsing('gender_female', { gender: 'female' });
			await testFilterParsing('country_us,country_pr', { country: ['us', 'pr'] });
			await testFilterParsing('country_co,country_ke', { country: ['co', 'ke'] });
			await testFilterParsing('gender_female,country_us', { gender: 'female', country: ['us'] });
			await testFilterParsing('gender_male,sector_arts,sector_agriculture', { gender: 'male', sector: [9, 1] });
			await testFilterParsing('sector_personal use', { sector: [16] });
			await testFilterParsing('theme_green', { theme: ['Green'] });
			await testFilterParsing('theme_disaster recovery', { theme: ['Disaster recovery'] });
			await testFilterParsing('theme_refugees/displaced', { theme: ['Refugees/Displaced'] });
			await testFilterParsing('theme_start-up', { theme: ['Start-Up'] });
			await testFilterParsing('theme_youth,theme_green', { theme: ['Youth', 'Green'] });

			await testFilterParsing('notafilter_value', {});
			await testFilterParsing('sector_notasector', {});
			await testFilterParsing('theme_notatheme', {});
			await testFilterParsing('', {});
			await testFilterParsing('1234', {});
		});

		// TODO: activate this test (by removing .skip) once FLSS is used for live loan searching
		it.skip('converts filter strings to valid [FundraisingLoanSearchFilterInput!] arrays', async () => {
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
