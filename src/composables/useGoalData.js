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
	const goalCurrentLoanCount = ref(0); // Tracks loans toward "Support All" goal
	const loading = ref(true);
	const totalLoanCount = ref(null);
	const userGoal = ref(null);
	const userGoalAchievedNow = ref(false);
	const userPreferences = ref(null);

	// --- Computed Properties ---

	const goalProgress = computed(() => {
		const goal = userGoal.value;
		const progress = currentYearProgress.value;
		if (goal?.category === ID_SUPPORT_ALL) return totalLoanCount.value || 0;
		const progressForYear = progress.find(n => n.id === goal?.category)?.progressForYear || 0;
		return progressForYear;
	});

	const userGoalAchieved = computed(() => goalProgress.value >= userGoal.value?.target);

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

	async function getPostCheckoutProgressByLoans(loans, year = new Date().getFullYear()) {
		try {
			const loanIds = loans.map(loan => loan.id);
			const response = await apolloClient.query({
				query: useGoalDataProgressQuery,
				variables: { loanIds, year },
			});
			const progress = response.data?.postCheckoutAchievements?.yearlyProgress || [];
			const userGoalProgress = progress.find(
				entry => entry.achievementId === userGoal.value?.category
			)?.totalProgress || 0;
			return userGoalProgress;
		} catch (error) {
			logFormatter(error, 'Failed to get post-checkout progress');
			return null;
		}
	}

	async function getPostCheckoutProgressByLoan(loan, year = new Date().getFullYear()) {
		if (userGoal.value?.category === ID_SUPPORT_ALL) {
			goalCurrentLoanCount.value += 1;
			return goalCurrentLoanCount.value;
		}
		const progress = await getPostCheckoutProgressByLoans([loan], year);
		return progress;
	}

	async function storeGoalPreferences(updates) {
		if (!userPreferences.value?.id) {
			await createUserPreferences(apolloClient, { goals: [] });
			await loadPreferences('network-only'); // Reload after create
		}
		const parsedPrefs = JSON.parse(userPreferences.value?.preferences || '{}');
		const goals = parsedPrefs.goals || [];
		const goalIndex = goals.findIndex(g => g.goalName === updates.goalName);
		if (goalIndex !== -1) goals[goalIndex] = { ...goals[goalIndex], ...updates };
		else goals.push(updates);
		await updateUserPreferences(
			apolloClient,
			userPreferences.value,
			parsedPrefs,
			{ goals }
		);
		setGoalState({ goals }); // Refresh local state after update
	}

	async function checkCompletedGoal({ currentGoalProgress = 0, category = 'post-checkout' } = {}) {
		if (
			(currentGoalProgress && (currentGoalProgress >= userGoal.value?.target))
			|| (userGoal.value && userGoalAchieved.value
				&& ![GOAL_STATUS.COMPLETED, GOAL_STATUS.EXPIRED].includes(userGoal.value.status))
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

	async function loadGoalData({
		loans = [],
		year = new Date().getFullYear()
	} = {}) {
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

	return {
		checkCompletedGoal,
		getCategories,
		getCategoryLoansLastYear,
		getCtaHref,
		getGoalDisplayName,
		getPostCheckoutProgressByLoan,
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
	};
}
