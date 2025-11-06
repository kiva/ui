import { isNumber } from '#src/util/numberUtils';

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
});
