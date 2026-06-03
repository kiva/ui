import useGoalSignupCopyVariant, {
	GOAL_SIGNUP_COPY_VARIANT,
} from '#src/composables/useGoalSignupCopyVariant';

const variantAt = now => useGoalSignupCopyVariant({ now }).variant.value;

describe('useGoalSignupCopyVariant', () => {
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
		const { variant } = useGoalSignupCopyVariant();
		// Variant for "today" depends on the calendar but must always be valid.
		expect(Object.values(GOAL_SIGNUP_COPY_VARIANT)).toContain(variant.value);
	});
});
