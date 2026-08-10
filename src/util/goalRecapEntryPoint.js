import { GOAL_STATUS } from '#src/composables/useGoalData';

export const RECAP_CTA_LABEL = 'View goal recap';

// A past goal's recap stays reachable until the end of March 31 in the year after the
// goal ran, derived from the goal's own year rather than pinned to a calendar year.
const CUTOFF_MONTH = 2;
const CUTOFF_DATE = 31;

/**
 * Last moment a past goal's recap entry point is offered.
 *
 * @param {number|string} goalYear The year the goal ran.
 * @returns {Date} End of March 31 in the year after the goal.
 */
export function getRecapEntryCutoff(goalYear) {
	return new Date(Number(goalYear) + 1, CUTOFF_MONTH, CUTOFF_DATE, 23, 59, 59, 999);
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
 * @param {boolean} [options.hasCurrentYearGoal] Whether a goal is set for this year.
 * @param {Date} [options.now] The effective current date.
 * @returns {boolean} Whether to offer the recap from this card.
 */
export function shouldShowRecapEntryPoint({
	enabled = false,
	goalStatus = '',
	goalYear = null,
	currentYear = null,
	loansTowardGoal = 0,
	hasCurrentYearGoal = false,
	now = new Date(),
} = {}) {
	if (!enabled || !goalYear || !currentYear) {
		return false;
	}

	if (Number(goalYear) > Number(currentYear)) {
		return false;
	}

	// This year's goal: only completers. While a goal is still running its card stays
	// completion-focused, so there is no recap CTA on it.
	if (Number(goalYear) === Number(currentYear)) {
		return goalStatus === GOAL_STATUS.COMPLETED;
	}

	// A past goal keeps its recap into the new year for anyone who made progress toward
	// it, until they set this year's goal or the cutoff passes, whichever lands first.
	if (hasCurrentYearGoal || now.getTime() > getRecapEntryCutoff(goalYear).getTime()) {
		return false;
	}
	return goalStatus === GOAL_STATUS.COMPLETED || Number(loansTowardGoal) > 0;
}
