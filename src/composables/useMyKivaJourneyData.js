/**
 * Shared MyKiva journey data transformations and methods.
 * All exports are named functions, compatible with both Options API and Composition API.
 *
 * Usage:
 *   import { buildLatestLoanData, buildLenderData, ... } from '#src/composables/useMyKivaJourneyData';
 */

import useBadgeData, {
	applyFreshProgressToAchievements,
	getContentfulLevelData,
} from '#src/composables/useBadgeData';
import {
	getRecentTransactionLoans,
	checkPostLendingCardCookie,
	removePostLendingCardCookie
} from '#src/util/myKivaUtils';

let badgeDataInstance = null;
const getBadgeData = () => {
	if (!badgeDataInstance) badgeDataInstance = useBadgeData();
	return badgeDataInstance;
};

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
	return getBadgeData().combineBadgeData(heroTieredAchievements, heroBadgeContentfulData);
};

/**
 * Computes categoriesLoanCount from tiered achievements
 * @param {Array} heroTieredAchievements - Tiered achievements array
 * @returns {Object} - Categories loan count object
 */
export const buildCategoriesLoanCount = heroTieredAchievements => {
	return getBadgeData().getAllCategoryLoanCounts(heroTieredAchievements);
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
 * Builds contentful data (heroSlides and heroBadgeContentfulData) from query results
 * @param {Object} slidesResult - The result from contentful slides query
 * @param {Object} contentfulChallengeResult - The result from contentful challenge query
 * @returns {Object} - Object containing { heroSlides, heroBadgeContentfulData }
 */
export const buildContentfulData = (slidesResult, contentfulChallengeResult) => {
	const heroSlides = slidesResult?.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
	const heroBadgeContentfulData = (contentfulChallengeResult?.contentful?.entries?.items ?? [])
		.map(entry => getContentfulLevelData(entry));

	return { heroSlides, heroBadgeContentfulData };
};

/**
 * Builds achievements data with fresh progress applied
 * @param {Object} lastYearResult - The result from userAchievementProgress query for last year
 * @param {Object} currentYearResult - The result from userAchievementProgress query for current year
 * @param {Array} transactions - The transactions array from myKivaQuery
 * @returns {Object} - { heroTieredAchievements, currentYearTieredAchievements, recentTransactionLoans }
 */
export const buildAchievementsWithFreshProgress = (lastYearResult, currentYearResult, transactions) => {
	const rawHeroTieredAchievements = lastYearResult?.userAchievementProgress?.tieredLendingAchievements ?? [];
	const currentYearTieredAchievements = currentYearResult?.userAchievementProgress?.tieredLendingAchievements ?? [];

	const recentTransactionLoans = getRecentTransactionLoans(transactions);
	const heroTieredAchievements = applyFreshProgressToAchievements({
		achievements: rawHeroTieredAchievements,
		freshProgressLoans: recentTransactionLoans,
	});

	return { heroTieredAchievements, currentYearTieredAchievements, recentTransactionLoans };
};

/**
 * Applies fresh progress to a single achievements array.
 * This is the base pattern used by MyKivaPage.applyMyKivaFreshProgress.
 * @param {Array} achievements - Tiered achievements to update
 * @param {Array} transactions - Raw transactions array
 * @returns {Object} - { achievements, recentTransactionLoans }
 */
export const applyFreshProgress = (achievements, transactions) => {
	const recentTransactionLoans = getRecentTransactionLoans(transactions);
	const updatedAchievements = applyFreshProgressToAchievements({
		achievements,
		freshProgressLoans: recentTransactionLoans,
	});
	return { achievements: updatedAchievements, recentTransactionLoans };
};

/**
 * Checks and clears the post-lending card cookie
 * @param {Object} cookieStore - The cookie store instance
 * @returns {boolean} - Whether the cookie was present (and cleared)
 */
export const checkAndClearPostLendingCookie = cookieStore => {
	if (checkPostLendingCardCookie(cookieStore)) {
		removePostLendingCardCookie(cookieStore);
		return true;
	}
	return false;
};

/**
 * Creates modal handler methods with configurable tracking category.
 * All state is managed via refs passed by the caller — no internal closure state.
 * @param {Object} options - Configuration options
 * @param {Function} options.trackEvent - The $kvTrackEvent function
 * @param {Function} options.storeGoalPreferences - Function to store goal preferences
 * @param {Function} options.loadGoalData - Function to reload goal data
 * @param {string} options.trackingCategory - Category for analytics ('portfolio')
 * @param {boolean} options.goalsV2Enabled - Whether goals v2 is enabled
 * @returns {Object} - Object containing modal methods (setGoal, closeGoalModal, closeImpactInsightsModal)
 */
export const createModalsHandlers = ({
	trackEvent,
	storeGoalPreferences,
	loadGoalData,
	trackingCategory = 'portfolio',
	goalsV2Enabled = true,
}) => {
	/**
	 * Handles setting a goal
	 * @param {Object} preferences - Goal preferences
	 * @param {Object} refs - Reactive refs { isGoalSet, newGoalPrefs, showGoalModal }
	 */
	const setGoal = async (preferences, refs) => {
		const updateLocalState = !goalsV2Enabled;
		await storeGoalPreferences(preferences, updateLocalState);

		/* eslint-disable no-param-reassign */
		refs.newGoalPrefs.value = preferences;
		refs.isGoalSet.value = true;
		/* eslint-enable no-param-reassign */

		if (!goalsV2Enabled) {
			await loadGoalData({ yearlyProgress: false });
			if (refs.showGoalModal) refs.showGoalModal.value = false; // eslint-disable-line no-param-reassign
		}
	};

	/**
	 * Handles closing the goal modal
	 * @param {Object} refs - Reactive refs { showGoalModal, isGoalSet, newGoalPrefs, recordedGoalSet }
	 */
	const closeGoalModal = async refs => {
		if (refs.showGoalModal.value) {
			refs.showGoalModal.value = false; // eslint-disable-line no-param-reassign
			trackEvent(trackingCategory, 'click', 'close-goals');
		}

		if (refs.isGoalSet.value) {
			if (!refs.recordedGoalSet.value) {
				trackEvent(
					trackingCategory,
					'show',
					'goal-set',
					refs.newGoalPrefs.value?.category,
					refs.newGoalPrefs.value?.target
				);
				refs.recordedGoalSet.value = true; // eslint-disable-line no-param-reassign
			}
			await loadGoalData({ yearlyProgress: goalsV2Enabled });
		}
	};

	/**
	 * Handles closing the impact insights modal
	 * @param {Object} refs - Reactive refs { showImpactInsightsModal }
	 */
	const closeImpactInsightsModal = refs => {
		if (refs.showImpactInsightsModal.value) {
			refs.showImpactInsightsModal.value = false; // eslint-disable-line no-param-reassign
			trackEvent(trackingCategory, 'click', 'next-step-close-education');
		}
	};

	return {
		setGoal,
		closeGoalModal,
		closeImpactInsightsModal,
	};
};
