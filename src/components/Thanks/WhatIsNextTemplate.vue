<template>
	<div class="md:tw-py-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-relative" :style="{maxWidth: '620px'}">
		<div class="tw-bg-marigold-1 md:tw-rounded-b">
			<div class="tw-bg-eco-green-3 tw-text-center tw-pt-4 md:tw-rounded-t">
				<h1 class="tw-text-white">
					Success!
				</h1>
				<p class="tw-text-subhead tw-text-white tw-mb-2 tw-px-3 md:tw-px-8">
					{{ headerCopy }}
				</p>

				<div class="borrower-container">
					<div class="tw-absolute tw-w-full tw-h-full tw-z-docked" style="width: 240px;">
						<animated-sparkles />
					</div>

					<div
						class="tw-flex tw-justify-center tw-items-center tw-z-1"
						:style="{height: '200px'}"
					>
						<borrower-image
							v-for="loan, index in filteredLoans"
							:key="loan.id"
							class="borrower-image"
							:class="{'main-loan' : index === 1 && loans.length === 3}"
							:style="{
								marginLeft: `${loans.length === 2 && index === 1
									? (index * marginLeftWeight)
									: (index - 1) * marginLeftWeight}rem`,
								zIndex: `${index + 1}`,
							}"
							:alt="loan.name"
							:aspect-ratio="1"
							:default-image="{ width: 200, faceZoom: 30 }"
							:hash="hash(loan)"
							:images="[
								{ width: 200, faceZoom: 30 },
							]"
						/>
					</div>
				</div>
			</div>
			<div class="tw-relative tw-flex tw-justify-center">
				<div class="tw-bg-marigold-1 tw-absolute oval"></div>
				<div
					class="secondary-container"
				>
					<template v-if="!selectOption">
						<template v-if="!shortVersionEnabled">
							<h4 class="tw-text-center tw-pt-1">
								What to expect next:
							</h4>
							<opt-in-steps
								class="tw-mb-5"
								:weeks-to-repay="weeksToRepay"
							/>
						</template>
						<div class="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
							<h3 class="tw-text-center" v-if="ctaCopy">
								{{ ctaCopy }}
							</h3>
							<template v-if="!optedIn || (optedIn && isGuest && !shortVersionEnabled)">
								<kv-button
									@click="updateOptIn(true)"
									v-kv-track-event="[
										'thanks',
										'click',
										'accept-opt-in-request',
									]"
								>
									Yes, keep me updated
								</kv-button>
								<kv-button
									@click="updateOptIn(false)"
									variant="ghost"
									class="ghost-button"
									v-kv-track-event="[
										'thanks',
										'click',
										'reject-opt-in-request',
									]"
								>
									No, I don’t want to receive updates
								</kv-button>
							</template>
							<template v-else-if="isGuest && optedIn && shortVersionEnabled">
								<kv-button
									to="/portfolio"
									v-kv-track-event="[
										'thanks',
										'click',
										'complete-account',
									]"
								>
									Complete account
								</kv-button>
							</template>
							<template v-else>
								<kv-button
									to="/portfolio"
									v-kv-track-event="[
										'thanks',
										'click',
										'go-to-my-kiva',
									]"
								>
									Go to my kiva
								</kv-button>
							</template>
						</div>
					</template>
					<template v-else>
						<div class="tw-z-5 tw-flex tw-flex-col tw-items-center tw-mt-2.5">
							<template v-if="confirmOptedOut">
								<img
									:src="imageRequire(`./hi-five.svg`)"
									class="tw-w-7 tw-h-7 tw-mb-1"
									alt="Hi five icon"
								>
								<h3 class="tw-text-center">
									We will keep you updated!
								</h3>
							</template>
							<template v-else>
								<img
									:src="imageRequire(`./paper-plane.svg`)"
									class="tw-w-7 tw-h-7 tw-mb-1"
									alt="Paper plane icon"
								>
								<h3 class="tw-text-center">
									You will not receive updates
								</h3>
							</template>
						</div>
					</template>
				</div>
			</div>
			<div class="tw-py-5 tw-px-3 md:tw-px-8">
				<div class="tw-mb-2">
					<div v-if="selectOption && !isGuest">
						<kv-button
							class="tw-w-full"
							to="/portfolio"
							v-kv-track-event="[
								'thanks',
								'click',
								'go-to-my-kiva',
							]"
						>
							Go to my kiva
						</kv-button>
					</div>
					<!-- eslint-disable-next-line max-len -->
					<div
						v-if="!optedIn && isGuest"
						class="
							tw-w-full tw-border tw-rounded
							tw-flex tw-justify-between tw-cursor-pointer
							tw-py-2 tw-px-3
						"
						@click="openCreateAccount = !openCreateAccount"
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
						v-if="!optedIn && isGuest"
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
				<div class="tw-mb-2">
					<!-- eslint-disable-next-line max-len -->
					<div
						class="
							tw-w-full tw-border tw-rounded
							tw-flex tw-justify-between tw-cursor-pointer
							tw-py-2 tw-px-3
						"
						@click="openOrderConfirmation = !openOrderConfirmation"
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
				<div>
					<div
						class="
							tw-w-full tw-border tw-rounded
							tw-flex tw-justify-between tw-cursor-pointer
							tw-py-2 tw-px-3
						"
						@click="openShareModule = !openShareModule"
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
import OptInSteps from '@/components/Thanks/OptInSteps';
import KvExpandable from '@/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import GuestAccountCreation from '@/components/Forms/GuestAccountCreation';
import AnimatedSparkles from '@/components/Thanks/AnimatedSparkles';
import confetti from 'canvas-confetti';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const imageRequire = require.context('@/assets/images/thanks-page/', true);

export default {
	name: 'WhatIsNextTemplate',
	components: {
		OptInSteps,
		KvExpandable,
		CheckoutReceipt,
		SocialShareV2,
		BorrowerImage,
		GuestAccountCreation,
		AnimatedSparkles,
		KvButton,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		selectedLoan: {
			type: Object,
			default: () => ({})
		},
		borrowerName: {
			type: String,
			default: ''
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
			default: () => []
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
			confirmOptedOut: false,
			selectOption: false,
			imageRequire,
		};
	},
	computed: {
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
			if (this.loans.length === 1) {
				return `You and ${this.borrowerName} are in this together now`;
			}
			if (this.loans.length === 2) {
				const names = this.loans.map(loan => loan.name).join(' and ');
				return `You are part of ${names}'s journey now'`;
			}
			const beginning = `You are part of ${this.loans[0].name}, ${this.loans[1].name}, and `;

			if (this.loans.length === 3) {
				return `${beginning} ${this.loans[2].name}'s journey now`;
			}
			return `${beginning} ${this.loans.length - 2} others journey now`;
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
		}
	},
	methods: {
		hash(loan) {
			return loan?.image?.hash ?? '';
		},
		updateOptIn(value) {
			this.selectOption = true;
			this.openCreateAccount = true;
			this.confirmOptedOut = value;
		}
	},
	created() {
		this.$kvTrackEvent('thanks', 'view', 'opt-in-request', this.isGuest ? 'guest' : 'signed-in');
	},
	mounted() {
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

.oval {
	width: 653px;
	height: 181px;
	border-radius: 50%;
	margin-top: -90px;
}

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.borrower-container {
	animation: fadein ease-in 1s;
	width: 150px;
	@apply tw-block tw-relative tw-mx-auto tw-z-4;
}

.borrower-image {
	width: 150px;
	position: absolute;
	box-shadow: '0px 4.42px 22.1px 0px #D1DCD6';
	@apply tw-w-full tw-rounded-full tw-bg-black tw-border-4 tw-border-white tw-z-2;
}

.borrower-image >>> img.tw-object-contain {
	@apply tw-object-fill;
}

.main-loan {
	width: 180px !important;
	height: 180px !important;
	@apply !tw-z-5;
}

.social-share >>> .share__social.social {
	@apply tw-w-full;
}

.ghost-button >>> span {
	@apply tw-bg-transparent;
}

.account-creation >>> input {
	@apply tw-bg-marigold-1;
}

.secondary-container {
	border-bottom-color: #ECE4D5;
	@apply tw-bg-marigold-1 tw-w-full tw-px-3 md:tw-px-8 tw-border-b tw-z-1 tw-pb-5 tw-pt-3;
}

@keyframes fadein {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

</style>
