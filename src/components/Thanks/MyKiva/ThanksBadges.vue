<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4">
		<OptInModule
			v-if="!isGuest && !optedIn"
			class="tw-pb-4"
			:selected-loan="selectedLoan"
			:loans="loans"
			:is-guest="isGuest"
		/>
		<div
			class="tw-rounded md:tw-rounded-lg tw-mx-auto tw-bg-white tw-shadow-lg tw-p-3"
			:style="{ maxWidth: '620px' }"
		>
			<div v-if="isGuest" class="tw-mb-2">
				<div
					class="option-box"
					:class="{ 'open' : openCreateAccount }"
					@click="openCreateAccount = !openCreateAccount"
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
				<KvExpandable
					v-show="openCreateAccount"
					easing="ease-in-out"
				>
					<div class="tw-py-2">
						<h2>Before you go!</h2>
						<p>Finish setting up your account to track and relend your money as you are paid back.</p>
						<GuestAccountCreation
							class="tw-pt-3"
							event-category="thanks"
							event-label="open-account-creation-drawer"
						/>
					</div>
				</KvExpandable>
			</div>
			<div class="tw-mb-2">
				<div
					class="option-box"
					:class="{ 'open' : openOrderConfirmation }"
					@click="openOrderConfirmation = !openOrderConfirmation"
				>
					<p class="tw-font-medium">
						Show confirmation
					</p>
					<KvMaterialIcon
						:icon="mdiChevronDown"
						class="expandable-button"
						:class="{ 'tw-rotate-180' : openOrderConfirmation }"
					/>
				</div>
				<KvExpandable
					v-show="openOrderConfirmation"
					easing="ease-in-out"
				>
					<div class="tw-py-2">
						<CheckoutReceipt
							v-if="receipt"
							:lender="lender"
							:receipt="receipt"
						/>
					</div>
				</KvExpandable>
			</div>
			<div
				class="option-box"
				:class="{ 'open' : openShareModule }"
				@click="openShareModule = !openShareModule"
			>
				<p class="tw-font-medium">
					Share
				</p>
				<KvMaterialIcon
					:icon="mdiChevronDown"
					class="expandable-button"
					:class="{'tw-rotate-180' : openShareModule}"
				/>
			</div>
			<KvExpandable
				v-show="openShareModule"
				easing="ease-in-out"
			>
				<div class="tw-py-2">
					<SocialShareV2
						v-if="receipt"
						class="social-share"
						:lender="lender"
						:loans="loans"
					/>
				</div>
			</KvExpandable>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import confetti from 'canvas-confetti';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvExpandable from '#src/components/Kv/KvExpandable';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import OptInModule from './OptInModule';

// TODO: ensure these props are all needed as functionality is expanded (some currently unused)
defineProps({
	selectedLoan: {
		type: Object,
		default: () => ({}),
	},
	isGuest: {
		type: Boolean,
		default: true,
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
	optedIn: {
		type: Boolean,
		default: false
	}
});

const openCreateAccount = ref(false);
const openOrderConfirmation = ref(false);
const openShareModule = ref(false);

onMounted(() => {
	confetti({
		origin: {
			y: 0.2
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
});
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
</style>
