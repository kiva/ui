import {
	computed,
	inject,
	ref,
} from 'vue';

import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
import useGoalDataProgressQuery from '#src/graphql/query/useGoalDataProgress.graphql';
import useGoalDataYearlyProgressQuery from '#src/graphql/query/useGoalDataYearlyProgress.graphql';
import logFormatter from '#src/util/logFormatter';
import { createUserPreferences, updateUserPreferences } from '#src/util/userPreferenceUtils';

import useBadgeData, {
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
	[ID_CLIMATE_ACTION]: 'eco-friendly loans',
	[ID_REFUGEE_EQUALITY]: 'refugees',
	[ID_SUPPORT_ALL]: 'loans',
	[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
	[ID_WOMENS_EQUALITY]: 'women',
};

const GOAL_1_DISPLAY_MAP = {
	[ID_BASIC_NEEDS]: 'basic needs loan',
	[ID_CLIMATE_ACTION]: 'eco-friendly loan',
	[ID_REFUGEE_EQUALITY]: 'refugee',
	[ID_SUPPORT_ALL]: 'loan',
	[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneur',
	[ID_WOMENS_EQUALITY]: 'woman',
};

export const GOAL_STATUS = {
	COMPLETED: 'completed',
	EXPIRED: 'expired',
	IN_PROGRESS: 'in-progress',
};

export const SAME_AS_LAST_YEAR_LIMIT = 1;
export const LAST_YEAR_KEY = 2025;
export const GOALS_V2_START_YEAR = 2026;

/**
 * Check if Goals V2 should be enabled based on the flag or current year
 * Goals V2 is enabled if the flag is true OR the year is 2026 or later
 * @param {boolean} flagEnabled - The thankyou_page_goals_enable flag value
 * @returns {boolean} True if Goals V2 should be enabled
 */
export function isGoalsV2Enabled(flagEnabled) {
	const currentYear = new Date().getFullYear();
	return flagEnabled || currentYear >= GOALS_V2_START_YEAR;
}

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
	const goalCurrentLoanCount = ref(0); // In-page counter for tracking loans added to basket
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const userGoal = ref(null);
	const userGoalAchievedNow = ref(false);
	const userPreferences = ref(null);
	const useYearlyProgress = ref(false); // Default to all-time progress (flag disabled behavior)

	// --- Computed Properties ---

	const goalProgress = computed(() => {
		const goal = userGoal.value;
		const progress = currentYearProgress.value;
		// When flag is enabled (useYearlyProgress = true), use yearly progress
		// When flag is disabled (useYearlyProgress = false), use all-time progress minus loanTotalAtStart
		if (goal?.category === ID_SUPPORT_ALL) {
			if (useYearlyProgress.value) {
				return totalLoanCount.value || 0;
			}
			const loanTotalAtStart = goal?.loanTotalAtStart || 0;
			return Math.max(0, (totalLoanCount.value || 0) - loanTotalAtStart);
		}
		const categoryProgress = progress.find(n => n.id === goal?.category);
		if (useYearlyProgress.value) {
			return categoryProgress?.progressForYear || 0;
		}
		const allTimeProgress = categoryProgress?.totalProgressToAchievement || 0;
		const loanTotalAtStart = goal?.loanTotalAtStart || 0;
		return Math.max(0, allTimeProgress - loanTotalAtStart);
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
		// Check if progress > 0 and meets or exceeds target (completing the goal)
		return currentProgress > 0 && currentProgress >= target;
	}

	// --- Functions ---

	function setGoalState(parsedPrefs) {
		if (!parsedPrefs) return;
		const goals = parsedPrefs.goals || [];
		const activeGoals = goals.filter(g => g.status !== GOAL_STATUS.EXPIRED);
		userGoal.value = { ...activeGoals[0] };
	}

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
				name: 'Refugees',
				description: 'Transform the future for refugees',
				eventProp: 'refugees',
				customImage: refugeesImg,
				loanCount: categoriesLoanCount?.[ID_REFUGEE_EQUALITY],
				title: 'refugees',
				badgeId: ID_REFUGEE_EQUALITY,
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
				name: 'U.S. Entrepreneurs',
				description: 'Support small businesses in the U.S.',
				eventProp: 'us-entrepreneur',
				customImage: usEntrepreneursImg,
				loanCount: categoriesLoanCount?.[ID_US_ECONOMIC_EQUALITY],
				title: 'US entrepreneurs',
				badgeId: ID_US_ECONOMIC_EQUALITY,
			},
			{
				id: '5',
				name: 'Basic Needs',
				description: 'Clean water, healthcare, and sanitation',
				eventProp: 'basic-needs',
				customImage: basicNeedsImg,
				loanCount: categoriesLoanCount?.[ID_BASIC_NEEDS],
				title: 'basic needs',
				badgeId: ID_BASIC_NEEDS,
			},
			{
				id: '6',
				name: 'Choose as I go',
				description: 'Support a variety of borrowers',
				eventProp: 'help-everyone',
				customImage: supportAllImg,
				loanCount: totalLoans,
				title: null,
				badgeId: ID_SUPPORT_ALL,
			}
		];
	}

	/**
	 * Generate CTA Href for Goal Completion
	 * @param {*} selectedGoalNumber goal number selected by the user
	 * @param {*} categoryId category id selected by the user
	 * @param {*} router router instance
	 * @returns href string
	 */
	function getCtaHref(selectedGoalNumber, categoryId, router) {
		const { getLoanFindingUrl } = useBadgeData();
		const categoryHeader = getGoalDisplayName(selectedGoalNumber, categoryId);
		const string = `Your goal: Support ${selectedGoalNumber} ${categoryHeader}`;
		const encodedHeader = encodeURIComponent(string);
		const loanFindingUrl = getLoanFindingUrl(categoryId, router.currentRoute.value);
		return `${loanFindingUrl}?header=${encodedHeader}`;
	}

	/**
	 * Get the number of loans from last year by the given category ID
	 */
	function getCategoryLoansLastYear(tieredAchievements, categoryId = ID_WOMENS_EQUALITY) {
		const categoryAchievement = tieredAchievements?.find(entry => entry.id === categoryId);
		return categoryAchievement?.progressForYear || 0;
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

	async function loadProgress(year) {
		try {
			const response = await apolloClient.query({
				query: useGoalDataYearlyProgressQuery,
				variables: { year },
				fetchPolicy: 'network-only'
			});
			const progress = response.data.userAchievementProgress.tieredLendingAchievements;
			currentYearProgress.value = progress;
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
	 * @returns {number} Progress count for the user's goal category
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
				return goalProgress.value + goalCurrentLoanCount.value;
			}
			if (addBasketLoans) {
				// Basket page: add basket loan count (loans not yet in totalLoanCount)
				return goalProgress.value + loans.length;
			}
			// Thanks page: just return goalProgress (loans already in totalLoanCount after checkout)
			return goalProgress.value;
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
			const totalProgress = progress.find(
				entry => entry.achievementId === userGoal.value?.category
			)?.totalProgress || 0;
			// When using all-time progress, subtract loanTotalAtStart to get progress since goal was set
			if (!year) {
				const loanTotalAtStart = userGoal.value?.loanTotalAtStart || 0;
				return Math.max(0, totalProgress - loanTotalAtStart);
			}
			return totalProgress;
		} catch (error) {
			logFormatter(error, 'Failed to get post-checkout progress');
			return null;
		}
	}

	async function storeGoalPreferences(updates) {
		if (!userPreferences.value?.id) {
			await createUserPreferences(apolloClient, { goals: [] });
			await loadPreferences('network-only'); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		if (goalIndex !== -1) {
			goals[goalIndex] = { ...goals[goalIndex], ...updates };
		} else {
			// When creating a new goal, set loanTotalAtStart to current all-time progress for the category
			// This allows tracking progress from the point the goal was set
			// For ID_SUPPORT_ALL, use totalLoanCount since it tracks total loans, not category-specific progress
			let loanTotalAtStart;
			if (updates.category === ID_SUPPORT_ALL) {
				loanTotalAtStart = totalLoanCount.value || 0;
			} else {
				const categoryProgress = currentYearProgress.value.find(n => n.id === updates.category);
				loanTotalAtStart = categoryProgress?.totalProgressToAchievement || 0;
			}
			goals.push({ ...updates, loanTotalAtStart });
		}
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ goals }
		);
		setGoalState({ goals }); // Refresh local state after update
	}

	async function checkCompletedGoal({ currentGoalProgress = 0, category = 'post-checkout' } = {}) {
		// Skip if goal is already completed or expired
		if ([GOAL_STATUS.COMPLETED, GOAL_STATUS.EXPIRED].includes(userGoal.value?.status)) {
			return;
		}
		if (
			(currentGoalProgress && (currentGoalProgress >= userGoal.value?.target))
			|| (userGoal.value && userGoalAchieved.value)
		) {
			userGoal.value = {
				...userGoal.value,
				status: GOAL_STATUS.COMPLETED
			};
			await storeGoalPreferences({ ...userGoal.value });
			$kvTrackEvent(
				category,
				'show',
				'annual-goal-complete',
				userGoal.value.category,
				userGoal.value.target
			);
			userGoalAchievedNow.value = true;
		}
	}

	/**
	 * Check and correct negative goal progress
	 * This could happen due to a race condition with postCheckoutAchievements
	 * Only applies when yearlyProgress is false (all-time progress mode)
	 */
	async function correctNegativeProgress() {
		if (useYearlyProgress.value || !userGoal.value) return;

		const goal = userGoal.value;
		if (goal.category === ID_SUPPORT_ALL) return;

		const categoryProgress = currentYearProgress.value.find(n => n.id === goal.category);
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

	async function loadGoalData({
		loans = [], // Loans already in basket, used to initialize in-page counter for ID_SUPPORT_ALL
		year = new Date().getFullYear(),
		yearlyProgress = false, // thankyou_page_goals_enable flag - when true uses yearly, when false uses all-time
	} = {}) {
		loading.value = true;
		useYearlyProgress.value = yearlyProgress;
		const parsedPrefs = await loadPreferences();
		await loadProgress(year);
		setGoalState(parsedPrefs);
		// Initialize in-page counter for ID_SUPPORT_ALL based on loans already in basket
		if (userGoal.value?.category === ID_SUPPORT_ALL && loans.length > 0 && !goalCurrentLoanCount.value) {
			// Reducing counter by 1 because loans already has the added loan
			goalCurrentLoanCount.value = loans.length - 1;
		}
		// Check and correct negative progress after loading
		await correctNegativeProgress();
		loading.value = false;
	}

	/**
	 * This method renew goals annually.
	 * It invalidates all goals on Jan 1st of 2026
	 * @return {Array} - expiredGoals
	 */
	async function renewAnnualGoal(today = new Date()) {
		const parsedPrefs = await loadPreferences();
		const goals = parsedPrefs.goals || [];
		const currentYear = today.getFullYear();
		const renewedYear = parsedPrefs.goalsRenewedDate ? new Date(parsedPrefs.goalsRenewedDate).getFullYear() : null;
		const areGoalsRenewed = goals.some(goal => goal.status === GOAL_STATUS.EXPIRED);
		if (renewedYear > currentYear || areGoalsRenewed) {
			return {
				expiredGoals: goals,
				showRenewedAnnualGoalToast: false,
			};
		}

		// Renew goals every following year
		const expiredGoals = goals.map(goal => {
			const goalYear = goal.dateStarted ? new Date(goal.dateStarted).getFullYear() : null;
			if (goalYear < currentYear) {
				return {
					...goal,
					status: GOAL_STATUS.EXPIRED
				};
			}
			return null;
		}).filter(goal => goal !== null);

		if (expiredGoals.some(goal => goal.status === GOAL_STATUS.EXPIRED)) {
			parsedPrefs.goals = expiredGoals;
			parsedPrefs.goalsRenewedDate = today.toISOString();
			await updateUserPreferences(
				apolloClient,
				userPreferences.value,
				parsedPrefs,
				{ goals: expiredGoals }
			);
			setGoalState({ goals: expiredGoals });
		}

		const showRenewedAnnualGoalToast = !!expiredGoals.length
			&& !expiredGoals.some(g => g.status === GOAL_STATUS.COMPLETED);

		return {
			expiredGoals,
			showRenewedAnnualGoalToast,
		};
	}

	async function setHideGoalCardPreference() {
		const parsedPrefs = await loadPreferences();
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ hideGoalCard: true }
		);
	}

	function hideGoalCard() {
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		return parsedPrefs.hideGoalCard || false;
	}

	return {
		checkCompletedGoal,
		getCategories,
		getCategoryLoansLastYear,
		getCtaHref,
		isProgressCompletingGoal,
		getGoalDisplayName,
		getPostCheckoutProgressByLoans,
		goalProgress,
		loadGoalData,
		loading,
		storeGoalPreferences,
		userGoal,
		userGoalAchieved,
		userGoalAchievedNow,
		userPreferences,
		// Goal Entry for 2026 Goals
		renewAnnualGoal,
		hideGoalCard,
		setHideGoalCardPreference,
	};
}
