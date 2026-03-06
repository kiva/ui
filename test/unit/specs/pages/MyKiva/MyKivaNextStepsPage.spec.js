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

vi.mock('#src/composables/useBadgeData', () => ({
	default: () => ({
		combineBadgeData: vi.fn((a, b) => [...a, ...b]),
		getAllCategoryLoanCounts: vi.fn(() => ({})),
		isTieredAchievementComplete: vi.fn(() => false),
		getActiveTierData: vi.fn(() => null),
	}),
	applyFreshProgressToAchievements: vi.fn(({ achievements }) => achievements),
	getContentfulLevelData: vi.fn(entry => ({ id: entry?.sys?.id })),
	FRESH_PROGRESS_LOAN_PURCHASE_LIMIT: 20,
}));

vi.mock('#src/util/myKivaUtils', () => ({
	getRecentTransactionLoans: vi.fn(t => t?.slice(0, 5) ?? []),
	checkPostLendingCardCookie: vi.fn(),
	removePostLendingCardCookie: vi.fn(),
	CONTENTFUL_CAROUSEL_KEY: 'test-carousel-key',
}));

describe('MyKivaNextStepsPage', () => {
	describe('shared composable integration', () => {
		it('buildAchievementsWithFreshProgress returns structured data for the page', () => {
			const lastYear = {
				userAchievementProgress: {
					tieredLendingAchievements: [{ id: 'women', progress: 5 }],
				},
			};
			const currentYear = {
				userAchievementProgress: {
					tieredLendingAchievements: [{ id: 'climate', progress: 3 }],
				},
			};
			const transactions = [{ loanId: 1 }];

			const result = buildAchievementsWithFreshProgress(lastYear, currentYear, transactions);

			expect(result).toHaveProperty('heroTieredAchievements');
			expect(result).toHaveProperty('currentYearTieredAchievements');
			expect(result).toHaveProperty('recentTransactionLoans');
			expect(result.heroTieredAchievements).toHaveLength(1);
			expect(result.currentYearTieredAchievements).toHaveLength(1);
		});

		it('buildContentfulData returns heroSlides and heroBadgeContentfulData', () => {
			const slidesResult = {
				contentful: { entries: { items: [{ fields: { slides: [{ id: 's1' }] } }] } },
			};
			const challengeResult = {
				contentful: { entries: { items: [{ sys: { id: 'b1' } }] } },
			};

			const result = buildContentfulData(slidesResult, challengeResult);

			expect(result.heroSlides).toHaveLength(1);
			expect(result.heroBadgeContentfulData).toHaveLength(1);
		});

		it('buildRegionsData produces region data used by MyKivaRegionExperience', () => {
			const data = {
				lend: {
					countryFacets: [
						{ country: { region: 'Africa', isoCode: 'KE' }, count: 10 },
					],
				},
				my: { lendingStats: { countriesLentTo: [] } },
			};

			const { regionsData } = buildRegionsData(data);

			expect(regionsData).toHaveLength(1);
			expect(regionsData[0].name).toBe('Africa');
		});

		it('buildLatestLoanData returns loan data for impact insight card', () => {
			const myData = {
				latestLoan: {
					values: [{ loan: { id: 1, name: 'Loan' }, amount: 25 }],
				},
			};

			const result = buildLatestLoanData(myData);

			expect(result.id).toBe(1);
			expect(result.amount).toBe(25);
		});

		it('buildLenderData merges lender with account info', () => {
			const myData = {
				lender: { id: 1 },
				userAccount: { public: true, inviterName: 'Test' },
			};

			const result = buildLenderData(myData);

			expect(result.public).toBe(true);
			expect(result.inviterName).toBe('Test');
		});
	});

	describe('createModalsHandlers used by page', () => {
		it('setGoal updates refs passed by the page', async () => {
			const mockStore = vi.fn().mockResolvedValue();
			const handlers = createModalsHandlers({
				trackEvent: vi.fn(),
				storeGoalPreferences: mockStore,
				loadGoalData: vi.fn().mockResolvedValue(),
				goalsV2Enabled: true,
			});

			const refs = {
				isGoalSet: ref(false),
				newGoalPrefs: ref(null),
				showGoalModal: ref(true),
			};

			await handlers.setGoal({ category: 'women', target: 5 }, refs);

			expect(refs.isGoalSet.value).toBe(true);
			expect(refs.newGoalPrefs.value).toEqual({ category: 'women', target: 5 });
			expect(refs.showGoalModal.value).toBe(true);
		});

		it('closeGoalModal tracks and refreshes when goal was set', async () => {
			const mockTrack = vi.fn();
			const mockLoad = vi.fn().mockResolvedValue();
			const handlers = createModalsHandlers({
				trackEvent: mockTrack,
				storeGoalPreferences: vi.fn().mockResolvedValue(),
				loadGoalData: mockLoad,
				goalsV2Enabled: true,
			});

			const refs = {
				showGoalModal: ref(true),
				isGoalSet: ref(true),
				newGoalPrefs: ref({ category: 'women', target: 5 }),
				recordedGoalSet: ref(false),
			};

			await handlers.closeGoalModal(refs);

			expect(refs.showGoalModal.value).toBe(false);
			expect(mockTrack).toHaveBeenCalledWith('portfolio', 'click', 'close-goals');
			expect(mockTrack).toHaveBeenCalledWith('portfolio', 'show', 'goal-set', 'women', 5);
			expect(mockLoad).toHaveBeenCalledWith({ yearlyProgress: true });
		});

		it('closeImpactInsightsModal tracks and closes', () => {
			const mockTrack = vi.fn();
			const handlers = createModalsHandlers({
				trackEvent: mockTrack,
				storeGoalPreferences: vi.fn(),
				loadGoalData: vi.fn(),
			});

			const refs = { showImpactInsightsModal: ref(true) };

			handlers.closeImpactInsightsModal(refs);

			expect(refs.showImpactInsightsModal.value).toBe(false);
			expect(mockTrack).toHaveBeenCalledWith('portfolio', 'click', 'next-step-close-education');
		});
	});

	describe('checkAndClearPostLendingCookie used by page', () => {
		it('is used to check and clear the post-lending cookie on mount', () => {
			expect(typeof checkAndClearPostLendingCookie).toBe('function');
		});
	});
});
