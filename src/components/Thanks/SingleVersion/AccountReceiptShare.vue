<template>
	<div
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			print:tw-shadow-transparent"
	>
		<div v-if="isGuest" class="tw-mb-2 print:tw-hidden">
			<div
				class="option-box"
				:class="{ 'open' : openCreateAccount }"
				@click="handleClickCreateAccount"
			>
				<p class="tw-font-medium">
					Create your account
				</p>
				<KvMaterialIcon
					:icon="mdiChevronDown"
					class="expandable-button"
					:class="{ 'tw-rotate-180' : openCreateAccount }"
				/>
			</div>
			<KvExpandable easing="ease-in-out">
				<div v-show="openCreateAccount">
					<h2 class="tw-pt-2 tw-pb-3 tw-text-center">
						Before you go!
					</h2>
					<p>Finish setting up your account to track and relend your money as you are paid back.</p>
					<GuestAccountCreation
						class="tw-pt-3"
						:event-category="POST_CHECKOUT_EVENT_CATEGORY"
						event-label="create-new-account-from-drawer"
						:event-property="userType"
						:event-value="numberOfBadges"
						:guest-username="guestUsername"
					/>
				</div>
			</KvExpandable>
		</div>
		<div class="tw-mb-2">
			<div
				ref="orderConfirmationContainer"
				class="option-box print:!tw-hidden"
				:class="{ 'open' : openOrderConfirmation }"
				@click="handleClickOrderConfirmation"
			>
				<p class="tw-font-medium">
					{{ receiptTitle }}
				</p>
				<KvMaterialIcon
					:icon="mdiChevronDown"
					class="expandable-button"
					:class="{ 'tw-rotate-180' : openOrderConfirmation }"
				/>
			</div>
			<KvExpandable easing="ease-in-out">
				<div v-show="openOrderConfirmation">
					<CheckoutReceipt
						v-if="receipt"
						:lender="lender"
						:receipt="receipt"
						class="tw-pt-2"
					/>
				</div>
			</KvExpandable>
		</div>
		<div
			class="option-box print:!tw-hidden"
			:class="{ 'open' : openShareModule }"
			@click="handleClickShareDrawer"
		>
			<p class="tw-font-medium">
				Share
			</p>
			<KvMaterialIcon
				:icon="mdiChevronDown"
				class="expandable-button"
				:class="{ 'tw-rotate-180' : openShareModule }"
			/>
		</div>
		<KvExpandable easing="ease-in-out">
			<SocialShareV2
				v-show="openShareModule"
				class="social-share"
				:lender="lender"
				:loans="loans"
			/>
		</KvExpandable>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	computed,
	watch,
	defineExpose
} from 'vue';
import { KvMaterialIcon, KvExpandable } from '@kiva/kv-components';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import { mdiChevronDown } from '@mdi/js';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	numberOfBadges: {
		type: Number,
		default: 0,
	},
	receipt: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	showReceipt: {
		type: Boolean,
		default: false,
	},
	onlyDonations: {
		type: Boolean,
		default: false,
	},
	guestUsername: {
		type: String,
		default: ''
	},
});

const POST_CHECKOUT_EVENT_CATEGORY = 'post-checkout';
const CLICK_EVENT_ACTION = 'click';
const orderConfirmationContainer = ref(null);
const openCreateAccount = ref(false);
const openOrderConfirmation = ref(false);
const openShareModule = ref(false);

const userType = computed(() => (props.isGuest ? 'guest' : 'signed-in'));

const receiptTitle = computed(() => (props.onlyDonations ? 'Donation receipt' : 'Order confirmation'));

const handleClickCreateAccount = () => {
	openCreateAccount.value = !openCreateAccount.value;

	if (openCreateAccount.value) {
		$kvTrackEvent(
			POST_CHECKOUT_EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'open-account-creation-drawer',
			userType,
			props.numberOfBadges,
		);
	}
};

const handleClickOrderConfirmation = () => {
	openOrderConfirmation.value = !openOrderConfirmation.value;

	if (openOrderConfirmation.value) {
		$kvTrackEvent(
			POST_CHECKOUT_EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'open-order-confirmation-drawer',
			userType.value,
			props.numberOfBadges,
		);
	}
};

const handleClickShareDrawer = () => {
	openShareModule.value = !openShareModule.value;

	if (openShareModule.value) {
		$kvTrackEvent(
			POST_CHECKOUT_EVENT_CATEGORY,
			CLICK_EVENT_ACTION,
			'open-share-drawer',
			userType.value,
			props.numberOfBadges,
		);
	}
};

watch(() => props.showReceipt, newValue => {
	if (newValue) {
		openOrderConfirmation.value = true;
	}
});

defineExpose({ orderConfirmationContainer });
</script>

<style lang="postcss" scoped>
.option-box {
	@apply tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;

	transition: border 0.2s ease, border-radius 0.5s ease;
}

.option-box.open {
	@apply tw-border-t-transparent tw-border-l-transparent tw-border-r-transparent tw-rounded-none;
}

.expandable-button {
	@apply tw-transition-transform tw-ease-in-out tw-duration-500;
}

.social-share :deep(.share__social.social) {
	@apply tw-w-full;
}

.social-share :deep(.share__social button) {
	@apply tw-rounded;
}
</style>
