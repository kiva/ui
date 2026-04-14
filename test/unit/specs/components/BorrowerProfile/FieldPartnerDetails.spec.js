import FieldPartnerDetails from '#src/components/BorrowerProfile/FieldPartnerDetails';

// Parameterised on `now` so fake-timer changes in tests don't require updating this helper.
function isoMonthsAgo(monthsAgo, now) {
	const d = new Date(now);
	d.setMonth(d.getMonth() - monthsAgo);
	return d.toISOString().slice(0, 10);
}

describe('FieldPartnerDetails.timeOnKivaFormatted', () => {
	// Keep NOW on a day that exists in every month (<= 28) to avoid `setMonth` end-of-month overflow in isoMonthsAgo.
	const NOW = new Date('2026-04-14T12:00:00Z');

	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	function computeTimeOnKiva(startDate) {
		return FieldPartnerDetails.computed.timeOnKivaFormatted.call({ startDate });
	}

	it('returns empty string when startDate is missing', () => {
		expect(computeTimeOnKiva('')).toBe('');
		expect(computeTimeOnKiva(null)).toBe('');
		expect(computeTimeOnKiva(undefined)).toBe('');
	});

	it('returns empty string when startDate is unparseable', () => {
		expect(computeTimeOnKiva('not-a-date')).toBe('');
	});

	it('returns "0 months" for a startDate in the current month', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(0, NOW))).toBe('0 months');
	});

	it('singularizes "1 month"', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(1, NOW))).toBe('1 month');
	});

	it('pluralizes months under a year', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(2, NOW))).toBe('2 months');
		expect(computeTimeOnKiva(isoMonthsAgo(5, NOW))).toBe('5 months');
		expect(computeTimeOnKiva(isoMonthsAgo(11, NOW))).toBe('11 months');
	});

	it('singularizes "1 year" at exactly 12 months', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(12, NOW))).toBe('1 year');
	});

	it('pluralizes years at 24+ months', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(24, NOW))).toBe('2 years');
	});

	it('combines "1 year, 1 month" singular/singular', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(13, NOW))).toBe('1 year, 1 month');
	});

	it('combines "2 years, 3 months" plural/plural', () => {
		expect(computeTimeOnKiva(isoMonthsAgo(27, NOW))).toBe('2 years, 3 months');
	});
});

describe('FieldPartnerDetails.avgBorrowerCostFormatted', () => {
	function compute(avgBorrowerCost, avgBorrowerCostType) {
		return FieldPartnerDetails.computed.avgBorrowerCostFormatted.call({
			avgBorrowerCost,
			avgBorrowerCostType,
		});
	}

	it('returns "N/A" when avgBorrowerCost is 0', () => {
		expect(compute(0, 'APR')).toBe('N/A');
	});

	it('formats the percentage with the cost type when non-zero', () => {
		expect(compute(25, 'APR')).toBe('25% APR');
	});

	it('handles low percentages', () => {
		expect(compute(1, 'MPR')).toBe('1% MPR');
	});
});
