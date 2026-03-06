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
		it('delegates to goalModalHandlers.setGoal with modalRefs', async () => {
			const preferences = { category: 'women', target: 5 };
			const mockSetGoal = vi.fn().mockResolvedValue();
			const modalRefs = { some: 'refs' };
			const context = {
				goalModalHandlers: { setGoal: mockSetGoal },
				modalRefs,
			};

			await LendingStats.methods.setGoal.call(context, preferences);

			expect(mockSetGoal).toHaveBeenCalledTimes(1);
			expect(mockSetGoal).toHaveBeenCalledWith(preferences, modalRefs);
		});
	});

	describe('closeGoalModal', () => {
		it('delegates to goalModalHandlers.closeGoalModal with modalRefs', async () => {
			const mockCloseGoalModal = vi.fn().mockResolvedValue();
			const modalRefs = { some: 'refs' };
			const context = {
				goalModalHandlers: { closeGoalModal: mockCloseGoalModal },
				modalRefs,
			};

			await LendingStats.methods.closeGoalModal.call(context);

			expect(mockCloseGoalModal).toHaveBeenCalledTimes(1);
			expect(mockCloseGoalModal).toHaveBeenCalledWith(modalRefs);
		});
	});

	describe('closeImpactInsightsModal', () => {
		it('delegates to goalModalHandlers.closeImpactInsightsModal with modalRefs', () => {
			const mockCloseImpactInsightsModal = vi.fn();
			const modalRefs = { some: 'refs' };
			const context = {
				goalModalHandlers: { closeImpactInsightsModal: mockCloseImpactInsightsModal },
				modalRefs,
			};

			LendingStats.methods.closeImpactInsightsModal.call(context);

			expect(mockCloseImpactInsightsModal).toHaveBeenCalledTimes(1);
			expect(mockCloseImpactInsightsModal).toHaveBeenCalledWith(modalRefs);
		});
	});
});
