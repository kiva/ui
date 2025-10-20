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

function getGoalDisplayName(category) {
	return GOAL_DISPLAY_MAP[category] || 'loans';
}

/**
 * Vue composable for loading and managing user goal data
 *
 * @param {Array} loans - List of loans to count toward goals
 * @returns Goal data and utilities
 */
export default function useGoalData({ loans }) {
	const apollo = inject('apollo');

	const allTimeProgress = ref([]);
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const userGoal = ref(null);
	const userPreferences = ref(null);

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

	async function loadProgress(fetchPolicy = 'cache-first') {
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apollo.query({
				query: useGoalDataProgressQuery,
				variables: { loanIds },
				fetchPolicy
			});
			allTimeProgress.value = response?.data?.postCheckoutAchievements?.allTimeProgress || [];
			return true;
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
		if (!userPreferences.value) {
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
		if (userGoal.value?.category === ID_SUPPORT_ALL) return totalLoanCount.value || 0;
		const totalProgress = allTimeProgress.value.find(
			entry => entry.achievementId === userGoal.value?.category
		);
		const adjustedProgress = totalProgress - (userGoal.value?.loanTotalAtStart || 0);
		return (adjustedProgress?.totalProgress || 0);
	});

	const userGoalAchieved = computed(() => goalProgress.value >= userGoal.value?.target);

	async function runComposable() {
		loading.value = true;
		const parsedPrefs = await loadPreferences();
		await loadProgress();
		setGoalState(parsedPrefs);
		// Auto-update if active goal achieved
		if (userGoal.value && userGoalAchieved.value) {
			await storeGoalPreferences({
				goalName: userGoal.value.goalName,
				dateStarted: userGoal.value.dateStarted,
				target: userGoal.value.target,
				count: userGoal.value.count,
				status: 'completed',
			});
		}
		loading.value = false;
	}

	return {
		userGoal,
		userGoalAchieved,
		goalProgress,
		loading,
		getGoalDisplayName,
		runComposable,
		storeGoalPreferences,
	};
}
