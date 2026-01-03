import { createApp } from 'vue';
import useGoalData, { GOAL_STATUS, GOALS_V2_START_YEAR, isGoalsV2Enabled } from '#src/composables/useGoalData';
import {
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_SUPPORT_ALL,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn(),
}));

vi.mock('#src/util/userPreferenceUtils', () => ({
	createUserPreferences: vi.fn(() => Promise.resolve({ id: 'new-pref-id' })),
	updateUserPreferences: vi.fn(() => Promise.resolve()),
}));

describe('GOALS_V2_START_YEAR', () => {
	it('should be 2026', () => {
		expect(GOALS_V2_START_YEAR).toBe(2026);
	});
});

describe('isGoalsV2Enabled', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return true when flag is true regardless of year', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2025-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(true)).toBe(true);
	});

	it('should return false when flag is false and year is before 2026', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2025-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(false)).toBe(false);
	});

	it('should return true when flag is false but year is 2026', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(false)).toBe(true);
	});

	it('should return true when flag is false but year is after 2026', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2027-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(false)).toBe(true);
	});

	it('should return true when flag is undefined but year is 2026 or later', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(undefined)).toBe(true);
	});

	it('should return true when flag is null but year is 2026 or later', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(null)).toBe(true);
	});

	it('should return falsy when flag is undefined and year is before 2026', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2025-06-15T00:00:00Z'));

		expect(isGoalsV2Enabled(undefined)).toBeFalsy();
	});
});

describe('useGoalData', () => {
	let mockApollo;
	let mockKvTrackEvent;
	let composable;

	beforeEach(() => {
		mockKvTrackEvent = vi.fn();
		mockApollo = {
			query: vi.fn(),
		};

		// Create composable inside a mock component context
		let createdComposable;
		const TestComponent = {
			setup() {
				createdComposable = useGoalData({ apollo: mockApollo });
				return {};
			},
			template: '<div></div>',
		};

		// Create temporary app to provide injection context
		const app = createApp(TestComponent);
		app.provide('$kvTrackEvent', mockKvTrackEvent);
		const container = document.createElement('div');
		app.mount(container);

		composable = createdComposable;
	});

	describe('getGoalDisplayName', () => {
		it('should return plural display name for target > 1', () => {
			expect(composable.getGoalDisplayName(5, ID_BASIC_NEEDS)).toBe('basic needs loans');
			expect(composable.getGoalDisplayName(10, ID_CLIMATE_ACTION)).toBe('eco friendly loans');
			expect(composable.getGoalDisplayName(3, ID_REFUGEE_EQUALITY)).toBe('refugees');
			expect(composable.getGoalDisplayName(2, ID_SUPPORT_ALL)).toBe('borrowers');
			expect(composable.getGoalDisplayName(100, ID_US_ECONOMIC_EQUALITY)).toBe('US entrepreneurs');
			expect(composable.getGoalDisplayName(7, ID_WOMENS_EQUALITY)).toBe('women');
		});

		it('should return singular display name for target = 1', () => {
			expect(composable.getGoalDisplayName(1, ID_BASIC_NEEDS)).toBe('basic needs loan');
			expect(composable.getGoalDisplayName(1, ID_CLIMATE_ACTION)).toBe('eco friendly loan');
			expect(composable.getGoalDisplayName(1, ID_REFUGEE_EQUALITY)).toBe('refugee');
			expect(composable.getGoalDisplayName(1, ID_SUPPORT_ALL)).toBe('borrower');
			expect(composable.getGoalDisplayName(1, ID_US_ECONOMIC_EQUALITY)).toBe('US entrepreneur');
			expect(composable.getGoalDisplayName(1, ID_WOMENS_EQUALITY)).toBe('woman');
		});

		it('should return default plural for unknown category', () => {
			expect(composable.getGoalDisplayName(5, 'unknown-category')).toBe('loans');
		});

		it('should return default singular for unknown category with target 1', () => {
			expect(composable.getGoalDisplayName(1, 'unknown-category')).toBe('loan');
		});

		it('should handle falsy target as plural', () => {
			expect(composable.getGoalDisplayName(0, ID_BASIC_NEEDS)).toBe('basic needs loans');
			expect(composable.getGoalDisplayName(null, ID_WOMENS_EQUALITY)).toBe('women');
		});
	});

	describe('setGoalState (via loadGoalData)', () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		it('should filter out expired goals', async () => {
			const mockPrefs = {
				goals: [
					{
						goalName: 'expired-goal',
						category: ID_WOMENS_EQUALITY,
						target: 10,
						status: GOAL_STATUS.EXPIRED,
						dateStarted: '2025-01-01',
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// Expired goal should be filtered out, userGoal should be empty
			expect(composable.userGoal.value).toEqual({});
		});

		it('should filter out goals completed in previous years', async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

			const mockPrefs = {
				goals: [
					{
						goalName: 'old-completed-goal',
						category: ID_WOMENS_EQUALITY,
						target: 10,
						status: GOAL_STATUS.COMPLETED,
						dateStarted: '2025-01-01', // Previous year
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// Goal completed in previous year should be filtered out
			expect(composable.userGoal.value).toEqual({});
		});

		it('should keep goals completed in current year', async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

			const mockPrefs = {
				goals: [
					{
						goalName: 'current-completed-goal',
						category: ID_WOMENS_EQUALITY,
						target: 10,
						status: GOAL_STATUS.COMPLETED,
						dateStarted: '2026-02-01', // Current year
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// Goal completed in current year should be kept
			expect(composable.userGoal.value).toEqual(mockPrefs.goals[0]);
		});

		it('should keep in-progress goals from current year', async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

			const mockPrefs = {
				goals: [
					{
						goalName: 'current-goal',
						category: ID_BASIC_NEEDS,
						target: 5,
						status: GOAL_STATUS.IN_PROGRESS,
						dateStarted: '2026-03-01',
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.userGoal.value).toEqual(mockPrefs.goals[0]);
		});

		it('should select first active goal when multiple goals exist', async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

			const mockPrefs = {
				goals: [
					{
						goalName: 'expired-goal',
						category: ID_WOMENS_EQUALITY,
						target: 10,
						status: GOAL_STATUS.EXPIRED,
						dateStarted: '2024-01-01',
					},
					{
						goalName: 'old-completed-goal',
						category: ID_BASIC_NEEDS,
						target: 5,
						status: GOAL_STATUS.COMPLETED,
						dateStarted: '2025-01-01', // Previous year
					},
					{
						goalName: 'current-goal',
						category: ID_CLIMATE_ACTION,
						target: 3,
						status: GOAL_STATUS.IN_PROGRESS,
						dateStarted: '2026-03-01', // Current year
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// Should select the current year in-progress goal (third one)
			expect(composable.userGoal.value.goalName).toBe('current-goal');
		});

		it('should handle completed goal without dateStarted', async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));

			const mockPrefs = {
				goals: [
					{
						goalName: 'completed-no-date',
						category: ID_WOMENS_EQUALITY,
						target: 10,
						status: GOAL_STATUS.COMPLETED,
						// No dateStarted field
					},
				],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// Goal without dateStarted should be kept (can't determine year)
			expect(composable.userGoal.value).toEqual(mockPrefs.goals[0]);
		});
	});

	describe('loadGoalData', () => {
		it('should load preferences and progress successfully', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 15 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [{ id: ID_WOMENS_EQUALITY, progressForYear: 15 }],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.loading.value).toBe(false);
			expect(composable.userGoal.value).toEqual(mockPrefs.goals[0]);
			expect(mockApollo.query).toHaveBeenCalledTimes(2);
		});

		it('should handle empty loans array', async () => {
			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: null,
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.loading.value).toBe(false);
			expect(mockApollo.query).toHaveBeenCalledTimes(2);
		});

		it('should handle null user preferences', async () => {
			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: null,
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// When preferences are null, loadPreferences returns {}
			// setGoalState sets userGoal to {...goals[0]} where goals is []
			// so userGoal.value becomes {} (empty object)
			expect(composable.userGoal.value).toEqual({});
		});

		it('should handle preferences query error', async () => {
			const logFormatter = (await import('#src/util/logFormatter')).default;
			const error = new Error('Network error');

			mockApollo.query = vi.fn()
				.mockRejectedValueOnce(error)
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(logFormatter).toHaveBeenCalledWith(error, 'Failed to load preferences');
		});

		it('should handle progress query error', async () => {
			const logFormatter = (await import('#src/util/logFormatter')).default;
			const error = new Error('Progress error');

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: null,
							loans: { totalCount: 0 },
						},
					},
				})
				.mockRejectedValueOnce(error);

			await composable.loadGoalData();

			expect(logFormatter).toHaveBeenCalledWith(error, 'Failed to fetch categories progress by year');
		});
	});

	describe('goalProgress computed', () => {
		it('should calculate progress for SUPPORT_ALL category', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 10 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [{ id: ID_WOMENS_EQUALITY, progressForYear: 10 }],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.goalProgress.value).toBe(10);
		});

		it('should calculate progress for specific category', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 8,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								// When yearlyProgress is true, progressForYear is used
								{ id: ID_WOMENS_EQUALITY, progressForYear: 8, totalProgressToAchievement: 8 },
								{ id: ID_US_ECONOMIC_EQUALITY, progressForYear: 5, totalProgressToAchievement: 5 },
							],
						},
					},
				});

			// Pass yearlyProgress: true to use progressForYear instead of totalProgressToAchievement
			await composable.loadGoalData({ yearlyProgress: true });

			expect(composable.goalProgress.value).toBe(8);
		});

		it('should handle missing progress entry', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_CLIMATE_ACTION,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{ id: ID_WOMENS_EQUALITY, progressForYear: 0 },
							],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.goalProgress.value).toBe(0);
		});
	});

	describe('userGoalAchieved computed', () => {
		it('should return true when goal is achieved', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 20 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [{ id: ID_WOMENS_EQUALITY, progressForYear: 20 }],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.userGoalAchieved.value).toBe(true); // progress: 20, target: 10
		});

		it('should return false when goal is not achieved', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 5 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [{ id: ID_WOMENS_EQUALITY, progressForYear: 5 }],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.userGoalAchieved.value).toBe(false); // progress: 5, target: 10
		});
	});

	describe('isProgressCompletingGoal', () => {
		it('should return true when progress equals target', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 5,
					status: 'in-progress',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.isProgressCompletingGoal(5)).toBe(true);
		});

		it('should return false when progress does not equal target', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 5,
					status: 'in-progress',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.isProgressCompletingGoal(3)).toBe(false);
			expect(composable.isProgressCompletingGoal(6)).toBe(false);
		});

		it('should return false when goal status is not in-progress', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 5,
					status: 'completed',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.isProgressCompletingGoal(5)).toBe(false);
		});

		it('should return false when progress is 0', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 0,
					status: 'in-progress',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			expect(composable.isProgressCompletingGoal(0)).toBe(false);
		});
	});

	describe('storeGoalPreferences', () => {
		it('should create preferences if they do not exist', async () => {
			const {
				createUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'new-pref-id',
							preferences: JSON.stringify({ goals: [] }),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			await composable.storeGoalPreferences({
				goalName: 'new-goal',
				category: ID_WOMENS_EQUALITY,
				target: 5,
			});

			expect(createUserPreferences).toHaveBeenCalledWith(mockApollo, { goals: [] });
		});

		it('should update existing goal', async () => {
			const { updateUserPreferences } = await import('#src/util/userPreferenceUtils');

			const mockPrefs = {
				goals: [{
					goalName: 'existing-goal',
					category: ID_BASIC_NEEDS,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{
									id: ID_BASIC_NEEDS,
									totalProgressToAchievement: 0,
									progressForYear: 0,
								},
							],
						},
					},
				});

			await composable.loadGoalData();

			await composable.storeGoalPreferences({
				goalName: 'existing-goal',
				target: 15,
			});

			expect(updateUserPreferences).toHaveBeenCalled();
			expect(composable.userGoal.value.target).toBe(15);
		});

		it('should add new goal to existing preferences', async () => {
			const {
				updateUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			const mockPrefs = {
				goals: [{
					goalName: 'existing-goal',
					category: ID_BASIC_NEEDS,
					target: 10,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValue({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				}).mockResolvedValue({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{
									id: ID_WOMENS_EQUALITY,
									totalProgressToAchievement: 3,
									progressForYear: 3,
								},
							],
						},
					},
				});

			await composable.loadGoalData();

			await composable.storeGoalPreferences({
				goalName: 'new-goal',
				category: ID_WOMENS_EQUALITY,
				target: 5,
			});

			expect(updateUserPreferences).toHaveBeenCalled();
		});
	});

	describe('checkCompletedGoal', () => {
		it('should mark goal as completed and track event', async () => {
			const currentYear = new Date().getFullYear();
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					dateStarted: `${currentYear}-01-01`,
					count: 0,
					status: 'in-progress',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{ id: ID_WOMENS_EQUALITY, totalProgressToAchievement: 0, progressForYear: 0 },
							],
						},
					},
				})
				.mockResolvedValue({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify({
									goals: [{
										...mockPrefs.goals[0],
										status: 'completed',
									}],
								}),
							},
							loans: { totalCount: 0 },
						},
					},
				});

			await composable.loadGoalData();
			await composable.checkCompletedGoal({ currentGoalProgress: 20 });

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'show',
				'annual-goal-complete',
				ID_WOMENS_EQUALITY,
				10
			);
			expect(composable.userGoalAchievedNow.value).toBe(true);
		});

		it('should use custom category for tracking', async () => {
			const currentYear = new Date().getFullYear();
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_BASIC_NEEDS,
					target: 5,
					dateStarted: `${currentYear}-01-01`,
					count: 0,
					status: 'in-progress',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{ id: ID_BASIC_NEEDS, progressForYear: 10, totalProgressToAchievement: 10 },
							],
						},
					},
				})
				.mockResolvedValue({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify({
									goals: [{
										...mockPrefs.goals[0],
										status: 'completed',
									}],
								}),
							},
							loans: { totalCount: 0 },
						},
					},
				});

			await composable.loadGoalData({ yearlyProgress: true });
			await composable.checkCompletedGoal({ category: 'custom-category' });

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'custom-category',
				'show',
				'annual-goal-complete',
				ID_BASIC_NEEDS,
				5
			);
		});

		it('should not mark completed if goal already completed', async () => {
			const {
				updateUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					status: 'completed',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [
								{ id: ID_WOMENS_EQUALITY, progressForYear: 20, totalProgressToAchievement: 20 },
							],
						},
					},
				});

			await composable.loadGoalData();
			updateUserPreferences.mockClear();
			await composable.checkCompletedGoal();

			expect(updateUserPreferences).not.toHaveBeenCalled();
			expect(composable.userGoalAchievedNow.value).toBe(false);
		});

		it('should not mark completed if goal not achieved', async () => {
			const {
				updateUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					status: 'active',
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 8 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [{ id: ID_WOMENS_EQUALITY, progressForYear: 8 }],
						},
					},
				});

			await composable.loadGoalData();
			updateUserPreferences.mockClear();
			await composable.checkCompletedGoal();

			expect(updateUserPreferences).not.toHaveBeenCalled();
			expect(composable.userGoalAchievedNow.value).toBe(false);
		});
	});

	describe('getPostCheckoutProgressByLoans', () => {
		it('should return allTimeProgress minus loanTotalAtStart when year is not provided', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					loanTotalAtStart: 50, // Had 50 loans when goal was set
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							// Need totalProgressToAchievement >= loanTotalAtStart to avoid correctNegativeProgress
							tieredLendingAchievements: [
								{ id: ID_WOMENS_EQUALITY, progressForYear: 3, totalProgressToAchievement: 57 },
							],
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 57 }, // 57 all-time
							],
							yearlyProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 3 },
							],
						},
					},
				});

			await composable.loadGoalData();
			const progress = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 789 }],
			});

			// Should return 57 - 50 = 7 (progress since goal was set)
			expect(progress).toBe(7);
			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { loanIds: [789], year: null },
				})
			);
		});

		it('should return 0 if no matching progress found', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_BASIC_NEEDS,
					target: 10,
					loanTotalAtStart: 0,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				})
				.mockResolvedValue({
					data: {
						postCheckoutAchievements: {
							yearlyProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 5 },
							],
						},
					},
				});

			await composable.loadGoalData();
			const progress = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 999 }],
			});

			expect(progress).toBe(0);
		});

		it('should increment counter by 1 per call for ID_SUPPORT_ALL goal with increment option', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
					loanTotalAtStart: 100, // Had 100 loans when goal was set
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 103 }, // Now has 103 loans (3 since goal was set)
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// goalProgress should be 103 - 100 = 3
			expect(composable.goalProgress.value).toBe(3);

			// First call with increment: true (ATB modal use case)
			const progress1 = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 1 }],
				increment: true,
			});
			expect(progress1).toBe(4); // 3 + 1

			// Second call - still increments by 1
			const progress2 = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 1 }, { id: 2 }],
				increment: true,
			});
			expect(progress2).toBe(5); // 3 + 1 + 1

			// Should NOT make any postCheckoutAchievements query for ID_SUPPORT_ALL
			expect(mockApollo.query).toHaveBeenCalledTimes(2); // Only loadPreferences and loadProgress
		});

		it('should add loans.length for ID_SUPPORT_ALL goal with addBasketLoans option (Basket page)', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
					loanTotalAtStart: 100,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 100 }, // No change yet (loans in basket not counted)
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// goalProgress should be 100 - 100 = 0
			expect(composable.goalProgress.value).toBe(0);

			// With addBasketLoans: true (Basket page use case), adds loans.length
			const progress = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 1 }, { id: 2 }, { id: 3 }],
				addBasketLoans: true,
			});
			expect(progress).toBe(3); // 0 + 3 loans in basket
		});

		it('should return just goalProgress for ID_SUPPORT_ALL (Thanks page)', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
					loanTotalAtStart: 100,
				}],
			};

			mockApollo.query = vi.fn()
				.mockResolvedValueOnce({
					data: {
						my: {
							userPreferences: {
								id: 'pref-123',
								preferences: JSON.stringify(mockPrefs),
							},
							loans: { totalCount: 105 }, // After checkout, loans already in totalCount
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
						},
					},
				});

			await composable.loadGoalData();

			// goalProgress should be 105 - 100 = 5
			expect(composable.goalProgress.value).toBe(5);

			// Thanks page: just pass loans (defaults handle the rest)
			const progress = await composable.getPostCheckoutProgressByLoans({
				loans: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
			});
			expect(progress).toBe(5); // Just goalProgress, no additional loans added
		});
	});

	describe('renewAnnualGoal', () => {
		it('should expire only goals from previous years', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'new-pref-id',
							preferences: JSON.stringify({
								goals: [
									{
										goalName: 'Goal', status: 'in-progress', dateStarted: '2025-01-01'
									},
									{
										goalName: 'Current Goal', status: 'in-progress', dateStarted: '2026-02-01'
									},
								]
							}),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			const today = new Date('2026-06-01T00:00:00Z');
			const updatedGoals = await composable.renewAnnualGoal(today);

			expect(updatedGoals.expiredGoals[0].status).toBe(GOAL_STATUS.EXPIRED); // Previous year
		});

		it('should add goalsRenewed flag to preferences when there were no previous goals', async () => {
			const {
				updateUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'new-pref-id',
							preferences: JSON.stringify({ goals: [] }),
						},
					},
				},
			});

			const today = new Date('2026-06-01T00:00:00Z');
			const updatedGoals = await composable.renewAnnualGoal(today);

			expect(updatedGoals).toEqual({
				expiredGoals: [],
				showRenewedAnnualGoalToast: false,
			});
			expect(updateUserPreferences).toHaveBeenCalled();
		});
	});

	it('should renew goals every year', async () => {
		mockApollo.query = vi.fn().mockResolvedValue({
			data: {
				my: {
					userPreferences: {
						id: 'new-pref-id',
						preferences: JSON.stringify({
							goals: [
								{
									goalName: 'Goal', status: 'in-progress', dateStarted: '2025-01-01'
								},
							],
							goalsRenewedDate: '2027-01-15T00:00:00Z',
						}),
					},
					loans: { totalCount: 0 },
				},
			},
		});

		const today = new Date('2028-06-01T00:00:00Z');
		const updatedGoals = await composable.renewAnnualGoal(today);

		expect(updatedGoals.expiredGoals.length).toBe(1);
		expect(updatedGoals.showRenewedAnnualGoalToast).toBe(true);
	});

	describe('getCategories', () => {
		it('should return all goal categories with correct structure', () => {
			const categoriesLoanCount = {
				[ID_WOMENS_EQUALITY]: 5,
				[ID_REFUGEE_EQUALITY]: 3,
				[ID_CLIMATE_ACTION]: 7,
				[ID_US_ECONOMIC_EQUALITY]: 2,
				[ID_BASIC_NEEDS]: 10,
			};
			const totalLoans = 25;

			const categories = composable.getCategories(categoriesLoanCount, totalLoans);

			expect(categories).toHaveLength(6);
			expect(categories[0]).toEqual({
				id: '1',
				name: 'Women',
				description: 'Open doors for women around the world',
				eventProp: 'women',
				customImage: expect.any(String),
				loanCount: 5,
				title: 'women',
				badgeId: ID_WOMENS_EQUALITY,
			});

			expect(categories[5]).toEqual({
				id: '6',
				name: 'Choose as I go',
				description: 'Support a variety of borrowers',
				eventProp: 'help-everyone',
				customImage: expect.any(String),
				loanCount: 25,
				title: null,
				badgeId: ID_SUPPORT_ALL,
			});
		});

		it('should handle undefined categoriesLoanCount', () => {
			const categories = composable.getCategories(undefined, 15);

			expect(categories[0].loanCount).toBeUndefined();
			expect(categories[5].loanCount).toBe(15);
		});

		it('should handle null categoriesLoanCount', () => {
			const categories = composable.getCategories(null, 20);

			expect(categories[1].loanCount).toBeUndefined();
			expect(categories[5].loanCount).toBe(20);
		});
	});

	describe('getCtaHref', () => {
		beforeEach(() => {
			vi.mock('#src/composables/useBadgeData', () => ({
				default: () => ({
					getLoanFindingUrl: vi.fn(categoryId => `/lend/${categoryId}`),
				}),
				ID_BASIC_NEEDS: 'basic-needs-id',
				ID_CLIMATE_ACTION: 'climate-action-id',
				ID_REFUGEE_EQUALITY: 'refugee-equality-id',
				ID_SUPPORT_ALL: 'support-all-id',
				ID_US_ECONOMIC_EQUALITY: 'us-economic-equality-id',
				ID_WOMENS_EQUALITY: 'womens-equality-id',
			}));
		});

		it('should generate correct href for single target', () => {
			const selectedGoalNumber = 1;
			const categoryId = ID_WOMENS_EQUALITY;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Support 1 more woman to reach your goal';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});

		it('should generate correct href for plural target', () => {
			const selectedGoalNumber = 5;
			const categoryId = ID_BASIC_NEEDS;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Support 5 more basic needs loans to reach your goal';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});

		it('should handle support all category', () => {
			const selectedGoalNumber = 10;
			const categoryId = ID_SUPPORT_ALL;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Support 10 more borrowers to reach your goal';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});
	});

	describe('getCategoryLoansLastYear', () => {
		it('should return progress for women equality achievement', () => {
			const tieredAchievements = [
				{ id: ID_WOMENS_EQUALITY, progressForYear: 25 },
				{ id: ID_BASIC_NEEDS, progressForYear: 15 },
				{ id: ID_CLIMATE_ACTION, progressForYear: 8 },
			];

			const progress = composable.getCategoryLoansLastYear(tieredAchievements);

			expect(progress).toBe(25);
		});

		it('should return 0 if women equality achievement not found', () => {
			const tieredAchievements = [
				{ id: ID_BASIC_NEEDS, progressForYear: 15 },
				{ id: ID_CLIMATE_ACTION, progressForYear: 8 },
			];

			const progress = composable.getCategoryLoansLastYear(tieredAchievements);

			expect(progress).toBe(0);
		});

		it('should return 0 for undefined progressForYear', () => {
			const tieredAchievements = [
				{ id: ID_WOMENS_EQUALITY },
			];

			const progress = composable.getCategoryLoansLastYear(tieredAchievements);

			expect(progress).toBe(0);
		});

		it('should handle empty array', () => {
			const progress = composable.getCategoryLoansLastYear([]);

			expect(progress).toBe(0);
		});

		it('should handle null input', () => {
			const progress = composable.getCategoryLoansLastYear(null);

			expect(progress).toBe(0);
		});
	});

	describe('getCategoriesProgressByYear', () => {
		it('should use cache-first fetch policy by default', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 10, totalProgressToAchievement: 50 }
						]
					}
				}
			});

			await composable.getCategoriesProgressByYear(2026);

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'cache-first',
				})
			);
		});

		it('should use network-only fetch policy when specified', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 15, totalProgressToAchievement: 60 }
						]
					}
				}
			});

			await composable.getCategoriesProgressByYear(2026, 'network-only');

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'network-only',
				})
			);
		});

		it('should return tiered lending achievements for the specified year', async () => {
			const mockAchievements = [
				{ id: ID_WOMENS_EQUALITY, progressForYear: 10, totalProgressToAchievement: 50 },
				{ id: ID_BASIC_NEEDS, progressForYear: 5, totalProgressToAchievement: 25 }
			];

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: mockAchievements
					}
				}
			});

			const result = await composable.getCategoriesProgressByYear(2025);

			expect(result).toEqual(mockAchievements);
			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { year: 2025 },
				})
			);
		});

		it('should return null on error', async () => {
			mockApollo.query = vi.fn().mockRejectedValue(new Error('Network error'));

			const result = await composable.getCategoriesProgressByYear(2026);

			expect(result).toBeNull();
		});
	});

	describe('getCategoryLoanCountByYear', () => {
		it('should use cache-first fetch policy by default', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 12 }
						]
					}
				}
			});

			await composable.getCategoryLoanCountByYear(ID_WOMENS_EQUALITY, 2026);

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'cache-first',
				})
			);
		});

		it('should use network-only fetch policy when specified', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 8 }
						]
					}
				}
			});

			await composable.getCategoryLoanCountByYear(ID_WOMENS_EQUALITY, 2026, 'network-only');

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'network-only',
				})
			);
		});

		it('should return progressForYear for the specified category', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 15 },
							{ id: ID_BASIC_NEEDS, progressForYear: 7 }
						]
					}
				}
			});

			const result = await composable.getCategoryLoanCountByYear(ID_BASIC_NEEDS, 2026);

			expect(result).toBe(7);
		});

		it('should return 0 if category not found', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY, progressForYear: 15 }
						]
					}
				}
			});

			const result = await composable.getCategoryLoanCountByYear(ID_CLIMATE_ACTION, 2026);

			expect(result).toBe(0);
		});

		it('should return 0 if progressForYear is undefined', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [
							{ id: ID_WOMENS_EQUALITY }
						]
					}
				}
			});

			const result = await composable.getCategoryLoanCountByYear(ID_WOMENS_EQUALITY, 2026);

			expect(result).toBe(0);
		});

		it('should return 0 when getCategoriesProgressByYear returns null on error', async () => {
			// When getCategoriesProgressByYear fails, it returns null (handles its own error)
			// getCategoryLoanCountByYear then gets null progress, and progress?.find() returns undefined
			// which falls back to 0 via the || 0 default
			mockApollo.query = vi.fn().mockRejectedValue(new Error('Network error'));

			const result = await composable.getCategoryLoanCountByYear(ID_WOMENS_EQUALITY, 2026);

			expect(result).toBe(0);
		});
	});

	describe('setHideGoalCardPreference', () => {
		it('should set hideGoalCard preference to true', async () => {
			const {
				updateUserPreferences,
			} = await import('#src/util/userPreferenceUtils');

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'hide-goal-id',
							preferences: JSON.stringify({}),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			updateUserPreferences.mockClear();
			await composable.setHideGoalCardPreference(true);

			expect(updateUserPreferences).toHaveBeenCalledWith(
				mockApollo,
				{ id: 'hide-goal-id', preferences: '{}' },
				{},
				{ hideGoalCard: true },
			);
		});

		it('should use network-only fetch policy to get fresh preferences', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'hide-goal-id',
							preferences: JSON.stringify({}),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			await composable.setHideGoalCardPreference(true);

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'network-only',
				})
			);
		});
	});

	describe('loadPreferences', () => {
		it('should load preferences with default cache-first fetch policy', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify({ hideGoalCard: true }),
						},
						loans: { totalCount: 5 },
					},
				},
			});

			const result = await composable.loadPreferences();

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'cache-first',
				})
			);
			expect(result).toEqual({ hideGoalCard: true });
		});

		it('should load preferences with network-only fetch policy when specified', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify({ hideGoalCard: false }),
						},
						loans: { totalCount: 10 },
					},
				},
			});

			const result = await composable.loadPreferences('network-only');

			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchPolicy: 'network-only',
				})
			);
			expect(result).toEqual({ hideGoalCard: false });
		});

		it('should update userPreferences ref with loaded data', async () => {
			const mockPrefsData = {
				id: 'pref-456',
				preferences: JSON.stringify({ goals: [] }),
			};

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: mockPrefsData,
						loans: { totalCount: 3 },
					},
				},
			});

			await composable.loadPreferences();

			expect(composable.userPreferences.value).toEqual(mockPrefsData);
		});

		it('should return empty object when preferences are null', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: null,
						loans: { totalCount: 0 },
					},
				},
			});

			const result = await composable.loadPreferences();

			expect(result).toEqual({});
		});

		it('should return null on error', async () => {
			mockApollo.query = vi.fn().mockRejectedValue(new Error('Network error'));

			const result = await composable.loadPreferences();

			expect(result).toBeNull();
		});
	});

	describe('hideGoalCard', () => {
		it('should return hideGoalCard preference value', async () => {
			const mockPrefs = {
				hideGoalCard: true,
			};

			mockApollo.query = vi.fn().mockResolvedValueOnce({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify(mockPrefs),
						},
						loans: { totalCount: 0 },
					},
				},
			}).mockResolvedValueOnce({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [],
					},
				},
			});

			await composable.loadGoalData();
			const hideCard = await composable.hideGoalCard();

			expect(hideCard).toBe(true);
		});

		it('should return false if preferences are empty', async () => {
			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify({}),
						},
						loans: { totalCount: 0 },
					},
				},
			}).mockResolvedValueOnce({
				data: {
					userAchievementProgress: {
						tieredLendingAchievements: [],
					},
				},
			});

			await composable.loadGoalData();
			const hideCard = await composable.hideGoalCard();

			expect(hideCard).toBe(false);
		});
	});
});
