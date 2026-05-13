import {
	computed,
	inject,
	ref,
	toRef,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';

/**
 * State and props for the “recommended loan after goal” step in GoalSettingModal.
 */
export default function useGoalSettingRecommendedLoan({
	emit,
	props,
	selectedGoalNumber,
	selectedCategory,
	show,
	goalProgress,
	getRecommendedLoans,
}) {
	const router = useRouter();
	const appConfig = inject('$appConfig', {});
	const $kvTrackEvent = inject('$kvTrackEvent');

	const goalRecommendedLoanEnable = toRef(props, 'goalRecommendedLoanEnable');
	const basketItems = toRef(props, 'basketItems');

	const showPostGoalLoanRecommendation = ref(false);
	const recommendedLoan = ref(null);

	const showRecommendLoanAfterGoalView = computed(() => (
		goalRecommendedLoanEnable.value && showPostGoalLoanRecommendation.value
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
		const kvTrackFunction = (...args) => {
			$kvTrackEvent(...args);
		};
		const base = {
			photoPath,
			showTags: true,
			externalLinks: true,
			customLoanDetails: true,
			showLightView: true,
			basketItems: basketItems.value ?? [],
			route: router.currentRoute.value,
			kvTrackFunction,
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
			item => item.__typename === 'LoanReservation' && item.id === recommendedLoan.value?.id
		)
	));

	function resetRecommendedLoanState() {
		showPostGoalLoanRecommendation.value = false;
		recommendedLoan.value = null;
	}

	function enterRecommendedLoanStepAfterGoalSave() {
		if (goalRecommendedLoanEnable.value) {
			showPostGoalLoanRecommendation.value = true;
		}
	}

	function onGoalSelectorSetGoal(payload) {
		emit('set-goal', payload);
		enterRecommendedLoanStepAfterGoalSave();
	}

	function onGoalSelectorUpdateGoal(payload) {
		emit('set-goal', payload);
	}

	watch(show, visible => {
		if (!visible) {
			recommendedLoan.value = null;
			return;
		}
		showPostGoalLoanRecommendation.value = false;
	});

	watch(
		() => [showRecommendLoanAfterGoalView.value, selectedCategory.value?.badgeId],
		async ([visible, categoryId]) => {
			if (!visible || !categoryId) {
				recommendedLoan.value = null;
				return;
			}
			recommendedLoan.value = null;
			try {
				const loans = await getRecommendedLoans(categoryId);
				recommendedLoan.value = loans[0] ?? null;
			} catch {
				recommendedLoan.value = null;
			}
		},
	);

	return {
		showRecommendLoanAfterGoalView,
		recommendLoanHeaderDetails,
		recommendLoanCardProps,
		recommendLoanIsInBasket,
		resetRecommendedLoanState,
		enterRecommendedLoanStepAfterGoalSave,
		onGoalSelectorSetGoal,
		onGoalSelectorUpdateGoal,
	};
}
