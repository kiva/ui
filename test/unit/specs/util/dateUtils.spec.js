import getMonthsCount from '../../../../src/util/dateUtils';

describe('dateUtils.js', () => {
	const startTimestamp = 1674172800000; // Start subscription on Jan 20th

	it('should count the first month', () => {
		const endTimestamp = 1687132800000; // Current date: June 19th
		expect(getMonthsCount(startTimestamp, endTimestamp)).toBe(5);
	});

	it('should count the first and last month', () => {
		const endTimestamp = 1687219201000; // Current date: June 20th with 1 second
		expect(getMonthsCount(startTimestamp, endTimestamp)).toBe(6);
	});

	it('should use current date when endTimestamp is null', () => {
		const result = getMonthsCount(startTimestamp, null);
		// Result should be a positive number
		expect(result).toBeGreaterThan(0);
		expect(typeof result).toBe('number');
	});

	it('should use current date when endTimestamp is not provided', () => {
		const result = getMonthsCount(startTimestamp);
		// Result should be a positive number
		expect(result).toBeGreaterThan(0);
		expect(typeof result).toBe('number');
	});

	it('should handle same month when day is after start date', () => {
		// Jan 1st to Jan 25th should be 1 month
		const start = new Date('2024-01-01').getTime();
		const end = new Date('2024-01-25').getTime();
		expect(getMonthsCount(start, end)).toBe(1);
	});

	it('should handle same month when day is before start date', () => {
		// Jan 25th to Feb 20th should be 1 month (not 2)
		const start = new Date('2024-01-25').getTime();
		const end = new Date('2024-02-20').getTime();
		expect(getMonthsCount(start, end)).toBe(1);
	});

	it('should handle year boundary correctly', () => {
		// Dec 15th 2023 to Jan 20th 2024 should be 2 months
		const start = new Date('2023-12-15').getTime();
		const end = new Date('2024-01-20').getTime();
		expect(getMonthsCount(start, end)).toBe(2);
	});

	it('should handle multiple years', () => {
		// Jan 10th 2022 to Jan 15th 2024 should be 25 months
		const start = new Date('2022-01-10').getTime();
		const end = new Date('2024-01-15').getTime();
		expect(getMonthsCount(start, end)).toBe(25);
	});

	it('should handle end date on exact same day as start date', () => {
		// Jan 15th to Jan 15th should be 1 month
		const start = new Date('2024-01-15').getTime();
		const end = new Date('2024-01-15').getTime();
		expect(getMonthsCount(start, end)).toBe(1);
	});

	it('should handle end date one day before start date in next month', () => {
		// Jan 15th to Feb 14th should be 1 month (not 2)
		const start = new Date('2024-01-15').getTime();
		const end = new Date('2024-02-14').getTime();
		expect(getMonthsCount(start, end)).toBe(1);
	});

	it('should handle leap year', () => {
		// Jan 29th to Feb 29th 2024 (leap year) should be 2 months
		const start = new Date('2024-01-29').getTime();
		const end = new Date('2024-02-29').getTime();
		expect(getMonthsCount(start, end)).toBe(2);
	});
});
