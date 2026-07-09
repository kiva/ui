import {
	computed,
	inject,
	ref,
} from 'vue';

import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
import useGoalDataProgressQuery from '#src/graphql/query/useGoalDataProgress.graphql';
import useGoalDataYearlyProgressQuery from '#src/graphql/query/useGoalDataYearlyProgress.graphql';
import goalSummaryAchievementQuery from '#src/graphql/query/goalSummaryAchievement.graphql';
import goalSummaryQuery from '#src/graphql/query/goalSummary.graphql';
import loanStatsByYearQuery from '#src/graphql/query/loanStatsByYear.graphql';
import logFormatter from '#src/util/logFormatter';
import { getTransactionTimestamp } from '#src/util/myKivaUtils';
import { createUserPreferences, updateUserPreferences, setMyKivaGoal } from '#src/util/userPreferenceUtils';
import { runLoansQuery } from '#src/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_GOAL_RECOMMENDED_LOAN } from '#src/util/flssUtils';

import useBadgeData, {
	calculateFreshProgressAdjustments,
	getJourneysByLoan,
	getMissingLoans,
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_SUPPORT_ALL,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

import womenImg from '#src/assets/images/my-kiva/goal-setting/women.svg?url';
import refugeesImg from '#src/assets/images/my-kiva/goal-setting/refugees.svg?url';
import climateActionImg from '#src/assets/images/my-kiva/goal-setting/climate-action.svg?url';
import usEntrepreneursImg from '#src/assets/images/my-kiva/goal-setting/us-entrepreneurs.svg?url';
import basicNeedsImg from '#src/assets/images/my-kiva/goal-setting/basic-needs.svg?url';
import supportAllImg from '#src/assets/images/my-kiva/goal-setting/support-all.svg?url';

const GOAL_DISPLAY_MAP = {
	[ID_BASIC_NEEDS]: 'basic needs loans',
	[ID_CLIMATE_ACTION]: 'eco friendly loans',
	[ID_REFUGEE_EQUALITY]: 'refugees',
	[ID_SUPPORT_ALL]: 'borrowers',
	[ID_US_ECONOMIC_EQUALITY]: 'US entrepreneurs',
	[ID_WOMENS_EQUALITY]: 'women',
};

const GOAL_1_DISPLAY_MAP = {
	[ID_BASIC_NEEDS]: 'basic needs loan',
	[ID_CLIMATE_ACTION]: 'eco friendly loan',
	[ID_REFUGEE_EQUALITY]: 'refugee',
	[ID_SUPPORT_ALL]: 'borrower',
	[ID_US_ECONOMIC_EQUALITY]: 'US entrepreneur',
	[ID_WOMENS_EQUALITY]: 'woman',
};

// Filters with loanSearchState format to be used directly in graphql queries depending on the category
const FLSS_FILTERS_BY_GOAL = {
	[ID_WOMENS_EQUALITY]: { gender: ['female'] },
	[ID_US_ECONOMIC_EQUALITY]: { countryIsoCode: ['PR', 'US'] },
	[ID_CLIMATE_ACTION]: { tagId: [8, 9] },
	[ID_REFUGEE_EQUALITY]: { themeId: [28] },
	[ID_BASIC_NEEDS]: { sectorId: [6, 10, 20, 21] },
};

export const GOAL_STATUS = {
	COMPLETED: 'completed',
	EXPIRED: 'expired',
	IN_PROGRESS: 'in-progress',
};

export const GOALS_CURRENT_YEAR = new Date().getFullYear();
export const LAST_YEAR_KEY = GOALS_CURRENT_YEAR - 1;
export const COMPLETED_GOAL_THRESHOLD = 100;

// Matches achievements-service's rolling-window cap (MAX_ROLLING_WINDOW_SIZE); the
// service can't return more loanPurchases than this in one query, so it's the largest
// useful limit for summing borrowerCount.
export const GOAL_SUMMARY_LOAN_PURCHASES_LIMIT = 1000;
export const HALF_GOAL_THRESHOLD = 50;
const MIN_CATEGORY_LOANS_AMOUNT = 100;
const RECOMMENDED_LOANS_LIMIT = 4;

function getGoalDisplayName(target, category) {
	if (!target || target > 1) return GOAL_DISPLAY_MAP[category] || 'loans';
	return GOAL_1_DISPLAY_MAP[category] || 'loan';
}

/**
 * Vue composable for loading and managing user goal data
 *
 * @param {Object} options - Configuration options
 * @param {Array} options.loans - List of loans to count toward goals
 * @param {Object} options.apollo - Apollo client instance (optional, will use inject if not provided)
 * @returns Goal data and utilities
 */
export default function useGoalData({ apollo } = {}) {
	const apolloClient = apollo || inject('apollo');
	const $kvTrackEvent = inject('$kvTrackEvent');
	const currentYearProgress = ref([]);
	// Raw achievement-service progress with NO client-side fresh-progress added. Used to verify a
	// goal is genuinely complete before persisting a completed status, so optimistic adjustments
	// can drive UI without ever marking a goal complete the achievement service doesn't support.
	const rawCurrentYearProgress = ref([]);
	const goalCurrentLoanCount = ref(0); // In-page counter for tracking loans added to basket
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const yearlyLoanCount = ref(null); // Total loans for current year from loanStatsByYear
	const userGoal = ref(null);
	const userGoalAchievedNow = ref(false);
	const userPreferences = ref(null);

	// --- Computed Properties ---

	const goalProgress = computed(() => {
		const goal = userGoal.value;
		const progress = currentYearProgress.value;
		if (goal?.category === ID_SUPPORT_ALL) {
			return yearlyLoanCount.value || 0;
		}

		const categoryProgress = progress?.find(n => n.id === goal?.category);
		return categoryProgress?.progressForYear || 0;
	});

	const userGoalAchieved = computed(() => goalProgress.value >= userGoal.value?.target);

	/**
	 * Check if the current progress would complete the user's goal
	 * Used to show "reaches your goal" message in basket and ATB modal
	 * @param {number} currentProgress - Current progress toward goal (after adding loan to basket)
	 * @returns {boolean} True if this progress completes the goal
	 */
	function isProgressCompletingGoal(currentProgress) {
		const goal = userGoal.value;
		if (!goal || goal.status !== GOAL_STATUS.IN_PROGRESS) return false;

		const target = goal.target || 0;
		// Check if progress > 0 and equals target (completing the goal)
		return currentProgress > 0 && currentProgress === target;
	}

	// --- Functions ---

	function setGoalState(parsedPrefs) {
		if (!parsedPrefs) return;
		const goals = parsedPrefs.goals || [];
		const currentYear = new Date().getFullYear();
		const activeGoals = goals.filter(g => {
			// Filter out expired goals
			if (g.status === GOAL_STATUS.EXPIRED) return false;
			// Filter out goals completed in previous years
			if (g.status === GOAL_STATUS.COMPLETED && g.dateStarted) {
				const goalYear = new Date(g.dateStarted).getFullYear();
				if (goalYear < currentYear) return false;
			}
			return true;
		});
		userGoal.value = { ...activeGoals[0] };
	}

	/**
	 * Completed goals from prior years, exposed for the Impact Progress row.
	 * Current-year completed goals stay surfaced via `userGoal` so the featured
	 * slot and carousel keep working unchanged. Sorted by start-year, newest
	 * first.
	 */
	const completedGoalsHistory = computed(() => {
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];

		return goals
			.filter(g => g.dateStarted)
			.filter(g => new Date(g.dateStarted).getFullYear() < GOALS_CURRENT_YEAR)
			.filter(g => {
				if (g.status === GOAL_STATUS.COMPLETED) return true;
				if (g.status === GOAL_STATUS.EXPIRED) return (g.loansTowardGoal || 0) > 0;
				return false;
			})
			.sort((a, b) => (
				new Date(b.dateStarted).getFullYear() - new Date(a.dateStarted).getFullYear()
			));
	});

	/**
	 * Get Goal Categories for Goal Selection
	 * @param {*} categoriesLoanCount Categories Loan Count
	 * @param {*} totalLoans Total Loans
	 * @returns array of goal categories
	 */
	function getCategories(categoriesLoanCount, totalLoans) {
		return [
			{
				id: '1',
				name: 'Women',
				description: 'Open doors for women around the world',
				eventProp: 'women',
				customImage: womenImg,
				loanCount: categoriesLoanCount?.[ID_WOMENS_EQUALITY],
				title: 'women',
				badgeId: ID_WOMENS_EQUALITY,
			},
			{
				id: '2',
				name: 'Choose as I go',
				description: 'Support a variety of borrowers',
				eventProp: 'help-everyone',
				customImage: supportAllImg,
				loanCount: totalLoans,
				title: null,
				badgeId: ID_SUPPORT_ALL,
			},
			{
				id: '3',
				name: 'Climate Action',
				description: 'Support the front lines of the climate crisis',
				eventProp: 'climate',
				customImage: climateActionImg,
				loanCount: categoriesLoanCount?.[ID_CLIMATE_ACTION],
				title: 'climate action',
				badgeId: ID_CLIMATE_ACTION,
			},
			{
				id: '4',
				name: 'Basic Needs',
				description: 'Clean water, healthcare, and sanitation',
				eventProp: 'basic-needs',
				customImage: basicNeedsImg,
				loanCount: categoriesLoanCount?.[ID_BASIC_NEEDS],
				title: 'basic needs',
				badgeId: ID_BASIC_NEEDS,
			},
			{
				id: '5',
				name: 'Refugees',
				description: 'Transform the future for refugees',
				eventProp: 'refugees',
				customImage: refugeesImg,
				loanCount: categoriesLoanCount?.[ID_REFUGEE_EQUALITY],
				title: 'refugees',
				badgeId: ID_REFUGEE_EQUALITY,
			},
			{
				id: '6',
				name: 'U.S. Entrepreneurs',
				description: 'Support small businesses in the U.S.',
				eventProp: 'us-entrepreneur',
				customImage: usEntrepreneursImg,
				loanCount: categoriesLoanCount?.[ID_US_ECONOMIC_EQUALITY],
				title: 'US entrepreneurs',
				badgeId: ID_US_ECONOMIC_EQUALITY,
			},
		];
	}

	/**
	 * Generate CTA Href for Goal Completion
	 * @param {number} selectedGoalNumber goal target number selected by the user
	 * @param {string} categoryId category id selected by the user
	 * @param {object} router vue-router instance
	 * @param {number} currentLoanCount loans made toward this goal (default 0 for new goals,
	 *   pass goalProgress for existing goals to show remaining loans needed)
	 * @returns {string} href string with encoded header message
	 */
	function getCtaHref(selectedGoalNumber, categoryId, router, currentLoanCount = 0) {
		const { getLoanFindingUrl } = useBadgeData();
		const remaining = Math.max(0, selectedGoalNumber - currentLoanCount);
		const categoryHeader = getGoalDisplayName(remaining, categoryId);
		const string = `Support ${remaining} more ${categoryHeader} to reach your goal`;
		const encodedHeader = encodeURIComponent(string);
		const loanFindingUrl = getLoanFindingUrl(categoryId, router.currentRoute.value);
		if (remaining > 0) {
			return `${loanFindingUrl}?header=${encodedHeader}`;
		}
		return `${loanFindingUrl}`;
	}

	/**
	 * Get the number of loans from last year by the given category ID
	 */
	function getCategoryLoansLastYear(tieredAchievements, categoryId = ID_WOMENS_EQUALITY) {
		const categoryAchievement = tieredAchievements?.find(entry => entry.id === categoryId);
		return categoryAchievement?.progressForYear || 0;
	}

	/**
	 * Retrieves the user's tiered lending achievement progress for a given year.
	 * Always uses 'no-cache' because this lightweight query only selects
	 * tieredLendingAchievements — writing it to cache would overwrite richer
	 * data stored by the full userAchievementProgressQuery prefetch.
	 *
	 * @param {number} year - Year to fetch progress for.
	 * @returns {Promise<Object[]|null>} Tiered lending progress data, or null on error.
	 */
	async function getCategoriesProgressByYear(year) {
		try {
			const response = await apolloClient.query({
				query: useGoalDataYearlyProgressQuery,
				variables: { year },
				fetchPolicy: 'no-cache',
			});
			const progress = response.data.userAchievementProgress.tieredLendingAchievements;
			return progress;
		} catch (error) {
			logFormatter(error, 'Failed to fetch categories progress by year');
			return null;
		}
	}

	/**
	 * Retrieves the user's total loan count and amount for a given year.
	 * This includes all loans regardless of category.
	 *
	 * @param {number} year - Year to fetch loan stats for.
	 * @param {string} [fetchPolicy='cache-first'] - Apollo fetch policy.
	 * @returns {Promise<{count: number, amount: number}|null>} Loan stats for the year, or null on error.
	 */
	async function getLoanStatsByYear(year, fetchPolicy = 'cache-first') {
		try {
			const response = await apolloClient.query({
				query: loanStatsByYearQuery,
				variables: { year },
				fetchPolicy
			});
			const stats = response.data?.my?.lendingStats?.loanStatsByYear;
			return {
				count: stats?.count || 0,
				amount: stats?.amount || 0,
			};
		} catch (error) {
			logFormatter(error, 'Failed to fetch loan stats by year');
			return null;
		}
	}

	/**
	 * Get the previous year's support-all loan count
	 * @returns {Promise<{count: number, amount: number}|null>} Returns null if an error occurs
	 */
	const getSupportAllLoanCountByYear = async (year, fetchPolicy = 'network-only') => {
		try {
			const stats = await getLoanStatsByYear(year, fetchPolicy);
			return stats.count || 0;
		} catch (error) {
			logFormatter(error, 'Failed to fetch previous support-all loan count');
			return null;
		}
	};

	/**
	 * Retrieves the user's loan count for the specified category id and year.
	 *
	 * @param {string} categoryId - Category ID to fetch loan count for.
	 * @param {number} year - Year to fetch progress for.
	 * @returns {Promise<number|null>} The category loan count for the given year, or null on error.
	 */
	async function getCategoryLoanCountByYear(categoryId, year) {
		try {
			// Get actual yearly loan count
			if (categoryId === ID_SUPPORT_ALL) {
				return await getSupportAllLoanCountByYear(year);
			}

			const progress = await getCategoriesProgressByYear(year);
			const count = progress?.find(entry => entry.id === categoryId)?.progressForYear || 0;
			return count;
		} catch (error) {
			logFormatter(error, 'Failed to fetch category loan count by year');
			return null;
		}
	}

	async function loadPreferences(fetchPolicy = 'cache-first') {
		try {
			const response = await apolloClient.query({ query: useGoalDataQuery, fetchPolicy });
			const prefsData = response.data?.my?.userPreferences || null;
			totalLoanCount.value = response.data?.my?.loans?.totalCount || 0;
			userPreferences.value = prefsData;
			return prefsData ? JSON.parse(prefsData.preferences || '{}') : {};
		} catch (error) {
			logFormatter(error, 'Failed to load preferences');
			return null;
		}
	}

	function findMostRecentActiveGoal(goals) {
		const currentYear = new Date().getFullYear();
		return goals.find(g => {
			if (g.status === GOAL_STATUS.EXPIRED) return false;
			if (g.status === GOAL_STATUS.COMPLETED && g.dateStarted) {
				return new Date(g.dateStarted).getFullYear() >= currentYear;
			}
			return true;
		});
	}

	/**
	 * Returns a normalized summary for a user's MyKiva goal.
	 *
	 * Support-all goals route through the `my.goalSummary` monolith endpoint, which
	 * loads the user's lending history server-side and returns the full summary shape
	 * (super lenders have too many transactions to compute on the FE).
	 *
	 * For badge-journey goals, `count`, `percent`, and `borrowerCount` come from
	 * achievements-service. `amount` stays null: LoanPurchase doesn't expose a
	 * per-share money field, so we can't compute what the user actually lent
	 * without an achievements-service extension.
	 *
	 * `borrowerCount` is summed from the federated `loanPurchases.loan.borrowerCount`.
	 * achievements-service retains `loanPurchases` in a rolling window of
	 * MAX_ROLLING_WINDOW_SIZE (1000) loans, so we request that many
	 * (`GOAL_SUMMARY_LOAN_PURCHASES_LIMIT`) — the most the service can return in one
	 * call, accurate for any lender with <=1000 qualifying loans that year. Beyond
	 * that the service has already trimmed the loan IDs, so no FE query can do better;
	 * those users route through the `my.goalSummary` monolith endpoint.
	 *
	 * @param {string} [goalName] - Specific goal name to summarize.
	 * @returns {Promise<Object|null>} Goal summary or null when no matching goal.
	 */
	async function computeGoalSummary(goalName) {
		const prefs = await loadPreferences();
		const goals = prefs?.goals || [];
		const goal = goalName
			? goals.find(g => g.goalName === goalName)
			: findMostRecentActiveGoal(goals);
		if (!goal) return null;

		// Support-all is computed server-side by the monolith; it returns the full summary shape.
		if (goal.category === ID_SUPPORT_ALL) {
			try {
				const response = await apolloClient.query({
					query: goalSummaryQuery,
					variables: { goalName: goal.goalName },
					fetchPolicy: 'no-cache',
				});
				return response.data?.my?.goalSummary || null;
			} catch (error) {
				logFormatter('Failed to fetch support-all goal summary', 'error', { error: error?.message });
				return null;
			}
		}

		const year = new Date(goal.dateStarted).getFullYear();
		let achievement = null;
		try {
			const response = await apolloClient.query({
				query: goalSummaryAchievementQuery,
				variables: { year, loanPurchasesLimit: GOAL_SUMMARY_LOAN_PURCHASES_LIMIT },
				fetchPolicy: 'no-cache',
			});
			const tiered = response.data?.userAchievementProgress?.tieredLendingAchievements;
			achievement = tiered?.find(e => e.id === goal.category) || null;
		} catch (error) {
			logFormatter('Failed to fetch goal summary achievement', 'error', { error: error?.message });
		}

		const count = achievement?.progressForYear || 0;
		const target = goal.target || 0;
		const percent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

		let borrowerCount = null;
		if (achievement) {
			borrowerCount = (achievement.loanPurchases || [])
				.filter(p => p.purchaseTime && new Date(p.purchaseTime).getFullYear() === year)
				.reduce((sum, p) => sum + (p.loan?.borrowerCount || 0), 0);
		}

		return {
			goalName: goal.goalName,
			category: goal.category,
			dateStarted: goal.dateStarted,
			target: goal.target || null,
			status: goal.status || null,
			count,
			borrowerCount,
			amount: null,
			percent,
		};
	}

	// TESTING ONLY (remove later): super-lender timing via ?goalSummaryTiming.
	async function getGoalSummary(goalName) {
		const timingEnabled = typeof window !== 'undefined'
			&& new URLSearchParams(window.location.search).has('goalSummaryTiming');
		if (!timingEnabled) {
			return computeGoalSummary(goalName);
		}
		const start = performance.now();
		const result = await computeGoalSummary(goalName);
		let path = 'none (no goal or fetch error)';
		if (result) {
			path = result.category === ID_SUPPORT_ALL ? 'monolith:my.goalSummary' : 'achievements-service';
		}
		logFormatter('TESTING ONLY (remove later): super-lender goalSummary timing', 'info', {
			durationMs: Math.round(performance.now() - start),
			path,
			goalName: result?.goalName ?? goalName ?? null,
		});
		return result;
	}

	/**
	 * Calculates year-aware fresh progress adjustments for goals
	 *
	 * @param loans Array of carousel loans
	 * @param tieredAchievements Array of tiered achievements
	 * @param targetYear Year to filter for year-specific progress
	 * @param transactions Array of user transactions to get purchase dates
	 * @returns Object with allTime and yearSpecific adjustment maps
	 */
	function calculateGoalFreshProgressAdjustments(loans, tieredAchievements, targetYear, transactions = []) {
		// Get all-time adjustments using the exported utility function (no year filtering)
		const allTimeAdjustments = calculateFreshProgressAdjustments(loans, tieredAchievements);

		// Calculate year-specific adjustments by filtering loans by year
		const yearSpecificAdjustments = {};

		if (!loans?.length || !tieredAchievements?.length) {
			return { allTime: allTimeAdjustments, yearSpecific: yearSpecificAdjustments };
		}

		// Get missing loans using the shared helper
		const missingLoans = getMissingLoans(loans, tieredAchievements);

		// Create a map of loan ID to transaction purchase year
		const loanPurchaseYears = new Map();
		transactions.forEach(txn => {
			const transactionTimestamp = getTransactionTimestamp(txn);
			if (txn?.loan?.id != null && transactionTimestamp != null) {
				const purchaseYear = new Date(transactionTimestamp).getFullYear();
				loanPurchaseYears.set(txn.loan.id, { year: purchaseYear });
			}
		});

		missingLoans.forEach(loan => {
			if (!loan) return;

			// Use transaction purchase year only
			const purchaseInfo = loanPurchaseYears.get(loan.id);
			const loanYear = purchaseInfo?.year || null;

			// Only count for year-specific if year matches; skip loans with unknown purchase year
			// Unknown purchase years are for loans outside of the transactions loaded
			if (loanYear && loanYear === targetYear) {
				const journeys = getJourneysByLoan(loan);
				journeys.forEach(journeyId => {
					yearSpecificAdjustments[journeyId] = (yearSpecificAdjustments[journeyId] || 0) + 1;
				});
			}
		});
		return { allTime: allTimeAdjustments, yearSpecific: yearSpecificAdjustments };
	}

	/**
	 * Applies fresh progress adjustments to goal progress data
	 *
	 * @param progress Array of category progress objects
	 * @param freshProgressAdjustments Object with allTime and yearSpecific adjustment maps
	 * @returns The adjusted progress array (new array with modified copies)
	 */
	function applyFreshProgressToGoalData(progress, freshProgressAdjustments) {
		const allTimeAdjustments = freshProgressAdjustments?.allTime || {};
		const yearSpecificAdjustments = freshProgressAdjustments?.yearSpecific || {};

		if (!progress?.length || Object.keys(allTimeAdjustments).length === 0) {
			return progress?.map(p => ({ ...p })) || [];
		}

		// Apply adjustments to both all-time and year-specific progress
		return progress.map(achievement => {
			const allTimeAdjustment = allTimeAdjustments[achievement.id];
			const yearAdjustment = yearSpecificAdjustments[achievement.id];

			// Only apply adjustments to tiered achievements (which have totalProgressToAchievement)
			if ((allTimeAdjustment || yearAdjustment) && achievement.totalProgressToAchievement !== undefined) {
				// Update all-time progress
				const allTimeProgress = achievement.totalProgressToAchievement || 0;
				const newAllTimeProgress = allTimeProgress + (allTimeAdjustment || 0);

				// Update year-specific progress only with year-filtered loans
				const yearProgress = achievement.progressForYear || 0;
				const newYearProgress = achievement.progressForYear !== undefined
					? yearProgress + (yearAdjustment || 0)
					: achievement.progressForYear;

				// Return new object with adjusted progress
				return {
					...achievement,
					totalProgressToAchievement: newAllTimeProgress,
					progressForYear: newYearProgress
				};
			}
			// Return copy of achievement without adjustments
			return { ...achievement };
		});
	}

	async function loadProgress(year, freshProgressAdjustments = {}) {
		try {
			const progress = await getCategoriesProgressByYear(year);
			// Preserve the raw achievement-service progress before applying optimistic adjustments.
			rawCurrentYearProgress.value = progress?.map(p => ({ ...p })) || [];
			currentYearProgress.value = applyFreshProgressToGoalData(progress, freshProgressAdjustments);
		} catch (error) {
			logFormatter(error, 'Failed to load progress');
			return null;
		}
	}

	/**
	 * Get post-checkout progress for multiple loans
	 * @param {Object} options - Options for progress calculation
	 * @param {Array} options.loans - Array of loan objects with id property
	 * @param {number|null} options.year - Year for yearly progress, or null for all-time progress
	 * @param {boolean} options.increment - Increment in-page counter by 1 (ATB modal: true)
	 * @param {boolean} options.addBasketLoans - Add loans.length to progress (Basket page: true)
	 * @returns {Object} { totalProgress, hasContributingLoans } - Progress count and whether loans contributed
	 *
	 * Use cases:
	 * - ATB Modal: { loans, increment: true } - increments counter per add-to-basket action
	 * - Basket Page: { loans, addBasketLoans: true } - adds basket loan count
	 * - Thanks Page: { loans, year } - returns goalProgress (loans already in totalLoanCount)
	 */
	async function getPostCheckoutProgressByLoans({
		loans = [],
		year = null,
		increment = false,
		addBasketLoans = false,
	} = {}) {
		// For ID_SUPPORT_ALL, use in-page counter logic instead of API query
		// goalProgress already accounts for loanTotalAtStart
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			if (increment) {
				// ATB modal: increment by 1 per add-to-basket action
				goalCurrentLoanCount.value += 1;
				return {
					totalProgress: goalProgress.value + goalCurrentLoanCount.value,
					hasContributingLoans: true,
				};
			}
			if (addBasketLoans) {
				// Basket page: add basket loan count (loans not yet in totalLoanCount)
				return {
					totalProgress: goalProgress.value + loans.length,
					hasContributingLoans: loans.length > 0,
				};
			}
			// Thanks page: any loan counts towards support-all goal
			return {
				totalProgress: goalProgress.value,
				hasContributingLoans: loans.length > 0,
			};
		}
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apolloClient.query({
				query: useGoalDataProgressQuery,
				variables: { loanIds, year },
			});
			// Use allTimeProgress when year is null/undefined, otherwise use yearlyProgress
			const progress = year
				? response.data?.postCheckoutAchievements?.yearlyProgress || []
				: response.data?.postCheckoutAchievements?.allTimeProgress || [];
			const categoryProgress = progress.find(
				entry => entry.achievementId === userGoal.value?.category
			);
			const totalProgress = categoryProgress?.totalProgress || 0;
			// Get contributingLoanIds from overallProgress (different type than allTimeProgress/yearlyProgress)
			const overallProgress = response.data?.postCheckoutAchievements?.overallProgress || [];
			const overallCategoryProgress = overallProgress.find(
				entry => entry.achievementId === userGoal.value?.category
			);
			const contributingLoanIds = overallCategoryProgress?.contributingLoanIds || [];
			// contributingLoanIds from GraphQL are strings, loanIds are numbers - convert for comparison
			const hasContributingLoans = loanIds.some(id => contributingLoanIds.includes(String(id)));
			// When using all-time progress, subtract loanTotalAtStart to get progress since goal was set
			if (!year) {
				const loanTotalAtStart = userGoal.value?.loanTotalAtStart || 0;
				return {
					totalProgress: Math.max(0, totalProgress - loanTotalAtStart),
					hasContributingLoans,
				};
			}
			return { totalProgress, hasContributingLoans };
		} catch (error) {
			logFormatter(error, 'Failed to get post-checkout progress');
			return { totalProgress: null, hasContributingLoans: false };
		}
	}

	/**
	 * Remove goal from user preferences
	 * @param {Object} goal - Goal object to remove (identified by goalName)
	 */
	const removeGoalFromPreferences = async goal => {
		// Load preferences to ensure that goals information is up to date before modifying it
		// preventing the use case where a user updates a goal,
		// then quickly removes it before the update is reflected in the cache.
		await loadPreferences('network-only');
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		let goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === goal.goalName);

		if (goalIndex !== -1) {
			// Given the goal index remove the entry from the array
			goals = goals.filter((_, index) => index !== goalIndex);
		}

		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ goals, hideGoalCard: false } // Reset goal card visibility when removing goal
		);
	};

	/**
	 * Patch previous goal with update goal and store
	 * @param {Object} previousGoal - Previous goal data to identify which goal to remove
	 * @param {Object} updatedGoal - Updated goal data to replace the previous goal with
	 */
	async function updateCurrentGoal(previousGoal, updatedGoal) {
		loading.value = true;
		// Load preferences to ensure goals information is up to date before modiying it
		// preventing the use case where the previous goal was not updated in the cache
		await loadPreferences('network-only');
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === previousGoal.goalName);
		if (goalIndex !== -1) {
			goals[goalIndex] = { ...updatedGoal };
		}

		// If the updated category is support-all, we need to load the latest yearly loan count to set accurate progress
		if (updatedGoal?.category === ID_SUPPORT_ALL) {
			const stats = await getLoanStatsByYear(GOALS_CURRENT_YEAR, 'network-only');
			yearlyLoanCount.value = stats?.count || 0;
		}

		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ goals }
		);
		loading.value = false;

		setGoalState({ goals }); // Refresh local state after update
	}

	/**
	 * Authoritative current-year progress for a goal category, using the raw achievement-service
	 * data only (no client-side fresh-progress adjustments). Used to verify a goal is genuinely
	 * complete before persisting a completed status, so neither the post-checkout projection nor
	 * the fresh-progress adjustment can mark a goal complete the achievement service doesn't yet
	 * reflect. Support-all uses the yearly loan count, which is already authoritative.
	 * @param {string} category - Goal category id
	 * @returns {number} Raw current-year progress for the category
	 */
	function getVerifiedYearProgress(category) {
		if (category === ID_SUPPORT_ALL) {
			return yearlyLoanCount.value || 0;
		}
		const categoryProgress = rawCurrentYearProgress.value?.find(n => n.id === category);
		return categoryProgress?.progressForYear || 0;
	}

	/**
	 * Store goal preferences to backend
	 * @param {Object} updates - Goal data to store
	 * @param {boolean} updateLocalState - Whether to update local userGoal state (default: true)
	 *   Set to false when you want to delay the UI update (e.g., until modal closes)
	 */
	async function storeGoalPreferences(updates, updateLocalState = true) {
		if (!userPreferences.value?.id) {
			await createUserPreferences(apolloClient, { goals: [] });
			await loadPreferences('network-only'); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		let goalToStore;
		if (goalIndex !== -1) {
			goals[goalIndex] = { ...goals[goalIndex], ...updates };
			goalToStore = goals[goalIndex];
		} else {
			// When creating a new goal, set loanTotalAtStart to current all-time progress for the category
			// This allows tracking progress from the point the goal was set
			// For ID_SUPPORT_ALL, use totalLoanCount since it tracks total loans, not category-specific progress
			let loanTotalAtStart;
			if (updates.category === ID_SUPPORT_ALL) {
				// When setting a new goal in Thanks page, we don't have a userGoal object
				// so we have not loaded support-all loan count on loadGoalData.
				// We need to get the total loan count in this step.
				if (!userGoal.value?.category) {
					yearlyLoanCount.value = await getSupportAllLoanCountByYear(GOALS_CURRENT_YEAR, 'network-only');
				}
				loanTotalAtStart = totalLoanCount.value || 0;
			} else {
				const categoryProgress = currentYearProgress.value?.find(n => n.id === updates.category);
				loanTotalAtStart = categoryProgress?.totalProgressToAchievement || 0;
			}
			goalToStore = { ...updates, loanTotalAtStart };
			goals.push(goalToStore);
		}
		// Write-boundary guard: this is the single point through which every goal-status write
		// reaches the backend, which syncs to Iterable and fires the goal-complete email.
		// Never persist a completed status unless authoritative achievement progress confirms the
		// target was reached, so no caller can mark a goal complete one loan short.
		if (goalToStore.status === GOAL_STATUS.COMPLETED) {
			const verifiedProgress = getVerifiedYearProgress(goalToStore.category);
			if (verifiedProgress < goalToStore.target) {
				logFormatter('Prevented persisting completed goal below target', 'warn', {
					category: goalToStore.category,
					target: goalToStore.target,
					verifiedProgress,
				});
				goalToStore.status = GOAL_STATUS.IN_PROGRESS;
			}
		}
		await setMyKivaGoal(apolloClient, {
			category: goalToStore.category,
			target: goalToStore.target,
			dateStarted: goalToStore.dateStarted,
			status: goalToStore.status,
		});
		if (updateLocalState) {
			setGoalState({ goals }); // Refresh local state after update
		}
	}

	const hideGoalCard = computed(() => {
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		return parsedPrefs.hideGoalCard || false;
	});

	async function setHideGoalCardPreference(hide = true) {
		const parsedPrefs = await loadPreferences('network-only');
		const updatedPreference = { hideGoalCard: hide };
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			updatedPreference
		);
		// Persist only; do not copy the hidden preference into local state.
		// MyKiva renders the completed card once, then hides it on the next page load.
	}

	const viewedGoalCompleteByYear = computed(() => {
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		return parsedPrefs.viewedGoalComplete || {};
	});

	function hasViewedCompletedGoalForYear(year) {
		return Boolean(viewedGoalCompleteByYear.value?.[year]);
	}

	/**
	 * Drives the basket / ATB-modal achievement nudges so they stay out of the
	 * way while a goal is in progress and resume as soon as the goal is
	 * completed (or the lender has no goal at all).
	 */
	const suppressAchievementNudges = computed(() => (
		userGoal.value?.status === GOAL_STATUS.IN_PROGRESS
	));

	async function setViewedGoalCompletePreference(year = GOALS_CURRENT_YEAR) {
		if (!year) return;
		const parsedPrefs = await loadPreferences('network-only');
		const prev = parsedPrefs?.viewedGoalComplete || {};
		// Year-keyed flag so next year's celebration is not suppressed by a prior year's view.
		if (prev[year]) return;
		const updatedPreference = { viewedGoalComplete: { ...prev, [year]: true } };
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			updatedPreference
		);
	}

	async function checkCompletedGoal({
		currentGoalProgress = 0,
		category = 'post-checkout',
		eventLabel = 'annual-goal-complete',
		persistHideGoalCard = false,
	} = {}) {
		const goal = userGoal.value;
		if (!goal || goal.status === GOAL_STATUS.EXPIRED) {
			return;
		}

		// Optimistic progress (e.g. the post-checkout projection passed by the Thanks page)
		// drives the in-session celebration UX. It can include just-purchased loans that the
		// achievement service has not yet — or may never — attribute to the goal category.
		const progress = currentGoalProgress || goalProgress.value;
		const isGoalComplete = progress >= goal.target;
		// Raw achievement-service progress gates what we persist. The persisted status is what
		// syncs to Iterable and fires the goal-complete email, so we must never write "completed"
		// unless the achievement service confirms the target was reached — independent of the
		// post-checkout projection (Thanks page) or the fresh-progress adjustment (MyKiva page),
		// both of which were marking goals complete one loan short.
		const isVerifiedComplete = getVerifiedYearProgress(goal.category) >= goal.target;

		if (goal.status === GOAL_STATUS.COMPLETED) {
			if (persistHideGoalCard && isGoalComplete && !hideGoalCard.value) {
				await setHideGoalCardPreference();
			}
			return;
		}

		if (isGoalComplete) {
			// Capture goal data before storeGoalPreferences (which may filter out the goal via setGoalState)
			const goalCategory = goal.category;
			const goalTarget = goal.target;
			// Only persist the completed status when authoritative progress confirms it.
			// When the projection is ahead of the achievement service (indexing lag), the goal
			// is left in-progress and completed for real on a later load once progress catches up.
			if (isVerifiedComplete) {
				userGoal.value = {
					...goal,
					status: GOAL_STATUS.COMPLETED
				};
				await storeGoalPreferences({ ...userGoal.value });
				if (persistHideGoalCard) {
					await setHideGoalCardPreference();
				}
			}
			$kvTrackEvent(
				category,
				'show',
				eventLabel,
				goalCategory,
				goalTarget
			);
			userGoalAchievedNow.value = true;
		}
	}

	/**
	 * Check and correct negative goal progress
	 * This could happen due to a race condition with postCheckoutAchievements
	 */
	async function correctNegativeProgress() {
		if (!userGoal.value || !currentYearProgress?.value?.length) return;

		const goal = userGoal.value;
		if (goal.category === ID_SUPPORT_ALL) return;

		const categoryProgress = currentYearProgress.value?.find(n => n.id === goal.category);
		const allTimeProgress = categoryProgress?.totalProgressToAchievement || 0;
		const loanTotalAtStart = goal.loanTotalAtStart || 0;
		const adjustedProgress = allTimeProgress - loanTotalAtStart;

		if (adjustedProgress < 0) {
			const debugData = {
				category: goal.category,
				goalName: goal.goalName,
				allTimeProgress,
				loanTotalAtStart,
				adjustedProgress,
				target: goal.target,
			};

			logFormatter('Negative goal progress detected, correcting loanTotalAtStart', 'warn', debugData);

			// Correct the goal by updating loanTotalAtStart to allTimeProgress
			await storeGoalPreferences({
				...goal,
				loanTotalAtStart: allTimeProgress,
			});
		}
	}

	// Fills loansTowardGoal for expired prior-year goals that predate the field.
	// Only persist when there's actual progress to surface — zero-progress goals
	// are already hidden by the completedGoalsHistory filter.
	async function backfillExpiredGoalProgress(parsedPrefs) {
		const goals = parsedPrefs?.goals || [];
		const missing = goals
			.map((g, i) => ({ g, i }))
			.filter(({ g }) => (
				g.status === GOAL_STATUS.EXPIRED
				&& g.dateStarted
				&& new Date(g.dateStarted).getFullYear() < GOALS_CURRENT_YEAR
				&& g.loansTowardGoal === undefined
			));
		if (!missing.length) return;

		const resolved = await Promise.all(missing.map(async ({ g, i }) => {
			const goalYear = new Date(g.dateStarted).getFullYear();
			const loansTowardGoal = await getCategoryLoanCountByYear(g.category, goalYear);
			return { i, loansTowardGoal: loansTowardGoal || 0 };
		}));

		const withProgress = resolved.filter(r => r.loansTowardGoal > 0);
		if (!withProgress.length) return;

		const patched = [...goals];
		withProgress.forEach(({ i, loansTowardGoal }) => {
			patched[i] = { ...patched[i], loansTowardGoal };
		});

		userPreferences.value = {
			...userPreferences.value,
			preferences: JSON.stringify({ ...parsedPrefs, goals: patched }),
		};
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ goals: patched },
		);
	}

	async function loadGoalData({
		freshProgressLoans = [], // Loans used to reconcile missing achievement progress (e.g. recent transactions)
		supportAllCounterLoans = [], // Loans used to initialize in-page support-all counter state
		year = new Date().getFullYear(),
		tieredAchievements = [], // Tiered achievements from achievement service to calculate fresh progress
		transactions = [], // User transactions to get purchase dates for year filtering
		fetchPolicy = 'cache-first', // Apollo fetch policy for loading preferences
		checkMyKivaCompletedGoalAfterLoad = false, // Flag to check if completed goal should be checked after load
	} = {}) {
		loading.value = true;
		const parsedPrefs = await loadPreferences(fetchPolicy);
		await backfillExpiredGoalProgress(parsedPrefs);

		// Calculate fresh progress adjustments if loans and achievements provided
		let freshProgressAdjustments = { allTime: {}, yearSpecific: {} };
		if (freshProgressLoans?.length && tieredAchievements?.length) {
			freshProgressAdjustments = calculateGoalFreshProgressAdjustments(
				freshProgressLoans,
				tieredAchievements,
				year,
				transactions
			);
		}

		await loadProgress(year, freshProgressAdjustments);
		setGoalState(parsedPrefs);
		// Load yearly loan count for ID_SUPPORT_ALL goals to set initial progress state accurately
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			const stats = await getLoanStatsByYear(year, 'network-only');
			yearlyLoanCount.value = stats?.count || 0;
		}
		// ATB-only: initialize support-all in-page counter from current basket loans.
		if (
			userGoal.value?.category === ID_SUPPORT_ALL
			&& supportAllCounterLoans.length > 0
			&& !goalCurrentLoanCount.value
		) {
			// ATB flow calls getPostCheckoutProgressByLoans({ increment: true }) right after this
			// Initialize to basketSize - 1 so that increment lands at basketSize (no +1 overcount)
			goalCurrentLoanCount.value = supportAllCounterLoans.length - 1;
		}
		// Check and correct negative progress after loading
		await correctNegativeProgress();
		if (checkMyKivaCompletedGoalAfterLoad) {
			await checkCompletedGoal({
				category: 'portfolio',
				eventLabel: 'autolending-annual-goal-complete',
				persistHideGoalCard: true,
			});
		}
		loading.value = false;
	}

	/**
	 * Annual goal renewal — runs once per calendar year on the lender's first
	 * MyKiva visit. Prior-year in-progress goals are expired (and their final
	 * loan count toward the goal is captured so the impact-progress row can
	 * decide whether to surface them). Prior-year completed goals keep their
	 * COMPLETED status so they continue to appear in the row across years.
	 */
	async function renewAnnualGoal(today = new Date()) {
		const parsedPrefs = await loadPreferences();
		const goals = parsedPrefs.goals || [];
		const currentYear = today.getFullYear();
		const renewedYear = parsedPrefs.goalsRenewedDate ? new Date(parsedPrefs.goalsRenewedDate).getFullYear() : null;
		const areGoalsRenewed = goals.some(goal => goal.status === GOAL_STATUS.EXPIRED);

		if (renewedYear > currentYear || areGoalsRenewed) {
			return {
				expiredGoals: [],
				showRenewedAnnualGoalToast: false,
			};
		}

		const hadCompletedGoal = goals.some(g => {
			const goalYear = g.dateStarted ? new Date(g.dateStarted).getFullYear() : null;
			return goalYear < currentYear && g.status === GOAL_STATUS.COMPLETED;
		});

		const expiredGoals = await Promise.all(
			goals
				.filter(g => {
					const goalYear = g.dateStarted ? new Date(g.dateStarted).getFullYear() : null;
					return goalYear !== null
						&& goalYear < currentYear
						&& g.status !== GOAL_STATUS.COMPLETED;
				})
				.map(async goal => {
					const goalYear = new Date(goal.dateStarted).getFullYear();
					const loansTowardGoal = await getCategoryLoanCountByYear(goal.category, goalYear);
					return {
						...goal,
						status: GOAL_STATUS.EXPIRED,
						loansTowardGoal: loansTowardGoal || 0,
					};
				}),
		);
		const renewedGoals = goals.map(g => expiredGoals.find(e => e.goalName === g.goalName) ?? g);

		if (expiredGoals.length > 0) {
			const firstExpired = expiredGoals[0];
			await setMyKivaGoal(apolloClient, {
				category: firstExpired.category,
				target: firstExpired.target,
				dateStarted: firstExpired.dateStarted,
				status: firstExpired.status,
			});
			const fresh = await loadPreferences('network-only');
			await updateUserPreferences(
				apolloClient,
				userPreferences.value,
				fresh,
				{ goals: renewedGoals, goalsRenewedDate: today.toISOString() },
			);
			setGoalState({ goals: renewedGoals });
		}

		const showRenewedAnnualGoalToast = !!expiredGoals.length && !hadCompletedGoal;

		return {
			expiredGoals,
			showRenewedAnnualGoalToast,
		};
	}

	/**
	 * Fix goals incorrectly marked as completed or hidden due to progress-related bugs.
	 * Checks current year goals and resets status to in-progress and unhides the goal card
	 * if the actual yearly progress doesn't meet the target. Accepts fresh progress data
	 * to compensate for achievement service indexing lag, preventing false reverts of
	 * legitimately completed goals.
	 *
	 * @param {Object} options - Configuration options
	 * @param {Array} options.freshProgressLoans - Recent transaction loans for reconciling missing achievement progress
	 * @param {Array} options.tieredAchievements - Tiered achievements from achievement service for fresh progress calc
	 * @param {Array} options.transactions - User transactions for purchase date filtering
	 * @returns {Promise<{wasFixed: boolean}>} Whether a goal was fixed
	 */
	async function fixIncorrectlyCompletedGoals({
		freshProgressLoans = [],
		tieredAchievements = [],
		transactions = [],
	} = {}) {
		const parsedPrefs = await loadPreferences('network-only');
		const goals = parsedPrefs.goals || [];
		const currentYear = new Date().getFullYear();

		const isGoalCardHidden = parsedPrefs.hideGoalCard || false;

		// Find current year goal that is completed or hidden
		const goalToFix = goals.find(goal => {
			if (goal.status !== GOAL_STATUS.COMPLETED && !isGoalCardHidden) return false;
			const goalYear = goal.dateStarted ? new Date(goal.dateStarted).getFullYear() : null;
			return goalYear === currentYear;
		});

		if (!goalToFix) {
			return { wasFixed: false };
		}

		// Get actual yearly progress based on goal category
		let actualYearlyProgress;
		if (goalToFix.category === ID_SUPPORT_ALL) {
			const stats = await getLoanStatsByYear(currentYear, 'network-only');
			actualYearlyProgress = stats?.count || 0;
		} else {
			// Calculate fresh progress adjustments to account for achievement service kafka lag
			let freshProgressAdjustments = { allTime: {}, yearSpecific: {} };
			if (freshProgressLoans?.length && tieredAchievements?.length) {
				freshProgressAdjustments = calculateGoalFreshProgressAdjustments(
					freshProgressLoans,
					tieredAchievements,
					currentYear,
					transactions
				);
			}
			// Use loadProgress to populate currentYearProgress so goalProgress computed has data immediately
			await loadProgress(currentYear, freshProgressAdjustments);
			const categoryProgress = currentYearProgress.value?.find(n => n.id === goalToFix.category);
			actualYearlyProgress = categoryProgress?.progressForYear || 0;
		}

		// Check if goal is actually complete
		if (actualYearlyProgress >= goalToFix.target) {
			// Goal is legitimately complete
			return { wasFixed: false };
		}

		// For ID_SUPPORT_ALL, store the yearly loan count so goalProgress has data
		if (goalToFix.category === ID_SUPPORT_ALL) {
			yearlyLoanCount.value = actualYearlyProgress;
		}

		// Fix: reset status to in-progress and unhide goal card
		const updatedGoals = goals.map(goal => {
			if (goal.goalName === goalToFix.goalName) {
				return {
					...goal,
					status: GOAL_STATUS.IN_PROGRESS
				};
			}
			return goal;
		});

		const fixedGoal = updatedGoals.find(g => g.goalName === goalToFix.goalName);
		await setMyKivaGoal(apolloClient, {
			category: fixedGoal.category,
			target: fixedGoal.target,
			dateStarted: fixedGoal.dateStarted,
			status: fixedGoal.status,
		});
		setGoalState({ goals: updatedGoals });

		return { wasFixed: true };
	}

	const goalProgressPercentage = computed(() => {
		const target = Number(userGoal?.value?.target);
		if (!target || Number.isNaN(target) || goalProgress.value <= 0) return 0;
		return Math.min(
			Math.round((goalProgress.value / target) * 100),
			COMPLETED_GOAL_THRESHOLD
		);
	});

	/**
	 * Get recommended loans for a given goal category ID
	 * @param {*} categoryId - Category ID to get recommendations for
	 * @param {number[]} [filteredLoanIds=[]] - Loan ids to exclude (`loanIds.none` in FLSS filter)
	 * @returns array of recommended loans for the category
	 */
	const getRecommendedLoans = async (categoryId, filteredLoanIds = []) => {
		const flssFilter = FLSS_FILTERS_BY_GOAL?.[categoryId];
		const filterObject = {
			...flssFilter,
			...(filteredLoanIds.length > 0 ? { loanIds: { none: filteredLoanIds } } : {}),
			amountLeft: { range: { gte: MIN_CATEGORY_LOANS_AMOUNT } },
			pageLimit: RECOMMENDED_LOANS_LIMIT,
			sortBy: 'personalized',
		};

		const result = await runLoansQuery(apolloClient, filterObject, FLSS_ORIGIN_GOAL_RECOMMENDED_LOAN);
		return result?.loans || [];
	};

	return {
		applyFreshProgressToGoalData,
		calculateGoalFreshProgressAdjustments,
		checkCompletedGoal,
		getCategories,
		getCategoriesProgressByYear,
		getCategoryLoanCountByYear,
		getCategoryLoansLastYear,
		getCtaHref,
		getGoalDisplayName,
		getGoalSummary,
		getLoanStatsByYear,
		getPostCheckoutProgressByLoans,
		goalProgress,
		goalProgressPercentage,
		isProgressCompletingGoal,
		loadGoalData,
		loadPreferences,
		loading,
		storeGoalPreferences,
		userGoal,
		userGoalAchieved,
		userGoalAchievedNow,
		suppressAchievementNudges,
		userPreferences,
		completedGoalsHistory,
		// Goal Entry for 2026 Goals
		fixIncorrectlyCompletedGoals,
		renewAnnualGoal,
		hideGoalCard,
		setHideGoalCardPreference,
		viewedGoalCompleteByYear,
		hasViewedCompletedGoalForYear,
		setViewedGoalCompletePreference,
		getSupportAllLoanCountByYear,
		setGoalState,
		removeGoalFromPreferences,
		updateCurrentGoal,
		getRecommendedLoans,
	};
}
