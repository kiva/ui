<template>
	<div
		class="tw-relative tw-text-center md:tw-rounded-t hide-for-print"
	>
		<div
			class="tw-pt-4 tw-pb-5 bg-gradient"
		>
			<h1
				class="tw-mb-1 tw-transition-all tw-duration-1000 tw-ease-in-out tw-relative tw-z-2"
				:class="{
					'tw-text-black': badgeBlurRevealCompleted,
					'tw-text-white': !badgeBlurRevealCompleted
				}"
			>
				{{ headerTitle }}
			</h1>
			<p
				class="tw-text-subhead tw-px-3 md:tw-px-8
									tw-transition-all tw-duration-1000 tw-ease-in-out"
				:class="{
					'tw-relative tw-z-2 tw-text-black': badgeBlurRevealCompleted,
					'tw-text-white': !badgeBlurRevealCompleted
				}"
			>
				{{ headerCopy }}
			</p>
			<div class="tw-relative tw-mt-3" :class="{'tw-relative': !badgeBlurRevealing}">
				<div class="badge-container" :class="{'tw-flex-col': badgeBlurRevealing}">
					<div class="tw-relative" :class="{'tw-z-1': badgeBlurRevealing} ">
						<div
							:class="{'tw-hidden': !badgeBlurRevealCompleted}"
							class="tw-absolute tw-h-full tw-z-docked tw-left-1/2 -tw-translate-x-1/2"
						>
							<animated-stars :style="{ minWidth: '14rem'}" class="tw-h-full" />
						</div>

						<img
							:class="{
								'blurred': isBlurred,
								'wiggle': wiggle,
								'tw-z-2': badgeBlurRevealing
							}"
							:src="imageRequire('equity-badge.svg')"
							class="badge"
							alt="Gift icon"
						>
					</div>

					<kv-button
						@click="toggleBlur"
						variant="secondary"
						class="reveal-button"
						:class="{'tw-hidden': badgeBlurRevealing}"
						v-kv-track-event="[
							'thanks',
							'click',
							'reveal-badge',
						]"
					>
						<span class="tw-flex tw-items-center tw-gap-1">
							<img
								:src="imageRequire('gift.svg')"
								class="tw-w-3 tw-h-3"
								alt="Gift icon"
							>
							{{ revealBtnCta }}
						</span>
					</kv-button>
				</div>
			</div>
		</div>
		<div
			v-if="badgeBlurRevealCompleted" class="tw-absolute tw-z-2 tw-px-3"
		>
			<p class="tw-pb-4">
				<!-- eslint-disable-next-line max-len -->
				You made a difference! Thanks to your contribution we are one step closer to a more financially inclusive world.
			</p>
			<kv-button
				class="tw-w-full tw-mb-2"
				@click="$emit('show-discover-badges')"
				v-kv-track-event="[
					'thanks',
					'click',
					'discover-more-badges',
				]"
			>
				Discover more badges
			</kv-button>
			<div>
				<kv-button
					v-if="!isGuest"
					class="tw-w-full no-border"
					to="/portfolio"
					variant="secondary"
					v-kv-track-event="[
						'thanks',
						'click',
						'go-to-my-kiva',
						'Button seen after badge reveal'
					]"
				>
					Go to my kiva
				</kv-button>
				<div
					v-else
					class="option-box"
					:class="{'open' : openCreateAccount}"
					@click="() => openCreateAccount = !openCreateAccount"
					v-kv-track-event="[
						'thanks',
						'click',
						'open-account-creation-drawer',
					]"
				>
					<p class="tw-font-medium">
						Create your account
					</p>
					<kv-material-icon
						:icon="mdiChevronDown"
						class="expandable-button"
						:class="{'tw-rotate-180' : openCreateAccount}"
					/>
				</div>
				<kv-expandable
					v-show="openCreateAccount"
					easing="ease-in-out"
				>
					<div class="tw-py-2">
						<h2>Before you go!</h2>
						<!-- eslint-disable-next-line max-len -->
						<p>Finish setting up your account to track and relend your money as you are paid back.</p>
						<guest-account-creation
							class="tw-pt-3 account-creation"
							event-category="thanks"
							event-label="open-account-creation-drawer"
						/>
					</div>
				</kv-expandable>
			</div>
		</div>
		<div v-else>
			<div
				class="secondary-container"
			>
				<h3 class="tw-text-center tw-pt-1">
					You are now part of {{ borrowerName }}'s journey! Here's what's next:
				</h3>
				<loan-next-steps
					class="tw-mb-5"
					:weeks-to-repay="weeksToRepay"
				/>
				<div class="tw-mb-2 hide-for-print">
					<div v-if="!isGuest">
						<kv-button
							class="tw-w-full ghost-button"
							to="/portfolio"
							variant="secondary"
							v-kv-track-event="[
								'thanks',
								'click',
								'go-to-my-kiva',
							]"
						>
							Go to my kiva
						</kv-button>
					</div>
					<div
						v-else
						class="option-box"
						:class="{'open' : openCreateAccount}"
						@click="() => openCreateAccount = !openCreateAccount"
						v-kv-track-event="[
							'thanks',
							'click',
							'open-account-creation-drawer',
						]"
					>
						<p class="tw-font-medium">
							Create your account
						</p>
						<kv-material-icon
							:icon="mdiChevronDown"
							class="expandable-button"
							:class="{'tw-rotate-180' : openCreateAccount}"
						/>
					</div>
					<kv-expandable
						v-show="openCreateAccount"
						easing="ease-in-out"
					>
						<div class="tw-py-2">
							<h2>Before you go!</h2>
							<!-- eslint-disable-next-line max-len -->
							<p>Finish setting up your account to track and relend your money as you are paid back.</p>
							<guest-account-creation
								class="tw-pt-3 account-creation"
								event-category="thanks"
								event-label="open-account-creation-drawer"
							/>
						</div>
					</kv-expandable>
				</div>
			</div>
			<div class="tw-pt-2 tw-pb-5 tw-border-t tw-px-3 md:tw-px-8" style="border-top-color: #ECE4D5;">
				<div class="tw-mb-2">
					<!-- eslint-disable-next-line max-len -->
					<div
						class="option-box hide-for-print"
						:class="{'open' : openOrderConfirmation}"
						@click="() => openOrderConfirmation = !openOrderConfirmation"
						v-kv-track-event="[
							'thanks',
							'click',
							'open-order-confirmation-drawer',
						]"
					>
						<p class="tw-font-medium">
							Show confirmation
						</p>
						<kv-material-icon
							:icon="mdiChevronDown"
							class="expandable-button"
							:class="{'tw-rotate-180' : openOrderConfirmation}"
						/>
					</div>
					<kv-expandable
						v-show="openOrderConfirmation"
						easing="ease-in-out"
					>
						<div class="tw-py-2">
							<checkout-receipt
								v-if="receipt"
								:lender="lender"
								:receipt="receipt"
							/>
						</div>
					</kv-expandable>
				</div>
				<div class="hide-for-print">
					<div
						class="option-box"
						:class="{'open' : openShareModule}"
						@click="() => openShareModule = !openShareModule"
						v-kv-track-event="[
							'thanks',
							'click',
							'open-share-drawer',
						]"
					>
						<p class="tw-font-medium">
							Share
						</p>
						<kv-material-icon
							:icon="mdiChevronDown"
							class="expandable-button"
							:class="{'tw-rotate-180' : openShareModule}"
						/>
					</div>
					<kv-expandable
						v-show="openShareModule"
						easing="ease-in-out"
					>
						<div class="tw-py-2">
							<social-share-v2
								v-if="receipt"
								class="social-share"
								:lender="lender"
								:loans="loans"
							/>
						</div>
					</kv-expandable>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { addMonths, differenceInWeeks } from 'date-fns';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import AnimatedStars from '#src/components/Thanks/AnimatedStars';
import KvExpandable from '#src/components/Kv/KvExpandable';
import LoanNextSteps from '#src/components/Thanks/LoanNextSteps';
import KvButton from '@kiva/kv-components/dist/components/KvButton';
import KvMaterialIcon from '@kiva/kv-components/dist/components/KvMaterialIcon';
import { metaGlobReader } from '#src/util/importHelpers';

const imageGlob = import.meta.glob('/src/assets/images/thanks-page/*.*', { eager: true, query: '?url' });
const imageRequire = metaGlobReader(imageGlob, '/src/assets/images/thanks-page/');

export default {
	name: 'FirstScreen',
	components: {
		LoanNextSteps,
		KvExpandable,
		CheckoutReceipt,
		SocialShareV2,
		GuestAccountCreation,
		AnimatedStars,
		KvButton,
		KvMaterialIcon,
	},
	emits: ['show-new-bg', 'show-discover-badges'],
	props: {
		receipt: {
			type: Object,
			default: () => ({})
		},
		lender: {
			type: Object,
			default: () => ({})
		},
		loans: {
			type: Array,
			default: () => ([])
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		selectedLoan: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			mdiChevronDown,
			imageRequire,
			isBlurred: true,
			isMobileLayout: false,
			wiggle: false,
			badgeBlurRevealing: false,
			badgeBlurRevealCompleted: false,
			openCreateAccount: false,
			openOrderConfirmation: false,
			openShareModule: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	computed: {
		borrowerName() {
			return this.selectedLoan?.name ?? '';
		},
		weeksToRepay() {
			const date = this.selectedLoan?.terms?.expectedPayments?.[0]?.dueToKivaDate ?? null;
			const today = new Date();
			if (date) {
				// Get the number of weeks between the first repayment date (in the future) and now
				return `${differenceInWeeks(Date.parse(date), today)} weeks`;
			}

			// Calculating a possible range of weeks between the planned expiration date and a month after
			const expDate = Date.parse(this.selectedLoan?.plannedExpirationDate);
			const minDate = differenceInWeeks(addMonths(today, 1), today);
			const maxDate = differenceInWeeks(addMonths(expDate, 1), today);

			if (minDate === maxDate) {
				return `${minDate} weeks`;
			}

			return `${minDate} - ${maxDate} weeks`;
		},
		headerTitle() {
			return this.badgeBlurRevealCompleted ? 'Congrats!' : 'Success!';
		},
		headerCopy() {
			return this.badgeBlurRevealCompleted
				? 'You earned your first badge'
				: 'Celebrate your first loan with a special gift. 🙌';
		},
		revealBtnCta() {
			return `${this.isMobileLayout ? 'Tap' : 'Click'} to reveal`;
		},
	},
	methods: {
		toggleBlur() {
			this.$emit('show-new-bg');
			this.isBlurred = !this.isBlurred;
			if (!this.isBlurred) {
				this.badgeBlurRevealing = true;
			} else {
				this.badgeBlurRevealing = false;
			}

			setTimeout(() => {
				this.badgeBlurRevealCompleted = true;
			}, 1000);
		},
	},
	mounted() {
		this.isMobileLayout = window.innerWidth < 1024;

		this.wiggle = true;
		setTimeout(() => {
			this.wiggle = false;
		}, 1000);
	}
};
</script>

<style lang="postcss" scoped>

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.ghost-button :deep(span) {
	@apply tw-bg-transparent tw-border-black;
}

.no-border :deep(span) {
	@apply tw-bg-transparent tw-border-0;
}

.account-creation :deep(input) {
	@apply tw-bg-stone-1;
}

.secondary-container {
	@apply tw-bg-stone-1 tw-w-full tw-px-3 md:tw-px-8 tw-z-1 tw-pt-3;
}

.option-box {
	transition: border 0.2s ease, border-radius 0.5s ease;
	@apply tw-w-full tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;
}

.social-share :deep(.share__social.social) {
	@apply tw-w-full;
}

.option-box.open {
	@apply tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-rounded-none;
}

.hide-for-print {
	@apply print:tw-hidden;
}

.badge-container {
	box-shadow: 0 4px 12px 0 #00000014;
	transition: filter 0.3s ease;
	width: 228px;
	height: 233px;
	background-color: #F3F1EF33;
	@apply tw-flex tw-items-center tw-justify-center tw-mx-auto tw-rounded-lg;
}

.badge {
	width: 180px;
	height: 185px;
	transition: filter 2s ease;
}

.blurred {
	filter: blur(8px);
}

.reveal-button {
	@apply tw-absolute tw-bottom-3;
}

.reveal-button :deep(span) {
	opacity: 0.9;
	@apply tw-border-black;
}

@keyframes wiggle {
	0% {
		transform: rotate(0deg);
		filter: blur(8px);
	}

	25% {
		transform: rotate(-10deg);
	}

	50% {
		transform: rotate(10deg);
		filter: blur(2px);
	}

	75% {
		transform: rotate(-10deg);
	}

	100% {
		transform: rotate(0deg);
		filter: blur(8px);
	}
}

.wiggle {
	animation: wiggle 1s ease-in-out;
}

.bg-gradient {
	background: linear-gradient(166.92deg, #276A43 4.84%, #4DD083 95.26%);
}

</style>
