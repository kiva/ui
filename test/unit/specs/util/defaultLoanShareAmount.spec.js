import {
	decodeDefaultLoanShareAmount,
	readDefaultLoanShareAmount,
} from '#src/util/defaultLoanShareAmount';

describe('defaultLoanShareAmount.js', () => {
	describe('decodeDefaultLoanShareAmount', () => {
		it('decodes a JSON number', () => {
			expect(decodeDefaultLoanShareAmount('100')).toBe(100);
			expect(decodeDefaultLoanShareAmount('12.5')).toBe(12.5);
		});

		it('decodes a JSON-encoded numeric string', () => {
			expect(decodeDefaultLoanShareAmount('"100"')).toBe(100);
		});

		it('treats null and a missing value as not set', () => {
			expect(decodeDefaultLoanShareAmount('null')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount(null)).toBeUndefined();
			expect(decodeDefaultLoanShareAmount(undefined)).toBeUndefined();
		});

		it('treats garbage as not set', () => {
			expect(decodeDefaultLoanShareAmount('not json')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('"abc"')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('""')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('true')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('{"amount":100}')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('[100]')).toBeUndefined();
		});

		it('treats zero and negative amounts as not set', () => {
			expect(decodeDefaultLoanShareAmount('0')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('-25')).toBeUndefined();
			expect(decodeDefaultLoanShareAmount('"-25"')).toBeUndefined();
		});
	});

	describe('readDefaultLoanShareAmount', () => {
		it('reads the amount from a userPreferences node', () => {
			expect(readDefaultLoanShareAmount({ preferences: '{"defaultLoanShareAmount":100}' })).toBe(100);
			expect(readDefaultLoanShareAmount({ preferences: '{"defaultLoanShareAmount":"50"}' })).toBe(50);
		});

		it('treats a missing node, missing key, or invalid amount as not set', () => {
			expect(readDefaultLoanShareAmount(null)).toBeUndefined();
			expect(readDefaultLoanShareAmount({ preferences: '{}' })).toBeUndefined();
			expect(readDefaultLoanShareAmount({ preferences: 'not json' })).toBeUndefined();
			expect(readDefaultLoanShareAmount({ preferences: '{"defaultLoanShareAmount":0}' })).toBeUndefined();
		});
	});
});
