import { GOAL_STATUS } from '#src/composables/useGoalData';

/**
 * Whether the in-progress release date has arrived. Missing or unparseable dates
 * read as "not yet", so an unset setting holds the pop-up back rather than
 * releasing it to every in-progress goal setter at once.
 *
 * @param {Date|string|null} startDate The configured release date.
 * @param {Date} now The effective current date.
 * @returns {boolean} Whether in-progress goal setters are eligible yet.
 */
function hasInProgressReleaseStarted(startDate, now) {
	const start = startDate instanceof Date ? startDate : new Date(startDate ?? NaN);
	if (Number.isNaN(start.getTime())) {
		return false;
	}
	return now.getTime() >= start.getTime();
}

/**
 * Decides whether the recap should open by itself, for MyKiva and Portfolio alike.
 * Both pages call this so the pop-up happens once per user across the two, rather
 * than once per page.
 *
 * @param {object} options Trigger inputs.
 * @param {boolean} options.enabled The goal_in_review_enable setting.
 * @param {boolean} options.isEligible Whether the recap has a goal with progress.
 * @param {string} options.goalStatus The goal's status.
 * @param {number|string} options.goalYear The year the goal belongs to.
 * @param {number|string} options.currentGoalYear The goal year in progress now.
 * @param {boolean} options.hasViewedRecap Whether the recap has already been seen.
 * @param {boolean} options.completedThisSession Whether the goal completed during this
 *   browsing session, which means the recap waits for the next one.
 * @param {Date|string|null} options.inProgressStartDate The goal_in_review_in_progress_start
 *   setting, the date in-progress goal setters become eligible.
 * @param {Date} options.now The effective current date.
 * @returns {boolean} Whether to open the recap automatically.
 */
export function shouldAutoOpenRecap({
	enabled = false,
	isEligible = false,
	goalStatus = '',
	goalYear = null,
	currentGoalYear = null,
	hasViewedRecap = false,
	completedThisSession = false,
	inProgressStartDate = null,
	now = new Date(),
} = {}) {
	if (!enabled || !isEligible || hasViewedRecap) {
		return false;
	}

	// The pop-up is for this year's goal setters. A goal from a previous year is only
	// reachable through the goal card entry point.
	if (Number(goalYear) !== Number(currentGoalYear)) {
		return false;
	}

	// If the user arrives at MyKiva from the thanks page, the recap is not shown yet.
	// It waits for their next session.
	if (goalStatus === GOAL_STATUS.COMPLETED) {
		return !completedThisSession;
	}

	// Completed goal setters see the recap as soon as the feature is live; in-progress
	// ones wait for the configured release date so their goal has run most of its course.
	if (goalStatus === GOAL_STATUS.IN_PROGRESS) {
		return hasInProgressReleaseStarted(inProgressStartDate, now);
	}

	return false;
}
