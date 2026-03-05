import LendingStats from '#src/components/MyKiva/LendingStats';

describe('LendingStats', () => {
	describe('props', () => {
		it('defines heroBadgeData as Array with empty default', () => {
			const prop = LendingStats.props.heroBadgeData;
			expect(prop.type).toBe(Array);
			expect(prop.default()).toEqual([]);
		});

		it('defines heroTieredAchievements as Array with empty default', () => {
			const prop = LendingStats.props.heroTieredAchievements;
			expect(prop.type).toBe(Array);
			expect(prop.default()).toEqual([]);
		});
	});

	describe('mounted', () => {
		it('checks completed goals when next-steps experiment is enabled', async () => {
			const context = {
				isNextStepsExpEnabled: true,
				checkCompletedGoal: vi.fn().mockResolvedValue(),
				showRegionExperience: false,
				cookieStore: { get: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			await LendingStats.mounted.call(context);

			expect(context.checkCompletedGoal).toHaveBeenCalledTimes(1);
			expect(context.checkCompletedGoal).toHaveBeenCalledWith({ category: 'portfolio' });
		});

		it('does not check completed goals when next-steps experiment is disabled', async () => {
			const context = {
				isNextStepsExpEnabled: false,
				checkCompletedGoal: vi.fn().mockResolvedValue(),
				showRegionExperience: false,
				cookieStore: { get: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			await LendingStats.mounted.call(context);

			expect(context.checkCompletedGoal).not.toHaveBeenCalled();
		});
	});

	describe('goalRefreshKey watcher', () => {
		it('refreshes preferences and goal progress when key increments', async () => {
			const context = {
				goalsV2Enabled: true,
				loadPreferences: vi.fn().mockResolvedValue({}),
				loadGoalData: vi.fn().mockResolvedValue(),
			};

			await LendingStats.watch.goalRefreshKey.call(context, 1, 0);

			expect(context.loadPreferences).toHaveBeenCalledTimes(1);
			expect(context.loadPreferences).toHaveBeenCalledWith('network-only');
			expect(context.loadGoalData).toHaveBeenCalledTimes(1);
			expect(context.loadGoalData).toHaveBeenCalledWith({ yearlyProgress: true });
		});
	});

	describe('setGoal', () => {
		it('stores goal preferences with delayed local update for goalsV2', async () => {
			const preferences = { category: 'women', target: 5 };
			const mockSetGoal = vi.fn().mockResolvedValue();
			const context = {
				goalsV2Enabled: true,
				goalModalHandlers: {
					setGoal: mockSetGoal,
				},
				loadGoalData: vi.fn().mockResolvedValue(),
				newGoalPrefs: null,
				isGoalSet: false,
				showGoalModal: true,
			};

			await LendingStats.methods.setGoal.call(context, preferences);

			expect(mockSetGoal).toHaveBeenCalledTimes(1);
			expect(mockSetGoal).toHaveBeenCalledWith(preferences, {});
			expect(context.newGoalPrefs).toEqual(preferences);
			expect(context.isGoalSet).toBe(true);
			expect(context.showGoalModal).toBe(true);
		});

		it('refreshes and closes modal for legacy goals flow', async () => {
			const preferences = { category: 'women', target: 5 };
			const mockSetGoal = vi.fn().mockResolvedValue();
			const context = {
				goalsV2Enabled: false,
				goalModalHandlers: {
					setGoal: mockSetGoal,
				},
				loadGoalData: vi.fn().mockResolvedValue(),
				newGoalPrefs: null,
				isGoalSet: false,
				showGoalModal: true,
			};

			await LendingStats.methods.setGoal.call(context, preferences);

			expect(mockSetGoal).toHaveBeenCalledWith(preferences, {});
			expect(context.newGoalPrefs).toEqual(preferences);
			expect(context.isGoalSet).toBe(true);
			expect(context.showGoalModal).toBe(false);
		});
	});

	describe('closeGoalModal', () => {
		it('reloads goal data in yearly mode after setting a goal', async () => {
			const mockCloseGoalModal = vi.fn().mockResolvedValue();
			const context = {
				showGoalModal: true,
				$kvTrackEvent: vi.fn(),
				isGoalSet: true,
				goalModalHandlers: {
					closeGoalModal: mockCloseGoalModal,
				},
				newGoalPrefs: { category: 'women', target: 5 },
				loadGoalData: vi.fn().mockResolvedValue(),
			};

			await LendingStats.methods.closeGoalModal.call(context);

			expect(context.showGoalModal).toBe(false);
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'close-goals');
			expect(mockCloseGoalModal).toHaveBeenCalledTimes(1);
			expect(mockCloseGoalModal).toHaveBeenCalledWith({
				showGoalModal: { value: false },
				isGoalSet: { value: true },
				newGoalPrefs: { value: { category: 'women', target: 5 } },
			});
		});
	});
});
