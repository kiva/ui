<template>
	<div class="row">
		<kv-settings-card class="column large-8" title="Monthly Good">
			<template v-slot:icon>
				<kv-icon
					class="icon"
					title="Monthly Good"
					name="subscriptions-monthly-good"
				/>
			</template>
			<template v-slot:content>
				<router-link v-if="!isMonthlyGoodSubscriber"
					to="/monthlygood"
				>
					Sign up for a Kiva Monthly Good subscription
				</router-link>

				<div v-if="isMonthlyGoodSubscriber">
					<p>
						On the <kv-button class="text-link"
							@click.native.prevent="showLightbox = true;"
						>
							{{ dayOfMonth | numeral('Oo') }}
						</kv-button> of each month <kv-button class="text-link"
							@click.native.prevent="showLightbox = true;"
						>
							{{ totalCombinedDeposit | numeral('$0,0.00') }}
						</kv-button> will be
						transferred <kv-button class="text-link"
							@click.native.prevent="showLightbox = true;"
							v-if="selectedGroupDescriptor"
						>
							to support
							{{ selectedGroupDescriptor }}
						</kv-button>.
					</p>
					<p>
						<kv-button class="text-link"
							@click.native.prevent="$emit('cancel-subscription')"
						>
							Cancel Monthly Good
						</kv-button>
					</p>

					<!-- Edit MG Lightbox -->
					<kv-lightbox
						class="mg-update-lightbox"
						:visible="showLightbox"
						title="Change your monthly good"
						@lightbox-closed="closeLightbox"
					>
						<div class="mg-update-lightbox__content">
							<template v-if="showDropInPaymentUpdate">
								<transition :name="slideTransition" mode="out-in">
									<!-- Deposit Settings -->
									<div
										v-if="settingsOpen"
										class="row column" key="depositSettings"
									>
										<monthly-good-update-form
											:donation="donation"
											:day-of-month="dayOfMonth"
											:category="category"
											:mg-amount="mgAmount"
											:disabled="isSaving"
											@form-update="formUpdated"
											class="mg-update-lightbox__form"
										/>
										<div class="mg-update-lightbox__payment-method">
											<div class="row align-middle">
												<div class="column medium-12 large-6" v-if="paymentMethod">
													<strong>Current payment method:</strong><br>
													<img :src="paymentMethod.imageUrl">
													{{ paymentMethod.description }}
												</div>
												<div class="column medium-12 large-6 text-right">
													<button
														class="button--link"
														@click="toggleSections"
													>
														<strong>Update Payment Method</strong>
														<kv-icon class="icon-pencil" name="pencil" title="Edit" />
													</button>
												</div>
											</div>
										</div>
										<kv-button
											data-test="monthly-good-save-button"
											class="smaller button"
											v-if="!isSaving"
											@click.native="saveMonthlyGood"
											:disabled="!isChanged || !isFormValid"
										>
											Save Settings
										</kv-button>
										<kv-button data-test="monthly-good-save-button" class="smaller button" v-else>
											Saving <kv-loading-spinner />
										</kv-button>
									</div>
									<!-- Payment Methods -->
									<div
										v-if="!settingsOpen"
										class="row column" key="paymentSettings"
									>
										<kv-button class="text-link"
											@click.native.prevent="toggleSections"
										>
											<kv-icon
												class="arrow back-arrow"
												name="small-chevron"
												:from-sprite="true"
											/>
											Back to deposit settings
										</kv-button>
										<div class="mg-update-lightbox__dropin-payment-wrapper">
											<strong>Update payment method:</strong>
											<monthly-good-drop-in-payment-wrapper
												:amount="totalCombinedDeposit"
												:donate-amount="donation"
												:day-of-month="dayOfMonth"
												:category="category"
												action="Update"
												@complete-transaction="completeMGBraintree"
											/>
										</div>
									</div>
								</transition>
							</template>

							<template v-if="!showDropInPaymentUpdate">
								<monthly-good-update-form
									:donation="donation"
									:day-of-month="dayOfMonth"
									:category="category"
									:mg-amount="mgAmount"
									:disabled="isSaving"
									@form-update="formUpdated"
								/>
								<kv-button
									data-test="monthly-good-save-button"
									class="smaller button"
									v-if="!isSaving"
									@click.native="saveMonthlyGood"
									:disabled="!isChanged || !isFormValid"
								>
									Save
								</kv-button>
								<kv-button data-test="monthly-good-save-button" class="smaller button" v-else>
									Saving <kv-loading-spinner />
								</kv-button>
							</template>
						</div>

						<template slot="controls">
						</template>
					</kv-lightbox>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import MonthlyGoodUpdateForm from '@/components/Forms/MonthlyGoodUpdateForm';
import MonthlyGoodDropInPaymentWrapper from '@/components/MonthlyGood/MonthlyGoodDropInPaymentWrapper';

const pageQuery = gql`query monthlyGoodSubscription {
	my {
		autoDeposit {
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
	}
	general {
		braintreeDropInFeature: uiConfigSetting(key: "feature.braintree_dropin") {
			value
			key
		}
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvSettingsCard,
		MonthlyGoodDropInPaymentWrapper,
		MonthlyGoodUpdateForm,
	},
	data() {
		return {
			isSaving: false,
			category: null,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			mgAmount: 0,
			isMonthlyGoodSubscriber: false,
			showLightbox: false,
			settingsOpen: true, // if settingsOpen is false, payment update section is shown
			isChanged: false,
			isFormValid: true,
			showDropInPaymentUpdate: true,
		};
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (this.isMonthlyGoodSubscriber) {
				const autoDepositAmount = parseFloat(_get(data, 'my.autoDeposit.amount', 0));
				this.donation = parseFloat(_get(data, 'my.autoDeposit.donateAmount', 0));
				this.dayOfMonth = _get(data, 'my.autoDeposit.dayOfMonth');
				this.category = _get(data, 'my.monthlyGoodCategory', '');
				this.mgAmount = autoDepositAmount - this.donation;
				this.paymentMethod = _get(data, 'my.autoDeposit.paymentMethod', {});
			}

			// if experiment and feature flag are BOTH on, show UI
			const braintreeDropInFeatureFlag = _get(data, 'general.braintreeDropInFeature.value') === 'true' || false;
			this.showDropInPaymentUpdate = braintreeDropInFeatureFlag;
		},
	},
	computed: {
		selectedGroupDescriptor() {
			const selectedCategory = this.lendingCategories.find(category => category.value === this.category);

			// Set group descriptor. There can be cases where this is undefined, and returns empty string.
			return selectedCategory ? selectedCategory.shortName : '';
		},
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
		slideTransition() {
			return this.settingsOpen ? 'kv-slide-right' : 'kv-slide-left';
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
			if (this.isChanged) {
				this.$emit('unsaved-changes', true);
			}
			this.showLightbox = false;
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
							amount donateAmount dayOfMonth
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
				this.$emit('unsaved-changes', false);
				this.showLightbox = false;
			});
		},
		completeMGBraintree() {
			this.$kvTrackEvent('MonthlyGood', 'successful-update-mg-payment', 'update-monthly-good-payment');
			this.showLightbox = false;
			// reset lightbox state
			this.settingsOpen = true;
			// refetch page query with updated information
			this.apollo.query({ query: pageQuery, fetchPolicy: 'network-only' });
			this.$showTipMsg('Payment method updated');
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.mg-update-lightbox {
	&__content {
		overflow: hidden;
		max-width: 100%;
		margin: 1.5rem 0 0;

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
		margin-bottom: 2rem;
	}

	&__dropin-payment-wrapper {
		margin: 1rem 0 0;
		padding-left: 0.5rem;
	}

	.arrow {
		stroke: $blue;
		width: rem-calc(13);
		height: rem-calc(9);

		&.back-arrow {
			transform: rotate(90deg);
		}
	}

	.button--link {
		color: $kiva-accent-blue;
		fill: $kiva-accent-blue;
		cursor: pointer;
		padding: 0.5rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}
}
</style>
