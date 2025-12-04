import { createApp } from 'vue';
import useGoalData, { GOAL_STATUS } from '#src/composables/useGoalData';
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
			expect(composable.getGoalDisplayName(10, ID_CLIMATE_ACTION)).toBe('eco-friendly loans');
			expect(composable.getGoalDisplayName(3, ID_REFUGEE_EQUALITY)).toBe('refugees');
			expect(composable.getGoalDisplayName(2, ID_SUPPORT_ALL)).toBe('loans');
			expect(composable.getGoalDisplayName(100, ID_US_ECONOMIC_EQUALITY)).toBe('U.S. entrepreneurs');
			expect(composable.getGoalDisplayName(7, ID_WOMENS_EQUALITY)).toBe('women');
		});

		it('should return singular display name for target = 1', () => {
			expect(composable.getGoalDisplayName(1, ID_BASIC_NEEDS)).toBe('basic needs loan');
			expect(composable.getGoalDisplayName(1, ID_CLIMATE_ACTION)).toBe('eco-friendly loan');
			expect(composable.getGoalDisplayName(1, ID_REFUGEE_EQUALITY)).toBe('refugee');
			expect(composable.getGoalDisplayName(1, ID_SUPPORT_ALL)).toBe('loan');
			expect(composable.getGoalDisplayName(1, ID_US_ECONOMIC_EQUALITY)).toBe('U.S. entrepreneur');
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

	describe('loadGoalData', () => {
		it('should load preferences and progress successfully', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					loanTotalAtStart: 5,
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
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 12 },
							],
						},
					},
				});

			const loans = [{ id: 123 }, { id: 456 }];
			await composable.loadGoalData(loans);

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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

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
						postCheckoutAchievements: {
							allTimeProgress: [],
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

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

			await composable.loadGoalData([{ id: 1 }]);

			expect(logFormatter).toHaveBeenCalledWith(error, 'Failed to load progress');
		});
	});

	describe('goalProgress computed', () => {
		it('should calculate progress for SUPPORT_ALL category', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
					loanTotalAtStart: 5,
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

			expect(composable.goalProgress.value).toBe(10); // 15 - 5
		});

		it('should calculate progress for specific category', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					loanTotalAtStart: 3,
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
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 8 },
							],
						},
					},
				});

			await composable.loadGoalData([]);

			expect(composable.goalProgress.value).toBe(5); // 8 - 3
		});

		it('should return 0 if progress is negative', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_BASIC_NEEDS,
					target: 10,
					loanTotalAtStart: 20,
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
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_BASIC_NEEDS, totalProgress: 5 },
							],
						},
					},
				});

			await composable.loadGoalData([]);

			expect(composable.goalProgress.value).toBe(0);
		});

		it('should handle missing progress entry', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_CLIMATE_ACTION,
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

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
					loanTotalAtStart: 5,
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

			expect(composable.userGoalAchieved.value).toBe(true); // progress: 15, target: 10
		});

		it('should return false when goal is not achieved', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_SUPPORT_ALL,
					target: 10,
					loanTotalAtStart: 5,
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				});

			await composable.loadGoalData([]);

			expect(composable.userGoalAchieved.value).toBe(false); // progress: 5, target: 10
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

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify(mockPrefs),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			await composable.loadGoalData([]);

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

			mockApollo.query = vi.fn().mockResolvedValue({
				data: {
					my: {
						userPreferences: {
							id: 'pref-123',
							preferences: JSON.stringify(mockPrefs),
						},
						loans: { totalCount: 0 },
					},
				},
			});

			await composable.loadGoalData([]);

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
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
					target: 10,
					loanTotalAtStart: 5,
					dateStarted: '2024-01-01',
					count: 0,
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
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 20 },
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

			await composable.loadGoalData([]);
			await composable.checkCompletedGoal();

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
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_BASIC_NEEDS,
					target: 5,
					loanTotalAtStart: 0,
					dateStarted: '2024-01-01',
					count: 0,
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
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_BASIC_NEEDS, totalProgress: 10 },
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

			await composable.loadGoalData([]);
			await composable.checkCompletedGoal('custom-category');

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
					loanTotalAtStart: 5,
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
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 20 },
							],
						},
					},
				});

			await composable.loadGoalData([]);
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
					loanTotalAtStart: 5,
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
							loans: { totalCount: 0 },
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 8 },
							],
						},
					},
				});

			await composable.loadGoalData([]);
			updateUserPreferences.mockClear();
			await composable.checkCompletedGoal();

			expect(updateUserPreferences).not.toHaveBeenCalled();
			expect(composable.userGoalAchievedNow.value).toBe(false);
		});
	});

	describe('getProgressByLoan', () => {
		it('should return progress for specific loan', async () => {
			const mockPrefs = {
				goals: [{
					goalName: 'test-goal',
					category: ID_WOMENS_EQUALITY,
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 7 },
							],
						},
					},
				});

			await composable.loadGoalData([]);
			const progress = await composable.getProgressByLoan({ id: 789 });

			expect(progress).toBe(7);
			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { loanIds: [789] },
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
						postCheckoutAchievements: {
							allTimeProgress: [],
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						postCheckoutAchievements: {
							allTimeProgress: [
								{ achievementId: ID_WOMENS_EQUALITY, totalProgress: 5 },
							],
						},
					},
				});

			await composable.loadGoalData([]);
			const progress = await composable.getProgressByLoan({ id: 999 });

			expect(progress).toBe(0);
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

		const today = new Date('2026-06-01T00:00:00Z');
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
			const expectedString = 'Your goal: Support 1 woman';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});

		it('should generate correct href for plural target', () => {
			const selectedGoalNumber = 5;
			const categoryId = ID_BASIC_NEEDS;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Your goal: Support 5 basic needs loans';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});

		it('should handle support all category', () => {
			const selectedGoalNumber = 10;
			const categoryId = ID_SUPPORT_ALL;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Your goal: Support 10 loans';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});

		it('should encode special characters in header', () => {
			const selectedGoalNumber = 3;
			const categoryId = ID_US_ECONOMIC_EQUALITY;
			const router = { currentRoute: { value: {} } };

			const href = composable.getCtaHref(selectedGoalNumber, categoryId, router);
			const expectedString = 'Your goal: Support 3 U.S. entrepreneurs';
			const expectedHref = `/lend/${categoryId}?header=${encodeURIComponent(expectedString)}`;

			expect(href).toBe(expectedHref);
		});
	});

	describe('getWomenLoansLastYear', () => {
		it('should return women loans count from categoriesLoanCount', () => {
			const categoriesLoanCount = {
				[ID_WOMENS_EQUALITY]: 15,
				[ID_BASIC_NEEDS]: 5,
			};

			const result = composable.getWomenLoansLastYear(categoriesLoanCount);
			expect(result).toBe(15);
		});

		it('should return 0 when categoriesLoanCount is undefined', () => {
			const result = composable.getWomenLoansLastYear(undefined);
			expect(result).toBe(0);
		});

		it('should return 0 when categoriesLoanCount is null', () => {
			const result = composable.getWomenLoansLastYear(null);
			expect(result).toBe(0);
		});

		it('should return 0 when womens equality key is missing', () => {
			const categoriesLoanCount = {
				[ID_BASIC_NEEDS]: 10,
				[ID_CLIMATE_ACTION]: 5,
			};

			const result = composable.getWomenLoansLastYear(categoriesLoanCount);
			expect(result).toBe(0);
		});

		it('should return 0 when womens equality value is 0', () => {
			const categoriesLoanCount = {
				[ID_WOMENS_EQUALITY]: 0,
			};

			const result = composable.getWomenLoansLastYear(categoriesLoanCount);
			expect(result).toBe(0);
		});
	});
});
