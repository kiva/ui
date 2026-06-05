import getGoalSignupCopyVariant, {
	GOAL_SIGNUP_DATE_QUERY_PARAM,
	GOAL_SIGNUP_COPY_VARIANT,
} from '#src/util/goalSignupCopyVariant';

const variantAt = now => getGoalSignupCopyVariant({ now });
const CONFIG_GLOBAL_NAME = '__KV_CONFIG__';
const setTestUrl = query => {
	window.history.pushState({}, '', `/${query ? `?${query}` : ''}`);
};
const setAppHost = host => {
	Object.defineProperty(window, CONFIG_GLOBAL_NAME, {
		configurable: true,
		value: { host },
	});
};

describe('getGoalSignupCopyVariant', () => {
	afterEach(() => {
		setTestUrl('');
		vi.useRealTimers();
		delete window[CONFIG_GLOBAL_NAME];
	});

	it('returns last-year on Jan 1 (start-of-year boundary)', () => {
		expect(variantAt(new Date('2026-01-01T00:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR);
	});

	it('returns last-year on Mar 31 23:59 (last moment of last-year window)', () => {
		expect(variantAt(new Date('2026-03-31T23:59:59'))).toBe(GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR);
	});

	it('returns no-goal-yet on Apr 1 00:00 (first moment of no-goal-yet window)', () => {
		expect(variantAt(new Date('2026-04-01T00:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('returns no-goal-yet on Dec 31 (end-of-year boundary)', () => {
		expect(variantAt(new Date('2026-12-31T23:59:59'))).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('returns no-goal-yet for May 2026 (rollout exception per acceptance criteria)', () => {
		expect(variantAt(new Date('2026-05-15T12:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('returns last-year for mid-Q1 in a different year (evergreen)', () => {
		expect(variantAt(new Date('2025-03-15T12:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR);
	});

	it('returns no-goal-yet for mid-year in a future year (evergreen)', () => {
		expect(variantAt(new Date('2027-07-04T12:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('defaults to current date when now is omitted', () => {
		// Variant for "today" depends on the calendar but must always be valid.
		expect(Object.values(GOAL_SIGNUP_COPY_VARIANT)).toContain(getGoalSignupCopyVariant());
	});

	it('uses the query param date override in low environments', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-15T12:00:00'));
		setAppHost('www.development.kiva.org');
		setTestUrl(`${GOAL_SIGNUP_DATE_QUERY_PARAM}=2026-04-01`);

		expect(getGoalSignupCopyVariant()).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('ignores the query param date override in production', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-15T12:00:00'));
		setAppHost('www.kiva.org');
		setTestUrl(`${GOAL_SIGNUP_DATE_QUERY_PARAM}=2026-04-01`);

		expect(getGoalSignupCopyVariant()).toBe(GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR);
	});

	it('ignores invalid query param dates', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-15T12:00:00'));
		setAppHost('kiva-ui.local');
		setTestUrl(`${GOAL_SIGNUP_DATE_QUERY_PARAM}=2026-02-31`);

		expect(getGoalSignupCopyVariant()).toBe(GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET);
	});

	it('lets an explicit now option take precedence over the query param override', () => {
		setAppHost('www.development.kiva.org');
		setTestUrl(`${GOAL_SIGNUP_DATE_QUERY_PARAM}=2026-04-01`);

		expect(variantAt(new Date('2026-03-31T12:00:00'))).toBe(GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR);
	});
});
