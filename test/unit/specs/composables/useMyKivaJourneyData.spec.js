import { ref } from 'vue';
import {
	buildLatestLoanData,
	buildLenderData,
	buildRegionsData,
	buildContentfulData,
	buildAchievementsWithFreshProgress,
	checkAndClearPostLendingCookie,
	createModalsHandlers,
} from '#src/composables/useMyKivaJourneyData';
import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';

vi.mock('#src/composables/useBadgeData', () => ({
	default: () => ({
		combineBadgeData: vi.fn((achievements, contentful) => [...achievements, ...contentful]),
		getAllCategoryLoanCounts: vi.fn(() => ({ women: 5, climate: 3 })),
	}),
	applyFreshProgressToAchievements: vi.fn(({ achievements }) => achievements),
	getContentfulLevelData: vi.fn(entry => ({ id: entry?.sys?.id, levelName: entry?.fields?.levelName })),
}));

vi.mock('#src/util/myKivaUtils', () => ({
	getRecentTransactionLoans: vi.fn(transactions => transactions?.slice(0, 5) ?? []),
	checkPostLendingCardCookie: vi.fn(),
	removePostLendingCardCookie: vi.fn(),
}));

describe('useMyKivaJourneyData', () => {
	describe('buildLatestLoanData', () => {
		it('returns null when no latestLoan values exist', () => {
			expect(buildLatestLoanData(null)).toBeNull();
			expect(buildLatestLoanData({})).toBeNull();
			expect(buildLatestLoanData({ latestLoan: {} })).toBeNull();
			expect(buildLatestLoanData({ latestLoan: { values: [] } })).toBeNull();
			expect(buildLatestLoanData({ latestLoan: { values: [{}] } })).toBeNull();
		});

		it('builds latestLoan data from single loan transaction', () => {
			const myData = {
				latestLoan: {
					values: [{
						loan: { id: 123, name: 'Test Loan' },
						amount: 25,
					}],
				},
			};

			const result = buildLatestLoanData(myData);

			expect(result).toEqual({
				id: 123,
				name: 'Test Loan',
				amount: 25,
			});
		});

		it('includes otherLoans when multiple loan transactions exist (promo credit split)', () => {
			const myData = {
				latestLoan: {
					values: [
						{ loan: { id: 123, name: 'Loan 1' }, amount: 25 },
						{ loan: { id: 456, name: 'Loan 2' }, amount: 10 },
						{ loan: { id: 789, name: 'Loan 3' }, amount: 5 },
					],
				},
			};

			const result = buildLatestLoanData(myData);

			expect(result.id).toBe(123);
			expect(result.amount).toBe(25);
			expect(result.otherLoans).toHaveLength(2);
			expect(result.otherLoans[0].loan.id).toBe(456);
			expect(result.otherLoans[1].loan.id).toBe(789);
		});
	});

	describe('buildLenderData', () => {
		it('returns empty object structure when myData is null', () => {
			const result = buildLenderData(null);

			expect(result).toEqual({
				public: false,
				inviterName: null,
			});
		});

		it('combines lender data with userAccount fields', () => {
			const myData = {
				lender: {
					id: 123,
					name: 'Test Lender',
					loanCount: 50,
				},
				userAccount: {
					public: true,
					inviterName: 'Referrer Name',
				},
			};

			const result = buildLenderData(myData);

			expect(result).toEqual({
				id: 123,
				name: 'Test Lender',
				loanCount: 50,
				public: true,
				inviterName: 'Referrer Name',
			});
		});

		it('defaults public to false and inviterName to null when userAccount missing', () => {
			const myData = {
				lender: { id: 123 },
			};

			const result = buildLenderData(myData);

			expect(result.public).toBe(false);
			expect(result.inviterName).toBeNull();
		});
	});

	describe('buildRegionsData', () => {
		it('returns empty regionsData when no countryFacets', () => {
			const { regionsData, userLentToAllRegions } = buildRegionsData({});

			expect(regionsData).toEqual([]);
			expect(userLentToAllRegions).toBe(false);
		});

		it('groups countries by region and counts loans', () => {
			const lendingStatsData = {
				lend: {
					countryFacets: [
						{ country: { region: 'Africa', isoCode: 'KE' }, count: 10 },
						{ country: { region: 'Africa', isoCode: 'UG' }, count: 5 },
						{ country: { region: 'Asia', isoCode: 'PH' }, count: 20 },
					],
				},
				my: {
					lendingStats: {
						countriesLentTo: [{ region: 'Africa' }],
					},
				},
			};

			const { regionsData, userLentToAllRegions } = buildRegionsData(lendingStatsData);

			expect(regionsData).toHaveLength(2);

			const africa = regionsData.find(r => r.name === 'Africa');
			expect(africa.count).toBe(15);
			expect(africa.hasLoans).toBe(true);
			expect(africa.countries).toContain('KE');
			expect(africa.countries).toContain('UG');

			const asia = regionsData.find(r => r.name === 'Asia');
			expect(asia.count).toBe(20);
			expect(asia.hasLoans).toBe(false);
			expect(asia.countries).toContain('PH');

			expect(userLentToAllRegions).toBe(false);
		});

		it('returns userLentToAllRegions true when user has lent to all regions', () => {
			const lendingStatsData = {
				lend: {
					countryFacets: [
						{ country: { region: 'Africa', isoCode: 'KE' }, count: 10 },
						{ country: { region: 'Asia', isoCode: 'PH' }, count: 20 },
					],
				},
				my: {
					lendingStats: {
						countriesLentTo: [{ region: 'Africa' }, { region: 'Asia' }],
					},
				},
			};

			const { userLentToAllRegions } = buildRegionsData(lendingStatsData);

			expect(userLentToAllRegions).toBe(true);
		});
	});

	describe('buildContentfulData', () => {
		it('returns empty arrays when no contentful data', () => {
			const { heroSlides, heroBadgeContentfulData } = buildContentfulData(null, null);

			expect(heroSlides).toEqual([]);
			expect(heroBadgeContentfulData).toEqual([]);
		});

		it('extracts heroSlides from slides result', () => {
			const slidesResult = {
				contentful: {
					entries: {
						items: [{
							fields: {
								slides: [
									{ id: 'slide1', title: 'Slide 1' },
									{ id: 'slide2', title: 'Slide 2' },
								],
							},
						}],
					},
				},
			};

			const { heroSlides } = buildContentfulData(slidesResult, null);

			expect(heroSlides).toHaveLength(2);
			expect(heroSlides[0].id).toBe('slide1');
		});

		it('maps contentful challenge entries to level data', () => {
			const contentfulChallengeResult = {
				contentful: {
					entries: {
						items: [
							{ sys: { id: 'badge1' }, fields: { levelName: 'Level 1' } },
							{ sys: { id: 'badge2' }, fields: { levelName: 'Level 2' } },
						],
					},
				},
			};

			const { heroBadgeContentfulData } = buildContentfulData(null, contentfulChallengeResult);

			expect(heroBadgeContentfulData).toHaveLength(2);
			expect(heroBadgeContentfulData[0]).toEqual({ id: 'badge1', levelName: 'Level 1' });
		});
	});

	describe('buildAchievementsWithFreshProgress', () => {
		it('returns empty arrays when no data provided', () => {
			const result = buildAchievementsWithFreshProgress(null, null, []);

			expect(result.heroTieredAchievements).toEqual([]);
			expect(result.currentYearTieredAchievements).toEqual([]);
			expect(result.recentTransactionLoans).toEqual([]);
		});

		it('extracts achievements from query results', () => {
			const lastYearResult = {
				userAchievementProgress: {
					tieredLendingAchievements: [
						{ id: 'women', progress: 5 },
						{ id: 'climate', progress: 3 },
					],
				},
			};

			const currentYearResult = {
				userAchievementProgress: {
					tieredLendingAchievements: [
						{ id: 'education', progress: 10 },
					],
				},
			};

			const transactions = [
				{ loanId: 1 },
				{ loanId: 2 },
			];

			const result = buildAchievementsWithFreshProgress(
				lastYearResult,
				currentYearResult,
				transactions
			);

			expect(result.heroTieredAchievements).toHaveLength(2);
			expect(result.currentYearTieredAchievements).toHaveLength(1);
			expect(result.recentTransactionLoans).toHaveLength(2);
		});
	});

	describe('checkAndClearPostLendingCookie', () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it('returns false and does not remove cookie when cookie not present', () => {
			checkPostLendingCardCookie.mockReturnValue(false);
			const mockCookieStore = {};

			const result = checkAndClearPostLendingCookie(mockCookieStore);

			expect(result).toBe(false);
			expect(removePostLendingCardCookie).not.toHaveBeenCalled();
		});

		it('returns true and removes cookie when cookie is present', () => {
			checkPostLendingCardCookie.mockReturnValue(true);
			const mockCookieStore = {};

			const result = checkAndClearPostLendingCookie(mockCookieStore);

			expect(result).toBe(true);
			expect(removePostLendingCardCookie).toHaveBeenCalledWith(mockCookieStore);
		});
	});

	describe('createModalsHandlers', () => {
		const createRefs = () => ({
			showGoalModal: ref(true),
			showImpactInsightsModal: ref(true),
			isGoalSet: ref(false),
			newGoalPrefs: ref(null),
			recordedGoalSet: ref(false),
		});

		const createHandlers = (overrides = {}) => createModalsHandlers({
			trackEvent: vi.fn(),
			storeGoalPreferences: vi.fn().mockResolvedValue(),
			loadGoalData: vi.fn().mockResolvedValue(),
			goalsV2Enabled: true,
			...overrides,
		});

		describe('setGoal', () => {
			it('stores preferences and updates refs', async () => {
				const mockStore = vi.fn().mockResolvedValue();
				const handlers = createHandlers({ storeGoalPreferences: mockStore });
				const refs = createRefs();
				const prefs = { category: 'women', target: 5 };

				await handlers.setGoal(prefs, refs);

				expect(mockStore).toHaveBeenCalledWith(prefs, false);
				expect(refs.isGoalSet.value).toBe(true);
				expect(refs.newGoalPrefs.value).toEqual(prefs);
			});

			it('closes modal and refreshes for legacy goals (non-v2)', async () => {
				const mockLoad = vi.fn().mockResolvedValue();
				const handlers = createHandlers({ goalsV2Enabled: false, loadGoalData: mockLoad });
				const refs = createRefs();

				await handlers.setGoal({ category: 'women', target: 5 }, refs);

				expect(mockLoad).toHaveBeenCalledWith({ yearlyProgress: false });
				expect(refs.showGoalModal.value).toBe(false);
			});

			it('does not close modal for v2 goals', async () => {
				const handlers = createHandlers({ goalsV2Enabled: true });
				const refs = createRefs();

				await handlers.setGoal({ category: 'women', target: 5 }, refs);

				expect(refs.showGoalModal.value).toBe(true);
			});
		});

		describe('closeGoalModal', () => {
			it('closes modal and tracks close event', async () => {
				const mockTrack = vi.fn();
				const handlers = createHandlers({ trackEvent: mockTrack });
				const refs = createRefs();

				await handlers.closeGoalModal(refs);

				expect(refs.showGoalModal.value).toBe(false);
				expect(mockTrack).toHaveBeenCalledWith('portfolio', 'click', 'close-goals');
			});

			it('tracks goal-set and refreshes when goal was set', async () => {
				const mockTrack = vi.fn();
				const mockLoad = vi.fn().mockResolvedValue();
				const handlers = createHandlers({ trackEvent: mockTrack, loadGoalData: mockLoad });
				const refs = createRefs();
				refs.isGoalSet.value = true;
				refs.newGoalPrefs.value = { category: 'women', target: 5 };

				await handlers.closeGoalModal(refs);

				expect(mockTrack).toHaveBeenCalledWith('portfolio', 'show', 'goal-set', 'women', 5);
				expect(refs.recordedGoalSet.value).toBe(true);
				expect(mockLoad).toHaveBeenCalledWith({ yearlyProgress: true });
			});

			it('does not track goal-set twice', async () => {
				const mockTrack = vi.fn();
				const handlers = createHandlers({ trackEvent: mockTrack });
				const refs = createRefs();
				refs.isGoalSet.value = true;
				refs.recordedGoalSet.value = true;

				await handlers.closeGoalModal(refs);

				const goalSetCalls = mockTrack.mock.calls.filter(c => c[1] === 'show' && c[2] === 'goal-set');
				expect(goalSetCalls).toHaveLength(0);
			});

			it('does not refresh when no goal was set', async () => {
				const mockLoad = vi.fn().mockResolvedValue();
				const handlers = createHandlers({ loadGoalData: mockLoad });
				const refs = createRefs();

				await handlers.closeGoalModal(refs);

				expect(mockLoad).not.toHaveBeenCalled();
			});
		});

		describe('closeImpactInsightsModal', () => {
			it('closes modal and tracks event', () => {
				const mockTrack = vi.fn();
				const handlers = createHandlers({ trackEvent: mockTrack });
				const refs = createRefs();

				handlers.closeImpactInsightsModal(refs);

				expect(refs.showImpactInsightsModal.value).toBe(false);
				expect(mockTrack).toHaveBeenCalledWith('portfolio', 'click', 'next-step-close-education');
			});

			it('does not track when modal is already closed', () => {
				const mockTrack = vi.fn();
				const handlers = createHandlers({ trackEvent: mockTrack });
				const refs = createRefs();
				refs.showImpactInsightsModal.value = false;

				handlers.closeImpactInsightsModal(refs);

				expect(mockTrack).not.toHaveBeenCalled();
			});
		});
	});
});
