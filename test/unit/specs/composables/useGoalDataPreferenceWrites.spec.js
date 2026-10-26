import { createApp } from 'vue';
import useGoalData, { GOAL_STATUS, GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { ID_BASIC_NEEDS, ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import setUserPreferenceMutation from '#src/graphql/mutation/accountSettings/setUserPreference.graphql';
import setMyKivaGoalMutation from '#src/graphql/mutation/accountSettings/setMyKivaGoal.graphql';

vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

// Real util, mocked Apollo: pins the mutation, key, encoding and write order that reach the server.
describe('useGoalData preference writes', () => {
	let mockApollo;
	let composable;

	const womenGoal = {
		goalName: 'goal-women-2026',
		category: ID_WOMENS_EQUALITY,
		target: 5,
		status: GOAL_STATUS.IN_PROGRESS,
		dateStarted: '2026-03-01T00:00:00.000Z',
	};
	const basicNeedsGoal = {
		goalName: 'goal-basic-needs-2026',
		category: ID_BASIC_NEEDS,
		target: 3,
		status: GOAL_STATUS.IN_PROGRESS,
		dateStarted: '2026-02-01T00:00:00.000Z',
	};

	const prefsResponse = (prefs, achievements = []) => ({
		data: {
			my: {
				userPreferences: { id: 'pref-1', preferences: JSON.stringify(prefs) },
				loans: { totalCount: 0 },
			},
			userAchievementProgress: { tieredLendingAchievements: achievements },
		},
	});

	const operationName = call => call[0]?.mutation?.definitions?.[0]?.name?.value;
	const tick = () => new Promise(resolve => { setTimeout(resolve, 0); });

	beforeEach(() => {
		mockApollo = {
			query: vi.fn(),
			mutate: vi.fn().mockResolvedValue({ data: {} }),
		};

		let created;
		const app = createApp({
			name: 'TestComponent',
			setup() {
				created = useGoalData({ apollo: mockApollo });
				return {};
			},
			template: '<div></div>',
		});
		app.provide('$kvTrackEvent', vi.fn());
		app.mount(document.createElement('div'));
		composable = created;
	});

	it('hides the goal card with a single JSON-encoded boolean', async () => {
		await composable.setHideGoalCardPreference(true);

		expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
		expect(mockApollo.mutate).toHaveBeenCalledWith({
			mutation: setUserPreferenceMutation,
			variables: { key: 'hideGoalCard', value: 'true' },
		});
		expect(mockApollo.query).not.toHaveBeenCalled();
	});

	it('marks a year-keyed flag with the merged map as the value', async () => {
		mockApollo.query.mockResolvedValue(prefsResponse({
			viewedGoalComplete: { [GOALS_CURRENT_YEAR - 1]: true },
		}));

		await composable.setViewedGoalCompletePreference(GOALS_CURRENT_YEAR);

		expect(mockApollo.mutate).toHaveBeenCalledWith({
			mutation: setUserPreferenceMutation,
			variables: {
				key: 'viewedGoalComplete',
				value: JSON.stringify({ [GOALS_CURRENT_YEAR - 1]: true, [GOALS_CURRENT_YEAR]: true }),
			},
		});
	});

	it('edits a goal with one write to the goals key', async () => {
		mockApollo.query.mockResolvedValue(prefsResponse({ goals: [womenGoal, basicNeedsGoal] }));
		await composable.loadGoalData();

		await composable.updateCurrentGoal(womenGoal, { ...womenGoal, target: 9 });

		expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
		const { mutation, variables } = mockApollo.mutate.mock.calls[0][0];
		expect(mutation).toBe(setUserPreferenceMutation);
		expect(variables.key).toBe('goals');
		const goals = JSON.parse(variables.value);
		expect(goals).toHaveLength(2);
		expect(goals[0]).toEqual({ ...womenGoal, target: 9, updatedAt: expect.any(String) });
		expect(goals[1]).toEqual(basicNeedsGoal);
	});

	it('removes a goal with the goals write first and the card reset second', async () => {
		mockApollo.query.mockResolvedValue(prefsResponse({ goals: [womenGoal, basicNeedsGoal] }));

		await composable.removeGoalFromPreferences(womenGoal);

		expect(mockApollo.mutate).toHaveBeenCalledTimes(2);
		expect(mockApollo.mutate).toHaveBeenNthCalledWith(1, {
			mutation: setUserPreferenceMutation,
			variables: { key: 'goals', value: JSON.stringify([basicNeedsGoal]) },
		});
		expect(mockApollo.mutate).toHaveBeenNthCalledWith(2, {
			mutation: setUserPreferenceMutation,
			variables: { key: 'hideGoalCard', value: 'false' },
		});
	});

	it('waits for the goals write to settle before sending the card reset', async () => {
		mockApollo.query.mockResolvedValue(prefsResponse({ goals: [womenGoal] }));
		let resolveGoalsWrite;
		mockApollo.mutate = vi.fn()
			.mockImplementationOnce(() => new Promise(resolve => { resolveGoalsWrite = resolve; }))
			.mockResolvedValue({ data: {} });

		const removal = composable.removeGoalFromPreferences(womenGoal);
		await tick();

		expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
		expect(mockApollo.mutate.mock.calls[0][0].variables.key).toBe('goals');

		resolveGoalsWrite({ data: {} });
		await removal;

		expect(mockApollo.mutate).toHaveBeenCalledTimes(2);
		expect(mockApollo.mutate.mock.calls[1][0].variables.key).toBe('hideGoalCard');
	});

	it('still sends the card reset when the goals write fails, and does not throw', async () => {
		mockApollo.query.mockResolvedValue(prefsResponse({ goals: [womenGoal] }));
		mockApollo.mutate = vi.fn()
			.mockRejectedValueOnce(new Error('network'))
			.mockResolvedValue({ data: {} });

		await expect(composable.removeGoalFromPreferences(womenGoal)).resolves.toBeUndefined();

		expect(mockApollo.mutate).toHaveBeenCalledTimes(2);
		expect(mockApollo.mutate.mock.calls[1][0].variables).toEqual({ key: 'hideGoalCard', value: 'false' });
	});

	it('renews the year through setMyKivaGoal, then goals, then goalsRenewedDate', async () => {
		const lastYearGoal = { ...womenGoal, goalName: 'goal-women-2025', dateStarted: '2025-01-01T00:00:00.000Z' };
		const today = new Date('2026-01-15T00:00:00Z');
		mockApollo.query.mockResolvedValue(prefsResponse(
			{ goals: [lastYearGoal] },
			[{ id: ID_WOMENS_EQUALITY, progressForYear: 2, totalProgressToAchievement: 2 }],
		));

		await composable.renewAnnualGoal(today);

		expect(mockApollo.mutate.mock.calls.map(operationName))
			.toEqual(['SetMyKivaGoal', 'SetUserPreference', 'SetUserPreference']);
		expect(mockApollo.mutate.mock.calls[0][0]).toEqual({
			mutation: setMyKivaGoalMutation,
			variables: {
				category: ID_WOMENS_EQUALITY,
				target: 5,
				dateStarted: lastYearGoal.dateStarted,
				status: GOAL_STATUS.EXPIRED,
			},
		});
		expect(mockApollo.mutate.mock.calls[1][0].variables).toEqual({
			key: 'goals',
			value: JSON.stringify([{ ...lastYearGoal, status: GOAL_STATUS.EXPIRED, loansTowardGoal: 2 }]),
		});
		expect(mockApollo.mutate.mock.calls[2][0].variables).toEqual({
			key: 'goalsRenewedDate',
			value: JSON.stringify(today.toISOString()),
		});
	});

	it('sets a goal for a lender with no preferences row without creating one first', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { userPreferences: null, loans: { totalCount: 0 } },
				userAchievementProgress: { tieredLendingAchievements: [] },
			},
		});
		await composable.loadGoalData();

		await composable.storeGoalPreferences(womenGoal);

		expect(mockApollo.mutate.mock.calls.map(operationName)).toEqual(['SetMyKivaGoal']);
	});
});
