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

	describe('recentLoanIds', () => {
		it('maps loan ids from the loans prop', () => {
			const context = { loans: [{ id: 1 }, { id: 2 }, { id: 3 }] };
			expect(LendingStats.computed.recentLoanIds.call(context)).toEqual([1, 2, 3]);
		});

		it('filters out falsy ids and returns empty array when loans is empty', () => {
			expect(LendingStats.computed.recentLoanIds.call({ loans: [{ id: 1 }, {}, { id: null }] }))
				.toEqual([1]);
			expect(LendingStats.computed.recentLoanIds.call({ loans: [] })).toEqual([]);
		});
	});

	describe('mounted', () => {
		it('does not enable the post-lending experience when the cookie is absent', () => {
			const context = {
				cookieStore: { get: vi.fn(), remove: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			LendingStats.mounted.call(context);

			expect(context.showPostLendingNextStepsCards).toBe(false);
			expect(context.cookieStore.remove).not.toHaveBeenCalled();
		});

		it('enables the post-lending experience and clears the cookie when it is present', () => {
			const context = {
				cookieStore: { get: vi.fn().mockReturnValue('true'), remove: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			LendingStats.mounted.call(context);

			expect(context.showPostLendingNextStepsCards).toBe(true);
			expect(context.cookieStore.remove).toHaveBeenCalled();
		});
	});

	describe('goalRefreshKey watcher', () => {
		it('refreshes preferences and goal progress when key increments', async () => {
			const context = {
				loadPreferences: vi.fn().mockResolvedValue({}),
				loadGoalData: vi.fn().mockResolvedValue(),
			};

			await LendingStats.watch.goalRefreshKey.call(context, 1, 0);

			expect(context.loadPreferences).toHaveBeenCalledTimes(1);
			expect(context.loadPreferences).toHaveBeenCalledWith('network-only');
			expect(context.loadGoalData).toHaveBeenCalledTimes(1);
		});
	});

	describe('setGoal', () => {
		it('stores goal preferences with delayed local update for goalsV2', async () => {
			const preferences = { category: 'women', target: 5 };
			const context = {
				storeGoalPreferences: vi.fn().mockResolvedValue(),
				loadGoalData: vi.fn().mockResolvedValue(),
				isGoalSet: false,
				showGoalModal: true,
			};

			await LendingStats.methods.setGoal.call(context, preferences);

			expect(context.storeGoalPreferences).toHaveBeenCalledTimes(1);
			expect(context.storeGoalPreferences).toHaveBeenCalledWith(preferences);
			expect(context.isGoalSet).toBe(true);
			expect(context.showGoalModal).toBe(true);
			expect(context.loadGoalData).not.toHaveBeenCalled();
		});
	});

	describe('closeGoalModal', () => {
		it('reloads goal data in yearly mode after setting a goal', async () => {
			const context = {
				showGoalModal: true,
				$kvTrackEvent: vi.fn(),
				isGoalSet: true,
				recordedGoalSet: false,
				loadGoalData: vi.fn().mockResolvedValue(),
			};

			await LendingStats.methods.closeGoalModal.call(context);

			expect(context.showGoalModal).toBe(false);
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'close-goals');
			expect(context.loadGoalData).toHaveBeenCalledTimes(1);
		});
	});

	describe('handleViewAllClick', () => {
		it('tracks the event and navigates to /mykiva/next-steps', () => {
			const push = vi.fn();
			const context = {
				$kvTrackEvent: vi.fn(),
				$router: { push },
				showPostLendingNextStepsCards: false,
			};

			LendingStats.methods.handleViewAllClick.call(context);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'view-all-next-steps');
			expect(push).toHaveBeenCalledWith('/mykiva/next-steps');
		});

		it('appends ?postLending=true when showPostLendingNextStepsCards is true', () => {
			const push = vi.fn();
			const context = {
				$kvTrackEvent: vi.fn(),
				$router: { push },
				showPostLendingNextStepsCards: true,
			};

			LendingStats.methods.handleViewAllClick.call(context);

			expect(push).toHaveBeenCalledWith('/mykiva/next-steps?postLending=true');
		});
	});

	describe('showAlmostFundedCard', () => {
		it('shows the Almost Funded card when not post-lending', () => {
			const context = { showPostLendingNextStepsCards: false };
			expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(true);
		});

		it('shows the Almost Funded card for superlenders (not gated on region experience)', () => {
			const context = { showPostLendingNextStepsCards: false, userLentToAllRegions: true };
			expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(true);
		});

		it('is false during the post-lending experience', () => {
			const context = { showPostLendingNextStepsCards: true };
			expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(false);
		});
	});
});
