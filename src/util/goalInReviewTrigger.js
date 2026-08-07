import { GOAL_STATUS } from '#src/composables/useGoalData';

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
 * @param {boolean} options.hasCompletionPending Whether a completed goal was already
 *   seen on an earlier visit, which makes this the session after completion.
 * @returns {boolean} Whether to open the recap automatically.
 */
export function shouldAutoOpenRecap({
	enabled = false,
	isEligible = false,
	goalStatus = '',
	goalYear = null,
	currentGoalYear = null,
	hasViewedRecap = false,
	hasCompletionPending = false,
} = {}) {
	if (!enabled || !isEligible || hasViewedRecap) {
		return false;
	}

	// The pop-up is for this year's goal setters. A goal from a previous year is only
	// reachable through the goal card entry point.
	if (Number(goalYear) !== Number(currentGoalYear)) {
		return false;
	}

	if (goalStatus === GOAL_STATUS.COMPLETED) {
		// The session after completion: the completed goal was already seen on an earlier visit.
		return hasCompletionPending;
	}

	// In progress goal setters are reached when the feature itself goes live, so the
	// flag is the only gate.
	if (goalStatus === GOAL_STATUS.IN_PROGRESS) {
		return true;
	}

	return false;
}
