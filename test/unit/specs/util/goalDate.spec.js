import {
	GOAL_DATE_COOKIE,
	formatGoalDate,
	getCurrentGoalYear,
	getGoalDateOverride,
	getGoalNow,
	getLastGoalYear,
	parseGoalDate,
	saveGoalDateCookie,
} from '#src/util/goalDate';

const localDay = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

// In-memory stand-in for CookieStore's get/has/set/remove.
const createCookieStore = (initial = {}) => {
	const cookies = new Map(Object.entries(initial));
	return {
		cookies,
		get: vi.fn(name => cookies.get(name)),
		has: vi.fn(name => cookies.has(name)),
		set: vi.fn((name, value) => cookies.set(name, value)),
		remove: vi.fn(name => cookies.delete(name)),
	};
};

describe('goalDate', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	describe('parseGoalDate', () => {
		it('reads YYYY-MM-DD as that local day, not UTC', () => {
			const date = parseGoalDate('2027-01-01');
			expect(localDay(date)).toEqual([2027, 1, 1]);
		});

		it('anchors at local noon, so a saved ISO timestamp keeps the same calendar day in UTC', () => {
			const date = parseGoalDate('2027-01-01');
			expect([date.getHours(), date.getMinutes()]).toEqual([12, 0]);
			// Holds for any zone within 12 hours of UTC, the server's zone.
			expect(date.toISOString().slice(0, 10)).toBe('2027-01-01');
		});

		it('uses the first value of a repeated param', () => {
			expect(localDay(parseGoalDate(['2027-04-01', '2026-01-01']))).toEqual([2027, 4, 1]);
		});

		it.each([
			['an impossible day', '2027-02-30'],
			['a bare year', '2027'],
			['a date with a time', '2027-01-01T10:00:00'],
			['a word', 'off'],
			['nothing', undefined],
			['null', null],
		])('rejects %s', (_, value) => {
			expect(parseGoalDate(value)).toBeNull();
		});
	});

	describe('getGoalDateOverride', () => {
		it('reads goalDate', () => {
			expect(localDay(getGoalDateOverride({ goalDate: '2027-03-31' }))).toEqual([2027, 3, 31]);
		});

		it('returns null without an override', () => {
			expect(getGoalDateOverride({})).toBeNull();
			expect(getGoalDateOverride()).toBeNull();
			expect(getGoalDateOverride(null)).toBeNull();
		});

		it('reads the cookie when the query has no goal date param', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			expect(localDay(getGoalDateOverride({ loanId: '1' }, cookieStore))).toEqual([2027, 1, 5]);
		});

		it('lets the query win over the cookie', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			expect(localDay(getGoalDateOverride({ goalDate: '2028-06-01' }, cookieStore))).toEqual([2028, 6, 1]);
		});

		it('turns the override off with ?goalDate=off even when the cookie is set', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			expect(getGoalDateOverride({ goalDate: 'off' }, cookieStore)).toBeNull();
		});

		it('ignores a cookie that is not a valid date', () => {
			expect(getGoalDateOverride({}, createCookieStore({ [GOAL_DATE_COOKIE]: 'junk' }))).toBeNull();
		});
	});

	describe('getGoalNow and goal years', () => {
		it('uses the override when there is one', () => {
			const query = { goalDate: '2027-01-05' };
			expect(localDay(getGoalNow(query))).toEqual([2027, 1, 5]);
			expect(getCurrentGoalYear(query)).toBe(2027);
			expect(getLastGoalYear(query)).toBe(2026);
		});

		it('uses the cookie override', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			expect(getCurrentGoalYear({}, cookieStore)).toBe(2027);
			expect(getLastGoalYear({}, cookieStore)).toBe(2026);
		});

		it('uses the real clock otherwise', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-11-05T12:00:00'));
			expect(getGoalNow({}).getTime()).toBe(new Date('2026-11-05T12:00:00').getTime());
			expect(getCurrentGoalYear({})).toBe(2026);
			expect(getLastGoalYear({})).toBe(2025);
		});
	});

	describe('formatGoalDate', () => {
		it('formats a local date as YYYY-MM-DD', () => {
			expect(formatGoalDate(new Date(2027, 0, 5))).toBe('2027-01-05');
		});
	});

	describe('saveGoalDateCookie', () => {
		it('saves the date as a session cookie', () => {
			const cookieStore = createCookieStore();
			saveGoalDateCookie({ goalDate: '2027-01-05' }, cookieStore);
			expect(cookieStore.set).toHaveBeenCalledWith(GOAL_DATE_COOKIE, '2027-01-05', { path: '/' });
		});

		it('clears the cookie with ?goalDate=off', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			saveGoalDateCookie({ goalDate: 'off' }, cookieStore);
			expect(cookieStore.remove).toHaveBeenCalledWith(GOAL_DATE_COOKIE, { path: '/' });
			expect(cookieStore.cookies.has(GOAL_DATE_COOKIE)).toBe(false);
		});

		it('leaves the cookie alone without a goal date param', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			saveGoalDateCookie({ loanId: '1' }, cookieStore);
			expect(cookieStore.set).not.toHaveBeenCalled();
			expect(cookieStore.remove).not.toHaveBeenCalled();
		});

		it('writes nothing when there is no cookie to clear', () => {
			const cookieStore = createCookieStore();
			saveGoalDateCookie({ goalDate: 'off' }, cookieStore);
			expect(cookieStore.remove).not.toHaveBeenCalled();
		});

		it('does nothing without a cookie store', () => {
			expect(() => saveGoalDateCookie({ goalDate: '2027-01-05' }, null)).not.toThrow();
		});
	});
});
