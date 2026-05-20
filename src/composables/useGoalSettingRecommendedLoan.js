import {
	computed,
	ref,
	toRef,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';
import useTipMessage from '#src/composables/useTipMessage';

/**
 * Recommended-loan step state for {@link GoalSettingModal.vue}.
 *
 * The modal owns refs and passes them in; this composable does not call `defineProps` itself.
 *
 * @param {object} options
 * @param {Function} options.emit — Modal emit function (`defineEmits`), e.g. `set-goal`.
 * @param {object} options.props — GoalSettingModal’s full `defineProps` object; this composable only
 *   reads two keys via `toRef` (pass the same reactive reference the modal uses).
 *   - **`goalRecommendedLoanEnable`** (`boolean`): feature flag; when false the recommend-loan step
 *     and related fetch never activate.
 *   - **`basketItems`** (`Array`): shop/basket line items; each entry’s **`id`** is passed to
 *     `getRecommendedLoans` as exclusions (`loanIds.none`). Same array is forwarded on loan card
 *     props. Entries may include GraphQL fields such as **`__typename`** (e.g. `LoanReservation`) for
 *     “recommended loan already in basket” checks.
 * @param {object} options.selectedGoalNumber — Vue ref from the modal; `.value` is goal target (loan count).
 * @param {object} options.selectedCategory — Vue ref from the modal; `.value` has `name`, `badgeId`.
 * @param {object} options.show — Vue ref from the modal; `.value` is whether the lightbox is open.
 * @param {object} options.goalProgress — Vue ref from `useGoalData`; `.value` is loans toward goal this year.
 * @param {Function} options.getRecommendedLoans — From `useGoalData`; returns a promise of loans for a category id.
 * @param {Function} options.getCtaHref — From `useGoalData`; builds lend URL + optional header query.
 * @param {object} options.userGoal — Vue ref from `useGoalData`; `.value` is saved goal or null (`target`, `category`).
 * @param {Function} options.kvTrackEvent — Analytics helper from GoalSettingModal (`$kvTrackEvent`).
 * @param {object} [options.appConfig] — From GoalSettingModal (`$appConfig`), e.g. `photoPath`.
 * @param {object} options.apollo — Apollo client instance for tip message mutations.
 */
export default function useGoalSettingRecommendedLoan({
	emit,
	props,
	selectedGoalNumber,
	selectedCategory,
	show,
	goalProgress,
	getRecommendedLoans,
	getCtaHref,
	userGoal,
	kvTrackEvent,
	appConfig = {},
	apollo,
}) {
	const router = useRouter();
	const { $showTipMsg } = useTipMessage(apollo);

	const basketItems = toRef(props, 'basketItems');

	const showPostGoalLoanRecommendation = ref(false);
	const recommendedLoans = ref([]);
	const recommendedLoanIndex = ref(0);
	const recommendedLoan = ref(null);

	const showRecommendLoanAfterGoalView = computed(() => (
		props.goalRecommendedLoanEnable && showPostGoalLoanRecommendation.value
	));

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

	const resetRecommendedLoanState = () => {
		showPostGoalLoanRecommendation.value = false;
		recommendedLoans.value = [];
		recommendedLoanIndex.value = 0;
		recommendedLoan.value = null;
	};

	const enterRecommendedLoanStepAfterGoalSave = () => {
		if (props.goalRecommendedLoanEnable) {
			showPostGoalLoanRecommendation.value = true;
		}
	};

	const onGoalSelectorSetGoal = payload => {
		emit('set-goal', payload);
		enterRecommendedLoanStepAfterGoalSave();
	};

	const onGoalSelectorUpdateGoal = payload => {
		emit('set-goal', payload);
	};

	const handleExploreMoreLoans = () => {
		window.location.href = getCtaHref(
			userGoal.value?.target,
			userGoal.value?.category,
			router,
			goalProgress.value,
		);
	};

	const filteredLoanIds = computed(() => {
		return basketItems.value?.map(item => item.id) ?? [];
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
				return;
			}
			recommendedLoans.value = [];
			recommendedLoanIndex.value = 0;
			recommendedLoan.value = null;
			try {
				recommendedLoans.value = await getRecommendedLoans(categoryId, filteredLoanIds.value);
				recommendedLoan.value = recommendedLoans.value[0] ?? null;
			} catch {
				$showTipMsg('There was a problem loading a loan.', 'error');
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
		recommendLoanHeaderDetails,
		recommendLoanCardProps,
		recommendLoanIsInBasket,
		resetRecommendedLoanState,
		enterRecommendedLoanStepAfterGoalSave,
		onGoalSelectorSetGoal,
		onGoalSelectorUpdateGoal,
		handleExploreMoreLoans,
		onAddToBasketError,
	};
}
