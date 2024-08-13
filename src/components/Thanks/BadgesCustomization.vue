<template>
	<div
		class="md:tw-my-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-relative"
		:style="{maxWidth: '620px', boxShadow: '0px 5px 25px 0px #D1DCD6'}"
	>
		<div class="tw-bg-stone-1 md:tw-rounded-b">
			<div
				class="tw-text-center tw-pt-4 tw-pb-5 md:tw-rounded-t hide-for-print"
				style="background: linear-gradient(166.92deg, #276A43 4.84%, #4DD083 95.26%);"
			>
				<h1 class="tw-text-white tw-mb-1">
					Success!
				</h1>
				<p class="tw-text-subhead tw-text-white tw-px-3 md:tw-px-8">
					{{ headerCopy }}
				</p>
				<div class="tw-relative tw-mt-3">
					<div class="badge-container">
						<img
							:class="{ 'blurred': isBlurred, 'wiggle': wiggle }"
							:src="images('equity-badge.svg')"
							class="badge"
							alt="Gift icon"
						>
						<kv-button
							@click="() => toggleBlur"
							variant="secondary"
							class="reveal-button"
							v-kv-track-event="[
								'thanks',
								'click',
								'reveal-badge',
							]"
						>
							<span class="tw-flex tw-items-center tw-gap-1">
								<img
									:src="images('gift.svg')"
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
</template>

<script>
import { addMonths, differenceInWeeks } from 'date-fns';
import LoanNextSteps from '#src/components/Thanks/LoanNextSteps';
import KvExpandable from '#src/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import confetti from 'canvas-confetti';
import { gql } from '@apollo/client';
import logFormatter from '#src/util/logFormatter';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import KvButton from '@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import { metaGlobReader } from '#src/util/importHelpers';

const imageRequire = import.meta.glob('/src/assets/images/thanks-page/*.*', { eager: true });
const images = metaGlobReader(imageRequire, '/src/assets/images/thanks-page/');

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
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [smoothScrollMixin],
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
		optedIn: {
			type: Boolean,
			default: false
		},
		shortVersionEnabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			openCreateAccount: false,
			openOrderConfirmation: false,
			openShareModule: false,
			mdiChevronDown,
			confirmOptInChoice: false,
			selectOption: false,
			images,
			isBlurred: true,
			isMobileLayout: false,
			wiggle: false,
		};
	},
	computed: {
		borrowerName() {
			return this.selectedLoan?.name ?? '';
		},
		filteredLoans() {
			const filteredLoans = [...this.loans];
			if (this.loans.length === 3) {
				const indexToRemove = filteredLoans.indexOf(loan => loan.id === this.selectedLoan.id);
				const removedLoan = filteredLoans.splice(indexToRemove, 1)[0];
				filteredLoans.splice(1, 0, removedLoan);
			}
			return filteredLoans.slice(0, 3);
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
		marginLeftWeight() {
			if (this.filteredLoans.length === 1) {
				return 0;
			}
			if (this.filteredLoans.length === 2) {
				return 6;
			}

			return 10;
		},
		headerCopy() {
			return 'Celebrate your first loan with a special gift. 🙌';
		},
		ctaCopy() {
			if (this.optedIn && this.isGuest && this.shortVersionEnabled) {
				return 'Complete your account to track your impact and manage repayments.';
			}
			if (this.isGuest || (!this.isGuest && !this.optedIn)) {
				// eslint-disable-next-line max-len
				return `Want to hear how you're impacting ${this.borrowerName}'s life and more ways to help people like them?`;
			}

			return '';
		},
		revealBtnCta() {
			return `${this.isMobileLayout ? 'Tap' : 'Click'} to reveal`;
		}
	},
	methods: {
		hash(loan) {
			return loan?.image?.hash ?? '';
		},
		updateOptIn(value) {
			this.selectOption = true;
			this.openCreateAccount = true;
			if (value) {
				try {
					this.apollo.mutate({
						mutation: gql`
							mutation updateCommunicationSettings(
								$lenderNews: Boolean
							) {
								my {
									updateCommunicationSettings(
										communicationSettings: {
											lenderNews: $lenderNews
										}
									)
								}
							}
						`,
						variables: {
							lenderNews: value,
						},
					});
				} catch (error) {
					logFormatter(error, 'error');
				}
			}
			const elementToScrollTo = document.querySelector('#loan-info');
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
			this.confirmOptInChoice = value;
		},
		toggleBlur() {
			this.isBlurred = !this.isBlurred;
		}
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

</style>
