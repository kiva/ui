/**
 * Composable for shared MyKiva journey data transformations and methods.
 * Compatible with both Options API and Composition API.
 *
 * Usage in Composition API:
 *   const { buildLatestLoanData, buildLenderData, ... } = useMyKivaJourneyData();
 *
 * Usage in Options API:
 *   import { buildLatestLoanData, buildLenderData, ... } from '#src/composables/useMyKivaJourneyData';
 *   // Use directly in methods or computed
 */

import useBadgeData from '#src/composables/useBadgeData';
/**
 * Builds the latestLoan object from myKiva query result
 * @param {Object} myData - The my object from myKivaQuery result
 * @returns {Object|null} - Processed latestLoan object or null
 */
export const buildLatestLoanData = myData => {
	const latestLoanValues = myData?.latestLoan?.values;
	if (!latestLoanValues?.[0]?.loan) return null;

	return {
		...latestLoanValues[0].loan,
		amount: latestLoanValues[0]?.amount || null,
		// Edge case: user has promo credit, transaction is split. Include other items to sum amounts.
		...(latestLoanValues.length > 1
			? { otherLoans: latestLoanValues.slice(1) }
			: {}),
	};
};

/**
 * Builds the lender object with additional user account info
 * @param {Object} myData - The my object from myKivaQuery result
 * @returns {Object} - Processed lender object
 */
export const buildLenderData = myData => {
	return {
		...(myData?.lender ?? {}),
		public: myData?.userAccount?.public ?? false,
		inviterName: myData?.userAccount?.inviterName ?? null,
	};
};

/**
 * Builds heroBadgeData by combining tiered achievements with contentful data
 * @param {Array} heroTieredAchievements - Tiered achievements from userAchievementProgress query
 * @param {Array} heroBadgeContentfulData - Badge contentful data
 * @returns {Array} - Combined badge data
 */
export const buildHeroBadgeData = (heroTieredAchievements, heroBadgeContentfulData) => {
	const { combineBadgeData } = useBadgeData();
	return combineBadgeData(heroTieredAchievements, heroBadgeContentfulData);
};

/**
 * Computes categoriesLoanCount from tiered achievements
 * @param {Array} heroTieredAchievements - Tiered achievements array
 * @returns {Object} - Categories loan count object
 */
export const buildCategoriesLoanCount = heroTieredAchievements => {
	const { getAllCategoryLoanCounts } = useBadgeData();
	return getAllCategoryLoanCounts(heroTieredAchievements);
};

/**
 * Builds regionsData from lendingStats query result
 * @param {Object} lendingStatsData - The data object from lendingStatsQuery result
 * @returns {Object} - Object containing { regionsData, userLentToAllRegions }
 */
export const buildRegionsData = lendingStatsData => {
	const countryFacets = lendingStatsData?.lend?.countryFacets ?? [];
	const countriesLentTo = lendingStatsData?.my?.lendingStats?.countriesLentTo ?? [];

	const regionCounts = new Map();
	const regionCountries = new Map();

	countryFacets.forEach(facet => {
		const region = facet.country?.region;
		const isoCode = facet.country?.isoCode;
		if (region) {
			regionCounts.set(region, (regionCounts.get(region) || 0) + (facet.count || 0));
			if (isoCode) {
				const currentCountries = regionCountries.get(region) || [];
				regionCountries.set(region, [...currentCountries, isoCode]);
			}
		}
	});

	const regionsData = [...regionCounts.keys()].map(region => ({
		name: region,
		hasLoans: countriesLentTo.some(item => item?.region === region),
		count: regionCounts.get(region) || 0,
		countries: regionCountries.get(region) || [],
	}));

	const userLentToAllRegions = regionsData.length > 0
		&& regionsData.every(region => region.hasLoans);

	return { regionsData, userLentToAllRegions };
};

/**
 * Creates modal handler methods with configurable tracking category
 * Handles both Goal modal and Impact Insights modal
 * @param {Object} options - Configuration options
 * @param {Function} options.trackEvent - The $kvTrackEvent function
 * @param {Function} options.storeGoalPreferences - Function to store goal preferences
 * @param {Function} options.loadGoalData - Function to reload goal data
 * @param {string} options.trackingCategory - Category for analytics ('portfolio' or 'next-steps')
 * @param {boolean} options.goalsV2Enabled - Whether goals v2 is enabled (for LendingStats compatibility)
 * @returns {Object} - Object containing modal methods (setGoal, closeGoalModal, closeImpactInsightsModal, resetState)
 */
export const createModalsHandlers = ({
	trackEvent,
	storeGoalPreferences,
	loadGoalData,
	trackingCategory = 'portfolio',
	goalsV2Enabled = true,
}) => {
	// Shared state for tracking
	let recordedGoalSet = false;
	let newGoalPrefs = null;
	let isGoalSet = false;

	/**
	 * Handles setting a goal
	 * @param {Object} preferences - Goal preferences
	 * @param {Object} refs - Reactive refs { isGoalSet, newGoalPrefs, showGoalModal }
	 */
	const setGoal = async (preferences, refs = {}) => {
		// For goalsV2, pass false to not update local state yet (delays UI update until modal closes)
		const updateLocalState = !goalsV2Enabled;
		await storeGoalPreferences(preferences, updateLocalState);

		// Update local tracking state
		newGoalPrefs = preferences;
		isGoalSet = true;

		// Update refs if provided (for Composition API)
		/* eslint-disable no-param-reassign */
		if (refs.newGoalPrefs) refs.newGoalPrefs.value = preferences;
		if (refs.isGoalSet) refs.isGoalSet.value = true;
		/* eslint-enable no-param-reassign */

		// For legacy goals (non-v2), close modal and refresh immediately
		if (!goalsV2Enabled) {
			await loadGoalData({ yearlyProgress: false });
			if (refs.showGoalModal) refs.showGoalModal.value = false; // eslint-disable-line no-param-reassign
		}
	};

	/**
	 * Handles closing the goal modal
	 * @param {Object} refs - Reactive refs { showGoalModal, isGoalSet, newGoalPrefs }
	 */
	const closeGoalModal = async (refs = {}) => {
		const showModalValue = refs.showGoalModal?.value ?? false;
		const isGoalSetValue = refs.isGoalSet?.value ?? isGoalSet;
		const newGoalPrefsValue = refs.newGoalPrefs?.value ?? newGoalPrefs;

		if (showModalValue) {
			if (refs.showGoalModal) refs.showGoalModal.value = false; // eslint-disable-line no-param-reassign
			trackEvent(trackingCategory, 'click', 'close-goals');
		}

		// Only refresh goal data when modal closes AND goal was set
		if (isGoalSetValue) {
			if (!recordedGoalSet) {
				trackEvent(
					trackingCategory,
					'show',
					'goal-set',
					newGoalPrefsValue?.category,
					newGoalPrefsValue?.target
				);
				recordedGoalSet = true;
			}
			// Refresh goal data to update the main card with the ring
			await loadGoalData({ yearlyProgress: goalsV2Enabled });
		}
	};

	/**
	 * Handles closing the impact insights modal
	 * @param {Object} refs - Reactive refs { showImpactInsightsModal }
	 */
	const closeImpactInsightsModal = (refs = {}) => {
		const showModalValue = refs.showImpactInsightsModal?.value ?? false;

		if (showModalValue) {
			// eslint-disable-next-line no-param-reassign
			if (refs.showImpactInsightsModal) refs.showImpactInsightsModal.value = false;
			trackEvent(trackingCategory, 'click', 'next-step-close-education');
		}
	};

	/**
	 * Resets the internal tracking state (useful for component cleanup)
	 */
	const resetState = () => {
		recordedGoalSet = false;
		newGoalPrefs = null;
		isGoalSet = false;
	};

	return {
		setGoal,
		closeGoalModal,
		closeImpactInsightsModal,
		resetState,
	};
};

/**
 * Composable for MyKiva journey data
 * @returns {Object} - All utility functions and composable methods
 */
export default function useMyKivaJourneyData() {
	return {
		buildLatestLoanData,
		buildLenderData,
		buildHeroBadgeData,
		buildCategoriesLoanCount,
		buildRegionsData,
		createModalsHandlers,
	};
}
