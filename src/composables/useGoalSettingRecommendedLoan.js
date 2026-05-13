import {
	computed,
	ref,
	toRef,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';

/**
 * State and props for the “recommended loan after goal” step in GoalSettingModal.
 * @param {object} options
 * @param {import('vue').Ref<object|null>} options.userGoal — annual goal from `useGoalData`.
 * @param {Function} options.getCtaHref — from `useGoalData`; lend URL + header query.
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
}) {
	const router = useRouter();

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
			kvTrackEvent?.(...args);
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
			// eslint-disable-next-line no-underscore-dangle
			item => item.__typename === 'LoanReservation' && item.id === recommendedLoan.value?.id
		)
	));

	const resetRecommendedLoanState = () => {
		showPostGoalLoanRecommendation.value = false;
		recommendedLoan.value = null;
	};

	const enterRecommendedLoanStepAfterGoalSave = () => {
		if (goalRecommendedLoanEnable.value) {
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
		handleExploreMoreLoans,
	};
}
