import {
	getIsoCodes,
	isoToCountryName,
	mapIsoCodesToCountryNames,
	sortRegions
} from '@/util/loanSearch/countryUtils';
import {
	mockTransformedMiddleEast,
	mockTransformedChile,
	mockTransformedColombia,
	mockTransformedSouthAmerica,
	mockTransformedRegions
} from './mockData';

describe('countryUtils.js', () => {
	describe('sortRegions', () => {
		it('should handle empty', () => {
			expect(sortRegions([])).toEqual([]);
		});

		it('should sort', () => {
			const regions = [
				mockTransformedSouthAmerica([mockTransformedColombia(), mockTransformedChile()]),
				mockTransformedMiddleEast()
			];
			expect(sortRegions(regions)).toEqual(mockTransformedRegions);
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
				'South America': ['Chile'],
			}).sort()).toEqual(['JO', 'CL'].sort());
		});
	});

	describe('isoToCountryName', () => {
		it('should return corresponding country name', () => {
			const mappedName = isoToCountryName('JO', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe('Jordan');
		});

		it('should return null if no matching country name', () => {
			const mappedName = isoToCountryName('MS', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe(null);
		});
	});

	describe('mapIsoCodesToCountryNames', () => {
		const targetIsos = ['JO', 'CL', 'CO'];

		it('should return an empty object if no ISO codes are passed', () => {
			expect(mapIsoCodesToCountryNames(undefined, mockTransformedRegions)).toEqual({});
			expect(mapIsoCodesToCountryNames([], mockTransformedRegions)).toEqual({});
		});

		it('should return an empty object if no regions are passed', () => {
			expect(mapIsoCodesToCountryNames(targetIsos, undefined)).toEqual({});
			expect(mapIsoCodesToCountryNames(targetIsos, [])).toEqual({});
		});

		it('should return region keyed object with array of country names', () => {
			const selectedCountries = mapIsoCodesToCountryNames(targetIsos, mockTransformedRegions);
			expect(selectedCountries).toEqual({
				'Middle East': ['Jordan'],
				'South America': ['Chile', 'Colombia']
			});
		});
	});
});
