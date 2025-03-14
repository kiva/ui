const fetch = require('../../../../server/util/fetch');
const fetchLoansByType = require('../../../../server/util/live-loan/live-loan-fetch');

// mock out the fetch module so that no real requests are made
jest.mock('../../../../server/util/fetch');

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
jest.mock('../../../../server/util/argv', () => {
	return {};
});

describe('live-loan-fetch', () => {
	describe('fetchRecommendationsByFilter', () => {
		// Extract the variables used in the graphql query performed by fetchLoansByType when given inputString
		async function readParsedVariable(inputString) {
			// Reset fetch mock and make it return a resolved promise when called
			fetch.default.mockClear();
			fetch.default.mockResolvedValue({ json: () => { } });

			// Run the filter parsing
			await fetchLoansByType.default('filter', inputString);

			// Extract the grahpql query variables
			const { variables } = JSON.parse(fetch.default.mock.calls[0][1].body);
			return variables;
		}

		// Test that expectedFilters are used for the graphql query that's based on the inputString
		async function testFilterParsing(inputString, expectedFilters) {
			const { filters } = await readParsedVariable(inputString);
			expect(filters).toEqual(expectedFilters);
		}

		// Test that expectedSort is used for the graphql query that's based on the inputString
		async function testSortParsingLegacy(inputString, expectedSort) {
			const { sort } = await readParsedVariable(inputString);
			expect(sort).toEqual(expectedSort);
		}
		async function testSortParsing(inputString, expectedSort) {
			const { sortBy } = await readParsedVariable(inputString);
			expect(sortBy).toEqual(expectedSort);
		}

		beforeEach(async () => {
			// Suppress console warnings
			jest.spyOn(console, 'warn').mockImplementation(jest.fn());
		});

		it('converts input strings to valid LoanSearchFiltersInput objects', async () => {
			// Using sort_random forces using the legacy loan search
			await testFilterParsing('sort_random,gender_male,sector_education', { gender: 'male', sector: [15] });
			await testFilterParsing('sort_random,sector_retail', { sector: [7] });
			await testFilterParsing('sort_random,gender_female', { gender: 'female' });
			await testFilterParsing('sort_random,country_us,country_pr', { country: ['us', 'pr'] });
			await testFilterParsing('sort_random,country_co,country_ke', { country: ['co', 'ke'] });
			await testFilterParsing('sort_random,gender_female,country_us', { gender: 'female', country: ['us'] });
			await testFilterParsing(
				'sort_random,gender_male,sector_arts,sector_agriculture',
				{ gender: 'male', sector: [9, 1] }
			);
			await testFilterParsing('sort_random,sector_personal use', { sector: [16] });
			await testFilterParsing('sort_random,gender_female', { gender: 'female' });
			await testFilterParsing('sort_random,theme_green', { theme: ['Green'] });
			await testFilterParsing('sort_random,theme_disaster recovery', { theme: ['Disaster recovery'] });
			await testFilterParsing('sort_random,theme_refugees/displaced', { theme: ['Refugees/Displaced'] });
			await testFilterParsing('sort_random,theme_start-up', { theme: ['Start-Up'] });
			await testFilterParsing('sort_random,theme_youth,theme_green', { theme: ['Youth', 'Green'] });
			await testFilterParsing('sort_random,tag_u.s. black-owned businesses', { loanTags: [43] });
			await testFilterParsing(
				'sort_random,tag_u.s. black-owned businesses,theme_green',
				{ loanTags: [43], theme: ['Green'] }
			);
			await testFilterParsing(
				'sort_random,tag_latinx/hispanic owned business,tag_u.s. black-owned businesses',
				{ loanTags: [45, 43] }
			);
			await testFilterParsing('sort_random,notafilter_value', {});
			await testFilterParsing('sort_random,sector_notasector', {});
			await testFilterParsing('sort_random,theme_notatheme', {});
			await testFilterParsing('sort_random,tag_notatag', {});
			await testFilterParsing('sort_random', {});
			await testFilterParsing('sort_random,1234', {});
		});

		it('converts input strings to valid LoanSearchSortByEnum values', async () => {
			await testSortParsingLegacy('sort_random', 'random');
			await testSortParsingLegacy('sort_random,gender_female', 'random');
		});

		it('converts input strings to valid [FundraisingLoanSearchFilterInput!] arrays', async () => {
			await testFilterParsing(
				'gender_male,sector_education',
				[{ gender: { any: ['male'] } }, { sector: { any: ['education'] } }]
			);
			await testFilterParsing('sector_retail', [{ sector: { any: ['retail'] } }]);
			await testFilterParsing('gender_female', [{ gender: { any: ['female'] } }]);
			await testFilterParsing('country_us,country_pr', [{ countryIsoCode: { any: ['us', 'pr'] } }]);
			await testFilterParsing('country_co,country_ke', [{ countryIsoCode: { any: ['co', 'ke'] } }]);
			await testFilterParsing(
				'gender_female,country_us',
				[{ gender: { any: ['female'] } }, { countryIsoCode: { any: ['us'] } }]
			);
			await testFilterParsing(
				'gender_male,sector_arts,sector_agriculture',
				[{ gender: { any: ['male'] } }, { sector: { any: ['arts', 'agriculture'] } }]
			);
			await testFilterParsing('sector_personal use', [{ sector: { any: ['personal use'] } }]);
			await testFilterParsing('sort_expiringSoon,gender_female', [{ gender: { any: ['female'] } }]);
			await testFilterParsing('theme_green', [{ theme: { any: ['green'] } }]);
			await testFilterParsing('theme_disaster recovery', [{ theme: { any: ['disaster recovery'] } }]);
			await testFilterParsing('theme_refugees/displaced', [{ theme: { any: ['refugees/displaced'] } }]);
			await testFilterParsing('theme_start-up', [{ theme: { any: ['start-up'] } }]);
			await testFilterParsing('theme_youth,theme_green', [{ theme: { any: ['youth', 'green'] } }]);
			await testFilterParsing('tag_u.s. black-owned businesses', [{ tagId: { any: [43] } }]);
			await testFilterParsing(
				'tag_u.s. black-owned businesses,theme_green',
				[{ tagId: { any: [43] } }, { theme: { any: ['green'] } }]
			);
			await testFilterParsing(
				'tag_latinx/hispanic owned business,tag_u.s. black-owned businesses',
				[{ tagId: { any: [45, 43] } }]
			);

			await testFilterParsing(
				'gender_male,sector_education',
				[
					{ gender: { any: ['male'] } },
					{ sector: { any: ['education'] } }
				]
			);
			await testFilterParsing(
				'sector_retail',
				[
					{ sector: { any: ['retail'] } }
				]
			);
			await testFilterParsing(
				'country_us,country_pr',
				[
					{ countryIsoCode: { any: ['us', 'pr'] } },
				]
			);
			await testFilterParsing('notafilter_value', null);
			await testFilterParsing('tag_notatag', null);
			await testFilterParsing('', null);
			await testFilterParsing('1234', null);
		});

		it('converts input strings to valid SortEnum values', async () => {
			await testSortParsing('sort_expiringSoon', 'expiringSoon');
			await testSortParsing('sort_mostRecent,gender_female', 'mostRecent');
			await testSortParsing('sort_researchScore', 'researchScore');

			await testSortParsing('sort_notasort', null);
			await testSortParsing('gender_female', null);
			await testSortParsing('', null);
			await testSortParsing('1234', null);
		});
	});

	describe('fetchRecommendationsByFLSS', () => {
		it('have flss call defined with userId', async () => {
			fetch.default.mockClear();
			fetch.default.mockResolvedValue({ json: () => { } });

			await fetchLoansByType.default('user', '1234', 'flss');

			const { variables, query } = JSON.parse(fetch.default.mock.calls[0][1].body);
			expect(fetch).toBeDefined();
			expect(variables.userId).toEqual(1234);
			expect(query).toBeDefined();
			expect(query).toContain('fundraisingLoans');
			expect(fetch.default.mock.results[0].value).toBeDefined();
		});
	});

	describe('fetchRecommendationsByLoanRecs', () => {
		it('should make recommendations call with correct parameters', async () => {
			fetch.default.mockClear();
			fetch.default.mockResolvedValue({ json: () => { } });

			await fetchLoansByType.default('user', '1234', 'recommendations');

			const { variables, query } = JSON.parse(fetch.default.mock.calls[0][1].body);
			expect(fetch).toBeDefined();
			expect(variables.userId).toEqual(1234);
			expect(query).toBeDefined();
			expect(query).toContain('loanRecommendations');
			expect(fetch.default.mock.results[0].value).toBeDefined();
		});
	});
});
