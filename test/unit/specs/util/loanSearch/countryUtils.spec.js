import {
	isoToCountryName,
	sortRegions
} from '#src/util/loanSearch/countryUtils';
import {
	mockTransformedMiddleEast,
	mockTransformedChile,
	mockTransformedColombia,
	mockTransformedSouthAmerica,
	mockTransformedRegions
} from '../../../fixtures/mockLoanSearchData';

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

	describe('isoToCountryName', () => {
		it('should return corresponding country name', () => {
			const mappedName = isoToCountryName('JO', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe('Jordan');
		});

		it('should return null if no matching country name', () => {
			const mappedName = isoToCountryName('MS', mockTransformedMiddleEast().countries);
			expect(mappedName).toBe(null);
		});

		it('should return null when countryList is empty or undefined', () => {
			expect(isoToCountryName('JO', [])).toBe(null);
			expect(isoToCountryName('JO', undefined)).toBe(null);
			expect(isoToCountryName('JO')).toBe(null);
		});
	});
});
