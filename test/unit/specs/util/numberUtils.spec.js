import { isNumber, parseMoney } from '#src/util/numberUtils';

describe('numberUtils.js', () => {
	describe('isNumber', () => {
		it('should validate number', () => {
			expect(isNumber(-1)).toBe(true);
			expect(isNumber(0)).toBe(true);
			expect(isNumber(1)).toBe(true);
			expect(isNumber(1.5)).toBe(true);
			expect(isNumber(5.321456)).toBe(true);
			expect(isNumber(500)).toBe(true);
			expect(isNumber('-1')).toBe(true);
			expect(isNumber('0')).toBe(true);
			expect(isNumber('1')).toBe(true);
			expect(isNumber('1.5')).toBe(true);
			expect(isNumber('5.321456')).toBe(true);
			expect(isNumber('500')).toBe(true);
		});

		it('should validate non-number', () => {
			expect(isNumber({})).toBe(false);
			expect(isNumber([])).toBe(false);
			expect(isNumber(NaN)).toBe(false);
			expect(isNumber(null)).toBe(false);
			expect(isNumber(undefined)).toBe(false);
			expect(isNumber(true)).toBe(false);
			expect(isNumber(false)).toBe(false);
			expect(isNumber('')).toBe(false);
			expect(isNumber('.')).toBe(false);
			expect(isNumber('1asd')).toBe(false);
			expect(isNumber('1.asd')).toBe(false);
		});

		it('should handle infinity values', () => {
			expect(isNumber(Infinity)).toBe(true);
			expect(isNumber(-Infinity)).toBe(true);
		});

		it('should handle whitespace in numeric strings', () => {
			expect(isNumber(' 123 ')).toBe(true);
			// Whitespace-only strings convert to 0, which is a number
			expect(isNumber('  ')).toBe(true);
		});

		it('should handle scientific notation', () => {
			expect(isNumber('1e5')).toBe(true);
			expect(isNumber('1e-5')).toBe(true);
		});
	});

	describe('parseMoney', () => {
		it('should parse the formatted strings the gateway returns for Money', () => {
			// A bare Number() is NaN on any of these (MP-3138).
			expect(parseMoney('11,621.53')).toBe(11621.53);
			expect(parseMoney('1,000')).toBe(1000);
			expect(parseMoney('10,745,000.04')).toBe(10745000.04);
		});

		it('should parse unseparated strings and plain numbers', () => {
			expect(parseMoney('843.57')).toBe(843.57);
			expect(parseMoney('0.00')).toBe(0);
			expect(parseMoney('-12.50')).toBe(-12.5);
			expect(parseMoney(300)).toBe(300);
			expect(parseMoney(0)).toBe(0);
		});

		it('should fall back to 0 for non-numeric and absent values', () => {
			expect(parseMoney(null)).toBe(0);
			expect(parseMoney(undefined)).toBe(0);
			expect(parseMoney('')).toBe(0);
			expect(parseMoney('n/a')).toBe(0);
			expect(parseMoney(NaN)).toBe(0);
			expect(parseMoney(Infinity)).toBe(0);
			expect(parseMoney(true)).toBe(0);
			expect(parseMoney({})).toBe(0);
		});
	});
});
