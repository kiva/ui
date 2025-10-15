import {
	computed,
	inject,
	ref,
} from 'vue';

import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
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
export default function useGoalData({ loans, totalLoanCount }) {
	const apollo = inject('apollo');

	const loading = ref(true);
	const currentGoal = ref(null);
	const userPreferences = ref(null);
	const allTimeProgress = ref([]);

	async function loadPreferences(fetchPolicy = 'cache-first') {
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apollo.query({ query: useGoalDataQuery, variables: { loanIds }, fetchPolicy });
			const prefsData = response.data?.my?.userPreferences || null;
			allTimeProgress.value = response?.data?.postCheckoutAchievements?.allTimeProgress || [];
			userPreferences.value = prefsData;
			return prefsData ? JSON.parse(prefsData.preferences || '{}') : {};
		} catch (error) {
			console.error('Failed to load preferences:', error);
		}
	}

	function setGoalState(parsedPrefs) {
		if (!parsedPrefs) return;
		const goals = parsedPrefs.goals || [];
		currentGoal.value = { ...goals[0] };
	}

	async function storeGoalPreferences(updates) {
		if (!userPreferences.value) {
			await createUserPreferences(apollo, { goals: [] });
			await loadPreferences('network-only'); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		if (goalIndex !== -1) goals[goalIndex] = { ...goals[goalIndex], ...updates };
		else goals.push(updates);
		await updateUserPreferences(apollo, userPreferences.value, parsedPrefs, { goals });
		setGoalState({ goals }); // Refresh local state after update
	}

	const goalProgress = computed(() => {
		if (currentGoal.value?.category === ID_SUPPORT_ALL) return totalLoanCount;
		const currentProgress = allTimeProgress.value.find(
			entry => entry.achievementId === currentGoal.value?.category
		);
		return (currentProgress?.totalProgress || 0);
	});

	const currentGoalActive = computed(() => currentGoal.value.status === 'in-progress');
	const currentGoalAchieved = computed(() => goalProgress.value >= currentGoal.value?.target);

	async function runComposable() {
		loading.value = true;
		const parsedPrefs = await loadPreferences();
		setGoalState(parsedPrefs);
		// Auto-update if active goal achieved
		if (currentGoal.value && currentGoalAchieved.value) {
			await storeGoalPreferences({
				goalName: currentGoal.value.goalName,
				dateStarted: currentGoal.value.dateStarted,
				target: currentGoal.value.target,
				count: currentGoal.value.count,
				status: 'completed',
			});
		}
		loading.value = false;
	}

	return {
		currentGoal,
		currentGoalAchieved,
		currentGoalActive,
		loading,
		goalProgress,
		getGoalDisplayName,
		runComposable,
		storeGoalPreferences,
	};
}
