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
			<ControlModule
				v-if="!myKivaEnabled"
				:is-opted-in="isOptedIn"
				@continue="handleContinue"
				class="print:tw-hidden tw-mb-2.5"
			/>
			<BadgeMilestone
				v-if="badgesAchieved.length > 0 && myKivaEnabled"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				:badge-achieved-ids="badgeAchievedIds"
				@continue-clicked="handleContinue"
				class="tw-mb-2.5"
			/>
			<JourneyGeneralPrompt
				v-if="badgesAchieved.length === 0 && myKivaEnabled"
				:loans="loans"
				:is-guest="isGuest"
				:is-opted-in="isOptedIn"
				@continue-as-guest="handleContinue"
				class="tw-mb-2.5"
			/>
			<KivaCards
				v-if="printableKivaCards.length"
				:printable-kiva-cards="printableKivaCards"
				class="tw-mb-2.5"
				@view-pdf-clicked="scrollToReceipt"
			/>
			<template v-if="!isGuest">
				<LoanComment
					v-for="loan in loans"
					:key="loan.id"
					:loan="loan"
					class="tw-mb-2.5"
				/>
			</template>
			<AccountReceiptShare
				ref="receiptSection"
				:is-guest="isGuest"
				:number-of-badges="numberOfBadges"
				:receipt="receipt"
				:lender="lender"
				:loans="loans"
				:show-receipt="showReceipt"
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
import OptInModule from '#src/components/Thanks/MyKiva/OptInModule';
import KivaCards from '#src/components/Thanks/SingleVersion/KivaCards';
import AccountReceiptShare from '#src/components/Thanks/SingleVersion/AccountReceiptShare';
import ControlModule from '#src/components/Thanks/SingleVersion/ControlModule';
import JourneyGeneralPrompt from '#src/components/Thanks/SingleVersion/JourneyGeneralPrompt';
import BadgeMilestone from '#src/components/Thanks/SingleVersion/BadgeMilestone';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import { KvLightbox } from '@kiva/kv-components';
import { MY_IMPACT_JOURNEYS_ID, MY_ACHIEVEMENTS_ID } from '#src/composables/useBadgeData';
import { useRouter } from 'vue-router';

const $kvTrackEvent = inject('$kvTrackEvent');

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
	}
});

const receiptSection = ref(null);
const showReceipt = ref(false);
const router = useRouter();
const showGuestAccountModal = ref(false);
const badgeAchievedIds = ref(props.badgesAchieved.map(b => b.achievementId));

const userType = computed(() => (props.isGuest ? 'guest' : 'signed-in'));

// Handle when a guest doesn't have access to achievement data but at least achieved the equity badge
const numberOfBadges = computed(() => (props.badgesAchieved.length || 1));

const showOptInModule = computed(() => !props.isOptedIn);

const onlyDonations = computed(() => (
	(props.receipt && props.receipt?.totals?.itemTotal === props.receipt?.totals?.donationTotal)
		|| !!props.monthlyDonationAmount?.length
));

const printableKivaCards = computed(() => (props.receipt?.items?.values ?? [])
	.filter(item => item.basketItemType === 'kiva_card' && item.kivaCardObject?.deliveryType === 'print'));

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
	const EVENT_CATEGORY = 'post-checkout';
	const CLICK_EVENT_ACTION = 'click';

	if (props.isGuest) {
		showGuestAccountModal.value = true;
		$kvTrackEvent(
			EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'continue-to-my-kiva',
			userType,
			numberOfBadges.value,
		);
	} else {
		$kvTrackEvent(
			EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'continue-to-my-kiva',
			userType,
			numberOfBadges.value,
		);

		const sectionToScrollTo = numberOfBadges.value === 1 ? MY_IMPACT_JOURNEYS_ID : MY_ACHIEVEMENTS_ID;

		router.push(`/portfolio${!numberOfBadges.value ? '' : `#${sectionToScrollTo}`}`);
	}
};

onMounted(showConfetti);
</script>

<style lang="postcss" scoped>
.content-box {
	max-width: 620px;
}
</style>
