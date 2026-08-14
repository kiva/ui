import {
	computed,
	inject,
	ref,
} from 'vue';

import goalInReviewAchievementsQuery from '#src/graphql/query/goalInReviewAchievements.graphql';
import goalInReviewLenderQuery from '#src/graphql/query/goalInReviewLender.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import useGoalData, { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import {
	getCategoryName,
	getGoalLoans,
	getIsEligible,
	getLoanStats,
	mergeRecapExtras,
	scopeToGoalYear,
	shouldAutoOpenRecap,
} from '#src/util/goalInReview';
import { completedGoalThisSession } from '#src/util/goalRecapSession';
import logFormatter from '#src/util/logFormatter';

// Open the Goal In Review recap from MyKiva with /mykiva?goTo=goal-recap.
export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

/**
 * Returns the current date, applying the ?recapDate=YYYY-MM-DD URL override for dev/QA use only.
 * Once dev/QA testing is complete, this override will be removed.
 *
 * Example: /mykiva?goTo=goal-recap&recapDate=2027-01-01
 *
 * @returns {Date} The effective "now" for Goal In Review logic.
 */
export function getGoalInReviewNow() {
	if (typeof window !== 'undefined') {
		const param = new URLSearchParams(window.location.search).get('recapDate');
		if (param) {
			const override = new Date(param);
			if (!Number.isNaN(override.getTime())) {
				return override;
			}
		}
	}
	return new Date();
}

/**
 * Gets the recap year from the provided date.
 *
 * @param {Date} date Source date for determining the recap year.
 * @returns {number} Full year used for Goal In Review data.
 */
export function getGoalInReviewTargetYear(date = getGoalInReviewNow()) {
	return date.getFullYear();
}

/**
 * Returns the current year, honoring the ?recapDate dev/QA override via getGoalInReviewNow().
 *
 * @returns {number} The current year.
 */
export function getGoalInReviewCurrentYear() {
	return getGoalInReviewNow().getFullYear();
}

/**
 * Provides Goal In Review modal state and loads the shared recap payload.
 *
 * @param {object} options Composable options.
 * @param {object} [options.apollo] Apollo client; injected when omitted.
 * @param {object} [options.cookieStore] Cookie store; injected when omitted.
 * @param {object} [options.goalData] An existing useGoalData instance. Pass the page's
 *   own so the recap reads and writes the same preferences it does — each call to
 *   useGoalData owns a separate `userPreferences` ref.
 * @returns {object} Goal In Review state, eligibility, and loading function.
 */
export default function useGoalInReview({ apollo, cookieStore, goalData } = {}) {
	const apolloClient = apollo || inject('apollo');
	const cookies = cookieStore || inject('cookieStore', null);
	const {
		getGoalSummary,
		hasViewedGoalRecapForYear,
		loadPreferences,
		setGoalRecapViewedPreference,
		hasSubmittedGoalFeedbackForYear,
		setGoalFeedbackSubmittedPreference,
	} = goalData || useGoalData({ apollo: apolloClient });
	const loading = ref(false);
	const goalInReviewData = ref(null);

	const isEligible = computed(() => Boolean(goalInReviewData.value?.isEligible));

	async function query(recapQuery, variables, fetchPolicy = 'network-only') {
		try {
			const response = await apolloClient.query({ query: recapQuery, variables, fetchPolicy });
			return response?.data ?? null;
		} catch (error) {
			logFormatter('useGoalInReview failed to load recap data', 'error', { error: error?.message });
			return null;
		}
	}

	async function loadGoalSummary() {
		try {
			return await getGoalSummary();
		} catch (error) {
			logFormatter('useGoalInReview failed to load the goal summary', 'error', { error: error?.message });
			return null;
		}
	}

	/**
	 * Loads the recap data used by the modal and its slides.
	 *
	 * @param {object} options Load options.
	 * @param {number} options.year Recap year to load.
	 * @returns {Promise<object>} Goal In Review data payload.
	 */
	async function loadGoalInReview({
		year = getGoalInReviewTargetYear(),
	} = {}) {
		loading.value = true;
		try {
			const [summary, lenderData, contentfulData] = await Promise.all([
				loadGoalSummary(),
				query(goalInReviewLenderQuery),
				query(contentfulEntriesQuery, { contentType: 'challenge', limit: 200 }, 'cache-first'),
			]);

			// getGoalSummary returns the monolith's own summary for support-all, which is
			// the only category it carries the recap extras for. Every other category is
			// built from achievements-service instead, so only one of the two is ever read.
			const monolithSummary = summary?.category === ID_SUPPORT_ALL ? summary : null;
			// 'no-cache' because this query only selects tieredLendingAchievements — writing it to
			// the cache would overwrite the richer userAchievementProgress data stored by the full
			// badges prefetch. Same convention as useGoalData.getCategoriesProgressByYear.
			const achievementsData = summary && !monolithSummary
				? await query(goalInReviewAchievementsQuery, { year, loanPurchasesLimit: summary.target }, 'no-cache')
				: null;
			const achievements = achievementsData?.userAchievementProgress?.tieredLendingAchievements ?? [];
			const goalSummary = scopeToGoalYear(
				mergeRecapExtras(summary, monolithSummary),
				achievements,
			);

			goalInReviewData.value = {
				year,
				isEligible: getIsEligible(goalSummary),
				firstName: lenderData?.my?.userAccount?.firstName ?? '',
				goalSummary,
				categoryName: getCategoryName(goalSummary?.category, contentfulData?.contentful?.entries?.items),
				loanStats: getLoanStats(goalSummary),
				goalLoans: getGoalLoans(goalSummary, achievements),
				lifetimePercentile: lenderData?.my?.lendingStats?.amountLentPercentile ?? null,
			};
			return goalInReviewData.value;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Loads the recap only when it should open by itself. MyKiva and Portfolio both
	 * call this, so the pop-up happens once per user rather than once per page.
	 *
	 * @param {object} options Trigger options.
	 * @param {boolean} options.enabled The goal_in_review_enable setting.
	 * @param {Date|string|null} [options.inProgressStartDate] The
	 *   goal_in_review_in_progress_start setting, the date in-progress goal setters
	 *   become eligible. Completed goal setters are not gated by it.
	 * @returns {Promise<object|null>} The recap payload to show, or null to stay shut.
	 */
	async function loadAutoOpenRecap({ enabled = false, inProgressStartDate = null } = {}) {
		if (!enabled) {
			return null;
		}

		await loadPreferences('network-only');
		const now = getGoalInReviewNow();
		const year = getGoalInReviewTargetYear(now);
		const hasViewedRecap = hasViewedGoalRecapForYear(year);
		if (hasViewedRecap) {
			return null;
		}

		const data = await loadGoalInReview({ year });
		const goalYear = new Date(data?.goalSummary?.dateStarted).getFullYear();

		const shouldOpen = shouldAutoOpenRecap({
			enabled,
			isEligible: Boolean(data?.isEligible),
			goalStatus: data?.goalSummary?.status,
			goalYear,
			currentGoalYear: GOALS_CURRENT_YEAR,
			hasViewedRecap,
			completedThisSession: completedGoalThisSession(cookies, year),
			inProgressStartDate,
			now,
		});

		if (!shouldOpen) {
			return null;
		}

		// Opening is what counts as seen, so dismissing without reading still stops it
		// coming back on the other page or in a later session.
		await setGoalRecapViewedPreference(year);
		return data;
	}

	return {
		GOAL_RECAP_DEEP_LINK,
		goalInReviewData,
		isEligible,
		loadAutoOpenRecap,
		loadGoalInReview,
		loading,
		hasSubmittedGoalFeedbackForYear,
		loadGoalPreferences: loadPreferences,
		setGoalFeedbackSubmittedPreference,
	};
}
