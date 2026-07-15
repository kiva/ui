<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<KivaCards
				v-if="showKivaCardsModule"
				:printable-kiva-cards="printableKivaCards"
				class="tw-mb-2.5"
				@view-pdf-clicked="scrollToReceipt"
			/>
			<!-- Non-tiered badge: badge appears BEFORE all goal modules -->
			<BadgeMilestone
				v-if="showBadgeBeforeGoals"
				data-testid="badge-milestone"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				:badge-achieved-ids="badgeAchievedIds"
				:only-kiva-cards-and-donations="onlyKivaCardsAndDonations"
				:loans="loans"
				:loan-comment-module-shown="showLoanComment"
				:kiva-cards-module-shown="showKivaCardsModule"
				:achievements-completed="achievementsCompleted"
				@continue-clicked="handleContinue(NON_TIERED_BADGE)"
				class="tw-mb-2.5"
			/>
			<!--  Start of donation context -->
			<OptInModule
				v-if="showDonationOptInModule"
				data-testid="donation-opt-in-module"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:only-donations="true"
				:achievements-completed="achievementsCompleted"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<AccountReceiptShare
				v-if="onlyDonations"
				ref="receiptSection"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:receipt="receipt"
				:lender="lender"
				:loans="loans"
				:show-receipt="showReceipt"
				:only-donations="onlyDonations"
				:guest-username="guestUsername"
				class="tw-mb-2.5"
			/>
			<!--  End of donation context -->

			<!-- Start goal module variations -->
			<GoalEntrypoint
				v-if="showGoalEntrypoint"
				:loading="goalDataLoading || isSettingGoal || isLoadingRecommendedLoan"
				:total-loans="totalLoans"
				:categories-loan-count="categoriesLoanCount"
				:is-goal-set="isGoalSet"
				:tiered-achievements="tieredAchievements"
				:selected-category="selectedCategory"
				:is-editing="isEditing"
				:goal-loans="goalTarget"
				:goal-progress="goalProgress"
				:goal-progress-percentage="goalProgressPercentage"
				:show-recommend-loan-after-goal-view="showRecommendLoanAfterGoalView"
				:has-recommended-loans="hasRecommendedLoans"
				:recommend-loan-card-props="recommendLoanCardProps"
				:recommend-loan-header-details="recommendLoanHeaderDetails"
				:recommend-loan-is-in-basket="recommendLoanIsInBasket"
				:loaded-set-data="loadedSetData"
				:is-adding="isAdding"
				:is-redirecting="isRedirecting"
				go-to-url="/mykiva"
				@edit-goal="editGoalCategory"
				@set-goal-target="setGoalTarget"
				@set-goal="setGoal"
				@add-to-basket="handleAddToBasket"
				class="tw-mb-2.5"
			/>
			<GoalCompleted
				v-else-if="showGoalCompletedModule"
				:current-goal="userGoal"
				:loading="goalDataLoading"
				class="tw-mb-2.5"
			/>
			<GoalInProgress
				v-else-if="showGoalInProgressModule"
				data-testid="goal-in-progress"
				:is-opted-in="isOptedIn"
				:loan="loanForComment"
				:current-goal="userGoal"
				:target-loans-amount="goalTargetLoansAmount"
				class="tw-mb-2.5"
			/>
			<!-- End goal module variations -->
			<OptInModule
				v-if="showNonDonationOptInModule"
				data-testid="opt-in-module"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:achievements-completed="achievementsCompleted"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<!-- Tiered badge achieved: appears AFTER goal and opt-in module -->
			<BadgeMilestone
				v-if="showBadgeAfterGoals"
				data-testid="badge-milestone"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				:badge-achieved-ids="badgeAchievedIds"
				:only-kiva-cards-and-donations="onlyKivaCardsAndDonations"
				:loans="loans"
				:loan-comment-module-shown="showLoanComment"
				:kiva-cards-module-shown="showKivaCardsModule"
				:achievements-completed="achievementsCompleted"
				@continue-clicked="handleContinue"
				class="tw-mb-2.5"
			/>
			<JourneyGeneralPrompt
				v-if="showJourneyModule"
				:loans="loans"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				@continue-as-guest="handleContinue"
				class="tw-mb-2.5"
			/>
			<LoanComment
				v-if="showLoanComment"
				:is-guest="isGuest"
				:loan="loanForComment"
				class="tw-mb-2.5"
				@guest-continue="handleContinue"
			/>
			<AccountReceiptShare
				v-if="!onlyDonations"
				ref="receiptSection"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:receipt="receipt"
				:lender="lender"
				:loans="loans"
				:show-receipt="showReceipt"
				:only-donations="onlyDonations"
				:guest-username="guestUsername"
			/>
		</div>
		<KvLightbox
			:visible="showGuestAccountModal"
			title="Finish creating your account to see what's next"
			@lightbox-closed="showGuestAccountModal = false"
		>
			<GuestAccountCreation
				event-label="create-new-account"
				:event-property="userType"
				:event-value="numberOfBadges"
				:guest-username="guestUsername"
			/>
		</KvLightbox>
		<GoalSettingModal
			v-if="showGoalModal"
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			:is-thanks-page="true"
			:number-of-loans="goalTarget"
			:goals-v2-enabled="true"
			:controlled-is-editing="isEditing"
			:controlled-selected-category="selectedCategory"
			@update-goal-choices="handleUpdateGoalChoices"
			@close-goal-modal="closeGoalModal"
			@set-goal="setGoal"
		/>
		<ExpressCheckoutModal
			v-if="!isGuest && isExpressCheckoutModalEnabled"
			ref="expressCheckoutModalRef"
			:loan="expressCheckoutLoan"
			@checkout-complete="handleExpressCheckoutComplete"
			@close="handleExpressCheckoutClose"
		/>
	</div>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
	toRef,
} from 'vue';
import { useRouter } from 'vue-router';

import confetti from 'canvas-confetti';
import _orderBy from 'lodash/orderBy';

import { KvLightbox } from '@kiva/kv-components';

import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import GoalCompleted from '#src/components/Thanks/SingleVersion/GoalCompleted';
import LoanComment from '#src/components/Thanks/SingleVersion/LoanComment';
import OptInModule from '#src/components/Thanks/SingleVersion/OptInModule';
import KivaCards from '#src/components/Thanks/SingleVersion/KivaCards';
import AccountReceiptShare from '#src/components/Thanks/SingleVersion/AccountReceiptShare';
import JourneyGeneralPrompt from '#src/components/Thanks/SingleVersion/JourneyGeneralPrompt';
import BadgeMilestone from '#src/components/Thanks/SingleVersion/BadgeMilestone';
import GoalEntrypoint from '#src/components/Thanks/SingleVersion/GoalEntrypoint';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import GoalInProgress from '#src/components/Thanks/SingleVersion/GoalInProgress';
import ExpressCheckoutModal from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutModal';
import useGoalData, { GOAL_STATUS } from '#src/composables/useGoalData';
import useGoalSettingRecommendedLoan, {
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT,
} from '#src/composables/useGoalSettingRecommendedLoan';
import useExpressCheckoutModal from '#src/composables/useExpressCheckoutModal';
import useBadgeData from '#src/composables/useBadgeData';
import {
	incrementGoalSignupThanksViewCount,
	isGoalSignupThanksViewCapped,
	setPostLendingCardCookie,
} from '#src/util/myKivaUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import useTipMessage from '#src/composables/useTipMessage';

const EVENT_CATEGORY = 'post-checkout';
const NON_TIERED_BADGE = 'non-tiered-badge';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const cookieStore = inject('cookieStore');
const $appConfig = inject('$appConfig', {});

const { $showTipMsg } = useTipMessage(apollo);

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	receipt: {
		type: Object,
		default: () => ({}),
	},
	monthlyDonationAmount: {
		type: String,
		default: '',
	},
	badgesAchieved: {
		type: Array,
		default: () => ([]),
	},
	guestUsername: {
		type: String,
		default: '',
	},
	achievementsCompleted: {
		type: Boolean,
		default: false,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	goalRecommendedLoanEnable: {
		type: Boolean,
		default: false,
	},
	isExpressCheckoutModalEnabled: {
		type: Boolean,
		default: false,
	},
	/**
	 * The user's most recent loan ids (from `my.loans`), excluded from the
	 * recommended-loan fetch alongside this checkout's loans.
	 */
	recentLoanIds: {
		type: Array,
		default: () => ([]),
	},
});

const receiptSection = ref(null);
const showGuestAccountModal = ref(false);
const showReceipt = ref(false);
const router = useRouter();
const showGoalModal = ref(false);
const hasContributingLoans = ref(false);
const isGoalSet = ref(false);
const isEmptyGoal = ref(true);
const goalTarget = ref(0);
const goalSignupThanksViewCapped = ref(false);

// Basket primitives are owned by ThanksPage's borrowerProfileExpMixin and
// bridged down via provide/inject so we don't duplicate addToBasket /
// loadInitialBasketItems here.
const thanksPageBasket = inject('thanksPageBasket');
const { basketItems, isAdding } = thanksPageBasket;

const {
	expressCheckoutModalRef,
	expressCheckoutLoan,
	isRedirecting,
	handleAddRecommendedLoanToBasket,
	handleExpressCheckoutComplete,
	handleExpressCheckoutClose,
} = useExpressCheckoutModal({
	addToBasket: thanksPageBasket.addToBasket,
	loadInitialBasketItems: thanksPageBasket.loadInitialBasketItems,
	basketItems: thanksPageBasket.basketItems,
	onResetAdding: thanksPageBasket.resetIsAdding,
	isExpressCheckoutEnabled: toRef(props, 'isExpressCheckoutModalEnabled'),
	kvTrackEvent: $kvTrackEvent,
});

const {
	checkCompletedGoal,
	getPostCheckoutProgressByLoans,
	getCtaHref,
	getRecommendedLoans,
	goalProgress,
	goalProgressPercentage,
	loadGoalData,
	loading: goalDataLoading,
	storeGoalPreferences,
	userGoal,
	userGoalAchievedNow,
	getCategories,
} = useGoalData({ apollo });

const { getAllCategoryLoanCounts } = useBadgeData();

const badgeAchievedIds = computed(() => props.badgesAchieved.map(b => b.achievementId));

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);
const selectedCategory = ref(categories[0]);

// Recommended-loan-after-goal step (shared logic with GoalSettingContainer)
const loadedSetData = ref(false);
const isSettingGoal = ref(false);
// Exclude the loans the user just supported in this transaction plus their most
// recent loans (`my.loans`) so none of them resurface as the recommendation.
const excludedLoanIds = computed(() => {
	const transactionLoanIds = (props.loans ?? []).map(loan => loan?.id).filter(Boolean);
	return [...new Set([...transactionLoanIds, ...props.recentLoanIds])];
});
const {
	showRecommendLoanAfterGoalView,
	hasRecommendedLoans,
	isLoadingRecommendedLoan,
	recommendLoanHeaderDetails,
	recommendedLoan,
	recommendLoanCardProps,
	recommendLoanIsInBasket,
	enterRecommendedLoanStepAfterGoalSave,
	onAddToBasketError,
	trackAddToBasketClick,
} = useGoalSettingRecommendedLoan({
	emit: () => {},
	goalRecommendedLoanEnable: toRef(props, 'goalRecommendedLoanEnable'),
	basketItems,
	selectedGoalNumber: goalTarget,
	selectedCategory,
	show: ref(true),
	goalProgress,
	getRecommendedLoans,
	getCtaHref,
	userGoal,
	kvTrackEvent: $kvTrackEvent,
	entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT,
	additionalExcludedLoanIds: excludedLoanIds,
	appConfig: $appConfig,
	apollo,
});

const goalTargetLoansAmount = computed(() => userGoal.value?.target ?? 0);

// Initialize goalDataInitialized to track if we've loaded goal data
// This prevents flash of journey module before loading completes
const goalDataInitialized = ref(false);

const userType = computed(() => (props.isGuest ? 'guest' : 'signed-in'));

// Guests should see the fallback equity version of the badge module
const numberOfBadges = computed(() => {
	return props.badgesAchieved.length || (props.isGuest ? 1 : 0);
});

const onlyDonations = computed(() => (
	(props.receipt && props.receipt?.totals?.itemTotal === props.receipt?.totals?.donationTotal)
		|| !!props.monthlyDonationAmount?.length
));

const printableKivaCards = computed(() => (props.receipt?.items?.values ?? [])
	.filter(item => item.basketItemType === 'kiva_card' && item.kivaCardObject?.deliveryType === 'print'));

const onlyKivaCardsAndDonations = computed(() => (props.receipt?.items?.values ?? [])
	.every(item => ['kiva_card', 'donation'].includes(item.basketItemType)));

const loanForComment = computed(() => {
	const orderedLoans = _orderBy(props.loans, ['unreservedAmount'], ['desc']);
	return orderedLoans[0];
});

const hasPfpLoan = computed(() => loanForComment.value?.inPfp ?? false);

const hasTeamAttributedPartnerLoan = computed(
	() => loanForComment.value?.distributionModel === 'fieldPartner' && !!loanForComment.value?.team?.name
);

const showOptInModule = computed(() => !props.isOptedIn);
const showDonationOptInModule = computed(() => showOptInModule.value && onlyDonations.value);
const showNonDonationOptInModule = computed(() => showOptInModule.value && !onlyDonations.value);
const showKivaCardsModule = computed(() => !!printableKivaCards.value.length);
const showGoalCompletedModule = computed(() => {
	// Show goal completed module immediately when user achieved their goal
	// Guests don't have goals, so never show for guests
	if (props.isGuest) return false;
	return userGoalAchievedNow.value;
});
const showGoalInProgressModule = computed(() => {
	return !props.isGuest
		&& userGoal.value?.status === GOAL_STATUS.IN_PROGRESS
		&& !userGoalAchievedNow.value
		&& hasContributingLoans.value;
});
const showBadgeModule = computed(() => {
	// Don't show badge module while loading goal data when experiment is enabled
	// This prevents the badge module from flashing before goal completed module
	if (!goalDataInitialized.value || goalDataLoading.value) {
		return false;
	}
	return numberOfBadges.value > 0;
});
const showJourneyModule = computed(() => {
	if (props.achievementsCompleted || showBadgeModule.value) return false;
	if (!goalDataInitialized.value || goalDataLoading.value) return false;
	if (showGoalInProgressModule.value) return false;
	if (onlyKivaCardsAndDonations.value) return false;
	return !userGoalAchievedNow.value;
});
const showLoanComment = computed(() => hasPfpLoan.value || hasTeamAttributedPartnerLoan.value);
const showGoalEntrypoint = computed(() => {
	return !props.isGuest
		&& goalDataInitialized.value
		&& isEmptyGoal.value
		&& !goalSignupThanksViewCapped.value;
});

// Only tiered when all achieved badges are tiered; non-tiered takes precedence
const hasOnlyTieredBadgesAchieved = computed(() => {
	return props.badgesAchieved.length > 0
		&& props.badgesAchieved.every(b => b.preCheckoutTier !== null);
});

// Non-tiered badge appears before all goal modules; tiered-only badge appears after GoalInProgress
const showBadgeBeforeGoals = computed(() => {
	return showBadgeModule.value && !hasOnlyTieredBadgesAchieved.value;
});

const showBadgeAfterGoals = computed(() => {
	return showBadgeModule.value && !showBadgeBeforeGoals.value;
});

const categoriesLoanCount = computed(() => {
	return getAllCategoryLoanCounts(props.tieredAchievements);
});

const showConfetti = () => {
	confetti({
		origin: {
			y: 0.2
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
};

const scrollToReceipt = () => {
	showReceipt.value = true;
	// Wait for order confirmation expandable to open before scrolling
	setTimeout(() => {
		receiptSection.value?.orderConfirmationContainer?.scrollIntoView({ behavior: 'smooth' });
	}, 500);
};

const handleContinue = (badgeType = null) => {
	const CLICK_EVENT_ACTION = 'click';
	if (props.isGuest) {
		showGuestAccountModal.value = true;
		$kvTrackEvent(
			EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'continue-to-my-kiva',
			userType.value,
			numberOfBadges.value,
		);
	} else {
		$kvTrackEvent(
			EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'continue-to-my-kiva',
			userType.value,
			numberOfBadges.value,
		);

		if (badgeType) {
			return router?.push('/portfolio/lending-stats#lend-stat-badges');
		}
		router?.push('/mykiva');
	}
};

const setGoal = async preferences => {
	isSettingGoal.value = true;
	try {
		await storeGoalPreferences(preferences);
		isGoalSet.value = true;
		showGoalModal.value = false;
		loadedSetData.value = true;
		enterRecommendedLoanStepAfterGoalSave();
	} catch (error) {
		logReadQueryError(error, 'MyKivaPage userPreferences watchQuery');
		$showTipMsg('There was a problem setting up this goal', 'error');
	} finally {
		isSettingGoal.value = false;
	}
};

const handleAddToBasket = payload => {
	trackAddToBasketClick();
	// Prefer the raw recommended loan over the card's blanked copy in the forwarded payload.
	handleAddRecommendedLoanToBasket({
		...payload,
		loan: recommendedLoan.value ?? payload.loan,
		onError: onAddToBasketError,
	});
};

const closeGoalModal = () => {
	if (showGoalModal.value) {
		showGoalModal.value = false;
		$kvTrackEvent(
			'post-checkout',
			'click',
			'close-goals'
		);
	}
};
const setGoalTarget = target => {
	goalTarget.value = target;
};

const isEditing = ref(false);

const editGoalCategory = () => {
	isEditing.value = true;
	showGoalModal.value = true;
};

const handleUpdateGoalChoices = updatedCategory => {
	selectedCategory.value = updatedCategory;
	isEditing.value = false;
	showGoalModal.value = false;
};

onMounted(async () => {
	await loadGoalData();
	const year = new Date().getFullYear();
	// Loans already in totalLoanCount after checkout
	const { totalProgress, hasContributingLoans: contributingLoans } = await getPostCheckoutProgressByLoans({
		loans: props.loans,
		year,
	});
	hasContributingLoans.value = contributingLoans;
	// Thanks can mark the goal complete, but MyKiva owns hiding the completed card after showing it once.
	await checkCompletedGoal({ currentGoalProgress: totalProgress, persistHideGoalCard: false });
	goalDataInitialized.value = true;
	isEmptyGoal.value = Object.keys(userGoal.value || {}).length === 0;
	goalSignupThanksViewCapped.value = !props.isGuest
		&& isEmptyGoal.value
		&& isGoalSignupThanksViewCapped(cookieStore);
	if (!props.isGuest
		&& isEmptyGoal.value
		&& !goalSignupThanksViewCapped.value) {
		incrementGoalSignupThanksViewCount(cookieStore);
	}

	if (!props.isGuest
		&& userGoal.value?.status === GOAL_STATUS.IN_PROGRESS) {
		$kvTrackEvent('post-checkout', 'show', userGoal.value?.category, goalProgress?.value, userGoal.value?.target);
	}

	showConfetti();
	const isOptInLoan = showOptInModule.value && props.loans.length > 0;
	const isOptInDonate = showOptInModule.value && onlyDonations.value;
	const badgeNotEarned = onlyKivaCardsAndDonations.value;
	const analyticsModuleOrder = [
		isOptInLoan ? 'optInLoan' : '',
		isOptInDonate ? 'optInDonate' : '',
		showOptInModule.value && !isOptInLoan && !isOptInDonate ? 'optInOther' : '',
		showKivaCardsModule.value ? 'kivaCard' : '',
		showBadgeModule.value && !onlyKivaCardsAndDonations.value ? 'journeyBadgeEarned' : '',
		showJourneyModule.value || badgeNotEarned ? 'journeyBadgeNotEarned' : '',
		showLoanComment.value ? 'commenting' : '',
		props.isGuest ? 'drawerCreateAccount' : '',
		'drawerOrderConfirmation',
		'drawerShare',
	].filter(s => !!s).join('-');
	$kvTrackEvent(
		EVENT_CATEGORY,
		'view',
		analyticsModuleOrder,
		userType.value,
	);

	// Track if all achievements have been earned
	if (props.achievementsCompleted) {
		$kvTrackEvent(
			'post-checkout',
			'view',
			'all-achievements-earned',
		);
	}

	setPostLendingCardCookie(cookieStore, props.loans?.length);
});
</script>

<style lang="postcss" scoped>
.content-box {
	@media (width < 733px) {
		width: 100%;
	}

	@media (width >= 734px) {
		width: 620px;
	}
}
</style>
