<template>
	<div class="tw-flex tw-justify-center md:tw-justify-end">
		<div class="dropin-payment-holder" style="padding: 0; max-width: 20rem;">
			<braintree-drop-in-interface
				v-if="isClientReady"
				ref="braintreeDropInInterface"
				:amount="amount"
				flow="checkout"
				:payment-types="paymentTypes"
				:preselect-vaulted-payment-method="!isGuestCheckout"
				:auth="isGuestCheckout ? 'token-key' : 'client-token'"
				@transactions-enabled="enableCheckoutButton = $event"
			/>
			<div v-if="isGuestCheckout" id="guest-checkout">
				<label class="input-label tw-font-medium tw-block tw-my-2" for="email">
					Where should we email your receipt?
				</label>
				<kv-text-input
					type="email"
					name="email"
					v-model="email"
					ref="email"
					data-testid="basket-guest-email-input"
					id="email"
					class="data-hj-suppress tw-mb-2 tw-w-full"
					@focus="$kvTrackEvent(
						'basket',
						'click-email-receipt-field',
						'Where should we email your receipt?'
					)"
				/>
				<p v-if="$v.email.$error" class="input-error tw-text-danger tw-text-base tw-mb-2">
					Valid email required.
				</p>
				<p v-else-if="validateCampaignEmail && $v.email.error">
					Valid campaign email required
				</p>
				<kv-checkbox
					data-testid="basket-guest-terms-agreement"
					id="termsAgreement"
					name="termsAgreement"
					class="checkbox tw-text-small tw-mb-2"
					v-model="termsAgreement"
					@update:modelValue="$kvTrackEvent(
						'basket',
						'click-terms-of-use',
						'I have read and agree to the Terms of Use and Privacy Policy.',
						$event ? 1 : 0
					)"
				>
					I have read and agree to the
					<a
						:href="`https://${this.$appConfig.host}/legal/terms`"
						target="_blank"
						title="Open Terms of Use in a new window"
					>Terms of Use</a>
					and
					<a
						:href="`https://${this.$appConfig.host}/legal/privacy`"
						target="_blank"
						title="Open Privacy Policy in a new window"
					>Privacy Policy</a>.
					<p v-if="$v.termsAgreement.$error" class="input-error tw-text-danger tw-text-base">
						You must agree to the Kiva Terms of service & Privacy
						policy.
					</p>
				</kv-checkbox>
				<kv-checkbox
					data-testid="basket-guest-email-updates"
					id="emailUpdates"
					class="checkbox tw-text-small tw-mb-2"
					name="emailUpdates"
					v-model="emailUpdates"
					@update:modelValue="$kvTrackEvent(
						'basket',
						'click-marketing-updates',
						'Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.', // eslint-disable-line
						$event ? 1 : 0
					)"
				>
					Receive email updates from Kiva (including borrower updates
					and promos). You can unsubscribe anytime.
				</kv-checkbox>
			</div>
			<div id="dropin-button">
				<kv-button
					value="submit"
					id="dropin-submit"
					data-testid="basket-dropin-submit"
					class="tw-mb-2"
					:state="`${!enableCheckoutButton ? 'disabled' : ''}`"
					@click="submit"
				>
					Complete order
				</kv-button>
			</div>
			<p class="dropin-wrapper-attribution-text">
				Thanks to PayPal, Kiva receives free payment processing for all
				loans.
			</p>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import * as Sentry from '@sentry/vue';

import checkoutUtils from '@/plugins/checkout-utils-mixin';
import braintreeDropInError from '@/plugins/braintree-dropin-error-mixin';

import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'CheckoutDropInPaymentWrapper',
	components: {
		KvButton,
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvCheckbox,
		KvTextInput,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [checkoutUtils, validationMixin, braintreeDropInError],
	props: {
		amount: {
			type: String,
			default: '',
		},
		isGuestCheckout: {
			type: Boolean,
			default: false,
		},
		promoFundId: {
			type: String,
			default: '',
		},
		managedAccountId: {
			type: Number,
			default: '',
		},
	},
	data() {
		return {
			email: null,
			termsAgreement: false,
			emailUpdates: false,
			enableCheckoutButton: false,
			isClientReady: false,
			paymentTypes: ['paypal', 'card', 'applePay', 'googlePay'],
		};
	},
	validations: {
		email: {
			required,
			email,
		},
		termsAgreement: { required: value => value === true },
	},
	mounted() {
		this.isClientReady = !this.$isServer;
	},
	methods: {
		submit() {
			if (this.isGuestCheckout && this.promoFundId) {
				this.$v.$touch();
				if (!this.$v.$invalid) {
					this.validatePromoGuestBasketAndCheckout();
				}
			} else if (this.isGuestCheckout) {
				this.$v.$touch();
				if (!this.$v.$invalid) {
					this.validateGuestBasketAndCheckout();
				}
			} else {
				this.validateBasketAndCheckout();
			}
		},
		validateGuestBasketAndCheckout() {
			this.$emit('updating-totals', true);
			this.validateGuestBasket(this.email, this.emailUpdates)
				.then(validationStatus => {
					if (validationStatus === true) {
						this.submitDropInPayment();
					} else {
						const errorMessage = _get(
							validationStatus,
							'[0].error'
						);
						if (errorMessage === 'api.authenticationRequired') {
							const loginHint = encodeURIComponent(
								`login|${JSON.stringify({
									msg: 're-auth-acc-exists',
								})}`
							);
							window.location = `/ui-login?force=true&doneUrl=/checkout&loginHint=${loginHint}`;
						} else {
							this.$emit('updating-totals', false);
							this.showCheckoutError(validationStatus);
							this.$emit('refreshtotals');
						}
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					const errorCode = _get(error, 'errors[0].code');
					const errorMessage = _get(error, 'errors[0].message');

					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btSubmitValidationCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							errorMessage
						);
						Sentry.captureException(errorCode);
					});
				});
		},
		validatePromoGuestBasketAndCheckout() {
			this.$emit('updating-totals', true);
			this.validateGuestPromoBasket(this.email, this.emailUpdates, this.promoFundId, this.managedAccountId)
				.then(validationStatus => {
					if (validationStatus === true) {
						this.submitDropInPayment();
					} else {
						const errorMessage = _get(
							validationStatus,
							'[0].error'
						);
						if (errorMessage === 'api.authenticationRequired') {
							const loginHint = encodeURIComponent(
								`login|${JSON.stringify({
									msg: 're-auth-acc-exists',
								})}`
							);
							window.location = `/ui-login?force=true&doneUrl=/checkout&loginHint=${loginHint}`;
						} else {
							this.$emit('updating-totals', false);
							this.showCheckoutError(validationStatus);
							this.$emit('refreshtotals');
						}
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					const errorCode = _get(error, 'errors[0].code');
					const errorMessage = _get(error, 'errors[0].message');

					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btSubmitValidationCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							errorMessage
						);
						Sentry.captureException(errorCode);
					});
				});
		},
		validateBasketAndCheckout() {
			this.$emit('updating-totals', true);
			// Validate Basket prior to starting
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// request payment method
						this.submitDropInPayment();
					} else {
						// validation failed
						this.$emit('updating-totals', false);
						this.showCheckoutError(validationStatus);
						this.$emit('refreshtotals');
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					const errorCode = _get(error, 'errors[0].code');
					const errorMessage = _get(error, 'errors[0].message');

					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btSubmitValidationCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							errorMessage
						);
						Sentry.captureException(errorCode);
					});
				});
		},
		submitDropInPayment() {
			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance
				.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeCheckout(
							transactionNonce,
							deviceData,
							paymentType
						);
					}
				})
				.catch(btSubmitError => {
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btRequestPaymentMethodCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							btSubmitError
						);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeCheckout(nonce, deviceData, paymentType) {
			// Apollo call to the query mutation
			this.apollo
				.mutate({
					mutation: braintreeDepositAndCheckout,
					variables: {
						amount: numeral(this.amount).format('0.00'),
						nonce,
						deviceData,
						savePaymentMethod: false, // save payment methods handled by braintree drop in UI
						visitorId: this.cookieStore.get('uiv') || null
					},
				})
				.then(kivaBraintreeResponse => {
					// Check for errors in transaction
					if (kivaBraintreeResponse.errors) {
						this.$emit('updating-totals', false);
						this.processBraintreeDropInError('basket', kivaBraintreeResponse);
						// Payment method failed, unselect attempted payment method
						this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
						// Initialize a refresh of basket state
						this.$emit('refreshtotals');
						// exit
						return kivaBraintreeResponse;
					}

					// Transaction is complete
					const transactionId = _get(
						kivaBraintreeResponse,
						'data.shop.doNoncePaymentDepositAndCheckout'
					);
					// redirect to thanks with KIVA transaction id
					if (transactionId) {
						// fire BT Success event
						this.$kvTrackEvent(
							'basket',
							`${paymentType} Braintree DropIn Payment`,
							'Success',
							transactionId,
							transactionId
						);
						// Complete transaction handles additional analytics + redirect
						this.$emit('complete-transaction', transactionId);
					}
					return kivaBraintreeResponse;
				});
		},
		validateCampaignEmail() {
			const emailRegex = new RegExp(`^[A-Za-z0-9._%+-]@${promoFundEmail}`);
			return emailRegex.test(this.$refs.email);
		},
	},
};
</script>
