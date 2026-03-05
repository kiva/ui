import { buildEmailFlowGoalData } from '#src/util/goalEmailFlow';
import { GOAL_STATUS } from '#src/composables/useGoalData';

vi.mock('#src/composables/useGoalData', () => ({
	GOAL_STATUS: {
		COMPLETED: 'completed',
		EXPIRED: 'expired',
		IN_PROGRESS: 'in-progress',
	},
}));

const CATEGORY = 'climate-action';
const OTHER_CATEGORY = 'womens-equality';

describe('goalEmailFlow.js', () => {
	describe('buildEmailFlowGoalData', () => {
		it('returns newGoalPrefs when no goals exist', () => {
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(existingGoal).toBeNull();
			expect(newGoalPrefs).toMatchObject({
				category: CATEGORY,
				target: 10,
				status: GOAL_STATUS.IN_PROGRESS,
			});
		});

		it('includes the current year and a dateStarted in newGoalPrefs', () => {
			const { newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [],
				category: CATEGORY,
				validEmailTarget: 5,
			});
			const currentYear = new Date().getFullYear();

			expect(newGoalPrefs.goalName).toBe(`goal-${CATEGORY}-${currentYear}`);
			expect(newGoalPrefs.dateStarted).toBeTruthy();
		});

		it('returns null newGoalPrefs when an in-progress goal already exists for the category', () => {
			const existing = { category: CATEGORY, status: GOAL_STATUS.IN_PROGRESS, target: 5 };
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [existing],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(existingGoal).toEqual(existing);
			expect(newGoalPrefs).toBeNull();
		});

		it('returns the existing active goal', () => {
			const otherGoal = { category: OTHER_CATEGORY, status: GOAL_STATUS.IN_PROGRESS, target: 5 };
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [otherGoal],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(existingGoal).toEqual(otherGoal);
			expect(newGoalPrefs).toBeNull();
		});

		it('ignores completed goals for the same category', () => {
			const completed = { category: CATEGORY, status: GOAL_STATUS.COMPLETED, target: 5 };
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [completed],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(existingGoal).toBeNull();
			expect(newGoalPrefs).toMatchObject({ category: CATEGORY });
		});

		it('ignores expired goals for the same category', () => {
			const expired = { category: CATEGORY, status: GOAL_STATUS.EXPIRED, target: 5 };
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [expired],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(existingGoal).toBeNull();
			expect(newGoalPrefs).toMatchObject({ category: CATEGORY });
		});

		it('returns null newGoalPrefs when validEmailTarget is null', () => {
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [],
				category: CATEGORY,
				validEmailTarget: null,
			});

			expect(existingGoal).toBeNull();
			expect(newGoalPrefs).toBeNull();
		});
	});
});
