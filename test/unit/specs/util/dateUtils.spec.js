import getMonthsCount from '@/util/dateUtils';

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
});
