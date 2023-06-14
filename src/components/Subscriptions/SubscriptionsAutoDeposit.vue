<template>
	<div class="row">
		<kv-settings-card class="column large-8" title="Auto Deposit">
			<template #content>
				<router-link
					v-if="!isAutoDepositSubscriber"
					to="/auto-deposit"
				>
					Add money to your account every month
				</router-link>
				<div v-if="isAutoDepositSubscriber">
					<p>
						On the
						<button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							{{ dayOfMonth | numeral('Oo') }}
						</button>
						of each month
						<button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							{{ mgAmount | numeral('$0,0.00') }}
						</button>
						will be transferred to your lending balance and
						<button
							class="tw-text-link tw-font-medium"
							@click="showEditLightbox = true;"
						>
							{{ donation | numeral('$0,0.00') }}
						</button>
						will be donated to Kiva.
					</p>
					<p>
						<button
							class="tw-text-link tw-font-medium"
							@click="$emit('cancel-subscription')"
						>
							Cancel Auto Deposit
						</button>
					</p>

					<!-- Edit AD Lightbox -->
					<kv-lightbox
						class="ad-update-lightbox"
						:visible="showEditLightbox"
						:title="settingsOpen ? 'Change your auto deposit' : 'Update payment method'"
						@lightbox-closed="closeLightbox"
					>
						<div class="ad-update-lightbox__content">
							<transition :name="slideTransition" mode="out-in">
								<!-- Deposit Settings -->
								<div
									v-if="settingsOpen"
									class="row column" key="depositSettings"
								>
									<!-- TODO move this form to separate component  -->
									<form
										@submit.prevent
										novalidate
										class="ad-update-lightbox__form"
									>
										<fieldset :disabled="isSaving">
											<div class="row align-center tw-text-left">
												<div class="small-12 columns">
													<div class="row column">
														<strong>Each month on the</strong>
														<label
															class="tw-sr-only"
															:class="{ 'error': $v.dayOfMonth.$invalid }"
															for="dayOfMonth"
														>
															Day of the Month
														</label>
														<kv-text-input
															v-if="isDayInputShown"
															@blur="hideDayInput()"
															class="text-input__day"
															id="dayOfMonth"
															type="number"
															placeholder=""
															required
															min="1"
															max="31"
															v-model.number="dayOfMonth"
														/>
														<button
															class="tw-text-link tw-font-medium"
															@click="isDayInputShown = true"
															v-if="!isDayInputShown"
														>
															<strong>{{ dayOfMonth | numeral('Oo') }}</strong>
															<kv-icon class="icon-pencil" name="pencil" title="Edit" />
														</button>
														<strong>we'll process the following:</strong>
														<ul class="validation-errors" v-if="$v.dayOfMonth.$invalid">
															<li v-if="!$v.dayOfMonth.required">
																Field is required
															</li>
															<li
																v-if="!$v.dayOfMonth.minValue
																	|| !$v.dayOfMonth.maxValue"
															>
																Enter day of month between 1 and 31
															</li>
														</ul>
														<div class="additional-day-info">
															<small v-if="dayOfMonth > 28">
																(note - may be processed on the last day of the month)
															</small>
														</div>
													</div>
													<div class="middle-wrapper">
														<div class="row align-middle">
															<div class="columns">
																<span>
																	Deposit for lending
																</span>
															</div>

															<div class="small-6 medium-4 columns">
																<label
																	class="tw-sr-only"
																	:class="{ 'error': $v.mgAmount.$invalid }"
																	for="amount"
																>
																	Amount
																</label>
																<kv-currency-input
																	id="amount"
																	v-model="mgAmount"
																/>
															</div>
														</div>
														<div class="row columns align-middle">
															<ul
																class="tw-text-right validation-errors"
																v-if="$v.mgAmount.$invalid"
															>
																<li v-if="!$v.mgAmount.required">
																	Field is required
																</li>
																<li
																	v-if="!$v.mgAmount.minValue
																		|| !$v.mgAmount.maxValue"
																>
																	Enter an amount of $5-$10,000
																</li>
															</ul>
														</div>

														<div class="row align-middle">
															<div class="columns">
																<span>
																	Optional donation to support Kiva
																</span>
															</div>

															<div class="small-6 medium-4 columns">
																<label
																	class="tw-sr-only"
																	:class="{ 'error': $v.donation.$invalid }"
																	for="amount"
																>
																	Donation
																</label>
																<kv-currency-input
																	id="donation"
																	v-model="donation"
																/>
															</div>
														</div>
														<div class="row column align-middle">
															<ul
																class="tw-text-right validation-errors"
																v-if="$v.donation.$invalid"
															>
																<li
																	v-if="!$v.donation.minValue
																		|| !$v.donation.maxValue"
																>
																	Enter an amount of $0-$10,000
																</li>
															</ul>
														</div>

														<div class="row">
															<div class="columns">
																<strong>Total/month</strong>
															</div>

															<div class="small-6 medium-4 columns">
																<strong
																	class="additional-left-pad-currency"
																>{{ totalCombinedDeposit | numeral('$0,0.00') }}
																</strong>
															</div>
														</div>
														<div class="row column">
															<ul
																class="tw-text-center validation-errors"
																v-if="!$v.mgAmount.maxTotal || !$v.donation.maxTotal"
															>
																<li>
																	The maximum Auto Deposit total is $10,000.<br>
																	Please try again by entering in a smaller amount.
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</form>
									<div class="ad-update-lightbox__payment-method">
										<p class="tw-mb-1">
											<strong>Current payment method:</strong>
										</p>
										<div class="row">
											<div class="column">
												<template v-if="paymentMethod">
													<img
														class="ad-update-lightbox__cc-icon tw-inline-block"
														:src="paymentMethod.imageUrl"
														alt="credit card"
													>
													{{ paymentMethod.description }}
												</template>
												<template v-else>
													<p>
														<!-- eslint-disable-next-line max-len  -->
														You are currently using a legacy payment method and will need to cancel the current auto deposit or subscription, followed by creating a new auto deposit or subscription in order to change or manage the payment method.
													</p>
												</template>
											</div>
											<div class="column tw-text-right" v-if="paymentMethod">
												<button
													class="tw-text-link tw-font-medium"
													@click="toggleSections"
												>
													<strong>Update Payment Method</strong>
													<kv-icon class="icon-pencil" name="pencil" title="Edit" />
												</button>
											</div>
										</div>
									</div>
								</div>
								<!-- Payment Methods -->
								<div
									v-if="!settingsOpen"
									class="row column" key="paymentSettings"
								>
									<button
										class="tw-text-link tw-font-medium"
										@click="toggleSections"
									>
										<kv-icon
											class="arrow back-arrow tw-stroke-current"
											name="small-chevron"
											:from-sprite="true"
										/>
										Back to deposit settings
									</button>
									<div class="ad-update-lightbox__dropin-payment-wrapper">
										<div class="row column ad-update-lightbox__current-payment-method">
											<strong class="tw-mb-1">Current payment method:</strong><br>
											<img
												class="ad-update-lightbox__cc-icon tw-inline-block"
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
										<auto-deposit-drop-in-payment-wrapper
											:amount="totalCombinedDeposit"
											:donate-amount="donation"
											:day-of-month="dayOfMonth"
											:current-nonce="paymentMethod.nonce"
											action="Update"
											@complete-transaction="completeADBraintree"
											@no-update="noUpdate"
										/>
									</div>
								</div>
							</transition>
						</div>
						<template #controls>
							<kv-button
								v-if="settingsOpen"
								data-test="auto-deposit-save-button"
								@click="saveAutoDeposit"
								:state="saveButtonState"
							>
								Save
							</kv-button>
						</template>
					</kv-lightbox>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import AutoDepositDropInPaymentWrapper from '@/components/AutoDeposit/AutoDepositDropInPaymentWrapper';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const pageQuery = gql`query autoDepositPage {
	my {
		id
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			isSubscriber
			status
			paymentMethod {
				methodType
				imageUrl
				description
				nonce
			}
		}
	}
}`;

export default {
	name: 'SubscriptionsAutoDeposit',
	inject: ['apollo', 'cookieStore'],
	components: {
		AutoDepositDropInPaymentWrapper,
		KvButton,
		KvCurrencyInput,
		KvIcon,
		KvLightbox,
		KvSettingsCard,
		KvTextInput,
	},
	data() {
		return {
			isSaving: false,
			dayOfMonth: new Date().getDate(),
			donation: 0,
			mgAmount: 0,
			isAutoDepositSubscriber: false,
			showEditLightbox: false,
			isDayInputShown: false,
			settingsOpen: true, // if settingsOpen is false, payment update section is shown
			updateToCurrentPaymentMethod: false,
			paymentMethod: {}
		};
	},
	mixins: [
		validationMixin,
	],
	validations: {
		mgAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(10000),
			maxTotal(value) {
				return value + this.donation < 10000;
			}
		},
		donation: {
			minValue: minValue(0),
			maxValue: maxValue(10000),
			maxTotal(value) {
				return value + this.mgAmount < 10000;
			}
		},
		dayOfMonth: {
			required,
			minValue: minValue(1),
			maxValue: maxValue(31)
		},
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			const isSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			const autoDepositStatus = data?.my?.autoDeposit?.status ?? false;

			this.isAutoDepositSubscriber = !isSubscriber && autoDepositStatus;
			if (this.isAutoDepositSubscriber) {
				const autoDepositAmount = parseFloat(data?.my?.autoDeposit?.amount ?? 0);
				this.donation = parseFloat(data?.my?.autoDeposit?.donateAmount ?? 0);
				this.dayOfMonth = data?.my?.autoDeposit?.dayOfMonth;
				this.mgAmount = autoDepositAmount - this.donation;
				this.paymentMethod = data?.my?.autoDeposit?.paymentMethod ?? {};
			}
		},
	},
	mounted() {
		// After initial value is loaded, setup watch to make form dirty on value changes
		this.$watch('mgAmount', () => {
			this.$v.$touch();
		});
		this.$watch('donation', () => {
			this.$v.$touch();
		});
		this.$watch('dayOfMonth', () => {
			this.$v.$touch();
		});
	},
	computed: {
		totalCombinedDeposit() {
			return this.donation + this.mgAmount;
		},
		isChanged() {
			return this.$v.$dirty;
		},
		slideTransition() {
			return this.settingsOpen ? 'kv-slide-right' : 'kv-slide-left';
		},
		saveButtonState() {
			if (!this.isChanged || this.$v.$invalid) {
				return 'disabled';
			}
			if (this.isSaving) {
				return 'loading';
			}
			return '';
		}
	},
	methods: {
		toggleSections() {
			this.settingsOpen = !this.settingsOpen;
		},
		closeLightbox() {
			// this will trigger only when the lightbox is closed manually
			// not when it is closed via outside click or close button click
			this.$emit('unsaved-changes', true);
			this.showEditLightbox = false;
		},
		hideDayInput() {
			if (!this.$v.dayOfMonth.$invalid) {
				this.isDayInputShown = false;
			}
		},
		saveAutoDeposit() {
			this.isSaving = true;
			const updateAutoDepositSettings = this.apollo.mutate({
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
			return updateAutoDepositSettings.then(() => {
				this.$showTipMsg('Settings saved!');
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.$emit('unsaved-changes', false);
				this.showEditLightbox = false;
			});
		},
		completeADBraintree() {
			this.$kvTrackEvent('AutoDeposit', 'successful-update-ad-payment', 'update-auto-deposit-payment');
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
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

form {
	.row {
		margin-bottom: 0.25em;
	}

	.additional-left-pad-currency {
		padding-left: 0.65rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}

	.text-input__day {
		margin: 0 0 0 0.25rem;
	}

	.text-input,
	.validation-errors {
		margin: 0;
	}

	.additional-day-info {
		margin-bottom: 1.25rem;

		small,
		strong {
			display: block;
		}
	}

	.middle-wrapper {
		padding-left: 2rem;
		padding-right: 2rem;
		margin-bottom: 2rem;
	}
}

.ad-update-lightbox {
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
