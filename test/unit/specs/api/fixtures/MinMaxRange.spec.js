import MinMaxRange, {
	getCacheableRange,
	getInputRange,
	getSearchableRange,
	rangesAreEqual,
} from '#src/api/fixtures/MinMaxRange';

describe('MinMaxRange.js', () => {
	describe('MinMaxRange constructor', () => {
		it('should return a MinMaxRange object with default values', () => {
			const range = MinMaxRange();

			expect(range).toEqual({
				__typename: 'MinMaxRange',
				min: null,
				max: null,
			});
		});
	});

	describe('getCacheableRange', () => {
		it('should add __typename to range object', () => {
			const range = { min: 0, max: 10 };
			const result = getCacheableRange(range);

			expect(result).toEqual({
				min: 0,
				max: 10,
				__typename: 'MinMaxRange',
			});
		});

		it('should preserve existing properties', () => {
			const range = { min: 5, max: 15, customProp: 'test' };
			const result = getCacheableRange(range);

			expect(result).toEqual({
				min: 5,
				max: 15,
				customProp: 'test',
				__typename: 'MinMaxRange',
			});
		});

		it('should override __typename if it exists', () => {
			const range = { min: 1, max: 3, __typename: 'OldType' };
			const result = getCacheableRange(range);

			expect(result).toHaveProperty('__typename', 'MinMaxRange');
		});
	});

	describe('getInputRange', () => {
		it('should return range object when both min and max are numbers', () => {
			const range = { min: 0, max: 10, __typename: 'MinMaxRange' };
			const result = getInputRange(range);

			expect(result).toEqual({
				min: 0,
				max: 10,
			});
		});

		it('should return range object when only min is a number', () => {
			const range = { min: 5, max: null };
			const result = getInputRange(range);

			expect(result).toEqual({
				min: 5,
				max: null,
			});
		});

		it('should return range object when only max is a number', () => {
			const range = { min: null, max: 20 };
			const result = getInputRange(range);

			expect(result).toEqual({
				min: null,
				max: 20,
			});
		});

		it('should return null when both min and max are null', () => {
			const range = { min: null, max: null };
			const result = getInputRange(range);

			expect(result).toBeNull();
		});

		it('should return null when range is null', () => {
			const result = getInputRange(null);

			expect(result).toBeNull();
		});

		it('should return null when range is undefined', () => {
			const result = getInputRange(undefined);

			expect(result).toBeNull();
		});

		it('should handle zero as valid number for min', () => {
			const range = { min: 0, max: null };
			const result = getInputRange(range);

			expect(result).toEqual({
				min: 0,
				max: null,
			});
		});

		it('should handle zero as valid number for max', () => {
			const range = { min: null, max: 0 };
			const result = getInputRange(range);

			expect(result).toEqual({
				min: null,
				max: 0,
			});
		});
	});

	describe('getSearchableRange', () => {
		it('should return range with both min and max when both are numbers', () => {
			const range = { min: 5, max: 15 };
			const result = getSearchableRange(range);

			expect(result).toEqual({
				min: 5,
				max: 15,
			});
		});

		it('should return range with only min when max is null', () => {
			const range = { min: 10, max: null };
			const result = getSearchableRange(range);

			expect(result).toEqual({
				min: 10,
			});
		});

		it('should return range with only max when min is null', () => {
			const range = { min: null, max: 20 };
			const result = getSearchableRange(range);

			expect(result).toEqual({
				max: 20,
			});
		});

		it('should return undefined when both min and max are null', () => {
			const range = { min: null, max: null };
			const result = getSearchableRange(range);

			expect(result).toBeUndefined();
		});

		it('should return undefined when range is null', () => {
			const result = getSearchableRange(null);

			expect(result).toBeUndefined();
		});

		it('should return undefined when range is undefined', () => {
			const result = getSearchableRange(undefined);

			expect(result).toBeUndefined();
		});

		it('should handle zero as valid number for min', () => {
			const range = { min: 0, max: null };
			const result = getSearchableRange(range);

			expect(result).toEqual({
				min: 0,
			});
		});

		it('should handle zero as valid number for max', () => {
			const range = { min: null, max: 0 };
			const result = getSearchableRange(range);

			expect(result).toEqual({
				max: 0,
			});
		});
	});

	describe('rangesAreEqual', () => {
		it('should return true when both ranges are identical', () => {
			const rangeA = { min: 5, max: 10 };
			const rangeB = { min: 5, max: 10 };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(true);
		});

		it('should return true when both ranges are null', () => {
			expect(rangesAreEqual(null, null)).toBe(true);
		});

		it('should return true when both ranges are undefined', () => {
			expect(rangesAreEqual(undefined, undefined)).toBe(true);
		});

		it('should return false when first range is null', () => {
			const rangeB = { min: 5, max: 10 };

			expect(rangesAreEqual(null, rangeB)).toBe(false);
		});

		it('should return false when second range is null', () => {
			const rangeA = { min: 5, max: 10 };

			expect(rangesAreEqual(rangeA, null)).toBe(false);
		});

		it('should return false when min values differ', () => {
			const rangeA = { min: 5, max: 10 };
			const rangeB = { min: 6, max: 10 };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(false);
		});

		it('should return false when max values differ', () => {
			const rangeA = { min: 5, max: 10 };
			const rangeB = { min: 5, max: 11 };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(false);
		});

		it('should return true when both have null min and max', () => {
			const rangeA = { min: null, max: null };
			const rangeB = { min: null, max: null };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(true);
		});

		it('should return true when both have zero values', () => {
			const rangeA = { min: 0, max: 0 };
			const rangeB = { min: 0, max: 0 };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(true);
		});

		it('should ignore extra properties in comparison', () => {
			const rangeA = { min: 5, max: 10, __typename: 'MinMaxRange' };
			const rangeB = { min: 5, max: 10, extra: 'prop' };

			expect(rangesAreEqual(rangeA, rangeB)).toBe(true);
		});
	});
});
