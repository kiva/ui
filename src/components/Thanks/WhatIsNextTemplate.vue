<template>
	<div
		class="md:tw-my-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-relative"
		:style="{maxWidth: '620px', boxShadow: '0px 5px 25px 0px #D1DCD6'}"
	>
		<div class="tw-bg-stone-1 md:tw-rounded-b">
			<div class="tw-bg-eco-green-3 tw-text-center tw-pt-4 md:tw-rounded-t hide-for-print">
				<h1 class="tw-text-white">
					Success!
				</h1>
				<p class="tw-text-subhead tw-text-white tw-mb-2 tw-px-3 md:tw-px-8">
					{{ headerCopy }}
				</p>

				<div class="borrower-container">
					<div class="tw-absolute tw-h-full tw-z-docked tw-left-1/2 -tw-translate-x-1/2">
						<animated-sparkles class="tw-h-full" />
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
								boxShadow: '0px 5.5px 27.49px 0px #D1DCD6',
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
			<div class="tw-relative tw-flex tw-justify-center hide-for-print" id="loan-info">
				<div class="tw-bg-stone-1 tw-absolute oval"></div>
				<div
					class="secondary-container"
				>
					<template v-if="!selectOption">
						<div class="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
							<h3 class="tw-text-center" v-if="ctaCopy">
								{{ ctaCopy }}
							</h3>
							<template v-if="!optedIn">
								<kv-button
									@click="() => updateOptIn(true)"
									v-kv-track-event="[
										'thanks',
										'click',
										'accept-opt-in-request',
									]"
								>
									Yes, keep me updated
								</kv-button>
								<kv-button
									@click="() => updateOptIn(false)"
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
							<template v-else-if="isGuest && optedIn">
								<guest-account-creation
									class="tw-pt-3 account-creation"
									event-category="thanks"
									event-label="open-account-creation-drawer"
								/>
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
							<template v-if="confirmOptInChoice">
								<img
									:src="images('hi-five.svg')"
									class="tw-w-7 tw-h-7 tw-mb-1"
									alt="Hi five icon"
								>
								<h3 class="tw-text-center">
									We will keep you updated!
								</h3>
							</template>
							<template v-else>
								<img
									:src="images('paper-plane.svg')"
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
				<div class="tw-mb-2 hide-for-print">
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
					<div
						v-if="!optedIn && isGuest"
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
import KvExpandable from '#src/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import AnimatedSparkles from '#src/components/Thanks/AnimatedSparkles';
import confetti from 'canvas-confetti';
import { gql } from 'graphql-tag';
import logFormatter from '#src/util/logFormatter';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import KvButton from '@kiva/kv-components/dist/components/KvButton';
import KvMaterialIcon from '@kiva/kv-components/dist/components/KvMaterialIcon';
import { metaGlobReader } from '#src/util/importHelpers';

const imagesGlob = import.meta.glob('../../assets/images/thanks-page/*.*', { eager: true, query: '?url' });
const images = metaGlobReader(imagesGlob, '../../assets/images/thanks-page/');

export default {
	name: 'WhatIsNextTemplate',
	components: {
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
				return `You are part of ${names}'s journey now`;
			}
			const beginning = `You are part of ${this.loans[0].name}, ${this.loans[1].name}, and `;

			if (this.loans.length === 3) {
				return `${beginning} ${this.loans[2].name}'s journey now`;
			}
			return `${beginning} ${this.loans.length - 2} others journey now`;
		},
		ctaCopy() {
			if (this.optedIn && this.isGuest) {
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
		}
	},
	created() {
		this.$kvTrackEvent('thanks', 'view', 'Thanks-marketing-opt-in-prompt', this.isGuest ? 'guest' : 'registered');
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
	width: 751px;
	height: 171px;
	border-radius: 50%;
	margin-top: -90px;
}

@screen md {
	.oval {
		width: 1037px;
		height: 237px;
	}
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
	box-shadow: '0px 4.42px 22.1px 0px #D1DCD6';
	@apply tw-absolute tw-w-full tw-rounded-full tw-bg-black tw-border-4 tw-border-white tw-z-2;
}

.borrower-image :deep(img.tw-object-contain) {
	@apply tw-object-fill;
}

.main-loan {
	width: 180px !important;
	height: 180px !important;
	@apply !tw-z-5;
}

.social-share :deep(.share__social.social) {
	@apply tw-w-full;
}

.ghost-button :deep(span) {
	@apply tw-bg-transparent;
}

.account-creation :deep(input) {
	@apply tw-bg-stone-1;
}

.secondary-container {
	border-bottom-color: #ECE4D5;
	@apply tw-bg-stone-1 tw-w-full tw-px-3 md:tw-px-8 tw-border-b tw-z-1 tw-pb-5 tw-pt-3;
}

.option-box {
	transition: border 0.2s ease, border-radius 0.5s ease;
	@apply tw-w-full tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;
}

.option-box.open {
	@apply tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-rounded-none;
}

.hide-for-print {
	@apply print:tw-hidden;
}

</style>
