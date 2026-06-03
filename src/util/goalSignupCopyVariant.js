/**
 * Calendar-driven copy variant for goal sign-up entrypoints.
 * Foundation for MP-2855: a single source of truth that the Thanks page,
 * Portfolio, Goal Setting page, and MyKiva entrypoints can consume.
 *
 * Variant rule (local browser time, year-agnostic):
 *   Jan 1 – Mar 31  -> 'last-year'
 *   Apr 1 – Dec 31  -> 'no-goal-yet'
 */

export const GOAL_SIGNUP_COPY_VARIANT = {
	LAST_YEAR: 'last-year',
	NO_GOAL_YET: 'no-goal-yet',
};

// April (Date#getMonth is 0-indexed) is the earliest 'no-goal-yet' month.
const NO_GOAL_YET_START_MONTH = 3;
const NO_GOAL_YET_START_DAY = 1;

/**
 * Pure resolver.
 *
 * @param {Date} [date] - Date to evaluate; defaults to now.
 * @returns {'last-year' | 'no-goal-yet'}
 */
function resolveGoalSignupCopyVariant(date = new Date()) {
	const month = date.getMonth();
	const day = date.getDate();
	const onOrAfterApr1 = month > NO_GOAL_YET_START_MONTH
		|| (month === NO_GOAL_YET_START_MONTH && day >= NO_GOAL_YET_START_DAY);
	return onOrAfterApr1
		? GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET
		: GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR;
}

/**
 * Returns the current goal signup copy variant. The value is captured once
 * at call time and does not react to midnight rollover (explicit non-goal).
 *
 * @param {object} [options]
 * @param {Date}   [options.now] - Override date (used by tests to pin a boundary).
 * @returns {'last-year' | 'no-goal-yet'}
 */
export default function useGoalSignupCopyVariant({ now } = {}) {
	return resolveGoalSignupCopyVariant(now ?? new Date());
}
