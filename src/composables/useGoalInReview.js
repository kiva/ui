import {
	computed,
	inject,
	ref,
	toValue,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';

import goalInReviewQuery from '#src/graphql/query/goalInReview.graphql';
import goalInReviewLenderQuery from '#src/graphql/query/goalInReviewLender.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import useGoalData, { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import {
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

// Open the Goal In Review recap from MyKiva with /mykiva?goTo=goal-recap.
export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

/**
 * Returns the current date, applying the ?recapDate=YYYY-MM-DD URL override (dev/QA only; production
 * users never pass it). A bare date is read as the user's LOCAL midnight. The override is permanent
 * QA tooling shared by the goal recap and the goal-card countdown; without it, the browser clock wins.
 *
 * Example: /mykiva?goTo=goal-recap&recapDate=2027-01-01
 *
 * @param {string} [recapDate] The override, read from the route rather than the address bar, which
 *   does not exist on the server. Anything deciding what the server renders has to pass it, or the
 *   server resolves the real date and the client then hydrates something else.
 * @returns {Date} The effective "now" for Goal In Review logic.
 */
export function getGoalInReviewNow(recapDate = null) {
	const param = recapDate || (typeof window !== 'undefined'
		? new URLSearchParams(window.location.search).get('recapDate')
		: null);
	if (param) {
		// Parse a bare YYYY-MM-DD as LOCAL midnight, not UTC. `new Date('2027-04-01')` is
		// UTC per spec, which in a negative-offset zone (e.g. America/Los_Angeles) lands on
		// the previous evening — pushing the effective "now" a day back and breaking the
		// March-31 recap cutoff and the year-boundary checks in QA. Anything with
		// an explicit time is left as-is.
		const override = /^\d{4}-\d{2}-\d{2}$/.test(param)
			? new Date(`${param}T00:00:00`)
			: new Date(param);
		if (!Number.isNaN(override.getTime())) {
			return override;
		}
	}
	return new Date();
}

/**
 * The ?recapDate override, read off the route so the server can see it too. getGoalInReviewNow
 * otherwise falls back to the address bar, which only the browser has, so anything whose markup
 * depends on the override reads it here and both sides agree.
 *
 * @returns {{recapDate: import('vue').ComputedRef<string|string[]|null>}} The override, or null
 *   when none is set. A repeated query param arrives as an array, which getGoalInReviewNow cannot
 *   parse and treats as no override.
 */
export function useRecapDateOverride() {
	// Optional on purpose: this carries a QA param only, so a caller mounted without a router
	// reads no override instead of failing, and still gets the address-bar fallback.
	const router = useRouter();
	return { recapDate: computed(() => router?.currentRoute?.value?.query?.recapDate ?? null) };
}

/**
 * Whether to hide the goal sign up ask, resolved against the route's ?recapDate override so the
 * server and the client agree. Every surface offering the ask shares this: each one renders or
 * not on this answer, so a server that disagreed would send markup the client throws away.
 *
 * @param {import('vue').MaybeRefOrGetter<Date|string|null>} recapStartDate The
 *   goal_in_review_in_progress_start setting, as a value, a ref or a getter.
 * @returns {{hideGoalSignup: import('vue').ComputedRef<boolean>}} Whether the sign up ask stays
 *   hidden.
 */
export function useHideGoalSignup(recapStartDate) {
	const { recapDate } = useRecapDateOverride();
	return {
		hideGoalSignup: computed(() => shouldHideGoalSignup({
			recapStartDate: toValue(recapStartDate),
			now: getGoalInReviewNow(recapDate.value),
		})),
	};
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
 * @param {string} [recapDate] The override read from the route, for callers that run during SSR.
 * @returns {number} The current year.
 */
export function getGoalInReviewCurrentYear(recapDate = null) {
	return getGoalInReviewNow(recapDate).getFullYear();
}

/**
 * The "View goal recap" entry point on the MyKiva goal card, shared by the featured slot
 * and the next steps carousel tile so both answer the same way.
 *
 * The Impact Progress row is deliberately not a caller: it offers its recap straight away.
 *
 * Resolves the current date itself, from the route's ?recapDate override, and asks callers about
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
	const { recapDate } = useRecapDateOverride();
	const resolveGoalInReviewNow = () => getGoalInReviewNow(recapDate.value);

	// Snapshot: MyKiva writes `announced` mid-visit, so reading it live would show the CTA
	// seconds after the confetti. Keyed to the goal, which resolves alongside the preference.
	const announcedBeforeThisVisit = ref(null);
	const viewedBeforeThisVisit = ref(null);
	watch(
		() => toValue(goalStatus),
		status => {
			if (announcedBeforeThisVisit.value !== null || !status) return;
			announcedBeforeThisVisit.value = Boolean(toValue(announced));
			viewedBeforeThisVisit.value = Boolean(hasViewedRecap?.(resolveGoalInReviewNow().getFullYear()));
		},
		{ immediate: true },
	);

	const showRecapCta = computed(() => {
		const currentDate = resolveGoalInReviewNow();
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
			const recapData = summary && !monolithSummary
				? await query(goalInReviewQuery, { achievementId: summary.category, year })
				: null;
			const goalInReview = recapData?.goalInReview ?? null;
			const goalSummary = scopeToGoalYear(mergeRecapExtras(summary, monolithSummary), goalInReview);

			goalInReviewData.value = {
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
		const now = getGoalInReviewNow();
		const year = getGoalInReviewTargetYear(now);
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
			currentGoalYear: GOALS_CURRENT_YEAR,
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
		await setGoalRecapViewedPreference(year);
		return data;
	}

	return {
		GOAL_RECAP_DEEP_LINK,
		getFinishGoalHref,
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
