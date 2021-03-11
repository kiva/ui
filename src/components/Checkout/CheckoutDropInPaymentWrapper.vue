<template>
	<div class="row align-right">
		<div class="dropin-payment-holder small-12 columns">
			<braintree-drop-in-interface
				ref="braintreeDropInInterface"
				:amount="amount"
				flow="checkout"
				:payment-types="paymentTypes"
				@transactions-enabled="enableCheckoutButton = $event"
			/>
			<div v-if="isGuestCheckout" id="guest-checkout">
				<label class="input-label" for="email">
					Where should we email your receipt?
					<input
						type="email"
						name="email"
						v-model="email"
						id="email"
						class="fs-exclude"
					>
					<p v-if="!$v.email.email" class="input-error">
						Valid email required.
					</p>
				</label>
				<kv-checkbox
					id="termsAgreement"
					class="checkbox"
				>I have read and agree to the <a
					:href="`https://${this.$appConfig.host}/legal/terms`"
					target="_blank"
					title="Open Terms of Use in a new window">Terms of Use</a> and <a
						:href="`https://${this.$appConfig.host}/legal/privacy`"
						target="_blank"
						title="Open Privacy Policy in a new window">Privacy Policy</a>.
				</kv-checkbox>
				<kv-checkbox
					id="emailUpdates"
					class="checkbox"
					name="emailUpdates"
					:checked="true"
				>Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.
				</kv-checkbox>
			</div>
			<div id="dropin-button">
				<kv-button
					value="submit"
					id="dropin-submit"
					class="button"
					:disabled="!enableCheckoutButton"
					@click.native="validateBasketAndCheckout"
				>
					<kv-icon name="lock" />
					Checkout
				</kv-button>
			</div>
			<p class="dropin-wrapper-attribution-text">
				Thanks to PayPal, Kiva receives free payment processing for all loans.
			</p>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';

import * as Sentry from '@sentry/browser';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import BraintreeDropInInterface from '@/components/Payment/BraintreeDropInInterface';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import { validationMixin } from 'vuelidate';
import { email } from 'vuelidate/lib/validators';

export default {
	components: {
		KvButton,
		KvIcon,
		BraintreeDropInInterface,
		KvCheckbox
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		checkoutUtils,
		validationMixin
	],
	props: {
		amount: {
			type: String,
			default: ''
		},
		isGuestCheckout: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			email: null,
			enableCheckoutButton: false,
			paymentTypes: ['paypal', 'card', 'applePay', 'googlePay'],
		};
	},
	validations: {
		email: { email }
	},
	methods: {
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
						scope.setTag('bt_stage_dropin', 'btSubmitValidationCatch');
						scope.setTag('bt_basket_validation_error', errorMessage);
						Sentry.captureException(errorCode);
					});
				});
		},
		submitDropInPayment() {
			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeCheckout(transactionNonce, deviceData, paymentType);
					}
				}).catch(btSubmitError => {
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage_dropin', 'btRequestPaymentMethodCatch');
						scope.setTag('bt_basket_validation_error', btSubmitError);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeCheckout(nonce, deviceData, paymentType) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeDepositAndCheckout,
				variables: {
					amount: numeral(this.amount).format('0.00'),
					nonce,
					deviceData,
					savePaymentMethod: false, // save payment methods handled by braintree drop in UI
				}
			}).then(kivaBraintreeResponse => {
				// Check for errors in transaction
				if (kivaBraintreeResponse.errors) {
					this.$emit('updating-totals', false);
					const errorCode = _get(kivaBraintreeResponse, 'errors[0].code');
					const errorMessage = _get(kivaBraintreeResponse, 'errors[0].message');
					const standardErrorCode = `(Braintree error: ${errorCode})`;
					const standardError = `There was an error processing your payment.
					Please try again. ${standardErrorCode}`;

					// Payment method failed, unselect attempted payment method
					this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
					// Potential error message: 'Transaction failed. Please select a different payment method.';

					this.$showTipMsg(standardError, 'error');

					// Fire specific exception to Snowplow
					this.$kvTrackEvent('basket', 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);

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
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

#guest-checkout {
	.input-label {
		margin: 1rem 0 1rem;
		text-align: left;
		font-weight: normal;
		font-size: 1rem;
		line-height: 1.4;
		color: $charcoal;

		input {
			color: $charcoal;
			margin: 0;
		}
	}

	.checkbox {

		@include small-text();

		font-weight: $global-weight-normal;
		margin: 0 0 1rem;
	}

	.input-error {
		color: $kiva-accent-red;
		font-weight: $global-weight-normal;
	}
}
</style>
