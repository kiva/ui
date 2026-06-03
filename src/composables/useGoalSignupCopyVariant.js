import { computed } from 'vue';

/**
 * Calendar-driven copy variant for goal sign-up entrypoints.
 * Foundation for MP-2855: a single source of truth that the Thanks page,
 * Portfolio, Goal Setting page, and MyKiva entrypoints can consume.
 *
 * Variant rule (local browser time, year-agnostic):
 *   Jan 1 – Mar 31  -> 'last-year'
 *   Apr 1 – Dec 31  -> 'no-goal-yet'
 */

export const GOAL_SIGNUP_COPY_VARIANT = Object.freeze({
	LAST_YEAR: 'last-year',
	NO_GOAL_YET: 'no-goal-yet',
});

// April (Date#getMonth is 0-indexed) is the earliest 'no-goal-yet' month.
const NO_GOAL_YET_START_MONTH = 3;
const NO_GOAL_YET_START_DAY = 1;

/**
 * Pure resolver. Exported so tests can hit boundary dates directly without
 * mounting a Vue tree.
 *
 * @param {Date} [date] - Date to evaluate; defaults to now.
 * @returns {'last-year' | 'no-goal-yet'}
 */
export function resolveGoalSignupCopyVariant(date = new Date()) {
	const month = date.getMonth();
	const day = date.getDate();
	const onOrAfterApr1 = month > NO_GOAL_YET_START_MONTH
		|| (month === NO_GOAL_YET_START_MONTH && day >= NO_GOAL_YET_START_DAY);
	return onOrAfterApr1
		? GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET
		: GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR;
}

/**
 * Vue composable returning the current goal signup copy variant.
 *
 * The `computed` wrapper has no reactive input — `now ?? new Date()` is
 * resolved once at composable-call time. Across a realistic SSR + first-render
 * lifespan the variant cannot flip mid-session unless the page is kept open
 * across Jan 1 or Apr 1 midnight, which is an explicit non-goal.
 *
 * @param {object} [options]
 * @param {Date}   [options.now] - Override date (used by tests to pin a boundary).
 * @returns {{ variant: import('vue').ComputedRef<'last-year' | 'no-goal-yet'> }}
 */
export default function useGoalSignupCopyVariant({ now } = {}) {
	const variant = computed(() => resolveGoalSignupCopyVariant(now ?? new Date()));
	return { variant };
}
