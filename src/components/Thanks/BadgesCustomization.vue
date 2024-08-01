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
						<!-- eslint-disable-next-line max-len -->
						<!-- TODO: Update with the selected svg -->
						<svg :class="{ 'blurred': isBlurred }" width="180" height="185" viewBox="0 0 180 185" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M151.071 0H28.9286C12.9518 0 0 12.9518 0 28.9286V108.083C0 116.96 4.07577 125.345 11.0559 130.83L72.1273 178.814C77.3722 182.935 83.6862 184.996 90 184.996C96.3138 184.996 102.628 182.935 107.873 178.814L168.944 130.83C175.924 125.345 180 116.96 180 108.083V28.9286C180 12.9518 167.048 0 151.071 0Z" fill="#F8F2E6" />
							<path d="M164.786 116.763L121.5 119.852L83.3858 124.729L56.7352 134.392H26.3335L47.1964 152.673L84.6445 144.976H106.438L153.631 134.392L164.786 116.763ZM168.093 111.535L168.093 111.537L168.093 111.535Z" fill="#FDF0D2" />
							<path d="M170.357 86.1429L160.858 86.7625L117.232 94.597L70.5269 107.736L12.2144 111.378L19.6137 129.593L25.131 134.357H55.8498L82.7784 124.736L121.29 119.879L165.028 116.803L168.369 111.6L168.369 111.598L170.357 86.1429Z" fill="#FBE5B2" />
							<path d="M172.286 58.5L147.624 65.5105L128.32 79.7458L58.1179 80.5559L36.7058 86.6052L9 90.5712V102.497L12.5303 111.214L70.6483 107.573L117.197 94.4377L160.678 86.6052L170.146 85.9858L172.286 58.5Z" fill="#FADE9C" />
							<path d="M170.279 33.3624H157.647L128.529 43.5786L77.3958 50.068L44.184 64.157L10.0444 65.2854V90.5769L37.5561 86.5928L58.8181 80.5158L128.529 79.702L147.697 65.4016L172.186 58.3591L172.709 51.5607L170.279 33.3624Z" fill="#FAD98D" />
							<path d="M125.31 12.203L95.5527 18.9293L75.3506 29.5133L37.5561 32.8813L10.0444 42.367V65.2855L44.184 64.1571L77.3958 50.0681L128.529 43.5787L157.647 33.3625H170.279L167.579 13.1503L125.31 12.203Z" fill="#F9D582" />
							<path d="M17.5752 9.78851L10.0444 28.0915V42.3669L37.5561 32.8812L75.3506 29.5132L95.5527 18.9292L125.31 12.2029L17.5752 9.78851Z" fill="#F9D37B" />
							<mask id="mask0_4933_1064" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="25" y="33" width="131" height="132">
								<path d="M93.9239 33.4058L25.2983 104.742L87.362 164.447L155.987 93.1113L93.9239 33.4058Z" fill="white" />
							</mask>
							<g mask="url(#mask0_4933_1064)">
								<path d="M65.9224 80.373L65.872 80.4865L66.3559 81.821L67.7996 81.9431L76.5851 73.9283L76.6587 73.8518L86.3695 63.2216C86.421 63.1681 87.2129 62.5897 87.6251 62.1613L88.6452 61.3458C88.9334 61.1075 89.276 60.9658 89.6506 60.9285L90.4823 60.8448C91.7076 60.9337 92.4487 61.6024 92.5325 62.832L91.8465 64.6169C91.9113 65.6365 85.7951 72.7139 85.0962 73.4556L78.815 80.5362L89.0863 70.5482L93.5155 66.2961C93.7437 66.059 95.1314 64.8461 95.5271 64.3429L96.6899 63.915C97.4658 63.6747 98.3046 63.9513 98.7826 64.6027L99.0215 64.9208C99.4533 65.513 99.5134 66.2926 99.1657 66.945L98.0235 68.8212C96.7963 70.1888 95.1691 72.2171 95.0514 72.3395L90.0811 77.7356L84.8047 83.986L89.4844 79.8717L96.128 73.6699L99.8083 70.2731L102.364 69.2702L104.685 70.5314L104.235 72.8673L97.8417 79.5897L90.1576 87.8835L101.331 78.7639L103.409 76.7419L105.805 76.4103L107.182 78.1476L105.613 81.2183L104.287 82.903L88.4395 101.504C85.705 104.5 85.5943 104.6 85.4686 104.7L79.9517 108.613C79.8554 108.682 79.7515 108.744 79.6324 108.791L64.1829 115.757C64.0713 115.811 63.9524 115.874 63.8561 115.943L60.1619 118.605L55.1057 122.283L55.0241 122.338L52.5255 123.955C51.8211 124.412 50.9044 124.339 50.2632 123.811C43.4514 118.2 41.0802 111.295 40.331 108.261C40.1109 107.372 40.5662 106.455 41.4073 106.086L45.6942 104.171C45.7986 104.124 45.8951 104.07 45.9913 104L48.6881 102.162C49.066 101.906 49.3362 101.518 49.4479 101.081L50.8261 95.8818C50.8681 95.7309 50.8876 95.5728 50.8844 95.4078L50.9058 91.8641C50.9096 91.6614 50.9431 91.458 51.007 91.2691L53.2713 84.5366C53.3493 84.3023 53.473 84.0973 53.6269 83.9066L54.9409 82.3722L59.3328 77.3477L60.8373 75.5695L64.0326 68.0682L64.8802 65.3193L65.5292 63.5576C65.5292 63.5576 67.0686 63.5803 67.7208 64.3109C68.3731 65.0415 69.198 66.5568 69.198 66.5568L68.6567 71.1616L65.9374 80.3727L65.9224 80.373Z" fill="#D8A15B" />
								<path d="M117.566 115.826L117.617 115.713L117.133 114.378L115.689 114.256L106.904 122.271L106.83 122.348L97.1191 132.978C97.0676 133.031 96.2755 133.61 95.8635 134.038L94.8434 134.853C94.5552 135.092 94.2126 135.234 93.838 135.271L93.0065 135.355C91.781 135.266 91.0399 134.597 90.9561 133.367L91.6421 131.582C91.5773 130.563 97.6935 123.485 98.3924 122.744L104.674 115.663L94.4025 125.651L89.9731 129.903C89.7449 130.14 88.3572 131.353 87.9615 131.856L86.7987 132.284C86.0228 132.524 85.184 132.248 84.706 131.597L84.4671 131.278C84.0352 130.686 83.9751 129.907 84.3229 129.254L85.4651 127.378C86.6923 126.011 88.3195 123.982 88.4373 123.86L93.4075 118.464L98.6839 112.213L94.0042 116.328L87.3606 122.529L83.6803 125.926L81.1249 126.929L78.8033 125.668L79.2536 123.332L85.647 116.61L93.331 108.316L82.1572 117.435L80.0793 119.457L77.6837 119.789L76.3062 118.052L77.8758 114.981L79.2018 113.296L95.0491 94.695C97.7836 91.6993 97.8943 91.5996 98.02 91.4996L103.537 87.5868C103.633 87.5173 103.737 87.4552 103.856 87.4079L119.306 80.4425C119.417 80.3878 119.536 80.3255 119.632 80.256L123.327 77.5946L128.383 73.9159L128.464 73.8618L130.963 72.2445C131.667 71.788 132.584 71.8602 133.225 72.3883C140.038 77.9992 142.408 84.9046 143.158 87.938C143.378 88.827 142.923 89.7442 142.081 90.1133L137.794 92.0281C137.69 92.0751 137.594 92.1295 137.497 92.1989L134.801 94.0378C134.423 94.2929 134.152 94.6809 134.041 95.1185L132.663 100.317C132.621 100.468 132.601 100.626 132.604 100.792L132.583 104.335C132.579 104.538 132.546 104.741 132.482 104.93L130.217 111.663C130.139 111.897 130.015 112.102 129.862 112.293L128.548 113.827L124.156 118.852L122.651 120.63L119.456 128.131L118.609 130.88L117.959 132.642C117.959 132.642 116.42 132.619 115.768 131.889C115.116 131.158 114.29 129.642 114.29 129.642L114.832 125.038L117.551 115.827L117.566 115.826Z" fill="#AF752A" />
								<path d="M62.6061 89.7704L62.9652 89.6325L62.605 89.7679L62.6061 89.7704L62.9652 89.6325L62.605 89.7679C62.6204 89.8009 63.3139 91.6901 63.3103 94.1082C63.3105 95.0939 63.1978 96.1655 62.8924 97.2427C62.5863 98.3208 62.0911 99.4044 61.3124 100.441L60.54 101.469L62.5957 103.014L63.3681 101.986C64.3525 100.677 64.9853 99.2905 65.3663 97.9438C65.748 96.5962 65.8816 95.2882 65.8817 94.1082C65.8777 91.1196 65.038 88.9391 65.0065 88.8485L64.5455 87.6483L62.1451 88.5702L62.6061 89.7704Z" fill="#223829" />
								<path d="M119.471 104.282L118.984 104.605L119.475 104.287L119.471 104.282L118.984 104.605L119.475 104.287C119.472 104.283 119.155 103.792 118.847 102.96C118.537 102.127 118.237 100.959 118.237 99.5851C118.244 97.6625 118.798 95.3352 120.847 92.7669L121.652 91.7637L119.645 90.1554L118.841 91.1586C116.434 94.1506 115.659 97.142 115.666 99.5851C115.666 101.391 116.07 102.895 116.474 103.956C116.88 105.018 117.288 105.642 117.328 105.703L118.039 106.775L120.182 105.353L119.471 104.282Z" fill="#223829" />
								<path d="M90.7721 94.012L96.7337 96.006L103.348 97.582L104.026 105.098L96.2864 110.893L91.4087 110.988L77.4849 108.743L74.2563 93.2058L81.1148 83.3665L87.663 81.5357L92.6898 88.7576L90.7721 94.012Z" fill="#F4B536" />
								<path d="M91.6313 94.2057L91.5411 95.4882L96.6216 95.8459L102.388 98.9064L102.604 104.29L96.1726 108.198L91.7572 108.284L78.8139 106.191L75.8851 92.07L82.1556 83.0574L87.3859 81.6027L91.5756 87.6247L90.0978 95.3867L91.5411 95.4882L91.6313 94.2057L92.8943 94.4462L94.3037 87.0432L88.455 78.6363L80.5739 80.8284L73.1426 91.5091L76.6557 108.447L91.5753 110.859L96.9154 110.756L105.234 105.701L104.898 97.3274L97.3455 93.3191L91.7216 92.9232L91.6313 94.2057L92.8943 94.4462L91.6313 94.2057Z" fill="#223829" />
							</g>
							<path d="M151.071 12.8571C159.933 12.8571 167.143 20.0667 167.143 28.9286V108.083C167.143 113.047 164.904 117.653 161.001 120.72L99.9293 168.704C97.0699 170.951 93.6365 172.139 90 172.139C86.3635 172.139 82.9301 170.951 80.0707 168.704L18.9993 120.72C15.0958 117.653 12.8571 113.047 12.8571 108.083V28.9286C12.8571 20.0667 20.0667 12.8571 28.9286 12.8571H151.071ZM151.071 0H28.9286C12.9518 0 0 12.9518 0 28.9286V108.083C0 116.96 4.07577 125.345 11.0559 130.83L72.1273 178.814C77.3722 182.935 83.6862 184.996 90 184.996C96.3138 184.996 102.628 182.935 107.873 178.814L168.944 130.83C175.924 125.345 180 116.96 180 108.083V28.9286C180 12.9518 167.048 0 151.071 0Z" fill="#2E271E" />
						</svg>
						<kv-button
							@click="() => toggleBlur"
							variant="secondary"
							class="reveal-button"
							v-kv-track-event="[
								'thanks',
								'click',
								'reveal',
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
import LoanNextSteps from '@/components/Thanks/LoanNextSteps';
import KvExpandable from '@/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import GuestAccountCreation from '@/components/Forms/GuestAccountCreation';
import confetti from 'canvas-confetti';
import { gql } from '@apollo/client';
import logFormatter from '@/util/logFormatter';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';
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
			imageRequire,
			isBlurred: true,
			isMobileLayout: false,
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
	@apply tw-flex tw-items-center tw-justify-center tw-mx-auto tw-rounded-lg;
	box-shadow: 0px 4px 12px 0px #00000014;
	transition: filter 0.3s ease;
	width: 228px;
	height: 233px;
	background-color: #F3F1EF33;
}

.blurred {
	filter: blur(8px);
}

.reveal-button {
	@apply tw-absolute tw-bottom-3;
}

.reveal-button  >>> span {
	@apply tw-border-black;
	opacity: 90%;
}

</style>
