import {
	GOAL_DATE_COOKIE,
	getCurrentGoalYear,
	getGoalDateOverride,
	getGoalNow,
	getLastGoalYear,
	isProductionHost,
	parseGoalDate,
	syncGoalDateCookie,
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

		it('accepts a month and day without leading zeros', () => {
			expect(localDay(parseGoalDate('2027-2-1'))).toEqual([2027, 2, 1]);
			expect(localDay(parseGoalDate('2027-12-5'))).toEqual([2027, 12, 5]);
		});

		it('uses the first value of a repeated param', () => {
			expect(localDay(parseGoalDate(['2027-04-01', '2026-01-01']))).toEqual([2027, 4, 1]);
		});

		it.each([
			['an impossible day', '2027-02-30'],
			['an impossible month', '2027-13-1'],
			['a three-digit day', '2027-01-001'],
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

	describe('isProductionHost', () => {
		it('is true only for the production host', () => {
			expect(isProductionHost('www.kiva.org')).toBe(true);
			expect(isProductionHost('kiva.org')).toBe(false);
			expect(isProductionHost('www.development.kiva.org')).toBe(false);
			expect(isProductionHost('www.staging.kiva.org')).toBe(false);
			expect(isProductionHost('kiva-ui.local')).toBe(false);
			expect(isProductionHost(undefined)).toBe(false);
		});
	});

	describe('syncGoalDateCookie', () => {
		it('saves a valid date as a session cookie', () => {
			const cookieStore = createCookieStore();
			syncGoalDateCookie({ goalDate: '2027-01-05' }, cookieStore);
			expect(cookieStore.set).toHaveBeenCalledWith(GOAL_DATE_COOKIE, '2027-01-05', { path: '/' });
		});

		it('skips the write when the cookie already has that date', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			syncGoalDateCookie({ goalDate: '2027-01-05' }, cookieStore);
			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('deletes the cookie with ?goalDate=off or another invalid value', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			syncGoalDateCookie({ goalDate: 'off' }, cookieStore);
			expect(cookieStore.remove).toHaveBeenCalledWith(GOAL_DATE_COOKIE, { path: '/' });

			cookieStore.cookies.set(GOAL_DATE_COOKIE, '2027-01-05');
			syncGoalDateCookie({ goalDate: '2027-02-30' }, cookieStore);
			expect(cookieStore.cookies.has(GOAL_DATE_COOKIE)).toBe(false);
		});

		it('leaves the cookie alone without the param', () => {
			const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
			syncGoalDateCookie({ loanId: '1' }, cookieStore);
			syncGoalDateCookie(undefined, cookieStore);
			expect(cookieStore.set).not.toHaveBeenCalled();
			expect(cookieStore.remove).not.toHaveBeenCalled();
		});

		it('does nothing without a cookie store', () => {
			expect(() => syncGoalDateCookie({ goalDate: '2027-01-05' }, null)).not.toThrow();
		});
	});
});
