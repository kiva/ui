import {
	computed,
	inject,
	ref,
} from 'vue';

import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
import useGoalDataProgressQuery from '#src/graphql/query/useGoalDataProgress.graphql';
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

	async function loadProgress(loans) {
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apollo.query({
				query: useGoalDataProgressQuery,
				variables: { loanIds },
			});
			return response?.data?.postCheckoutAchievements?.allTimeProgress || [];
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
		const result = await loadProgress([loan]);
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			goalCurrentLoanCount.value += 1;
			return goalCurrentLoanCount.value;
		}

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
	 * Replaces all goals in user preferences with newGoals
	 * @param {*} newGoals - Array of new goal objects to set
	 */
	async function replaceAllGoals(newGoals) {
		if (!userPreferences.value?.id) {
			await createUserPreferences(apollo, { goals: [] });
			await loadPreferences('network-only');
		}
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		parsedPrefs.goals = newGoals;
		await updateUserPreferences(apollo, userPreferences.value, parsedPrefs, { goals: newGoals });
		setGoalState({ goals: newGoals });
	}

	/**
	 * This method shows Goal Entry for 2026 Goals
	 * It invalidates all goals on Jan 1st of 2026
	 * @return {Array} - expiredGoals
	 */
	async function renewAnnualGoal(today = new Date()) {
		const parsedPrefs = await loadPreferences();
		const goals = parsedPrefs.goals || [];
		let expiredGoals = [];

		if (today.getMonth() === 0 && today.getDate() === 1) {
			expiredGoals = goals.map(prevGoal => ({
				...prevGoal,
				active: false
			}));
			await replaceAllGoals(expiredGoals);
		}

		return expiredGoals;
	}

	/**
	 * Determines if the renew goal toast should be shown
	 */
	const showRenewedAnnualGoalToast = computed(() => {
		const parsedPrefs = userPreferences.value
			? JSON.parse(userPreferences.value.preferences || '{}')
			: {};
		const goals = parsedPrefs.goals || [];
		return !goals.some(goal => !goal?.active && goal.status === 'completed');
	});

	/**
	 * Determines if all goals are renewed (inactive)
	 */
	const goalsAreRenewed = computed(() => {
		const parsedPrefs = userPreferences.value
			? JSON.parse(userPreferences.value.preferences || '{}')
			: {};
		const goals = parsedPrefs.goals || [];

		return goals.every(goal => !goal?.active);
	});

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
		replaceAllGoals,
		renewAnnualGoal,
		showRenewedAnnualGoalToast,
		goalsAreRenewed,
	};
}
