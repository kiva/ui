import { buildEmailFlowGoalData } from '#src/util/goalEmailFlow';
import { GOAL_STATUS } from '#src/composables/useGoalData';

vi.mock('#src/composables/useGoalData', async importOriginal => {
	const { buildNewGoal } = await importOriginal();
	return {
		buildNewGoal,
		GOAL_STATUS: {
			COMPLETED: 'completed',
			EXPIRED: 'expired',
			IN_PROGRESS: 'in-progress',
		},
	};
});

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

		it('names and dates the new goal for the now it is given', () => {
			const now = new Date(2031, 0, 5, 12);
			const { newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [],
				category: CATEGORY,
				validEmailTarget: 5,
				now,
			});

			expect(newGoalPrefs.goalName).toBe(`goal-${CATEGORY}-2031`);
			expect(new Date(newGoalPrefs.dateStarted).getTime()).toBe(now.getTime());
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

		it('ignores completed goals', () => {
			const completed = { category: CATEGORY, status: GOAL_STATUS.COMPLETED, target: 5 };
			const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
				allGoals: [completed],
				category: CATEGORY,
				validEmailTarget: 10,
			});

			expect(newGoalPrefs).toBeNull();
			expect(existingGoal).toMatchObject({ category: CATEGORY });
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

		describe('goals from earlier years', () => {
			const now = new Date(2027, 1, 1, 12);
			const goalFrom = (status, year) => ({
				category: CATEGORY,
				status,
				target: 5,
				goalName: `goal-${CATEGORY}-${year}`,
				dateStarted: new Date(year, 5, 25, 12).toISOString(),
			});

			it('builds this year\'s goal when last year\'s was completed', () => {
				const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
					allGoals: [goalFrom(GOAL_STATUS.COMPLETED, 2026)],
					category: CATEGORY,
					validEmailTarget: 3,
					now,
				});

				expect(existingGoal).toBeNull();
				expect(newGoalPrefs).toMatchObject({ goalName: `goal-${CATEGORY}-2027`, target: 3 });
			});

			it('builds this year\'s goal when last year\'s is still saved as in progress', () => {
				const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
					allGoals: [goalFrom(GOAL_STATUS.EXPIRED, 2025), goalFrom(GOAL_STATUS.IN_PROGRESS, 2026)],
					category: CATEGORY,
					validEmailTarget: 3,
					now,
				});

				expect(existingGoal).toBeNull();
				expect(newGoalPrefs).toMatchObject({ goalName: `goal-${CATEGORY}-2027` });
			});

			it('keeps this year\'s goal next to last year\'s, with no second goal', () => {
				const thisYear = goalFrom(GOAL_STATUS.IN_PROGRESS, 2027);
				const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
					allGoals: [goalFrom(GOAL_STATUS.COMPLETED, 2026), thisYear],
					category: CATEGORY,
					validEmailTarget: 3,
					now,
				});

				expect(existingGoal).toEqual(thisYear);
				expect(newGoalPrefs).toBeNull();
			});

			it('treats this year\'s completed goal as existing', () => {
				const completedThisYear = goalFrom(GOAL_STATUS.COMPLETED, 2027);
				const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
					allGoals: [completedThisYear],
					category: CATEGORY,
					validEmailTarget: 3,
					now,
				});

				expect(existingGoal).toEqual(completedThisYear);
				expect(newGoalPrefs).toBeNull();
			});
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
