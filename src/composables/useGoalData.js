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

import {
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_SUPPORT_ALL,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

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
	const currentYearProgress = ref([]);
	const pastYearProgress = ref([]);
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const userGoal = ref(null);
	const userPreferences = ref(null);
	const userGoalAchievedNow = ref(false);
	const goalCurrentLoanCount = ref(0); // Tracks loans toward "Support All" goal

	// --- Computed Properties ---

	const goalProgress = computed(() => {
		if (userGoal.value?.category === ID_SUPPORT_ALL) return totalLoanCount.value || 0;
		const progress = currentYearProgress.value.find(
			entry => entry.id === userGoal.value?.category
		)?.totalProgressToAchievement || 0;
		return progress;
	});

	const prevYearGoalProgress = computed(() => {
		if (userGoal.value?.category === ID_SUPPORT_ALL) return totalLoanCount.value || 0;
		const progress = pastYearProgress.value.find(
			entry => entry.id === userGoal.value?.category
		)?.totalProgressToAchievement || 0;
		return progress;
	});

	const userGoalAchieved = computed(() => goalProgress.value >= userGoal.value?.target);

	// --- Functions ---

	function setGoalState(parsedPrefs) {
		if (!parsedPrefs) return;
		const goals = parsedPrefs.goals || [];
		userGoal.value = { ...goals[0] };
	}

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

	async function loadProgress(year) {
		try {
			const currentYearResponse = await apollo.query({
				query: useGoalDataYearlyProgressQuery,
				variables: { year },
			});
			const pastYearResponse = await apollo.query({
				query: useGoalDataYearlyProgressQuery,
				variables: { year: year - 1 },
			});
			const currYearProgress = currentYearResponse.data.userAchievementProgress.tieredLendingAchievements;
			const prevYearProgress = pastYearResponse.data.userAchievementProgress.tieredLendingAchievements;
			currentYearProgress.value = currYearProgress;
			pastYearProgress.value = prevYearProgress;
		} catch (error) {
			logFormatter(error, 'Failed to load progress');
			return null;
		}
	}

	// TODO: The useGoalDataProgressQuery's backend now requires modification in order to properly provide
	// an accurate all-time progress based on yearly-calculated loan progress.
	async function getProgressByLoans(loans, year = new Date().getFullYear()) {
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apollo.query({
				query: useGoalDataProgressQuery,
				variables: { loanIds, year },
			});
			const allTimeProgress = response.data?.postCheckoutAchievements?.allTimeProgress || [];
			const userGoalProgress = allTimeProgress.find(
				entry => entry.achievementId === userGoal.value?.category
			)?.totalProgress || 0;
			return userGoalProgress;
		} catch (error) {
			logFormatter(error, 'Failed to get post-checkout progress');
			return null;
		}
	}

	async function getProgressByLoan(loan, year = new Date().getFullYear()) {
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			goalCurrentLoanCount.value += 1;
			return goalCurrentLoanCount.value;
		}
		const progress = await getProgressByLoans([loan], year);
		return progress;
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

	async function checkCompletedGoal({ currentGoalProgress = null, category = 'post-checkout' }) {
		if (
			(currentGoalProgress && (currentGoalProgress >= userGoal.value?.target))
			|| (userGoal.value && userGoalAchieved.value && userGoal.value.status !== 'completed')
		) {
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
	}

	async function loadGoalData(loans = [], year = new Date().getFullYear()) {
		loading.value = true;
		const parsedPrefs = await loadPreferences();
		await loadProgress(year);
		setGoalState(parsedPrefs);
		if (userGoal.value?.category === ID_SUPPORT_ALL && !goalCurrentLoanCount.value) {
			// Reducing counter by 1 because loans already has the added loan
			goalCurrentLoanCount.value = loans.length - 1;
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

	return {
		checkCompletedGoal,
		getGoalDisplayName,
		getProgressByLoan,
		getProgressByLoans,
		goalProgress,
		loadGoalData,
		loading,
		prevYearGoalProgress,
		storeGoalPreferences,
		userGoal,
		userGoalAchieved,
		userGoalAchievedNow,
		// Goal Entry for 2026 Goals
		userPreferences,
		renewAnnualGoal,
	};
}
