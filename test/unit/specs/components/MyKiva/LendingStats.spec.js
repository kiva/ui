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
		it('completes without error when region experience is off', async () => {
			const context = {
				showRegionExperience: false,
				cookieStore: { get: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			await expect(LendingStats.mounted.call(context)).resolves.toBeUndefined();
		});

		it('does not start the region-checkbox animation while the Almost Funded card is shown', async () => {
			const context = {
				showRegionExperience: true,
				showAlmostFunded: true,
				cookieStore: { get: vi.fn() },
				showPostLendingNextStepsCards: false,
			};

			await LendingStats.mounted.call(context);

			// The reveal animation only drives the 2-tile card's checkboxes, which aren't rendered here.
			expect(context.disconnectRegionWatcher).toBeUndefined();
			expect(context.interval).toBeUndefined();
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
				newGoalPrefs: null,
				isGoalSet: false,
				showGoalModal: true,
			};

			await LendingStats.methods.setGoal.call(context, preferences);

			expect(context.storeGoalPreferences).toHaveBeenCalledTimes(1);
			expect(context.storeGoalPreferences).toHaveBeenCalledWith(preferences);
			expect(context.newGoalPrefs).toEqual(preferences);
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
				newGoalPrefs: { category: 'women', target: 5 },
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

	describe('showRegionExperience', () => {
		it('returns true when not post-lending and the user has not lent to all regions', () => {
			const context = { showPostLendingNextStepsCards: false, userLentToAllRegions: false };
			expect(LendingStats.computed.showRegionExperience.call(context)).toBe(true);
		});

		it('returns false when the user has lent to all regions', () => {
			const context = { showPostLendingNextStepsCards: false, userLentToAllRegions: true };
			expect(LendingStats.computed.showRegionExperience.call(context)).toBe(false);
		});

		it('returns false during the post-lending experience', () => {
			const context = { showPostLendingNextStepsCards: true, userLentToAllRegions: false };
			expect(LendingStats.computed.showRegionExperience.call(context)).toBe(false);
		});
	});

	describe('Almost Funded rollout', () => {
		it('shows the Almost Funded next step by default (2-tile card is the fallback)', () => {
			expect(LendingStats.data.call({ regionsData: [] }).showAlmostFunded).toBe(true);
		});

		describe('showAlmostFundedCard', () => {
			it('shows the Almost Funded card when not post-lending and the flag is on', () => {
				const context = { showPostLendingNextStepsCards: false, showAlmostFunded: true };
				expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(true);
			});

			it('shows the Almost Funded card for superlenders (not gated on region experience)', () => {
				const context = {
					showPostLendingNextStepsCards: false,
					userLentToAllRegions: true,
					showAlmostFunded: true,
				};
				expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(true);
			});

			it('falls back to the 2-tile card when the flag is off', () => {
				const context = { showPostLendingNextStepsCards: false, showAlmostFunded: false };
				expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(false);
			});

			it('is false during the post-lending experience', () => {
				const context = { showPostLendingNextStepsCards: true, showAlmostFunded: true };
				expect(LendingStats.computed.showAlmostFundedCard.call(context)).toBe(false);
			});
		});
	});
});
