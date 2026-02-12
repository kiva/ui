import { parseAllCountriesIsoMapToOptions } from '#src/util/countryOptions';

describe('countryOptions.js', () => {
	describe('parseAllCountriesIsoMapToOptions', () => {
		it('parses API format {"ISO":"Name",...} into sorted options array', () => {
			const json = '{"US":"United States","NI":"Nicaragua","AL":"Albania"}';
			const result = parseAllCountriesIsoMapToOptions(json);
			expect(result).toEqual([
				{ isoCode: 'AL', name: 'Albania' },
				{ isoCode: 'NI', name: 'Nicaragua' },
				{ isoCode: 'US', name: 'United States' },
			]);
		});

		it('returns empty array for empty string', () => {
			expect(parseAllCountriesIsoMapToOptions('')).toEqual([]);
		});

		it('returns empty array for invalid JSON', () => {
			expect(parseAllCountriesIsoMapToOptions('not json')).toEqual([]);
			expect(parseAllCountriesIsoMapToOptions('{"incomplete')).toEqual([]);
		});

		it('returns empty array for null/undefined/non-string', () => {
			expect(parseAllCountriesIsoMapToOptions(null)).toEqual([]);
			expect(parseAllCountriesIsoMapToOptions(undefined)).toEqual([]);
			expect(parseAllCountriesIsoMapToOptions(123)).toEqual([]);
		});

		it('returns empty array for JSON array (old format)', () => {
			expect(parseAllCountriesIsoMapToOptions('[]')).toEqual([]);
			expect(parseAllCountriesIsoMapToOptions('[{"US":"United States"}]')).toEqual([]);
		});

		it('sorts by name case-insensitively', () => {
			const json = '{"ZZ":"Zebra","aa":"aardvark"}';
			const result = parseAllCountriesIsoMapToOptions(json);
			expect(result[0].name).toBe('aardvark');
			expect(result[1].name).toBe('Zebra');
		});
	});
});
