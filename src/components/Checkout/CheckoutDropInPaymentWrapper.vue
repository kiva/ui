<template>
	<div class="row align-right">
		<div class="payment-holder small-12 medium-8 large-7 columns">
			<braintree-drop-in-interface
				ref="braintreeDropInInterface"
				:amount="amount"
				flow="checkout"
				:payment-types="paymentTypes"
				@transactions-enabled="enableCheckoutButton = $event"
			/>
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
			<p class="attribution-text">
				Thanks to PayPal, Kiva receives free payment processing for all loans.
			</p>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import gql from 'graphql-tag';

import * as Sentry from '@sentry/browser';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import BraintreeDropInInterface from '@/components/Payment/BraintreeDropInInterface';

const componentQuery = gql`query componentQueryCheckoutDropInPaymentWrapper {
	general {
		uiExperimentSetting(key: "braintree_dropin_apple_google") {
			key
			value
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvIcon,
		BraintreeDropInInterface
	},
	inject: ['apollo'],
	mixins: [
		checkoutUtils
	],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: componentQuery
			}).then(() => {
				return client.query({
					query: experimentAssignmentQuery, variables: { id: 'braintree_dropin_apple_google' }
				});
			});
		},
	},
	mounted() {
		// applePay & googlePay payment methods experiment - EXP-GROW-168-Aug2020
		const paymentMethodsExperiment = this.apollo.readFragment({
			id: 'Experiment:braintree_dropin_apple_google',
			fragment: experimentVersionFragment,
		}) || {};

		if (paymentMethodsExperiment.version === 'shown') {
			this.paymentTypes = ['paypal', 'card', 'applePay', 'googlePay'];
		}
		// Fire Event for EXP-GROW-168-Aug2020
		if (paymentMethodsExperiment.version && paymentMethodsExperiment.version !== 'unassigned') {
			this.$kvTrackEvent(
				'Basket',
				'EXP-GROW-168-Aug2020',
				paymentMethodsExperiment.version === 'shown' ? 'b' : 'a'
			);
		}
	},
	data() {
		return {
			enableCheckoutButton: false,
			paymentTypes: ['paypal', 'card'],
		};
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

.payment-holder {
	text-align: left;
	padding: 0 0.6rem 1.25rem;

	@include breakpoint(large) {
		padding: 0 1.5rem 1.5rem;
	}

	.attribution-text {
		color: $kiva-text-light;
		text-align: center;
		margin-top: rem-calc(24);
		padding: 0 0.75rem;
		font-size: $small-text-font-size;
	}

	::v-deep {
		#dropin-submit {
			width: 100%;
			font-size: 1.25rem;
			margin-top: 1.25rem;

			.icon-lock {
				height: rem-calc(20);
				width: rem-calc(20);
				fill: white;
				top: rem-calc(3);
				position: relative;
				margin-right: rem-calc(8);
			}
		}
	}
}
</style>
