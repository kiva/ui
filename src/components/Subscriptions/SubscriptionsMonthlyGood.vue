<template>
	<div>
		<kv-settings-card title="Monthly Good">
			<template #content>
				<router-link
					v-if="!isMonthlyGoodSubscriber"
					to="/monthlygood"
				>
					Sign up for a Kiva Monthly Good subscription
				</router-link>

				<div v-if="isMonthlyGoodSubscriber">
					<p>
						<span class="tw-text-action">{{ firstName }},</span>
						thank you for being a subscriber
						<span :class="{'tw-text-action': subStartDate }">{{ subStartDate }}</span>
					</p>
					<div class="tw-flex tw-justify-between tw-my-5">
						<div>
							<p class="tw-text-subhead tw-text-primary">
								{{ totalCombinedDeposit | numeral('$0,0.00') }}/month
							</p>
							<p class="tw-text-secondary">
								Next contribution: {{ nextContributionDate }}
							</p>
						</div>
						<kv-button
							variant="secondary"
							class="tw-bg-white tw-whitespace-nowrap"
							@click="setStep('change_subscription')"
						>
							Edit
						</kv-button>
					</div>
					<div class="tw-flex tw-justify-between tw-my-5">
						<div>
							<p class="tw-text-subhead tw-text-primary">
								Payment Method
							</p>
							<p class="tw-text-secondary">
								{{ cardDescription }}
							</p>
						</div>
						<kv-button
							variant="secondary"
							class="tw-bg-white tw-whitespace-nowrap"
							@click="setStep('update_payment_method')"
						>
							Update
						</kv-button>
					</div>
					<div class="tw-flex tw-justify-between tw-my-5">
						<div>
							<p class="tw-text-subhead tw-text-primary">
								Change subscription status
							</p>
							<p class="tw-text-secondary">
								Pause or cancel your membership
							</p>
						</div>
						<kv-button
							variant="secondary"
							class="tw-bg-white tw-whitespace-nowrap"
							@click="setStep('cancel_subscription')"
						>
							Change
						</kv-button>
					</div>

					<!-- Edit MG Lightbox -->
					<kv-lightbox
						class="mg-update-lightbox"
						:visible="showEditLightbox"
						:title="lightboxTitle"
						@lightbox-closed="closeLightbox"
					>
						<div class="mg-update-lightbox__content">
							<transition :name="slideTransition" mode="out-in">
								<div v-if="modalStep === 'change_subscription'">
									<!-- Deposit Settings -->
									<monthly-good-update-form
										:donation="donation"
										:day-of-month="dayOfMonth"
										:category="category"
										:mg-amount="mgAmount"
										:disabled="isSaving"
										@form-update="formUpdated"
										class="mg-update-lightbox__form"
									/>
								</div>
								<!-- Payment Methods -->
								<div
									v-if="modalStep === 'update_payment_method'"
									key="paymentSettings"
								>
									<button
										class="tw-text-link tw-font-medium"
										@click="setStep('change_subscription')"
									>
										<kv-icon
											class="arrow back-arrow tw-stroke-current"
											name="small-chevron"
											:from-sprite="true"
										/>
										Back to deposit settings
									</button>
									<div class="mg-update-lightbox__dropin-payment-wrapper">
										<div class="row column mg-update-lightbox__current-payment-method">
											<p class="tw-mb-1">
												<strong>Current payment method:</strong>
											</p>
											<img
												class="mg-update-lightbox__cc-icon tw-inline-block"
												:src="paymentMethod.imageUrl"
												alt="credit card"
											>
											{{ paymentMethod.description }}
										</div>
										<p
											v-if="updateToCurrentPaymentMethod"
											class="validation-error tw-text-center"
										>
											<!-- eslint-disable-next-line max-len -->
											This is your current payment method.<br> Please select or enter a new payment method to update your deposit.
										</p>
										<monthly-good-drop-in-payment-wrapper
											:amount="totalCombinedDeposit"
											:donate-amount="donation"
											:day-of-month="dayOfMonth"
											:category="category"
											:current-nonce="paymentMethod.nonce"
											action="Update"
											@complete-transaction="completeMGBraintree"
											@no-update="noUpdate"
										/>
									</div>
								</div>
							</transition>
						</div>
						<template #controls>
							<kv-button
								data-test="monthly-good-save-button"
								@click="saveMonthlyGood"
								:state="saveButtonState"
								v-if="modalStep === 'change_subscription'"
							>
								Save Settings
							</kv-button>
						</template>
					</kv-lightbox>

					<!-- Monthly Good Cancellation Flow -->
					<subscriptions-monthly-good-cancellation-flow
						:show-cancel-lightbox="showCancelLightbox"
						:subscription-id="subscriptionId"
						:sub-months-count="subMonthCount"
						:subs-loans="subscriptionsLoans"
						@confirm-cancel="onConfirmCancel"
						@abort-cancel="onAbortCancel"
						@modify-cancel="onModifyCancel"
					/>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import { gql } from '@apollo/client';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import MonthlyGoodUpdateForm from '@/components/Forms/MonthlyGoodUpdateForm';
import MonthlyGoodDropInPaymentWrapper from '@/components/MonthlyGood/MonthlyGoodDropInPaymentWrapper';
import SubscriptionsMonthlyGoodCancellationFlow from
	'@/components/Subscriptions/SubscriptionsMonthlyGoodCancellationFlow';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const CHANGE_SUBSCRIPTION = 'change_subscription';
const UPDATE_PAYMENT_METHOD = 'update_payment_method';
const CANCEL_SUBSCRIPTION = 'cancel_subscription';

const pageQuery = gql`query monthlyGoodSubscription {
	my {
		id
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			isSubscriber
			paymentMethod {
				methodType
				imageUrl
				description
				nonce
			}
		}
		monthlyGoodCategory
		userAccount {
			id
			firstName
		}
	}
	mySubscriptions(includeDisabled: false) {
		values {
			id
			history {
				values {
					id
					timestamp
				}
			}
		}
	}
}`;

export default {
	name: 'SubscriptionsMonthlyGood',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
		KvSettingsCard,
		MonthlyGoodDropInPaymentWrapper,
		MonthlyGoodUpdateForm,
		SubscriptionsMonthlyGoodCancellationFlow,
	},
	data() {
		return {
			isSaving: false,
			category: null,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			mgAmount: 0,
			isMonthlyGoodSubscriber: false,
			showEditLightbox: false,
			showCancelLightbox: false,
			settingsOpen: true, // if settingsOpen is false, payment update section is shown
			isChanged: false,
			isFormValid: true,
			updateToCurrentPaymentMethod: false,
			paymentMethod: {},
			subscriptionId: '',
			firstName: '',
			modalStep: '',
			subscriptionsLoans: 0
		};
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			if (this.isMonthlyGoodSubscriber) {
				const autoDepositAmount = parseFloat(data?.my?.autoDeposit?.amount ?? 0);
				this.donation = parseFloat(data?.my?.autoDeposit?.donateAmount ?? 0);
				this.dayOfMonth = data?.my?.autoDeposit?.dayOfMonth;
				this.category = data?.my?.monthlyGoodCategory ?? '';
				this.mgAmount = autoDepositAmount - this.donation;
				this.paymentMethod = data?.my?.autoDeposit?.paymentMethod ?? {};
				this.subscriptionId = data?.my?.autoDeposit?.id;
				this.firstName = data?.my?.userAccount?.firstName ?? '';
				this.subscriptionsLoans = data?.mySubscriptions?.values?.length ?? 0;
				const mySubscriptions = data?.mySubscriptions?.values?.history?.values ?? [];
				this.subStartTimestamp = mySubscriptions?.[mySubscriptions.length - 1]?.timeStamp ?? null;
			}
		},
	},
	computed: {
		subStartDate() {
			if (!this.subStartTimestamp) return '';
			const timestamp = new Date(this.subStartTimestamp); // Replace with your own timestamp
			return `since ${timestamp.toLocaleString('en-US', { month: 'long' })} ${timestamp.getFullYear()}!`;
		},
		subMonthCount() {
			if (!this.subStartTimestamp) return 0;
			const currentDate = new Date();
			const timestamp = new Date(this.subStartTimestamp);
			let monthsDiff = (currentDate.getFullYear() - timestamp.getFullYear()) * 12;
			monthsDiff -= timestamp.getMonth() + 1;
			monthsDiff += currentDate.getMonth();
			return monthsDiff;
		},
		lightboxTitle() {
			if (this.modalStep === CHANGE_SUBSCRIPTION) {
				return 'Change your subscription';
			}
			if (this.modalStep === UPDATE_PAYMENT_METHOD) {
				return 'Update payment method';
			}
			return '';
		},
		selectedGroupDescriptor() {
			const selectedCategory = this.lendingCategories.find(category => category.value === this.category);

			// Set group descriptor. There can be cases where this is undefined, and returns empty string.
			return selectedCategory ? selectedCategory.shortName : '';
		},
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
		slideTransition() {
			return this.modalStep === UPDATE_PAYMENT_METHOD ? 'kv-slide-right' : 'kv-slide-left';
		},
		saveButtonState() {
			if (!this.isChanged || !this.isFormValid) {
				return 'disabled';
			}
			if (this.isSaving) {
				return 'loading';
			}
			return '';
		},
		cardDescription() {
			return `Card ${this.paymentMethod?.description?.toLowerCase() ?? ''}`;
		},
		nextContributionDate() {
			const date = new Date();
			const day = date.getDate();
			let monthName = '';

			if (this.dayOfMonth >= day) {
				date.setMonth(date.getMonth() + 1);
			}
			monthName = date.toLocaleString('default', {
				month: 'long'
			});

			return `${monthName} ${day}`;
		},
	},
	methods: {
		/** This method is triggered when the form is updated.
		* Sets the values in this component to the form values
		* @param {Object} form - Update form values
		* @param {number} form.mgAmount - MG amount.
		* @param {number} form.donation - MG donation amount.
		* @param {number} form.dayOfMonth - MG day of month.
		* @param {string} form.category - MG category short name.
		* @param {boolean} form.isChanged - is the form dirty.
		* @param {boolean} form.isFormValid - is the form valid.
		*/
		formUpdated({
			mgAmount, donation, dayOfMonth, category, isChanged, isFormValid
		}) {
			this.mgAmount = mgAmount;
			this.donation = donation;
			this.dayOfMonth = dayOfMonth;
			this.category = category;
			this.isChanged = isChanged;
			this.isFormValid = isFormValid;
		},
		toggleSections() {
			this.settingsOpen = !this.settingsOpen;
		},
		closeLightbox() {
			/** If form is changed, let parent component know so save button can be displayed
			 * This method will not be executed when lightbox closes after saving.
			*/
			if (this.isChanged && this.isFormValid) {
				this.$emit('unsaved-changes', true);
			}
			this.modalStep = '';
			this.showEditLightbox = false;
		},
		saveMonthlyGood() {
			this.isSaving = true;
			const updateMGCategory = this.apollo.mutate({
				mutation: gql`mutation updateCategory($category: MonthlyGoodCategoryEnum!) {
					my {
						updateMonthlyGoodCategory(category: $category)
					}
				}`,
				variables: {
					category: this.category,
				}
			});
			const updateMGSettings = this.apollo.mutate({
				mutation: gql`mutation updateAutoDeposit($amount: Money, $donateAmount: Money, $dayOfMonth: Int) {
					my {
						updateAutoDeposit( autoDeposit: {
							amount: $amount, donateAmount: $donateAmount, dayOfMonth: $dayOfMonth
						}) {
							id amount donateAmount dayOfMonth
						}
					}
				}`,
				variables: {
					amount: this.totalCombinedDeposit,
					donateAmount: this.donation,
					dayOfMonth: this.dayOfMonth,
				}
			});
			return Promise.all([updateMGCategory, updateMGSettings]).then(data => {
				if (data.find(response => response.errors)) {
					this.$showTipMsg('There was a problem saving your settings', 'error');
				} else {
					this.$showTipMsg('Settings saved!');
				}
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.modalStep = '';
				this.$emit('unsaved-changes', false);
				this.showEditLightbox = false;
			});
		},
		completeMGBraintree() {
			this.$kvTrackEvent('MonthlyGood', 'successful-update-mg-payment', 'update-monthly-good-payment');
			this.showEditLightbox = false;
			// reset lightbox state
			this.settingsOpen = true;
			this.updateToCurrentPaymentMethod = false;
			// refetch page query with updated information
			this.apollo.query({ query: pageQuery, fetchPolicy: 'network-only' });
			this.$showTipMsg('Payment method updated');
		},
		noUpdate() {
			this.updateToCurrentPaymentMethod = true;
		},
		onConfirmCancel() {
			this.$emit('cancel-subscription');
			this.showCancelLightbox = false;
			this.modalStep = '';
		},
		onModifyCancel() {
			this.modalStep = CHANGE_SUBSCRIPTION;
			this.showEditLightbox = true;
			this.showCancelLightbox = false;
		},
		onAbortCancel() {
			this.showCancelLightbox = false;
		},
		setStep(step) {
			console.log(step === CANCEL_SUBSCRIPTION);
			if (step === CANCEL_SUBSCRIPTION) {
				this.showCancelLightbox = true;
				return;
			}
			this.showEditLightbox = true;
			this.modalStep = step;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.mg-update-lightbox {
	&__content {
		overflow: hidden;
		max-width: 100%;

		@include breakpoint('large') {
			width: rem-calc(530);
		}

		@include breakpoint('xxlarge') {
			width: rem-calc(620);
		}
	}

	&__form,
	&__payment-method {
		padding-left: 0.5rem;
	}

	&__payment-method {
		padding-right: 2rem;
	}

	&__dropin-payment-wrapper {
		margin: 1rem 0 0;
		padding-left: 0.5rem;
	}

	&__current-payment-method {
		margin: 1rem 0;
	}

	&__cc-icon {
		height: 1.5rem;
		margin-top: -0.33rem;
	}

	.arrow {
		width: rem-calc(13);
		height: rem-calc(9);

		&.back-arrow {
			transform: rotate(90deg);
		}
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}
}
</style>
