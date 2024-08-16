<template>
	<div
		class="md:tw-my-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-h-full tw-bg-stone-1"
		:style="{maxWidth: '620px', minHeight: '1012px', boxShadow: '0px 5px 25px 0px #D1DCD6'}"
	>
		<div>
			<div
				class="tw-text-center md:tw-rounded-t hide-for-print"
			>
				<div class="new-background tw-h-full tw-w-full" :class="{ 'grow': badgeBlurRevealing }"></div>
				<div class="tw-relative">
					<div
						:class="{'tw-hidden': discoverBadges}"
						style="background: linear-gradient(166.92deg, #276A43 4.84%, #4DD083 95.26%);"
						class="tw-pt-4 tw-pb-5"
					>
						<h1
							class="tw-mb-1 tw-transition-all tw-duration-1000 tw-ease-in-out"
							:class="{
								'tw-relative tw-z-2 tw-text-black': badgeBlurRevealCompleted,
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
						<div class="tw-mt-3" :class="{'tw-relative': !badgeBlurRevealing}">
							<div class="badge-container" :class="{'tw-flex-col': badgeBlurRevealing}">
								<div class="tw-relative" :class="{'tw-z-1': badgeBlurRevealing}">
									<div
										v-if="badgeBlurRevealCompleted"
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
										:src="imageRequire(`./equity-badge.svg`)"
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
											:src="imageRequire(`./gift.svg`)"
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
						:class="{'tw-hidden': discoverBadges}"
					>
						<p class="tw-pb-4">
							<!-- eslint-disable-next-line max-len -->
							You are a hero! Thanks to your loan, we are one step closer to a more financially inclusive world.
						</p>
						<kv-button
							class="tw-w-full tw-mb-2"
							@click="showAllBadges"
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
										Show previous loan details
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
			</div>
		</div>
		<transition name="fade">
			<DiscoverSection
				v-if="discoverBadges"
				:selected-loan-region="selectedLoanRegion"
				:is-guest="isGuest"
				@back-to-earned-badge="discoverBadges = false"
			/>
		</transition>
	</div>
</template>

<script>
import { addMonths, differenceInWeeks } from 'date-fns';
import LoanNextSteps from '@/components/Thanks/LoanNextSteps';
import KvExpandable from '@/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import GuestAccountCreation from '@/components/Forms/GuestAccountCreation';
import confetti from 'canvas-confetti';
import AnimatedStars from '@/components/Thanks/AnimatedStars';
import DiscoverSection from '@/components/Thanks/Badges/DiscoverSection';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const imageRequire = require.context('@/assets/images/thanks-page/', true);

export default {
	name: 'BadgesCustomization',
	components: {
		LoanNextSteps,
		KvExpandable,
		CheckoutReceipt,
		SocialShareV2,
		GuestAccountCreation,
		KvButton,
		KvMaterialIcon,
		AnimatedStars,
		DiscoverSection,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		selectedLoan: {
			type: Object,
			default: () => ({})
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		lender: {
			type: Object,
			default: () => ({})
		},
		loans: {
			type: Array,
			default: () => ([])
		},
		receipt: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			openCreateAccount: false,
			openOrderConfirmation: false,
			openShareModule: false,
			mdiChevronDown,
			imageRequire,
			isBlurred: true,
			isMobileLayout: false,
			wiggle: false,
			badgeBlurRevealing: false,
			badgeBlurRevealCompleted: false,
			discoverBadges: false,
		};
	},
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
		selectedLoanRegion() {
			return this.selectedLoan?.geocode?.country?.region ?? '';
		},
	},
	methods: {
		hash(loan) {
			return loan?.image?.hash ?? '';
		},
		toggleBlur() {
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
		showAllBadges() {
			this.discoverBadges = true;
		},
	},
	created() {
		this.$kvTrackEvent('thanks', 'view', 'equity badge', this.isGuest ? 'guest' : 'signed-in');
	},
	mounted() {
		this.isMobileLayout = window.innerWidth < 1024;

		this.wiggle = true;
		setTimeout(() => {
			this.wiggle = false;
		}, 1000);

		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#6AC395', '#223829', '#95D4B3'],
			disableForReducedMotion: true,
		});
	},
};
</script>

<style lang="postcss" scoped>

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.ghost-button >>> span {
	@apply tw-bg-transparent tw-border-black;
}

.no-border >>> span {
	@apply tw-bg-transparent tw-border-0;
}

.account-creation >>> input {
	@apply tw-bg-stone-1;
}

.secondary-container {
	@apply tw-bg-stone-1 tw-w-full tw-px-3 md:tw-px-8 tw-z-1 tw-pt-3;
}

.option-box {
	transition: border 0.2s ease, border-radius 0.5s ease;
	@apply tw-w-full tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;
}

.social-share >>> .share__social.social {
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

.reveal-button >>> span {
	opacity: 90%;
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

.new-background {
	transition: all 1s ease-in-out;
	@apply tw-bg-stone-1 tw-absolute tw-top-1/2 tw-left-1/2 tw-w-0 tw-h-0 tw-z-1;
}

.grow {
	@apply tw-w-full tw-h-full tw-top-0 tw-left-0 tw-transform-none;
}

.fade-enter-active {
	transition: opacity 1s;
}

.fade-enter {
	opacity: 0;
}

</style>
