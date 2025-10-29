import filterMixin from '../../../../src/plugins/any-or-selected-autolending-filter-mixin';

describe('any-or-selected-autolending-filter-mixin.js', () => {
	describe('getValues', () => {
		it('should add single value to current values when checked is true', () => {
			const result = filterMixin.methods.getValues(true, 'value1', ['existing1', 'existing2']);
			expect(result).toEqual(['existing1', 'existing2', 'value1']);
		});

		it('should add array of values to current values when checked is true', () => {
			const result = filterMixin.methods.getValues(true, ['value1', 'value2'], ['existing']);
			expect(result).toEqual(['existing', 'value1', 'value2']);
		});

		it('should remove single value from current values when checked is false', () => {
			const result = filterMixin.methods.getValues(false, 'existing1', ['existing1', 'existing2', 'existing3']);
			expect(result).toEqual(['existing2', 'existing3']);
		});

		it('should remove array of values from current values when checked is false', () => {
			const currentValues = ['value1', 'value2', 'value3', 'value4'];
			const result = filterMixin.methods.getValues(false, ['value1', 'value3'], currentValues);
			expect(result).toEqual(['value2', 'value4']);
		});

		it('should not add duplicate values when checked is true', () => {
			const result = filterMixin.methods.getValues(true, 'existing1', ['existing1', 'existing2']);
			expect(result).toEqual(['existing1', 'existing2']);
		});

		it('should handle empty current values array when checked is true', () => {
			const result = filterMixin.methods.getValues(true, 'value1', []);
			expect(result).toEqual(['value1']);
		});

		it('should handle empty current values array when checked is false', () => {
			const result = filterMixin.methods.getValues(false, 'value1', []);
			expect(result).toEqual([]);
		});

		it('should handle removing value that does not exist', () => {
			const result = filterMixin.methods.getValues(false, 'nonexistent', ['value1', 'value2']);
			expect(result).toEqual(['value1', 'value2']);
		});

		it('should preserve order when adding values', () => {
			const result = filterMixin.methods.getValues(true, 'value3', ['value1', 'value2']);
			expect(result).toEqual(['value1', 'value2', 'value3']);
		});

		it('should handle adding multiple values at once', () => {
			const result = filterMixin.methods.getValues(true, ['a', 'b', 'c'], ['x', 'y']);
			expect(result).toEqual(['x', 'y', 'a', 'b', 'c']);
		});

		it('should handle removing multiple values that partially exist', () => {
			const result = filterMixin.methods.getValues(false, ['a', 'b', 'c'], ['a', 'x', 'b', 'y']);
			expect(result).toEqual(['x', 'y']);
		});
	});
});
