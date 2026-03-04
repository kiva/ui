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
