import { GOAL_STATUS } from '#src/composables/useGoalData';

export const RECAP_CTA_LABEL = 'View goal recap';

// End of March is the product cutoff for looking back at last year's goal (MP-2944).
const MARCH = 2;
const CUTOFF_DAY = 31;

/**
 * The calendar year a goal belongs to, taken from the date it started.
 *
 * @param {object} goal A goal carrying a dateStarted.
 * @returns {number|null} The goal's year, or null when it has no start date.
 */
export function getGoalYear(goal) {
	return goal?.dateStarted ? new Date(goal.dateStarted).getFullYear() : null;
}

/**
 * Last moment a past goal's recap entry point is offered.
 *
 * @param {number|string} goalYear The year the goal ran.
 * @returns {Date} End of March 31 in the year after the goal.
 */
export function getRecapEntryCutoff(goalYear) {
	return new Date(Number(goalYear) + 1, MARCH, CUTOFF_DAY, 23, 59, 59, 999);
}

/**
 * Decides whether a goal card offers the "View goal recap" CTA. Shared by the
 * completed-goal next step card and the Impact Progress row, so both surfaces answer
 * the question the same way.
 *
 * @param {object} options Entry point inputs.
 * @param {boolean} options.enabled The goal_in_review_enable setting.
 * @param {string} options.goalStatus The goal's status.
 * @param {number|string} options.goalYear The year the goal ran.
 * @param {number|string} options.currentYear The current year.
 * @param {number} [options.loansTowardGoal] Loans made toward an unfinished goal.
 * @param {number|string|null} [options.activeGoalYear] The year of the goal the lender has
 *   set now, which ends a past goal's recap once it reaches the current year.
 * @param {Date} [options.now] The effective current date.
 * @returns {boolean} Whether to offer the recap from this card.
 */
export function shouldShowRecapEntryPoint({
	enabled = false,
	goalStatus = '',
	goalYear = null,
	currentYear = null,
	loansTowardGoal = 0,
	activeGoalYear = null,
	now = new Date(),
} = {}) {
	if (!enabled || !goalYear || !currentYear) {
		return false;
	}

	if (Number(goalYear) > Number(currentYear)) {
		return false;
	}

	// A goal still running keeps its card focused on finishing it.
	if (Number(goalYear) === Number(currentYear)) {
		return goalStatus === GOAL_STATUS.COMPLETED;
	}

	// A past goal's recap stays reachable into the new year, so lenders who never finished
	// still get to look back at what they did.
	if (Number(activeGoalYear) === Number(currentYear)
		|| now.getTime() > getRecapEntryCutoff(goalYear).getTime()) {
		return false;
	}
	return goalStatus === GOAL_STATUS.COMPLETED || Number(loansTowardGoal) > 0;
}
