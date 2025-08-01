<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<OptInModule
				v-if="showOptInModule"
				:loans="loans"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:only-donations="onlyDonations"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<KivaCards
				v-if="showKivaCardsModule"
				:printable-kiva-cards="printableKivaCards"
				class="tw-mb-2.5"
				@view-pdf-clicked="scrollToReceipt"
			/>
			<BadgeMilestone
				v-if="showBadgeModule"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				:badge-achieved-ids="badgeAchievedIds"
				:only-kiva-cards-and-donations="onlyKivaCardsAndDonations"
				:loans="loans"
				:loan-comment-module-shown="showLoanComment"
				:kiva-cards-module-shown="showKivaCardsModule"
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
			<ControlModule
				v-if="showControlModule"
				:is-opted-in="isOptedIn"
				:only-kiva-cards="onlyKivaCards"
				@continue="handleContinue"
				class="print:tw-hidden tw-mb-2.5"
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
	ref,
	computed,
	onMounted,
	inject,
} from 'vue';
import confetti from 'canvas-confetti';
import LoanComment from '#src/components/Thanks/SingleVersion/LoanComment';
import OptInModule from '#src/components/Thanks/SingleVersion/OptInModule';
import KivaCards from '#src/components/Thanks/SingleVersion/KivaCards';
import AccountReceiptShare from '#src/components/Thanks/SingleVersion/AccountReceiptShare';
import ControlModule from '#src/components/Thanks/SingleVersion/ControlModule';
import JourneyGeneralPrompt from '#src/components/Thanks/SingleVersion/JourneyGeneralPrompt';
import BadgeMilestone from '#src/components/Thanks/SingleVersion/BadgeMilestone';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import { KvLightbox } from '@kiva/kv-components';
import { useRouter } from 'vue-router';
import _orderBy from 'lodash/orderBy';
import { setGuestAssignmentCookie } from '#src/util/myKivaUtils';

const EVENT_CATEGORY = 'post-checkout';

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
	myKivaEnabled: {
		type: Boolean,
		default: false,
	},
	guestUsername: {
		type: String,
		default: '',
	},
});

const receiptSection = ref(null);
const showReceipt = ref(false);
const router = useRouter();
const showGuestAccountModal = ref(false);
const badgeAchievedIds = ref(props.badgesAchieved.map(b => b.achievementId));

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

const onlyKivaCards = computed(() => (props.receipt?.items?.values ?? [])
	.every(item => item.basketItemType === 'kiva_card'));

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
const showBadgeModule = computed(() => {
	return props.myKivaEnabled && (numberOfBadges.value > 0 || onlyKivaCardsAndDonations.value);
});
const showJourneyModule = computed(() => props.myKivaEnabled && !showBadgeModule.value);
const showControlModule = computed(() => !props.myKivaEnabled);
const showLoanComment = computed(() => hasPfpLoan.value || hasTeamAttributedPartnerLoan.value);

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

		router?.push(props.myKivaEnabled ? '/mykiva' : '/portfolio');
	}
};

onMounted(() => {
	showConfetti();

	const isOptInLoan = showOptInModule.value && props.loans.length > 0;
	const isOptInDonate = showOptInModule.value && onlyDonations.value;
	const badgeNotEarned = onlyKivaCardsAndDonations.value && !showControlModule.value;

	const analyticsModuleOrder = [
		isOptInLoan ? 'optInLoan' : '',
		isOptInDonate ? 'optInDonate' : '',
		showOptInModule.value && !isOptInLoan && !isOptInDonate ? 'optInOther' : '',
		showKivaCardsModule.value ? 'kivaCard' : '',
		showBadgeModule.value && !onlyKivaCardsAndDonations.value ? 'journeyBadgeEarned' : '',
		showJourneyModule.value || badgeNotEarned ? 'journeyBadgeNotEarned' : '',
		showControlModule.value ? 'journeyGeneral' : '',
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

	setGuestAssignmentCookie(cookieStore, props.myKivaEnabled, props.isGuest);
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
