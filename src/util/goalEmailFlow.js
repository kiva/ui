import { GOAL_STATUS } from '#src/composables/useGoalData';

/**
 * Given the current list of goals and email flow parameters, determines
 * whether a new goal should be created and builds the preferences object.
 *
 * @param {Object} params
 * @param {Array} params.allGoals - Current list of all user goals
 * @param {string} params.category - The validated email category
 * @param {number|null} params.validEmailTarget - Validated target (null if invalid)
 * @returns {{ existingGoal: Object|null, newGoalPrefs: Object|null }}
 */
export function buildEmailFlowGoalData({ allGoals, category, validEmailTarget }) {
	const existingGoal = allGoals.find(
		g => g.category === category && g.status === GOAL_STATUS.IN_PROGRESS,
	) ?? null;

	let newGoalPrefs = null;
	if (!existingGoal && validEmailTarget != null) {
		const currentYear = new Date().getFullYear();
		newGoalPrefs = {
			goalName: `goal-${category}-${currentYear}`,
			category,
			target: validEmailTarget,
			dateStarted: new Date().toISOString(),
			status: GOAL_STATUS.IN_PROGRESS,
		};
	}

	return { existingGoal, newGoalPrefs };
}

/**
 * Finds the goal to display in the email flow after store operations complete.
 * Falls back to any goal for the category when no in-progress goal existed.
 *
 * @param {Object} params
 * @param {Object|null} params.existingGoal - The pre-existing in-progress goal (if any)
 * @param {Array} params.allGoals - Updated list of all user goals (post-store)
 * @param {string} params.category - The validated email category
 * @returns {Object|null}
 */
export function findEmailDisplayGoal({ existingGoal, allGoals, category }) {
	return existingGoal ?? allGoals.find(g => g.category === category) ?? null;
}
