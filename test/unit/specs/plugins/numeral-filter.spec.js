import numeralFilter from '../../../../src/plugins/numeral-filter';

describe('numeral-filter.js', () => {
	it('should format number with default format', () => {
		const result = numeralFilter(1000);

		expect(result).toBe('1000');
	});

	it('should format number with custom format', () => {
		const result = numeralFilter(1234.56, '0,0.00');

		expect(result).toBe('1,234.56');
	});

	it('should format number as currency', () => {
		const result = numeralFilter(1000, '$0,0.00');

		expect(result).toBe('$1,000.00');
	});

	it('should format number with thousands separator', () => {
		const result = numeralFilter(1234567, '0,0');

		expect(result).toBe('1,234,567');
	});

	it('should format number as percentage', () => {
		const result = numeralFilter(0.5, '0.00%');

		expect(result).toBe('50.00%');
	});

	it('should format negative numbers', () => {
		const result = numeralFilter(-1000, '0,0');

		expect(result).toBe('-1,000');
	});

	it('should format zero', () => {
		const result = numeralFilter(0, '0');

		expect(result).toBe('0');
	});

	it('should handle decimal precision', () => {
		const result = numeralFilter(123.456, '0.0');

		expect(result).toBe('123.5');
	});

	it('should format with abbreviated notation', () => {
		const result = numeralFilter(1000000, '0.0a');

		expect(result).toBe('1.0m');
	});
});
