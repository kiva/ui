import {
	computed,
	ref,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';
import useTipMessage from '#src/composables/useTipMessage';
import { fetchAiLoanPills } from '#src/util/aiLoanPillsUtils';

export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO = 'portfolio';
export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT = 'post-checkout';
export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE = 'goals-page';

const ENTRYPOINT_TRACK_CATEGORY = {
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO]: 'portfolio',
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT]: 'post-checkout',
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE]: 'event-tracking',
};

/**
 * Recommended-loan step state shared by the goal-setting hosts (the goal modal, the
 * goals page, and the post-checkout thanks page).
 *
 * The host component owns the reactive inputs and passes them in; this composable does
 * not declare its own props.
 *
 * @param {object} options
 * @param {Function} options.emit — Host emit function (`defineEmits`), e.g. `set-goal`.
 * @param {object} options.goalRecommendedLoanEnable — Vue ref; `.value` is the feature-flag boolean.
 *   When false the recommend-loan step and related fetch never activate.
 * @param {object} options.basketItems — Vue ref; `.value` is the shop/basket line items array.
 *   `LoanReservation` entries’ **`id`** (the loan id) are sent to `getRecommendedLoans` as
 *   exclusions (`loanIds.none`) and drive the “recommended loan already in basket” check via
 *   **`__typename`**. The array is also forwarded on the loan card props.
 * @param {object} options.selectedGoalNumber — Vue ref; `.value` is the goal target (loan count).
 * @param {object} options.selectedCategory — Vue ref; `.value` has `name`, `badgeId`.
 * @param {object} options.show — Vue ref (must be reactive, not a bare boolean); `.value` is
 *   whether the recommended-loan view is active — a modal's lightbox-open flag, or a constant
 *   `true` in hosts that always show the view.
 * @param {object} options.goalProgress — Vue ref; `.value` is loans completed toward the goal this year.
 * @param {Function} options.getRecommendedLoans — Returns a promise of recommended loans for a category id.
 * @param {Function} options.getCtaHref — Builds the lend URL with an optional header query.
 * @param {object} options.userGoal — Vue ref; `.value` is the saved goal or null (`target`, `category`).
 * @param {object} [options.additionalExcludedLoanIds] — Optional Vue ref; `.value` is an array of
 *   loan ids to also exclude from the recommended-loan fetch (e.g. loans the user just made).
 * @param {Function} options.kvTrackEvent — Analytics tracking function.
 * @param {string} [options.entrypoint] — Where the composable is mounted. Use one of the exported
 *   `GOAL_RECOMMENDED_LOAN_ENTRYPOINT_*` constants; selects the analytics category for
 *   recommended-loan events. Omit to disable recommended-loan tracking.
 * @param {object} [options.appConfig] — App config values, e.g. `photoPath`.
 * @param {object} options.apollo — Apollo client instance for tip message mutations and AI loan pill fetches.
 */
export default function useGoalSettingRecommendedLoan({
	emit,
	goalRecommendedLoanEnable,
	basketItems,
	selectedGoalNumber,
	selectedCategory,
	show,
	goalProgress,
	getRecommendedLoans,
	getCtaHref,
	userGoal,
	kvTrackEvent,
	entrypoint,
	additionalExcludedLoanIds,
	appConfig = {},
	apollo,
}) {
	const router = useRouter();
	const { $showTipMsg } = useTipMessage(apollo);

	const showPostGoalLoanRecommendation = ref(false);
	const recommendedLoans = ref([]);
	const recommendedLoanIndex = ref(0);
	const recommendedLoan = ref(null);
	const isLoadingRecommendedLoanData = ref(false);
	const isLoadingRecommendedLoanPills = ref(false);
	const recommendedLoanPills = ref([]);

	// Keep the host's loading skeleton up until BOTH the loan and its AI pills have
	// resolved, so the card appears once with its final callouts instead of rendering
	// the loan's own tags and then popping them out when the pills arrive.
	const isLoadingRecommendedLoan = computed(() => (
		isLoadingRecommendedLoanData.value || isLoadingRecommendedLoanPills.value
	));

	const showRecommendLoanAfterGoalView = computed(() => (
		goalRecommendedLoanEnable.value && showPostGoalLoanRecommendation.value
	));

	// True once the fetch has resolved with at least one recommended loan.
	// Callers gate the recommended-loan UI on `showRecommendLoanAfterGoalView && hasRecommendedLoans`
	// so the new section is skipped entirely when there is nothing to recommend.
	const hasRecommendedLoans = computed(() => recommendedLoans.value.length > 0);

	const recommendLoanHeaderDetails = computed(() => {
		const segments = [];
		if (selectedGoalNumber.value) {
			segments.push(`${selectedGoalNumber.value} loan goal`);
		}
		const label = selectedCategory.value?.name?.trim();
		if (label) {
			segments.push(label);
		}
		if (goalProgress.value > 0) {
			const p = goalProgress.value;
			segments.push(`${p} ${p === 1 ? 'loan' : 'loans'} completed`);
		}
		return segments;
	});

	// The loan object handed to the card. When AI pills are present, blank the loan's
	// own callout sources (activity/sector/tags/themes) so the loan card renders only
	// the pills instead of appending them after its default callouts. Derived on its own
	// so the (cloned) loan reference stays stable across basket/route changes and the card
	// doesn't needlessly re-process it.
	const recommendedLoanForCard = computed(() => {
		const loan = recommendedLoan.value;
		if (!loan?.id || !recommendedLoanPills.value.length) {
			return loan;
		}
		return {
			...loan,
			activity: {},
			sector: {},
			tags: [],
			themes: [],
		};
	});

	const recommendLoanCardProps = computed(() => {
		const loan = recommendedLoan.value;
		const photoPath = appConfig?.photoPath ?? '';
		const base = {
			photoPath,
			showTags: true,
			externalLinks: true,
			customLoanDetails: true,
			showLightView: true,
			basketItems: basketItems.value ?? [],
			route: router.currentRoute.value,
			kvTrackFunction: kvTrackEvent,
		};
		if (!loan?.id) {
			return base;
		}
		const pills = recommendedLoanPills.value;
		return {
			...base,
			loan: recommendedLoanForCard.value,
			loanId: loan.id,
			...(pills.length ? { customCallouts: pills } : {}),
		};
	});

	const recommendLoanIsInBasket = computed(() => (
		(basketItems.value ?? []).some(
			// eslint-disable-next-line no-underscore-dangle
			item => item.__typename === 'LoanReservation' && item.id === recommendedLoan.value?.id
		)
	));

	const trackCategory = ENTRYPOINT_TRACK_CATEGORY[entrypoint];
	const isPostCheckout = entrypoint === GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT;

	const trackRecommendedLoanEvent = (action, label, property = null, value = null) => {
		if (!trackCategory || typeof kvTrackEvent !== 'function') return;
		kvTrackEvent(trackCategory, action, label, property, value);
	};

	const trackAddToBasketClick = (loanId, lendAmount) => {
		trackRecommendedLoanEvent(
			'click',
			'add-goal-confirmed-loan-to-basket',
			loanId,
			lendAmount,
		);
	};

	// On Thanks page the primary "checkout" CTA drives the in-context checkout and is
	// tracked as `complete-order`; everywhere else it's a standard `go-to-checkout` click.
	const trackCheckoutClick = () => {
		trackRecommendedLoanEvent('click', isPostCheckout ? 'complete-order' : 'go-to-checkout');
	};

	// Clears the recommended-loan data (loan + pills) and both in-flight flags. Does NOT
	// touch `showPostGoalLoanRecommendation` so that watch handlers can call it
	// without re-triggering themselves (resetting the step flag from inside
	// the view watch would cause a recursive flip).
	const clearRecommendedLoanData = () => {
		recommendedLoans.value = [];
		recommendedLoanIndex.value = 0;
		recommendedLoan.value = null;
		recommendedLoanPills.value = [];
		isLoadingRecommendedLoanData.value = false;
		isLoadingRecommendedLoanPills.value = false;
	};

	const resetRecommendedLoanState = () => {
		clearRecommendedLoanData();
		showPostGoalLoanRecommendation.value = false;
	};

	const enterRecommendedLoanStepAfterGoalSave = () => {
		if (goalRecommendedLoanEnable.value) {
			// Mark in-flight synchronously so the host's loading state covers
			// the upcoming fetch (avoids a brief "no loan yet" flicker).
			isLoadingRecommendedLoanData.value = true;
			showPostGoalLoanRecommendation.value = true;
			trackRecommendedLoanEvent('view', 'confirm-goal-set-recommended-loan');
		}
	};

	const onGoalSelectorSetGoal = payload => {
		emit('set-goal', payload);
		enterRecommendedLoanStepAfterGoalSave();
	};

	const onGoalSelectorUpdateGoal = payload => {
		emit('set-goal', payload);
		enterRecommendedLoanStepAfterGoalSave();
	};

	const handleExploreMoreLoans = () => {
		trackRecommendedLoanEvent('click', 'explore-more-loans');
		window.location.href = getCtaHref(
			userGoal.value?.target,
			userGoal.value?.category,
			router,
			goalProgress.value,
		);
	};

	const filteredLoanIds = computed(() => {
		// Only LoanReservation entries carry a loan id; other basket item types
		// (donations, Kiva Cards, etc.) must not be sent as loan exclusions.
		const fromBasket = (basketItems.value ?? [])
			// eslint-disable-next-line no-underscore-dangle
			.filter(item => item.__typename === 'LoanReservation')
			.map(item => item.id);
		const additional = additionalExcludedLoanIds?.value ?? [];
		// Currently is not possible for the same loan id to be in both arrays, but dedupe just in case.
		return [...new Set([...fromBasket, ...additional])];
	});

	watch(show, visible => {
		if (!visible) return;
		// Reset on open so the recommended-loan view stays rendered through
		// the previous close animation and starts fresh on the next session.
		clearRecommendedLoanData();
		showPostGoalLoanRecommendation.value = false;
	});

	watch(
		() => [showRecommendLoanAfterGoalView.value, selectedCategory.value?.badgeId],
		async ([visible, categoryId]) => {
			if (!visible || !categoryId) {
				clearRecommendedLoanData();
				return;
			}
			clearRecommendedLoanData();
			isLoadingRecommendedLoanData.value = true;
			try {
				recommendedLoans.value = await getRecommendedLoans(categoryId, filteredLoanIds.value);
				recommendedLoan.value = recommendedLoans.value[0] ?? null;
			} catch {
				$showTipMsg('There was a problem loading a loan.', 'error');
			} finally {
				isLoadingRecommendedLoanData.value = false;
			}
		},
	);

	// Fetch AI loan pills for whichever loan is currently recommended, refetching when
	// the recommended loan advances. The pills-loading flag folds into the host skeleton
	// (see `isLoadingRecommendedLoan`) so the card waits for pills and appears once with
	// its final callouts. Leaves pills empty (card falls back to its own callouts) when
	// the query returns nothing or errors.
	watch(() => recommendedLoan.value?.id, async loanId => {
		recommendedLoanPills.value = [];
		if (!loanId) {
			isLoadingRecommendedLoanPills.value = false;
			return;
		}
		isLoadingRecommendedLoanPills.value = true;
		const result = await fetchAiLoanPills(apollo, [loanId]);
		// Ignore a late response if the recommended loan advanced while awaiting; the
		// newer invocation owns the loading flag from here.
		if (recommendedLoan.value?.id !== loanId) {
			return;
		}
		recommendedLoanPills.value = result?.[0]?.pills ?? [];
		isLoadingRecommendedLoanPills.value = false;
	});

	const onAddToBasketError = () => {
		recommendedLoan.value = null;
		setTimeout(() => {
			recommendedLoanIndex.value += 1;
			recommendedLoan.value = recommendedLoans.value[recommendedLoanIndex.value] ?? null;
		}, 500); // brief delay to allow UI showing a loading state for the next loan card
	};

	return {
		showRecommendLoanAfterGoalView,
		hasRecommendedLoans,
		isLoadingRecommendedLoan,
		recommendLoanHeaderDetails,
		// Raw recommended loan for domain actions (add-to-basket); its callout fields are never blanked.
		recommendedLoan,
		// Loan-card props. `loan` here is callout-blanked for display when pills exist —
		// use `recommendedLoan` for domain actions instead.
		recommendLoanCardProps,
		recommendLoanIsInBasket,
		resetRecommendedLoanState,
		enterRecommendedLoanStepAfterGoalSave,
		onGoalSelectorSetGoal,
		onGoalSelectorUpdateGoal,
		handleExploreMoreLoans,
		onAddToBasketError,
		trackAddToBasketClick,
		trackCheckoutClick,
	};
}
