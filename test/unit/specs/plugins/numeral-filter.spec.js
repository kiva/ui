import numeralFilter from '#src/plugins/numeral-filter';
import numeral from 'numeral';

vi.mock('numeral');

describe('numeral-filter.js', () => {
	it('should call numeral with the provided value and format method with default format', () => {
		const mockFormat = vi.fn().mockReturnValue('formatted');
		numeral.mockReturnValue({ format: mockFormat });

		const result = numeralFilter(1000);

		expect(numeral).toHaveBeenCalledWith(1000);
		expect(mockFormat).toHaveBeenCalledWith('0');
		expect(result).toBe('formatted');
	});

	it('should call numeral with the provided value and format method with custom format', () => {
		const mockFormat = vi.fn().mockReturnValue('formatted');
		numeral.mockReturnValue({ format: mockFormat });

		const result = numeralFilter(1234.56, '0,0.00');

		expect(numeral).toHaveBeenCalledWith(1234.56);
		expect(mockFormat).toHaveBeenCalledWith('0,0.00');
		expect(result).toBe('formatted');
	});
});
