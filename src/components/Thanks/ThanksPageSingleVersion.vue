<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<KivaCards
				v-if="showKivaCardsModule"
				:printable-kiva-cards="printableKivaCards"
				class="tw-mb-2.5"
				@view-pdf-clicked="scrollToReceipt"
			/>
			<GoalEntrypoint
				v-if="isNextStepsExpEnabled && goalsV2Enabled && !isGuest && goalDataInitialized && isEmptyGoal"
				:loading="goalDataLoading"
				:total-loans="totalLoans"
				:categories-loan-count="categoriesLoanCount"
				:is-goal-set="isGoalSet"
				:tiered-achievements="tieredAchievements"
				@edit-goal="showGoalModal = true"
				@set-goal-target="setGoalTarget"
				@set-goal="setGoal"
				class="tw-mb-2.5"
			/>
			<GoalCompleted
				v-if="showGoalCompletedModule"
				:current-goal="userGoal"
				:get-goal-display-name="getGoalDisplayName"
				:loading="goalDataLoading"
				class="tw-mb-2.5"
			/>
			<BadgeMilestone
				v-else-if="showBadgeModule || achievementsCompleted"
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
			<OptInModule
				v-if="showOptInModule"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:only-donations="onlyDonations"
				:achievements-completed="achievementsCompleted"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<JourneyGeneralPrompt
				v-else-if="showJourneyModule"
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
			:goals-v2-enabled="goalsV2Enabled"
			@close-goal-modal="closeGoalModal"
			@set-goal="setGoal"
		/>
	</div>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
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
import useGoalData from '#src/composables/useGoalData';
import useBadgeData from '#src/composables/useBadgeData';
import { setGuestAssignmentCookie } from '#src/util/myKivaUtils';

const EVENT_CATEGORY = 'post-checkout';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const cookieStore = inject('cookieStore');

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
	isNextStepsExpEnabled: {
		type: Boolean,
		default: false,
	},
	goalsV2Enabled: {
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
});

const badgeAchievedIds = ref(props.badgesAchieved.map(b => b.achievementId));
const receiptSection = ref(null);
const showGuestAccountModal = ref(false);
const showReceipt = ref(false);
const router = useRouter();
const showGoalModal = ref(false);
const isGoalSet = ref(false);
const isEmptyGoal = ref(true);
const goalTarget = ref(0);
const currGoalProgress = ref(0);

const {
	checkCompletedGoal,
	getGoalDisplayName,
	getPostCheckoutProgressByLoans,
	loadGoalData,
	loading: goalDataLoading,
	postCheckoutSyncGoalCount,
	storeGoalPreferences,
	userGoal,
	userGoalAchievedNow,
} = useGoalData({ apollo });

const { getAllCategoryLoanCounts } = useBadgeData();

// Initialize goalDataInitialized to track if we've loaded goal data
// This prevents flash of journey module before loading completes
const goalDataInitialized = ref(!props.isNextStepsExpEnabled);

const userType = computed(() => (props.isGuest ? 'guest' : 'signed-in'));

// Guests and transactions without loans should see the fallback equity version of the badge module
const numberOfBadges = computed(() => {
	return props.badgesAchieved.length || (props.isGuest || props.loans.length === 0 ? 1 : 0);
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
const showKivaCardsModule = computed(() => !!printableKivaCards.value.length);
const showGoalCompletedModule = computed(() => {
	// Show goal completed module immediately when user achieved their goal
	if (!props.isNextStepsExpEnabled) return false;
	return userGoalAchievedNow.value;
});
const showBadgeModule = computed(() => {
	// Don't show badge module while loading goal data when experiment is enabled
	// This prevents the badge module from flashing before goal completed module
	if (props.isNextStepsExpEnabled && (!goalDataInitialized.value || goalDataLoading.value)) {
		return false;
	}
	// Don't show badge module if goal completed module will show
	if (showGoalCompletedModule.value) return false;
	return numberOfBadges.value > 0 || onlyKivaCardsAndDonations.value;
});
const showJourneyModule = computed(() => {
	if (props.achievementsCompleted || showBadgeModule.value) return false;
	// If experiment enabled, wait for initialization and loading to complete, and goal not achieved
	if (props.isNextStepsExpEnabled) {
		if (!goalDataInitialized.value || goalDataLoading.value) return false;
		return !userGoalAchievedNow.value;
	}
	// If experiment disabled, show journey module immediately
	return true;
});
const showLoanComment = computed(() => hasPfpLoan.value || hasTeamAttributedPartnerLoan.value);

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

const handleContinue = () => {
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
		router?.push('/mykiva');
	}
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	isGoalSet.value = true;
	showGoalModal.value = false;
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

onMounted(async () => {
	if (props.isNextStepsExpEnabled) {
		// Goals V2 is enabled if flag is true OR year >= 2026
		await loadGoalData({ yearlyProgress: props.goalsV2Enabled });
		// Use yearly progress with current year when Goals V2 is enabled, otherwise use all-time progress
		const year = props.goalsV2Enabled ? new Date().getFullYear() : null;
		// Loans already in totalLoanCount after checkout
		currGoalProgress.value = await getPostCheckoutProgressByLoans({
			loans: props.loans,
			year,
		});
		await postCheckoutSyncGoalCount({
			progressTotal: currGoalProgress.value,
			year,
		});
		await checkCompletedGoal({ currentGoalProgress: currGoalProgress.value });
		goalDataInitialized.value = true;
		isEmptyGoal.value = Object.keys(userGoal.value || {}).length === 0;
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
	setGuestAssignmentCookie(cookieStore, true, props.isGuest);

	// Track if all achievements have been earned
	if (props.achievementsCompleted) {
		$kvTrackEvent(
			'post-checkout',
			'view',
			'all-achievements-earned',
		);
	}
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
