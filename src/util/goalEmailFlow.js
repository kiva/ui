import { buildNewGoal, GOAL_STATUS } from '#src/composables/useGoalData';

/**
 * Given the current list of goals and email flow parameters, determines
 * whether a new goal should be created and builds the preferences object.
 *
 * @param {Object} params
 * @param {Array} params.allGoals - Current list of all user goals
 * @param {string} params.category - The validated email category
 * @param {number|null} params.validEmailTarget - Validated target (null if invalid)
 * @param {Date} [params.now] - The effective "now", from useGoalNow so the ?goalDate override applies
 * @returns {{ existingGoal: Object|null, newGoalPrefs: Object|null }}
 */
export function buildEmailFlowGoalData({
	allGoals, category, validEmailTarget, now = new Date(),
}) {
	// Only a goal for the goal year in progress counts, the rule MyKiva uses for the active goal: a goal
	// from an earlier year, completed or still saved as in progress, mustn't stop this year's being set.
	const currentYear = now.getFullYear();
	const existingGoal = allGoals.find(g => {
		if (g.status !== GOAL_STATUS.IN_PROGRESS && g.status !== GOAL_STATUS.COMPLETED) return false;
		return !g.dateStarted || new Date(g.dateStarted).getFullYear() >= currentYear;
	}) ?? null;

	let newGoalPrefs = null;
	if (!existingGoal && validEmailTarget != null) {
		newGoalPrefs = buildNewGoal({ category, target: validEmailTarget, now });
	}

	return { existingGoal, newGoalPrefs };
}
