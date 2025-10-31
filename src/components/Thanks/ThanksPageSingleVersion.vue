<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<OptInModule
				v-if="showOptInModule"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:only-donations="onlyDonations"
				:achievements-completed="achievementsCompleted"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<KivaCards
				v-if="showKivaCardsModule"
				:printable-kiva-cards="printableKivaCards"
				class="tw-mb-2.5"
				@view-pdf-clicked="scrollToReceipt"
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
import useGoalData from '#src/composables/useGoalData';
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
});

const badgeAchievedIds = ref(props.badgesAchieved.map(b => b.achievementId));
const receiptSection = ref(null);
const showGuestAccountModal = ref(false);
const showReceipt = ref(false);
const router = useRouter();

const {
	userGoal,
	userGoalAchievedNow,
	getGoalDisplayName,
	loadGoalData,
	checkCompletedGoal,
	loading: goalDataLoading,
} = useGoalData({ apollo });

// Initialize goalDataInitialized to track if we've loaded goal data
// This prevents flash of journey module before loading completes
const goalDataInitialized = ref(false);

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

/* eslint-disable max-len */
const showOptInModule = computed(() => !props.isOptedIn);
const showKivaCardsModule = computed(() => !!printableKivaCards.value.length);
const showBadgeModule = computed(() => (numberOfBadges.value > 0 || onlyKivaCardsAndDonations.value));
const showGoalCompletedModule = computed(() => {
	// Show goal module when experiment is enabled AND either:
	// - We haven't initialized yet (show loader)
	// - We're still loading (show loader)
	// - User achieved their goal (show completion)
	return props.isNextStepsExpEnabled && (!goalDataInitialized.value || goalDataLoading.value || userGoalAchievedNow.value);
});
const showJourneyModule = computed(() => {
	if (props.achievementsCompleted || (props.isNextStepsExpEnabled && !goalDataInitialized.value)) return false;
	// If experiment enabled, wait for initialization and loading to complete
	if (props.isNextStepsExpEnabled) return goalDataInitialized.value && !goalDataLoading.value && !userGoalAchievedNow.value;
	// If experiment disabled, show journey module immediately
	return true;
});
const showLoanComment = computed(() => hasPfpLoan.value || hasTeamAttributedPartnerLoan.value);
/* eslint-enable max-len */

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

onMounted(async () => {
	if (props.isNextStepsExpEnabled) {
		await loadGoalData(props.loans);
		await checkCompletedGoal();
		goalDataInitialized.value = true;
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
