import getMonthsCount, {
	KIVA_SERVER_TIMEZONE,
	formatInKivaServerTimezone,
	parseKivaDate,
	toValidDate,
} from '#src/util/dateUtils';

describe('dateUtils.js', () => {
	describe('formatInKivaServerTimezone', () => {
		const MONTH_AND_YEAR = { year: 'numeric', month: 'short' };

		it('names the timezone the server renders dates in', () => {
			expect(KIVA_SERVER_TIMEZONE).toBe('America/Los_Angeles');
		});

		it('keeps a Pacific-midnight instant on its own calendar day', () => {
			expect(formatInKivaServerTimezone('2020-03-01T08:00:00Z', MONTH_AND_YEAR)).toBe('Mar 2020');
		});

		it('formats a date-only value without shifting the day', () => {
			expect(formatInKivaServerTimezone('2020-03-01', MONTH_AND_YEAR)).toBe('Mar 2020');
		});

		it.each([null, undefined, '', 'not-a-date'])('returns an empty string for %s', value => {
			expect(formatInKivaServerTimezone(value, MONTH_AND_YEAR)).toBe('');
		});
	});

	describe('parseKivaDate', () => {
		it('anchors a date-only value inside its own Pacific day', () => {
			const date = parseKivaDate('2020-03-01');

			expect(date.toISOString()).toBe('2020-03-01T12:00:00.000Z');
		});

		it('keeps an ISO datetime as the instant it names', () => {
			expect(parseKivaDate('2020-03-01T08:00:00Z').toISOString()).toBe('2020-03-01T08:00:00.000Z');
		});

		it('returns null when the value cannot be parsed', () => {
			expect(parseKivaDate('not-a-date')).toBe(null);
			expect(parseKivaDate(null)).toBe(null);
		});
	});

	describe('toValidDate', () => {
		it('parses an ISO string into a valid Date', () => {
			const date = toValidDate('2025-02-10');
			expect(date).toBeInstanceOf(Date);
			expect(date.getMonth()).toBe(1); // February (0-indexed)
		});

		it('parses a numeric timestamp', () => {
			const date = toValidDate(1674172800000);
			expect(date).toBeInstanceOf(Date);
			expect(Number.isNaN(date.getTime())).toBe(false);
		});

		it('passes a Date through when it is valid', () => {
			const input = new Date('2024-06-15');
			expect(toValidDate(input)).toBeInstanceOf(Date);
		});

		it('returns null for falsy input', () => {
			expect(toValidDate(null)).toBe(null);
			expect(toValidDate(undefined)).toBe(null);
			expect(toValidDate('')).toBe(null);
		});

		it('returns null for an unparseable string', () => {
			expect(toValidDate('not-a-date')).toBe(null);
		});
	});

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
