import {
	getUpdatedRegions,
	transformIsoCodes,
	transformThemes,
	transformSectors,
	getUpdatedNumLoansFundraising,
	getCheckboxLabel,
	visibleThemeIds,
	formatSortOptions,
	FLSS_QUERY_TYPE,
	STANDARD_QUERY_TYPE,
	visibleFLSSSortOptions,
	transformTagName,
	transformTags,
	transformRadioGroupOptions,
	transformGenderOptions,
	transformDistributionModelOptions,
	FEMALE_KEY,
	MALE_KEY,
	NON_BINARY_KEY,
	FIELDPARTNER_KEY,
	DIRECT_KEY,
	genderDisplayMap,
	distributionModelDisplayMap,
	transformIsIndividualOptions,
	transformLenderRepaymentTermOptions,
	getFilterKeyFromValue,
	INDIVIDUAL_KEY,
	GROUP_KEY,
	isIndividualDisplayMap,
	EIGHT_MONTHS_KEY,
	SIXTEEN_MONTHS_KEY,
	TWO_YEARS_KEY,
	MORE_THAN_TWO_YEARS_KEY,
	lenderRepaymentTermDisplayMap,
	lenderRepaymentTermValueMap,
	transformPartners,
} from '@/util/loanSearch/filterUtils';
import _orderBy from 'lodash/orderBy';
import {
	mockAllFacets,
	mockTransformedMiddleEast,
	mockTransformedChile,
	mockTransformedColombia,
	mockTransformedSouthAmerica,
	mockTransformedRegions
} from '../../../fixtures/mockLoanSearchData';

const mockASector = (numLoansFundraising = 6) => ({ id: 7, name: 'c', numLoansFundraising });

const mockBSector = (numLoansFundraising = 3) => ({ id: 2, name: 'd', numLoansFundraising });

const mockTransformedSectors = [mockASector(), mockBSector()];

const mockATheme = (numLoansFundraising = 5) => ({ id: 6, name: 'a', numLoansFundraising });

const mockBTheme = (numLoansFundraising = 4) => ({ id: 3, name: 'b', numLoansFundraising });

describe('filterUtils.js', () => {
	describe('formatSortOptions', () => {
		const mockStandardSorts = [{ name: 'a' }, { name: 'b' }];
		const mockFLSSSorts = visibleFLSSSortOptions.map(f => ({ name: f, sortSrc: FLSS_QUERY_TYPE }));

		it('should handle empty', () => {
			expect(formatSortOptions()).toEqual([]);
			expect(formatSortOptions([])).toEqual([]);
			expect(formatSortOptions([], [])).toEqual([]);
		});

		it('should format', () => {
			expect(formatSortOptions(mockStandardSorts, mockFLSSSorts)).toEqual([
				{ name: 'a', sortSrc: STANDARD_QUERY_TYPE },
				{ name: 'b', sortSrc: STANDARD_QUERY_TYPE },
				...mockFLSSSorts
			]);
		});

		it('should exclude non-visible sort options', () => {
			expect(formatSortOptions(mockStandardSorts, [
				...mockFLSSSorts,
				{ name: 'researchScore' }
			]))
				.toEqual([
					{ name: 'a', sortSrc: STANDARD_QUERY_TYPE },
					{ name: 'b', sortSrc: STANDARD_QUERY_TYPE },
					...mockFLSSSorts
				]);
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

	describe('transformSectors', () => {
		it('should handle empty', () => {
			expect(transformSectors([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockFilteredSectors = [
				{
					key: 2,
					value: 3,
				},
				{
					key: 7,
					value: 6,
				},
			];

			const mockAllSectors = [
				{
					id: 2,
					name: 'd',
				},
				{
					id: 8,
					name: 'f',
				},
				{
					id: 7,
					name: 'c',
				},
			];

			const result = transformSectors(mockFilteredSectors, mockAllSectors);

			expect(result).toEqual(mockTransformedSectors);
		});

		it('should filter transform themes with number casting', () => {
			const mockFilteredSectors = [
				{
					key: '2',
					value: 3,
				},
				{
					key: '7',
					value: 6,
				},
			];

			const mockAllSectors = [
				{
					id: 2,
					name: 'd',
				},
				{
					id: 8,
					name: 'f',
				},
				{
					id: 7,
					name: 'c',
				},
			];

			const result = transformSectors(mockFilteredSectors, mockAllSectors);

			expect(result).toEqual(mockTransformedSectors);
		});
	});

	describe('transformThemes', () => {
		it('should handle empty', () => {
			expect(transformThemes([])).toEqual([]);
		});

		it('should filter, transform, and sort', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.map((t, i) => ({ key: t.name, value: i }));

			const expected = _orderBy(mockThemes.map((t, i) => ({ ...t, numLoansFundraising: i })), 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should filter transform themes case insensitive', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.map((t, i) => ({ key: t.name.toUpperCase(), value: i }));

			const expected = _orderBy(mockThemes.map((t, i) => ({ ...t, numLoansFundraising: i })), 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});

		it('should always show certain themes', () => {
			const mockThemes = visibleThemeIds.map(id => ({ id, name: Math.random().toString(36).slice(2, 5) }));

			const mockFilteredThemes = mockThemes.slice(0, 2).map((t, i) => ({ key: t.name, value: i }));

			const expected = _orderBy([
				...mockThemes.slice(0, 2).map((t, i) => ({ ...t, numLoansFundraising: i })),
				...mockThemes.slice(2).map(t => ({ ...t, numLoansFundraising: 0 }))], 'name');

			const result = transformThemes(mockFilteredThemes, mockThemes);

			expect(result).toEqual(expected);
		});
	});

	describe('transformTagName', () => {
		it('should handle empty', () => {
			expect(transformTagName()).toEqual('');
		});

		it('should remove #', () => {
			expect(transformTagName('#test')).toEqual('test');
		});

		it('should leave name without leading # as is', () => {
			expect(transformTagName('test#')).toEqual('test#');
		});
	});

	describe('transformTags', () => {
		it('should handle empty', () => {
			expect(transformTags()).toEqual([]);
			expect(transformTags([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const result = transformTags([
				{ id: 1, name: 'tag', vocabularyId: 2 },
				{ id: 2, name: '#tag2', vocabularyId: 2 },
				{ id: 3, name: 'asd', vocabularyId: 2 }
			]);

			expect(result).toEqual([{ id: 3, name: 'asd' }, { id: 1, name: 'tag' }, { id: 2, name: 'tag2' }]);
		});

		it('should only return public tags', () => {
			const result = transformTags([
				{ id: 1, name: 'tag', vocabularyId: 2 },
				{ id: 2, name: '#tag2', vocabularyId: 1 },
				{ id: 3, name: 'asd', vocabularyId: 2 }
			]);

			expect(result).toEqual([{ id: 3, name: 'asd' }, { id: 1, name: 'tag' }]);
		});
	});

	describe('transformRadioGroupOptions', () => {
		it('should handle empty', () => {
			expect(transformRadioGroupOptions([], [], [])).toEqual([]);
		});

		it('should transform and sort', () => {
			const options = [{ name: 'b' }, { name: 'c' }, { name: 'a' }];

			const order = ['a', 'b', 'c'];

			const map = { A: 'AA', B: 'BB', C: 'CC' };

			const result = transformRadioGroupOptions(options, order, map);

			expect(result).toEqual([
				{ name: 'a', title: 'AA', value: 'a' },
				{ name: 'b', title: 'BB', value: 'b' },
				{ name: 'c', title: 'CC', value: 'c' }
			]);
		});
	});

	describe('transformGenderOptions', () => {
		it('should handle empty', () => {
			expect(transformGenderOptions([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const genders = [{ name: MALE_KEY }, { name: FEMALE_KEY }, { name: NON_BINARY_KEY }];

			const result = transformGenderOptions(genders);

			expect(result).toEqual([
				{ name: FEMALE_KEY, title: genderDisplayMap[FEMALE_KEY], value: FEMALE_KEY },
				{ name: MALE_KEY, title: genderDisplayMap[MALE_KEY], value: MALE_KEY },
				{ name: NON_BINARY_KEY, title: genderDisplayMap[NON_BINARY_KEY], value: NON_BINARY_KEY },
			]);
		});
	});

	describe('transformDistributionModelOptions', () => {
		it('should handle empty', () => {
			expect(transformDistributionModelOptions([])).toEqual([]);
		});

		it('should transform and sort', () => {
			const distributionModels = [{ name: DIRECT_KEY }, { name: FIELDPARTNER_KEY }];

			const result = transformDistributionModelOptions(distributionModels);

			expect(result).toEqual([
				{
					name: FIELDPARTNER_KEY,
					title: distributionModelDisplayMap[FIELDPARTNER_KEY],
					value: FIELDPARTNER_KEY
				},
				{ name: DIRECT_KEY, title: distributionModelDisplayMap[DIRECT_KEY], value: DIRECT_KEY },
			]);
		});
	});

	describe('transformIsIndividualOptions', () => {
		it('should transform and sort', () => {
			const result = transformIsIndividualOptions();

			expect(result).toEqual([
				{ name: INDIVIDUAL_KEY, title: isIndividualDisplayMap[INDIVIDUAL_KEY], value: true },
				{ name: GROUP_KEY, title: isIndividualDisplayMap[GROUP_KEY], value: false },
			]);
		});
	});

	describe('transformLenderRepaymentTermOptions', () => {
		it('should transform and sort', () => {
			const result = transformLenderRepaymentTermOptions();

			expect(result).toEqual([
				{
					name: EIGHT_MONTHS_KEY,
					title: lenderRepaymentTermDisplayMap[EIGHT_MONTHS_KEY],
					value: lenderRepaymentTermValueMap[EIGHT_MONTHS_KEY]
				},
				{
					name: SIXTEEN_MONTHS_KEY,
					title: lenderRepaymentTermDisplayMap[SIXTEEN_MONTHS_KEY],
					value: lenderRepaymentTermValueMap[SIXTEEN_MONTHS_KEY]
				},
				{
					name: TWO_YEARS_KEY,
					title: lenderRepaymentTermDisplayMap[TWO_YEARS_KEY],
					value: lenderRepaymentTermValueMap[TWO_YEARS_KEY]
				},
				{
					name: MORE_THAN_TWO_YEARS_KEY,
					title: lenderRepaymentTermDisplayMap[MORE_THAN_TWO_YEARS_KEY],
					value: lenderRepaymentTermValueMap[MORE_THAN_TWO_YEARS_KEY]
				},
			]);
		});
	});

	describe('transformPartners', () => {
		it('should transform and sort', () => {
			const result = transformPartners(mockAllFacets.partnerFacets);

			expect(result).toEqual([
				{
					id: 3,
					name: 'Aaa',
					region: 'Central America'
				},
				{
					id: 2,
					name: 'Bbb',
					region: 'Central America'
				},
				{
					id: 1,
					name: 'Ccc',
					region: 'Africa'
				},
			]);
		});
	});

	describe('getFilterKeyFromValue', () => {
		it('should return undefined when not found', () => {
			const result = getFilterKeyFromValue('asd', lenderRepaymentTermValueMap);

			expect(result).toEqual(undefined);
		});

		it('should get filter key', () => {
			const result = getFilterKeyFromValue(1, { test: 1 });

			expect(result).toEqual('test');
		});

		it('should get filter key from min max range', () => {
			const result = getFilterKeyFromValue(
				lenderRepaymentTermValueMap[EIGHT_MONTHS_KEY],
				lenderRepaymentTermValueMap
			);

			expect(result).toEqual(EIGHT_MONTHS_KEY);
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

	describe('getUpdatedNumLoansFundraising', () => {
		it('should handle undefined and empty', () => {
			expect(getUpdatedNumLoansFundraising(undefined, [])).toEqual([]);
			expect(getUpdatedNumLoansFundraising([], [])).toEqual([]);
		});

		it('should update theme numLoansFundraising', () => {
			const nextA = mockATheme(9);

			const results = getUpdatedNumLoansFundraising([mockATheme(), mockBTheme()], [nextA]);

			expect(results).toEqual([nextA, mockBTheme(0)]);
		});

		it('should add missing themes', () => {
			const a = mockATheme();
			const nextB = mockBTheme();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
		});

		it('should update sector numLoansFundraising', () => {
			const nextA = mockASector(9);

			expect(getUpdatedNumLoansFundraising(mockTransformedSectors, [nextA])).toEqual([nextA, mockBSector(0)]);
		});

		it('should add missing sectors', () => {
			const a = mockASector();
			const nextB = mockBSector();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
		});

		it('should handle missing numLoansFundraising', () => {
			const a = { id: 1, name: 'a' };
			const nextA = { id: 1, name: 'a' };

			expect(getUpdatedNumLoansFundraising([a], [nextA])).toEqual([{ ...nextA }]);
		});
	});

	describe('getCheckboxLabel', () => {
		it('should handle region', () => {
			expect(getCheckboxLabel({ region: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});

		it('should handle item', () => {
			expect(getCheckboxLabel({ name: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});

		it('should handle missing numLoansFundraising', () => {
			expect(getCheckboxLabel({ name: 'test' })).toBe('test');
		});
	});
});
