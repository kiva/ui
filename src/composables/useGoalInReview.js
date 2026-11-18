import {
	computed,
	inject,
	ref,
	toValue,
	watch,
} from 'vue';

import goalInReviewQuery from '#src/graphql/query/goalInReview.graphql';
import goalInReviewLenderQuery from '#src/graphql/query/goalInReviewLender.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import useGoalData from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import {
	findGoalForYear,
	getCategoryName,
	getGoalLoans,
	getGoalYear,
	getIsEligible,
	getLoanStats,
	mergeRecapExtras,
	scopeToGoalYear,
	shouldAutoOpenRecap,
	shouldHideGoalSignup,
	shouldShowRecapEntryPoint,
} from '#src/util/goalInReview';
import logFormatter from '#src/util/logFormatter';
import { getContentfulEntries } from '#src/util/contentfulUtils';
import useGoalNow from '#src/composables/useGoalNow';

// Open the Goal In Review recap from MyKiva with /mykiva?goTo=goal-recap.
export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

/**
 * Whether to hide the goal sign up ask, resolved against the route's ?goalDate override so the
 * server and the client agree. Every surface offering the ask shares this: each one renders or
 * not on this answer, so a server that disagreed would send markup the client throws away.
 *
 * @param {import('vue').MaybeRefOrGetter<Date|string|null>} recapStartDate The
 *   goal_in_review_in_progress_start setting, as a value, a ref or a getter.
 * @returns {{hideGoalSignup: import('vue').ComputedRef<boolean>}} Whether the sign up ask stays
 *   hidden.
 */
export function useHideGoalSignup(recapStartDate) {
	const { goalNow } = useGoalNow();
	return {
		hideGoalSignup: computed(() => shouldHideGoalSignup({
			recapStartDate: toValue(recapStartDate),
			now: goalNow.value,
		})),
	};
}

/**
 * The "View goal recap" entry point on the MyKiva goal card, shared by the featured slot
 * and the next steps carousel tile so both answer the same way.
 *
 * The Impact Progress row is deliberately not a caller: it offers its recap straight away.
 *
 * Resolves the current date itself, honoring the route's ?goalDate override, and asks callers about
 * the year it resolved. Callers must not resolve a year of their own, or they drift apart from
 * this one.
 *
 * @param {object} options Entry point inputs, describing the lender's active goal.
 * @param {boolean} options.enabled The goal_in_review_enable setting.
 * @param {string} options.goalStatus The goal's status.
 * @param {number|null} options.goalYear The goal's year.
 * @param {boolean} options.announced The hideGoalCard preference, which MyKiva writes on the
 *   visit that announces the completion.
 * @param {function(number): boolean} options.hasViewedRecap Whether the recap has already been
 *   opened, asked of the year this resolves.
 * @param {number} [options.loansTowardGoal] Loans made toward the goal.
 * @returns {object} The CTA state and whether the card must stay put.
 */
export function useGoalRecapEntryPoint({
	enabled,
	goalStatus,
	goalYear,
	announced,
	hasViewedRecap,
	loansTowardGoal = 0,
}) {
	const { goalNow, getGoalNow } = useGoalNow();

	// Snapshot: MyKiva writes `announced` mid-visit, so reading it live would show the CTA
	// seconds after the confetti. Keyed to the goal, which resolves alongside the preference.
	const announcedBeforeThisVisit = ref(null);
	const viewedBeforeThisVisit = ref(null);
	watch(
		() => toValue(goalStatus),
		status => {
			if (announcedBeforeThisVisit.value !== null || !status) return;
			announcedBeforeThisVisit.value = Boolean(toValue(announced));
			viewedBeforeThisVisit.value = Boolean(hasViewedRecap?.(goalNow.value.getFullYear()));
		},
		{ immediate: true },
	);

	const showRecapCta = computed(() => {
		// Read fresh, so a page left open across a date boundary decides by the current day.
		const currentDate = getGoalNow();
		return shouldShowRecapEntryPoint({
			enabled: toValue(enabled),
			goalStatus: toValue(goalStatus),
			goalYear: toValue(goalYear),
			currentYear: currentDate.getFullYear(),
			loansTowardGoal: toValue(loansTowardGoal),
			activeGoalYear: toValue(goalYear),
			holdUntilNextVisit: !announcedBeforeThisVisit.value,
			now: currentDate,
		});
	});

	// hideGoalCard would retire the card on the visit the recap arrives on, so the card is
	// held back for the two visits it still has work to do in.
	const keepGoalCardForRecap = computed(() => {
		if (!toValue(enabled)) {
			return false;
		}
		// Not yet known, or the visit that announces the win: either way the card stays.
		if (announcedBeforeThisVisit.value !== true) {
			return true;
		}
		// The recap's own visit, which outlasts the opening that marks it seen. After that the
		// card retires as it always did, and the Impact Progress row keeps its entry point.
		return showRecapCta.value && !viewedBeforeThisVisit.value;
	});

	return {
		announcedBeforeThisVisit,
		keepGoalCardForRecap,
		showRecapCta,
		viewedBeforeThisVisit,
	};
}

/**
 * Provides Goal In Review modal state and loads the shared recap payload.
 *
 * @param {object} options Composable options.
 * @param {object} [options.apollo] Apollo client; injected when omitted.
 * @param {object} [options.goalData] An existing useGoalData instance. Pass the page's
 *   own so the recap reads and writes the same preferences it does — each call to
 *   useGoalData owns a separate `userPreferences` ref.
 * @returns {object} Goal In Review state, eligibility, and loading function.
 */
export default function useGoalInReview({ apollo, goalData } = {}) {
	const apolloClient = apollo || inject('apollo');
	const {
		findMostRecentActiveGoal,
		getCategories,
		getCtaHref,
		getGoalSummary,
		hasViewedGoalRecapForYear,
		hideGoalCard,
		loadPreferences,
		setGoalRecapViewedPreference,
		hasSubmittedGoalFeedbackForYear,
		setGoalFeedbackSubmittedPreference,
	} = goalData || useGoalData({ apollo: apolloClient });
	const { getGoalNow } = useGoalNow();
	const loading = ref(false);
	const goalInReviewData = ref(null);

	// Recap loads by year for this page load, as promises so overlapping clicks share one fetch.
	// Not left to Apollo: the goal summary is never cached, and the cache outlives the page.
	const loadsByYear = new Map();
	// Seen-flag writes by year, shared the same way. A write that throws is dropped so the next
	// open retries; failures the preference helpers only log don't retry.
	const viewedWrites = new Map();

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

	// Resolved by year so a link or tile can reach a goal that expired or ended in an earlier year.
	async function loadGoalSummary(year) {
		try {
			const parsedPrefs = await loadPreferences();
			return await getGoalSummary(findGoalForYear(parsedPrefs?.goals, year)?.goalName);
		} catch (error) {
			logFormatter('useGoalInReview failed to load the goal summary', 'error', { error: error?.message });
			return null;
		}
	}

	/**
	 * Fetches the recap payload for one year.
	 *
	 * @param {number} year Recap year to load.
	 * @returns {Promise<{data: object, complete: boolean}>} The payload and whether all of it loaded.
	 */
	async function fetchGoalInReview(year) {
		const [summary, lenderData, contentfulData] = await Promise.all([
			loadGoalSummary(year),
			query(goalInReviewLenderQuery),
			query(contentfulEntriesQuery, { contentType: 'challenge', limit: 200 }, 'cache-first'),
		]);

		// getGoalSummary returns the monolith's own summary for support-all, which is
		// the only category it carries the recap extras for. Every other category is
		// built from achievements-service instead, so only one of the two is ever read.
		const monolithSummary = summary?.category === ID_SUPPORT_ALL ? summary : null;
		const recapData = summary && !monolithSummary
			? await query(goalInReviewQuery, { achievementId: summary.category, year })
			: null;
		const goalInReview = recapData?.goalInReview ?? null;
		const goalSummary = scopeToGoalYear(mergeRecapExtras(summary, monolithSummary), goalInReview);

		const data = {
			year,
			isEligible: getIsEligible(goalSummary),
			firstName: lenderData?.my?.userAccount?.firstName ?? '',
			goalSummary,
			categoryName: getCategoryName(
				goalSummary?.category,
				getContentfulEntries(contentfulData) ?? [],
				getCategories(),
			),
			loanStats: getLoanStats(goalSummary),
			goalLoans: getGoalLoans(goalSummary, goalInReview),
			lifetimePercentile: lenderData?.my?.lendingStats?.amountLentPercentile ?? null,
		};
		// A failed goal summary or recap query comes back ineligible, so eligibility covers both.
		const complete = data.isEligible && lenderData !== null && contentfulData !== null;
		return { data, complete };
	}

	/**
	 * Loads the recap data used by the modal and its slides. Reuses a year already loaded;
	 * failed or ineligible loads retry.
	 *
	 * @param {object} options Load options.
	 * @param {number} options.year Recap year to load.
	 * @returns {Promise<object>} Goal In Review data payload.
	 */
	async function loadGoalInReview({
		year = getGoalNow().getFullYear(),
	} = {}) {
		loading.value = true;
		try {
			if (!loadsByYear.has(year)) {
				const load = fetchGoalInReview(year);
				const drop = () => loadsByYear.delete(year);
				load.then(({ complete }) => complete || drop(), drop);
				loadsByYear.set(year, load);
			}
			const { data } = await loadsByYear.get(year);
			goalInReviewData.value = data;
			return goalInReviewData.value;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Href for the recap's "Finish my goal" CTA — the goal category's loan-finding
	 * page with the "Support N more" header, built with the same getCtaHref the
	 * goal cards use so both routes land on the same page. getCtaHref owns the
	 * missing-field guard, so callers null-check the result.
	 *
	 * @param {object} router Vue router instance (getCtaHref reads the current route).
	 * @returns {string|null} The loan-finding href; null when getCtaHref has no
	 *   category/target to build from (e.g. the recap hasn't loaded yet).
	 */
	function getFinishGoalHref(router) {
		const summary = goalInReviewData.value?.goalSummary;
		return getCtaHref(summary?.target, summary?.category, router, summary?.count ?? 0);
	}

	/**
	 * Whether this instance has opened the recap for a year and marked it seen.
	 *
	 * @param {number} year Recap year.
	 * @returns {boolean} True once marking it seen has started, unless that write threw.
	 */
	function hasOpenedRecap(year) {
		return viewedWrites.has(year);
	}

	/**
	 * Marks the recap seen for a year, once per instance.
	 *
	 * @param {number} year Recap year.
	 * @returns {Promise<void>}
	 */
	function markRecapViewed(year) {
		if (!viewedWrites.has(year)) {
			const write = Promise.resolve().then(() => setGoalRecapViewedPreference(year));
			write.catch(() => viewedWrites.delete(year));
			viewedWrites.set(year, write);
		}
		return viewedWrites.get(year);
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

		const parsedPrefs = await loadPreferences('network-only');
		// Captured now; any later and this visit's own write could open the recap over the celebration.
		const announcedBeforeThisVisit = hideGoalCard.value;
		const now = getGoalNow();
		const year = now.getFullYear();
		const hasViewedRecap = hasViewedGoalRecapForYear(year);
		if (hasViewedRecap) {
			return null;
		}

		// None of these need the recap itself, so check them first and skip loading it when
		// the pop-up can't open anyway.
		const goal = findMostRecentActiveGoal(parsedPrefs?.goals ?? []);
		const autoOpenRules = {
			enabled,
			goalStatus: goal?.status,
			goalYear: getGoalYear(goal),
			currentGoalYear: year,
			hasViewedRecap,
			holdUntilNextVisit: !announcedBeforeThisVisit,
			inProgressStartDate,
			now,
		};
		if (!shouldAutoOpenRecap(autoOpenRules)) {
			return null;
		}

		const data = await loadGoalInReview({ year });
		if (!data?.isEligible) {
			return null;
		}

		// Opening is what counts as seen, so dismissing without reading still stops it
		// coming back on the other page or in a later session.
		await markRecapViewed(year);
		return data;
	}

	return {
		GOAL_RECAP_DEEP_LINK,
		getFinishGoalHref,
		goalInReviewData,
		hasOpenedRecap,
		isEligible,
		loadAutoOpenRecap,
		loadGoalInReview,
		loading,
		markRecapViewed,
		hasSubmittedGoalFeedbackForYear,
		loadGoalPreferences: loadPreferences,
		setGoalFeedbackSubmittedPreference,
	};
}
