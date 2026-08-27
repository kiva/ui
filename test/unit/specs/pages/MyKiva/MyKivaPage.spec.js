import MyKivaPage from '#src/pages/MyKiva/MyKivaPage';
import countryListQuery from '#src/graphql/query/countryList.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
}));

describe('MyKivaPage', () => {
	const getTimestampMinutesAgo = minutesAgo => {
		const date = new Date();
		date.setTime(date.getTime() - (minutesAgo * 60 * 1000));
		return date.toISOString();
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

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

		it('readContentfulSlides returns slides when Contentful has carousel content', () => {
			const slides = [{ fields: { richText: {} } }];
			const cachedResult = { contentful: { entries: { items: [{ fields: { slides } }] } } };
			const context = {
				apollo: {
					readQuery: vi.fn().mockReturnValue(cachedResult),
				},
			};

			const result = MyKivaPage.methods.readContentfulSlides.call(context);

			expect(result).toEqual(slides);
		});

		it('readContentfulSlides returns empty array when Contentful has no carousel entries', () => {
			const context = {
				apollo: {
					readQuery: vi.fn().mockReturnValue({ contentful: { entries: { items: [] } } }),
				},
			};

			const result = MyKivaPage.methods.readContentfulSlides.call(context);

			expect(result).toEqual([]);
		});

		it('readContentfulSlides returns empty array when the cache read throws', () => {
			const error = new Error('cache miss');
			const context = {
				apollo: {
					readQuery: vi.fn().mockImplementation(() => { throw error; }),
				},
			};

			const result = MyKivaPage.methods.readContentfulSlides.call(context);

			expect(result).toEqual([]);
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'MyKivaPage readContentfulSlides');
		});

		it('readContentfulBadgeData normalizes challenge entries when Contentful has content', () => {
			const context = {
				apollo: {
					readQuery: vi.fn().mockReturnValue({
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
					}),
				},
			};

			const result = MyKivaPage.methods.readContentfulBadgeData.call(context);

			expect(result).toEqual([
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

		it('readContentfulBadgeData returns empty array when Contentful has no challenge entries', () => {
			const context = {
				apollo: {
					readQuery: vi.fn().mockReturnValue({ contentful: { entries: { items: [] } } }),
				},
			};

			const result = MyKivaPage.methods.readContentfulBadgeData.call(context);

			expect(result).toEqual([]);
		});

		it('readContentfulBadgeData returns empty array when the cache read throws', () => {
			const error = new Error('network error');
			const context = {
				apollo: {
					readQuery: vi.fn().mockImplementation(() => { throw error; }),
				},
			};

			const result = MyKivaPage.methods.readContentfulBadgeData.call(context);

			expect(result).toEqual([]);
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'MyKivaPage readContentfulBadgeData');
		});
	});

	describe('computed', () => {
		it('heroBadgeData is derived from a single parent combine call', () => {
			const combined = [{ id: 'womens-equality' }];
			const context = {
				combineBadgeData: vi.fn().mockReturnValue(combined),
				heroTieredAchievements: [{ id: 'womens-equality', totalProgressToAchievement: 4 }],
				heroBadgeContentfulData: [{ id: 'womens-equality', level: 1 }],
			};

			const result = MyKivaPage.computed.heroBadgeData.call(context);

			expect(context.combineBadgeData).toHaveBeenCalledTimes(1);
			expect(context.combineBadgeData).toHaveBeenCalledWith(
				context.heroTieredAchievements,
				context.heroBadgeContentfulData
			);
			expect(result).toEqual(combined);
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
				.filter(call => call?.variables?.loanPurchasesLimit != null);

			expect(achievementCalls).toHaveLength(2);
			expect(achievementCalls[0].variables).toMatchObject({ loanPurchasesLimit: 20 });
			expect(achievementCalls[1].variables).toMatchObject({ loanPurchasesLimit: 20 });
		});

		it('prefetches the support-all yearly loan count so goal cards can server-render', async () => {
			const client = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			await MyKivaPage.apollo.preFetch({}, client, { route: { query: {} } });

			const yearOnlyCalls = client.query.mock.calls
				.map(call => call[0])
				.filter(call => call?.variables?.year != null && call?.variables?.loanPurchasesLimit == null);

			expect(yearOnlyCalls).toHaveLength(1);
			expect(yearOnlyCalls[0].variables).toEqual({ year: new Date().getFullYear() });
		});

		// Regression: this was route-gated to /mykiva/next-steps, but both routes resolve to
		// this same component, so Vue patches it in place and created() -> fetchMyKivaData()
		// never re-runs. regionsData then stayed empty from the /mykiva render and the
		// next-steps regions card appeared for lenders who had already lent everywhere.
		it('prefetches country facets on /mykiva too, not just on /mykiva/next-steps', async () => {
			const operationsFor = async path => {
				const client = { query: vi.fn().mockResolvedValue({ data: {} }) };
				await MyKivaPage.apollo.preFetch({}, client, { route: { path, query: {} } });
				return client.query.mock.calls.map(call => call[0].query);
			};

			const onMyKiva = await operationsFor('/mykiva');
			const onNextSteps = await operationsFor('/mykiva/next-steps');

			expect(onMyKiva).toContain(countryListQuery);
			expect(onMyKiva).toHaveLength(onNextSteps.length);
		});
	});

	describe('mounted', () => {
		it('does not recompute fresh progress during mounted goals maintenance', async () => {
			const applyMyKivaFreshProgress = vi.fn();
			const renewAnnualGoal = vi.fn().mockResolvedValue({
				showRenewedAnnualGoalToast: false,
				expiredGoals: [],
			});
			const fixIncorrectlyCompletedGoals = vi.fn().mockResolvedValue({ wasFixed: false });
			const context = {
				apollo: {
					watchQuery: vi.fn(() => ({
						subscribe: vi.fn(),
					}))
				},
				$route: { query: {} },
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
			expect(context.loadGoalData).toHaveBeenCalledWith(
				expect.objectContaining({ checkMyKivaCompletedGoalAfterLoad: true })
			);
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
				hydrateGoalDataFromCache: vi.fn(),
				readContentfulSlides: vi.fn().mockReturnValue([]),
				readContentfulBadgeData: vi.fn().mockReturnValue([]),
				heroTieredAchievements: [],
				currentYearTieredAchievements: [],
				apollo: {
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

		it('hydrates goal state from the cache with the optimistic loan adjustments included', () => {
			const currentYearTieredAchievements = [{ id: 'climate-action', totalProgressToAchievement: 1 }];
			const transactions = [{ type: 'loan_purchase', loan: { id: 7 } }];
			const recentTransactionLoans = [{ id: 7 }];
			const context = {
				fetchMyKivaData: vi.fn(),
				readTieredAchievementsFromCache: vi.fn()
					.mockReturnValueOnce([])
					.mockReturnValueOnce(currentYearTieredAchievements),
				applyMyKivaFreshProgress: vi.fn(),
				hydrateGoalDataFromCache: vi.fn(),
				readContentfulSlides: vi.fn().mockReturnValue([]),
				readContentfulBadgeData: vi.fn().mockReturnValue([]),
				heroTieredAchievements: [],
				currentYearTieredAchievements: [],
				recentTransactionLoans,
				transactions,
				apollo: {
					readFragment: vi.fn().mockReturnValue(undefined),
				},
				cookieStore: {
					get: vi.fn().mockReturnValue(undefined),
				},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
			};

			MyKivaPage.created.call(context);

			expect(context.hydrateGoalDataFromCache).toHaveBeenCalledWith({
				tieredAchievements: currentYearTieredAchievements,
				freshProgressLoans: recentTransactionLoans,
				transactions,
				year: new Date().getFullYear(),
			});
			// applyMyKivaFreshProgress is what populates recentTransactionLoans, which is
			// passed straight into the hydration above. Called the other way round, hydration
			// gets an empty array and renders progress short by any just-purchased loan the
			// achievement service has not attributed yet.
			expect(context.applyMyKivaFreshProgress.mock.invocationCallOrder[0])
				.toBeLessThan(context.hydrateGoalDataFromCache.mock.invocationCallOrder[0]);
		});

		it('wires heroSlides and heroBadgeContentfulData from the isolated Contentful readers', () => {
			const slides = [{ fields: { slides: [] } }];
			const badgeData = [{ id: 'womens-equality' }];
			const context = {
				fetchMyKivaData: vi.fn(),
				readTieredAchievementsFromCache: vi.fn()
					.mockReturnValueOnce([])
					.mockReturnValueOnce([]),
				applyMyKivaFreshProgress: vi.fn(),
				hydrateGoalDataFromCache: vi.fn(),
				readContentfulSlides: vi.fn().mockReturnValue(slides),
				readContentfulBadgeData: vi.fn().mockReturnValue(badgeData),
				heroTieredAchievements: [],
				currentYearTieredAchievements: [],
				heroBadgeContentfulData: [],
				apollo: {
					readFragment: vi.fn().mockReturnValue(undefined),
				},
				cookieStore: {
					get: vi.fn().mockReturnValue(undefined),
				},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
			};

			MyKivaPage.created.call(context);

			expect(context.heroSlides).toEqual(slides);
			expect(context.heroBadgeContentfulData).toEqual(badgeData);
		});
	});
});
