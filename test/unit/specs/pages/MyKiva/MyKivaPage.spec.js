import MyKivaPage from '#src/pages/MyKiva/MyKivaPage';

describe('MyKivaPage', () => {
	const getTimestampMinutesAgo = minutesAgo => {
		const date = new Date();
		date.setTime(date.getTime() - (minutesAgo * 60 * 1000));
		return date.toISOString();
	};

	describe('methods', () => {
		it('applyMyKivaFreshProgress centralizes and applies fresh progress to hero achievements', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(10),
						loan: { id: 1, gender: 'female' },
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: getTimestampMinutesAgo(3),
						loan: { id: 2, gender: 'female' },
					},
				],
				currentYearTieredAchievements: [
					{
						id: 'womens-equality',
						totalProgressToAchievement: 1,
						loanPurchases: [{ loan: { id: 1, gender: 'female' } }],
					}
				],
				heroTieredAchievements: [
					{
						id: 'womens-equality',
						totalProgressToAchievement: 5,
						loanPurchases: [{ loan: { id: 1, gender: 'female' } }],
					}
				],
				recentTransactionLoans: [],
			};

			MyKivaPage.methods.applyMyKivaFreshProgress.call(context);

			expect(context.recentTransactionLoans).toHaveLength(2);
			expect(context.heroTieredAchievements[0].totalProgressToAchievement).toBe(6);
			expect(context.heroTieredAchievements[0].loanPurchases.map(p => p.loan.id)).toEqual([2, 1]);
		});

		it('applyMyKivaFreshProgress filters out transactions outside the recent window', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(20),
						loan: { id: 1001, gender: 'female' },
					},
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(5),
						loan: { id: 1002, gender: 'female' },
					},
				],
				currentYearTieredAchievements: [{ id: 'womens-equality', loanPurchases: [] }],
				heroTieredAchievements: [{ id: 'womens-equality', totalProgressToAchievement: 0, loanPurchases: [] }],
				recentTransactionLoans: [],
			};

			MyKivaPage.methods.applyMyKivaFreshProgress.call(context);

			expect(context.recentTransactionLoans.map(loan => loan.id)).toEqual([1002]);
		});

		it('applyMyKivaFreshProgress uses hero achievements as adjustment baseline to avoid stale duplicates', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(2),
						loan: { id: 5001, gender: 'female' },
					},
				],
				// Different snapshot that would produce a stale duplicate if used.
				currentYearTieredAchievements: [{ id: 'womens-equality', loanPurchases: [] }],
				heroTieredAchievements: [
					{
						id: 'womens-equality',
						totalProgressToAchievement: 8,
						loanPurchases: [{ loan: { id: 5001, gender: 'female' } }],
					}
				],
				recentTransactionLoans: [],
			};

			MyKivaPage.methods.applyMyKivaFreshProgress.call(context);

			expect(context.heroTieredAchievements[0].totalProgressToAchievement).toBe(8);
		});

		it('applyMyKivaFreshProgress is idempotent across repeated invocations', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(2),
						loan: { id: 7001, gender: 'female' },
					},
				],
				heroTieredAchievements: [
					{
						id: 'womens-equality',
						totalProgressToAchievement: 4,
						loanPurchases: [],
					}
				],
				recentTransactionLoans: [],
			};

			MyKivaPage.methods.applyMyKivaFreshProgress.call(context);
			MyKivaPage.methods.applyMyKivaFreshProgress.call(context);

			expect(context.heroTieredAchievements[0].totalProgressToAchievement).toBe(5);
			expect(context.heroTieredAchievements[0].loanPurchases.map(p => p.loan.id)).toEqual([7001]);
		});

		it('readTieredAchievementsFromCache returns tiered achievements from high-limit cache key', () => {
			const tieredLendingAchievements = [{ id: 'womens-equality' }];
			const context = {
				apollo: {
					readQuery: vi.fn().mockReturnValue({
						userAchievementProgress: { tieredLendingAchievements }
					}),
				},
			};

			const result = MyKivaPage.methods.readTieredAchievementsFromCache.call(context, 2025);

			expect(result).toEqual(tieredLendingAchievements);
			expect(context.apollo.readQuery).toHaveBeenCalledTimes(1);
			expect(context.apollo.readQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { year: 2025, loanPurchasesLimit: 20 },
			});
		});

		it('readTieredAchievementsFromCache returns empty array when high-limit cache key misses', () => {
			const context = {
				apollo: {
					readQuery: vi.fn()
						.mockReturnValueOnce(null),
				},
			};

			const result = MyKivaPage.methods.readTieredAchievementsFromCache.call(context, 2025);

			expect(result).toEqual([]);
			expect(context.apollo.readQuery).toHaveBeenCalledTimes(1);
			expect(context.apollo.readQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { year: 2025, loanPurchasesLimit: 20 },
			});
		});

		it('readTieredAchievementsFromCache returns empty array when high-limit cache key throws', () => {
			const context = {
				apollo: {
					readQuery: vi.fn()
						.mockImplementationOnce(() => {
							throw new Error('cache miss');
						}),
				},
			};

			const result = MyKivaPage.methods.readTieredAchievementsFromCache.call(context, 2025);

			expect(result).toEqual([]);
			expect(context.apollo.readQuery).toHaveBeenCalledTimes(1);
			expect(context.apollo.readQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { year: 2025, loanPurchasesLimit: 20 },
			});
		});
	});

	describe('computed', () => {
		it('heroBadgeData uses buildHeroBadgeData utility to combine achievements with contentful', () => {
			// Test that computed property correctly passes data to the utility
			const context = {
				heroTieredAchievements: [{ id: 'womens-equality', totalProgressToAchievement: 4 }],
				heroBadgeContentfulData: [{ id: 'womens-equality', level: 1 }],
			};

			// Call the computed property - it should use buildHeroBadgeData internally
			const result = MyKivaPage.computed.heroBadgeData.call(context);

			// Verify it returns an array (the result of combineBadgeData inside buildHeroBadgeData)
			expect(Array.isArray(result)).toBe(true);
		});
	});

	describe('apollo.preFetch', () => {
		it('queries achievement progress with the higher loanPurchasesLimit for MyKiva', async () => {
			const client = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			await MyKivaPage.apollo.preFetch({}, client, { route: { query: {} } });

			const achievementCalls = client.query.mock.calls
				.map(call => call[0])
				.filter(call => call?.variables?.year != null);

			expect(achievementCalls).toHaveLength(2);
			expect(achievementCalls[0].variables).toMatchObject({ loanPurchasesLimit: 20 });
			expect(achievementCalls[1].variables).toMatchObject({ loanPurchasesLimit: 20 });
		});
	});

	describe('mounted', () => {
		it('passes precomputed recent transaction loans to loadGoalData for fresh progress', async () => {
			const context = {
				apollo: {
					watchQuery: vi.fn(() => ({
						subscribe: vi.fn(),
					}))
				},
				$route: { query: {} },
				goalsV2Enabled: false,
				loadGoalData: vi.fn().mockResolvedValue(),
				loans: [{ id: 999 }],
				currentYearTieredAchievements: [{ id: 'climate-action' }],
				transactions: [],
				recentTransactionLoans: [{ id: 101 }, { id: 201 }],
				userInfo: {},
				renewAnnualGoal: vi.fn().mockResolvedValue({ showRenewedAnnualGoalToast: false }),
				fixIncorrectlyCompletedGoals: vi.fn().mockResolvedValue({ wasFixed: false }),
				setHideGoalCardPreference: vi.fn().mockResolvedValue(),
				goalRefreshKey: 0,
			};

			await MyKivaPage.mounted.call(context);

			expect(context.loadGoalData).toHaveBeenCalledTimes(1);
			expect(context.loadGoalData).toHaveBeenCalledWith({
				year: expect.any(Number),
				yearlyProgress: false,
				freshProgressLoans: context.recentTransactionLoans,
				tieredAchievements: context.currentYearTieredAchievements,
				transactions: context.transactions
			});
		});

		it('does not recompute fresh progress during mounted goals maintenance', async () => {
			const applyMyKivaFreshProgress = vi.fn();
			const renewAnnualGoal = vi.fn().mockResolvedValue({ showRenewedAnnualGoalToast: false });
			const fixIncorrectlyCompletedGoals = vi.fn().mockResolvedValue({ wasFixed: false });
			const context = {
				apollo: {
					watchQuery: vi.fn(() => ({
						subscribe: vi.fn(),
					}))
				},
				$route: { query: {} },
				goalsV2Enabled: true,
				loadGoalData: vi.fn().mockResolvedValue(),
				applyMyKivaFreshProgress,
				renewAnnualGoal,
				fixIncorrectlyCompletedGoals,
				setHideGoalCardPreference: vi.fn().mockResolvedValue(),
				goalRefreshKey: 0,
				userInfo: {},
			};

			await MyKivaPage.mounted.call(context);

			expect(applyMyKivaFreshProgress).not.toHaveBeenCalled();
			expect(renewAnnualGoal).toHaveBeenCalledTimes(1);
			expect(fixIncorrectlyCompletedGoals).toHaveBeenCalledTimes(1);
		});
	});

	describe('created', () => {
		it('loads tiered achievements from cache and applies fresh progress during created', () => {
			const heroTieredAchievements = [{ id: 'womens-equality', totalProgressToAchievement: 2 }];
			const currentYearTieredAchievements = [{ id: 'climate-action', totalProgressToAchievement: 1 }];
			const context = {
				fetchMyKivaData: vi.fn(),
				readTieredAchievementsFromCache: vi.fn()
					.mockReturnValueOnce(heroTieredAchievements)
					.mockReturnValueOnce(currentYearTieredAchievements),
				applyMyKivaFreshProgress: vi.fn(),
				heroTieredAchievements: [],
				currentYearTieredAchievements: [],
				apollo: {
					readQuery: vi.fn()
						.mockReturnValueOnce({ contentful: { entries: { items: [] } } })
						.mockReturnValueOnce({ contentful: { entries: { items: [{ fields: { slides: [] } }] } } }),
					readFragment: vi.fn().mockReturnValue(undefined),
				},
				cookieStore: {
					get: vi.fn().mockReturnValue(undefined),
				},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
			};

			MyKivaPage.created.call(context);

			expect(context.fetchMyKivaData).toHaveBeenCalledTimes(1);
			expect(context.readTieredAchievementsFromCache).toHaveBeenCalledTimes(2);
			expect(context.heroTieredAchievements).toEqual(heroTieredAchievements);
			expect(context.currentYearTieredAchievements).toEqual(currentYearTieredAchievements);
			expect(context.applyMyKivaFreshProgress).toHaveBeenCalledTimes(1);
			expect(context.readTieredAchievementsFromCache.mock.invocationCallOrder[0])
				.toBeLessThan(context.applyMyKivaFreshProgress.mock.invocationCallOrder[0]);
		});

		it('normalizes challenge contentful entries in parent before passing to children', () => {
			const context = {
				fetchMyKivaData: vi.fn(),
				readTieredAchievementsFromCache: vi.fn()
					.mockReturnValueOnce([])
					.mockReturnValueOnce([]),
				applyMyKivaFreshProgress: vi.fn(),
				heroTieredAchievements: [],
				currentYearTieredAchievements: [],
				heroBadgeContentfulData: [],
				apollo: {
					readQuery: vi.fn()
						.mockReturnValueOnce({
							contentful: {
								entries: {
									items: [
										{
											fields: {
												key: 'womens-equality-level-2',
												levelName: '2',
												challengeName: 'Women',
												badgeImage: { fields: { file: { url: '/badge-2.svg' } } },
											}
										}
									]
								}
							}
						})
						.mockReturnValueOnce({ contentful: { entries: { items: [{ fields: { slides: [] } }] } } }),
					readFragment: vi.fn().mockReturnValue(undefined),
				},
				cookieStore: {
					get: vi.fn().mockReturnValue(undefined),
				},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
			};

			MyKivaPage.created.call(context);

			expect(context.heroBadgeContentfulData).toEqual([
				{
					id: 'womens-equality',
					level: 2,
					levelName: '2',
					challengeName: 'Women',
					imageUrl: '/badge-2.svg',
					shareFact: '',
					shareFactFootnote: '',
					shareFactUrl: '',
				}
			]);
		});
	});
});
