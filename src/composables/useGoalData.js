import { inject, ref, computed } from 'vue';

import thankYouPageQuery from '#src/graphql/query/thankYouPage.graphql';
import { createUserPreferences, updateUserPreferences } from '#src/util/userPreferenceUtils';

import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
} from '#src/composables/useBadgeData';

const CATEGORY_TAG_MAP = {
	[ID_BASIC_NEEDS]: ['basic_needs'],
	[ID_CLIMATE_ACTION]: ['climate_action'],
	[ID_REFUGEE_EQUALITY]: ['refugee_support'],
	[ID_US_ECONOMIC_EQUALITY]: ['us_entrepreneurs'],
	[ID_WOMENS_EQUALITY]: ['women', '#Woman-Owned Business'],
};

const GOAL_DISPLAY_MAP = {
	[ID_BASIC_NEEDS]: 'basic needs loans',
	[ID_CLIMATE_ACTION]: 'eco-friendly loans',
	[ID_REFUGEE_EQUALITY]: 'refugees',
	[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
	[ID_WOMENS_EQUALITY]: 'women',
};

function getGoalDisplayName(category) {
	return GOAL_DISPLAY_MAP[category] || 'loans';
}

function getCategoriesForTag(tag) {
	return Object.entries(CATEGORY_TAG_MAP)
		.filter(([, tags]) => tags.includes(tag))
		.map(([category]) => category);
}

/**
 * Vue composable for loading and managing user goal data
 *
 * @param {Array} loans - List of loans to count toward goals
 * @returns Goal data and utilities
 */
export default async function useGoalData(loans) {
	const apollo = inject('apollo');
	const showTipMsg = inject('$showTipMsg');

	const loading = ref(true);
	const goalState = ref({});
	const userPreferences = ref(null);

	async function loadPreferences() {
		try {
			const response = await apollo.query({ query: thankYouPageQuery });
			const prefsData = response.data?.my?.userPreferences || null;
			userPreferences.value = prefsData;
			return prefsData ? JSON.parse(prefsData.preferences || '{}') : {};
		} catch (error) {
			console.error('Failed to load preferences:', error);
			showTipMsg('Error loading goals. Please try again.', { type: 'error' });
			return {};
		}
	}

	// Initialize goal state from parsed prefs (filter current year, set counts to 0)
	function initializeGoalState(parsedPrefs) {
		const currentYear = new Date().getFullYear();
		const goals = parsedPrefs.goals || [];
		goals
			.filter(goal => new Date(goal.dateStarted).getFullYear() >= currentYear)
			.forEach(goal => {
				goalState.value[goal.category] = {
					target: goal.target,
					status: goal.status,
					count: 0,
					dateStarted: goal.dateStarted,
					goalName: goal.goalName,
				};
			});
	}

	// Count loans toward goals (only current-year loans)
	function countLoansTowardGoals() {
		const currentYear = new Date().getFullYear();
		loans
			.filter(
				loan => loan.postedDate
				&& new Date(loan.postedDate).getFullYear() >= currentYear
			)
			.forEach(loan => {
				(loan.tags || []).forEach(tag => {
					getCategoriesForTag(tag).forEach(category => {
						if (goalState.value[category]) {
							goalState.value[category].count += 1;
						}
					});
				});
			});
	}

	const activeGoal = computed(
		() => Object.values(goalState.value).find(goal => goal.status === 'in-progress') || null
	);

	const achievements = computed(() => {
		return Object.fromEntries(
			Object.entries(goalState.value).map(([category, goal]) => [category, goal.count >= goal.target])
		);
	});

	const currentGoalAchieved = computed(() => {
		return activeGoal.value ? achievements.value[activeGoal.value.category] : false;
	});

	async function storeGoalPreferences(updates) {
		if (!userPreferences.value) {
			await createUserPreferences(apollo, { goals: [] });
			userPreferences.value = await loadPreferences(); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		if (goalIndex !== -1) goals[goalIndex] = { ...goals[goalIndex], ...updates };
		else goals.push(updates);
		await updateUserPreferences(apollo, userPreferences.value, parsedPrefs, { goals });
		showTipMsg('Your goal was saved successfully!', { type: 'success' });
		// Refresh local state after update
		initializeGoalState({ goals });
	}

	const parsedPrefs = await loadPreferences();
	initializeGoalState(parsedPrefs);
	countLoansTowardGoals();

	// Auto-update if active goal achieved
	if (currentGoalAchieved.value && activeGoal.value) {
		await storeGoalPreferences({
			goalName: activeGoal.value.goalName,
			dateStarted: activeGoal.value.dateStarted,
			status: 'completed',
		});
	}

	loading.value = false;

	return {
		goalState,
		activeGoal,
		currentGoalAchieved,
		achievements,
		loading,
		storeGoalPreferences,
		getGoalDisplayName,
	};
}
