import {
	computed,
	inject,
	ref,
} from 'vue';

import goalInReviewSummaryQuery from '#src/graphql/query/goalInReviewSummary.graphql';
import goalInReviewAchievementsQuery from '#src/graphql/query/goalInReviewAchievements.graphql';
import goalInReviewLenderQuery from '#src/graphql/query/goalInReviewLender.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import useGoalData from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import logFormatter from '#src/util/logFormatter';
import {
	getCategoryName,
	getGoalLoans,
	getIsEligible,
	getLoanStats,
	mergeRecapExtras,
	scopeToGoalWindow,
} from '#src/util/goalInReviewPayload';

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
 * @returns {object} Goal In Review state, eligibility, and loading function.
 */
export default function useGoalInReview({ apollo } = {}) {
	const apolloClient = apollo || inject('apollo');
	const { getGoalSummary } = useGoalData({ apollo: apolloClient });
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
			const [summary, achievementsData, lenderData, contentfulData] = await Promise.all([
				loadGoalSummary(),
				query(goalInReviewAchievementsQuery, { year }),
				query(goalInReviewLenderQuery),
				query(contentfulEntriesQuery, { contentType: 'challenge', limit: 200 }, 'cache-first'),
			]);

			// The monolith only computes my.goalSummary for support-all.
			const extras = summary?.category === ID_SUPPORT_ALL
				? await query(goalInReviewSummaryQuery, { goalName: summary.goalName })
				: null;

			const achievements = achievementsData?.userAchievementProgress?.tieredLendingAchievements ?? [];
			const goalSummary = scopeToGoalWindow(
				mergeRecapExtras(summary, extras?.my?.goalSummary),
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

	return {
		GOAL_RECAP_DEEP_LINK,
		goalInReviewData,
		isEligible,
		loadGoalInReview,
		loading,
	};
}
