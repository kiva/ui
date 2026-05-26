import {
	computed,
	ref,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';
import useTipMessage from '#src/composables/useTipMessage';

/**
 * Recommended-loan step state shared by {@link GoalSettingModal.vue} and
 * {@link GoalSettingContainer.vue}.
 *
 * The host component owns refs and passes them in; this composable does not call `defineProps`.
 *
 * @param {object} options
 * @param {Function} options.emit — Host emit function (`defineEmits`), e.g. `set-goal`.
 * @param {object} options.goalRecommendedLoanEnable — Vue ref; `.value` is the feature-flag boolean.
 *   When false the recommend-loan step and related fetch never activate.
 * @param {object} options.basketItems — Vue ref; `.value` is the shop/basket line items array.
 *   `LoanReservation` entries’ **`id`** (the loan id) are sent to `getRecommendedLoans` as
 *   exclusions (`loanIds.none`) and drive the “recommended loan already in basket” check via
 *   **`__typename`**. The array is also forwarded on the loan card props.
 * @param {object} options.selectedGoalNumber — Vue ref from the modal; `.value` is goal target (loan count).
 * @param {object} options.selectedCategory — Vue ref from the modal; `.value` has `name`, `badgeId`.
 * @param {object} options.show — Vue ref from the modal; `.value` is whether the lightbox is open.
 * @param {object} options.goalProgress — Vue ref from `useGoalData`; `.value` is loans toward goal this year.
 * @param {Function} options.getRecommendedLoans — From `useGoalData`; returns a promise of loans for a category id.
 * @param {Function} options.getCtaHref — From `useGoalData`; builds lend URL + optional header query.
 * @param {object} options.userGoal — Vue ref from `useGoalData`; `.value` is saved goal or null (`target`, `category`).
 * @param {Function} options.kvTrackEvent — Analytics helper from GoalSettingModal (`$kvTrackEvent`).
 * @param {string} [options.entrypoint] — Where the composable is mounted. Use one of the exported
 *   `GOAL_RECOMMENDED_LOAN_ENTRYPOINT_*` constants; selects the analytics category for
 *   recommended-loan events. Omit to disable recommended-loan tracking.
 * @param {object} [options.appConfig] — From GoalSettingModal (`$appConfig`), e.g. `photoPath`.
 * @param {object} options.apollo — Apollo client instance for tip message mutations.
 */
export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO = 'portfolio';
export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT = 'post-checkout';
export const GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE = 'goals-page';

const ENTRYPOINT_TRACK_CATEGORY = {
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO]: 'portfolio',
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT]: 'post-checkout',
	[GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE]: 'event-tracking',
};

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
	appConfig = {},
	apollo,
}) {
	const router = useRouter();
	const { $showTipMsg } = useTipMessage(apollo);

	const showPostGoalLoanRecommendation = ref(false);
	const recommendedLoans = ref([]);
	const recommendedLoanIndex = ref(0);
	const recommendedLoan = ref(null);
	const isLoadingRecommendedLoan = ref(false);

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
		return {
			...base,
			loan,
			loanId: loan.id,
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

	const trackRecommendedLoanEvent = (action, label) => {
		if (!trackCategory || typeof kvTrackEvent !== 'function') return;
		kvTrackEvent(trackCategory, action, label);
	};

	const trackAddToBasketClick = () => {
		trackRecommendedLoanEvent('click', 'add-goal-confirmed-loan-to-basket');
	};

	// On Thanks page the primary "checkout" CTA drives the in-context checkout and is
	// tracked as `complete-order`; everywhere else it's a standard `go-to-checkout` click.
	const trackCheckoutClick = () => {
		trackRecommendedLoanEvent('click', isPostCheckout ? 'complete-order' : 'go-to-checkout');
	};

	const resetRecommendedLoanState = () => {
		showPostGoalLoanRecommendation.value = false;
		recommendedLoans.value = [];
		recommendedLoanIndex.value = 0;
		recommendedLoan.value = null;
	};

	const enterRecommendedLoanStepAfterGoalSave = () => {
		if (goalRecommendedLoanEnable.value) {
			// Mark in-flight synchronously so the host's loading state covers
			// the upcoming fetch (avoids a brief "no loan yet" flicker).
			isLoadingRecommendedLoan.value = true;
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
		return (basketItems.value ?? [])
			// eslint-disable-next-line no-underscore-dangle
			.filter(item => item.__typename === 'LoanReservation')
			.map(item => item.id);
	});

	watch(show, visible => {
		if (!visible) {
			recommendedLoans.value = [];
			recommendedLoanIndex.value = 0;
			recommendedLoan.value = null;
			return;
		}
		showPostGoalLoanRecommendation.value = false;
	});

	watch(
		() => [showRecommendLoanAfterGoalView.value, selectedCategory.value?.badgeId],
		async ([visible, categoryId]) => {
			if (!visible || !categoryId) {
				recommendedLoans.value = [];
				recommendedLoanIndex.value = 0;
				recommendedLoan.value = null;
				isLoadingRecommendedLoan.value = false;
				return;
			}
			recommendedLoans.value = [];
			recommendedLoanIndex.value = 0;
			recommendedLoan.value = null;
			isLoadingRecommendedLoan.value = true;
			try {
				recommendedLoans.value = await getRecommendedLoans(categoryId, filteredLoanIds.value);
				recommendedLoan.value = recommendedLoans.value[0] ?? null;
			} catch {
				$showTipMsg('There was a problem loading a loan.', 'error');
			} finally {
				isLoadingRecommendedLoan.value = false;
			}
		},
	);

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
