import { createMinMaxRange, getMinMaxRangeFilter, getMinMaxRangeQueryParam } from '@/util/loanSearch/minMaxRange';

describe('minMaxRange.js', () => {
	describe('createMinMaxRange', () => {
		it('should check numbers', () => {
			expect(createMinMaxRange()).toBe(undefined);
			expect(createMinMaxRange(1)).toBe(undefined);
			expect(createMinMaxRange(undefined, 1)).toBe(undefined);
			expect(createMinMaxRange('asd', 1)).toBe(undefined);
			expect(createMinMaxRange(1, 'asd')).toBe(undefined);
		});

		it('should create min max range', () => {
			expect(createMinMaxRange(1, 100)).toEqual({ min: 1, max: 100 });
		});
	});

	describe('getMinMaxRangeFilter', () => {
		it('should handle bad numbers', () => {
			expect(getMinMaxRangeFilter({})).toEqual(null);
		});

		it('should create min max range', () => {
			expect(getMinMaxRangeFilter({ min: 1, max: 100 })).toEqual({ gte: 1, lte: 100 });
			expect(getMinMaxRangeFilter({ min: 1 })).toEqual({ gte: 1 });
			expect(getMinMaxRangeFilter({ max: 100 })).toEqual({ lte: 100 });
		});
	});

	describe('getMinMaxRangeQueryParam', () => {
		it('should handle bad numbers', () => {
			expect(getMinMaxRangeQueryParam({})).toBe(null);
			expect(getMinMaxRangeQueryParam({ min: 1 })).toBe(null);
			expect(getMinMaxRangeQueryParam({ max: 100 })).toBe(null);
		});

		it('should return query param', () => {
			expect(getMinMaxRangeQueryParam({ min: 1, max: 100 })).toBe('1,100');
		});
	});
});
