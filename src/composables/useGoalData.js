import {
	computed,
	inject,
	ref,
} from 'vue';

import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
import useGoalDataProgressQuery from '#src/graphql/query/useGoalDataProgress.graphql';
import userAchievementProgressAllTimeQuery from '#src/graphql/query/userAchievementProgressAllTime.graphql';
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
export default function useGoalData({ apollo }) {
	const $kvTrackEvent = inject('$kvTrackEvent');

	const allTimeProgress = ref([]);
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const userGoal = ref(null);
	const userPreferences = ref(null);
	const userGoalAchievedNow = ref(false);
	const goalCurrentLoanCount = ref(0); // Tracks loans toward "Support All" goal

	async function loadPreferences(fetchPolicy = 'cache-first') {
		try {
			const response = await apollo.query({ query: useGoalDataQuery, fetchPolicy });
			const prefsData = response.data?.my?.userPreferences || null;
			totalLoanCount.value = response.data?.my?.loans?.totalCount || 0;
			userPreferences.value = prefsData;
			return prefsData ? JSON.parse(prefsData.preferences || '{}') : {};
		} catch (error) {
			logFormatter(error, 'Failed to load preferences');
			return null;
		}
	}

	async function loadProgress(loans = undefined) {
		try {
			if (loans?.length) {
				// Use postCheckoutAchievements with specific loans (e.g., from a checkout receipt)
				const loanIds = loans.map(loan => loan.id);
				const response = await apollo.query({
					query: useGoalDataProgressQuery,
					variables: { loanIds },
				});
				return response?.data?.postCheckoutAchievements?.allTimeProgress || [];
			}

			// Use userAchievementProgress to get current user's all-time progress
			const response = await apollo.query({
				query: userAchievementProgressAllTimeQuery,
				variables: { publicId: null }, // null means use the current user's JWT
			});

			// Transform userAchievementProgress data to match the allTimeProgress format
			const achievements = response?.data?.userAchievementProgress?.tieredLendingAchievements || [];
			return achievements.map(achievement => {
				const currentTier = achievement.tiers?.findIndex(tier => !tier.completedDate)
					?? achievement.tiers?.length ?? 0;
				return {
					achievementId: achievement.id,
					totalProgress: achievement.totalProgressToAchievement || 0,
					currentTier: currentTier >= 0 ? currentTier : achievement.tiers?.length ?? 0,
					completed: null, // Tiered achievements don't have a single completed flag
				};
			});
		} catch (error) {
			logFormatter(error, 'Failed to load progress');
			return null;
		}
	}

	function setGoalState(parsedPrefs) {
		if (!parsedPrefs) return;
		const goals = parsedPrefs.goals || [];
		userGoal.value = { ...goals[0] };
	}

	async function storeGoalPreferences(updates) {
		if (!userPreferences.value?.id) {
			await createUserPreferences(apollo, { goals: [] });
			await loadPreferences('network-only'); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		if (goalIndex !== -1) goals[goalIndex] = { ...goals[goalIndex], ...updates };
		else goals.push(updates);
		await updateUserPreferences(apollo, userPreferences.value, parsedPrefs, { goals });
		setGoalState({ goals }); // Refresh local state after update
	}

	const goalProgress = computed(() => {
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			const currentTotal = totalLoanCount.value || 0;
			const startTotal = userGoal.value?.loanTotalAtStart || 0;
			return Math.max(currentTotal - startTotal, 0);
		}
		const totalProgress = allTimeProgress.value.find(
			entry => entry.achievementId === userGoal.value?.category
		)?.totalProgress || 0;
		const adjustedProgress = totalProgress - (userGoal.value?.loanTotalAtStart || 0);

		// Check if adjustedProgress is negative and correct it
		// This could be happening due to a race condition with postCheckoutAchievements
		if (adjustedProgress < 0 && userGoal.value) {
			const debugData = {
				category: userGoal.value.category,
				goalName: userGoal.value.goalName,
				totalProgress,
				loanTotalAtStart: userGoal.value.loanTotalAtStart,
				adjustedProgress,
				target: userGoal.value.target,
			};

			logFormatter('Negative goal progress detected, correcting loanTotalAtStart', 'warn', debugData);

			// Correct the goal by updating loanTotalAtStart to totalProgress
			storeGoalPreferences({
				...userGoal.value,
				loanTotalAtStart: totalProgress,
			});
		}

		return Math.max(adjustedProgress, 0);
	});

	const userGoalAchieved = computed(() => goalProgress.value >= userGoal.value?.target);

	const checkCompletedGoal = async (category = 'post-checkout') => {
		if (userGoal.value && userGoalAchieved.value && userGoal.value.status !== 'completed') {
			await storeGoalPreferences({
				goalName: userGoal.value.goalName,
				dateStarted: userGoal.value.dateStarted,
				target: userGoal.value.target,
				count: userGoal.value.count,
				status: 'completed',
			});
			$kvTrackEvent(
				category,
				'show',
				'annual-goal-complete',
				userGoal.value.category,
				userGoal.value.target
			);
			userGoalAchievedNow.value = true;
		}
	};

	const getProgressByLoan = async loan => {
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			goalCurrentLoanCount.value += 1;
			return goalCurrentLoanCount.value;
		}

		const result = await loadProgress([loan]);
		const totalProgress = result.find(
			entry => entry.achievementId === userGoal.value?.category
		)?.totalProgress || 0;
		return totalProgress;
	};

	const setCurrentLoanCount = loansCount => {
		const currentTotal = totalLoanCount.value || 0;
		const startTotal = userGoal.value?.loanTotalAtStart || 0;

		goalCurrentLoanCount.value = Math.max(currentTotal - startTotal, 0) + loansCount;
	};

	async function loadGoalData(loans = []) {
		loading.value = true;
		const parsedPrefs = await loadPreferences();
		allTimeProgress.value = await loadProgress(loans);
		setGoalState(parsedPrefs);
		if (userGoal.value?.category === ID_SUPPORT_ALL && !goalCurrentLoanCount.value) {
			// Reducing counter by 1 because loans already has the added loan
			setCurrentLoanCount(loans.length - 1);
		}

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
		const renewedYear = goals.goalsRenewedDate ? new Date(goals.goalsRenewedDate).getFullYear() : null;
		if (renewedYear >= currentYear) {
			return {
				expiredGoals: goals,
				showRenewedAnnualGoalToast: false,
			};
		}

		// Renew goals every following year
		const expiredGoals = goals.map(goal => {
			const goalYear = goal.dateStarted ? new Date(goal.dateStarted).getFullYear() : null;
			if (goalYear < currentYear) {
				return { ...goal, status: GOAL_STATUS.EXPIRED };
			}
			return null;
		}).filter(goal => goal !== null);

		if (expiredGoals.some(goal => goal.status === GOAL_STATUS.EXPIRED)) {
			parsedPrefs.goals = expiredGoals;
			parsedPrefs.goalsRenewedDate = today.toISOString();

			await updateUserPreferences(apollo, userPreferences.value, parsedPrefs, { goals: expiredGoals });
			setGoalState({ goals: expiredGoals });
		}

		const showRenewedAnnualGoalToast = !!expiredGoals.length
			&& !expiredGoals.some(g => g.status === GOAL_STATUS.COMPLETED);

		return {
			expiredGoals,
			showRenewedAnnualGoalToast,
		};
	}

	/**
	 * Get Goal Categories for Goal Selection
	 * @param {*} categoriesLoanCount Categories Loan Count
	 * @param {*} totalLoans Total Loans
	 * @returns array of goal categories
	 */
	const getCategories = (categoriesLoanCount, totalLoans) => [
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

	/**
	 * Generate CTA Href for Goal Completion
	 * @param {*} selectedGoalNumber goal number selected by the user
	 * @param {*} categoryId category id selected by the user
	 * @param {*} router router instance
	 * @returns href string
	 */
	const getCtaHref = (selectedGoalNumber, categoryId, router) => {
		const { getLoanFindingUrl } = useBadgeData();

		const categoryHeader = getGoalDisplayName(selectedGoalNumber, categoryId);
		const string = `Your goal: Support ${selectedGoalNumber} ${categoryHeader}`;
		const encodedHeader = encodeURIComponent(string);
		const loanFindingUrl = getLoanFindingUrl(categoryId, router.currentRoute.value);
		return `${loanFindingUrl}?header=${encodedHeader}`;
	};

	return {
		getGoalDisplayName,
		goalProgress,
		loading,
		loadGoalData,
		storeGoalPreferences,
		userGoal,
		userGoalAchieved,
		userGoalAchievedNow,
		checkCompletedGoal,
		getProgressByLoan,
		// Goal Entry for 2026 Goals
		userPreferences,
		renewAnnualGoal,
		getCategories,
		getCtaHref,
	};
}
