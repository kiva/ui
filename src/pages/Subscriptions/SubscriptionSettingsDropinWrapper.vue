<template>
	<div class="row align-center">
		<div class="payment-holder small-12 medium-8 columns">
			<braintree-drop-in-interface
				ref="braintreeDropInInterface"
				:amount="amount | numeral('0.00')"
				flow="vault"
				@transactions-enabled="enableConfirmButton = $event"
			/>

			<p class="attribution-text">
				Thanks to PayPal powered by Braintree,
				Kiva receives free payment processing for all loans.
			</p>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';
import braintreeCreateMonthlyGoodSubscription from '@/graphql/mutation/braintreeCreateMonthlyGoodSubscription.graphql';
import BraintreeDropInInterface from '@/components/Payment/BraintreeDropInInterface';

export default {
	components: {
		BraintreeDropInInterface,
	},
	inject: ['apollo'],
	props: {
		amount: {
			type: Number,
			default: 0
		},
		donateAmount: {
			type: Number,
			default: 0
		},
		dayOfMonth: {
			type: Number,
			default: 0
		},
		category: {
			type: String,
			default: ''
		},
		isOneTime: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			enableConfirmButton: false,
			submitting: false,
		};
	},
	methods: {
		submitDropInForm() {
			// detect subscription type
			// adjust mutation method for AD or MG
			this.submitDropInMonthlyGood();
		},
		submitDropInMonthlyGood() {
			this.submitting = true;

			// TODO: Update tracking data, simplify for location + types
			// this.$kvTrackEvent(
			// 	'Subscription Settings',
			// 	'click-update-monthly-good',
			// 	'update-monthly-good-payment-method'
			// );

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = _get(btSubmitResponse, 'nonce');
					if (typeof transactionNonce !== 'undefined') {
						this.doBraintreeMonthlyGood(transactionNonce);
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
		doBraintreeMonthlyGood(nonce) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeCreateMonthlyGoodSubscription,
				variables: {
					paymentMethodNonce: nonce,
					amount: numeral(this.amount).format('0.00'),
					donateAmount: numeral(this.donateAmount).format('0.00'),
					dayOfMonth: numeral(this.dayOfMonth).value(),
					category: this.category,
					isOnetime: this.isOneTime
				}
			}).then(kivaBraintreeResponse => {
				// Check for errors in transaction
				if (kivaBraintreeResponse.errors) {
					const errorCode = _get(kivaBraintreeResponse, 'errors[0].code');
					// const errorMessage = _get(kivaBraintreeResponse, 'errors[0].message');
					const standardErrorCode = `(Braintree error: ${errorCode})`;
					const standardError = `There was an error processing your payment.
						Please try again. ${standardErrorCode}`;

					// Payment method failed, unselect attempted payment method
					// TODO: Figure out why this triggers in MG???
					this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
					// Potential error message: 'Transaction failed. Please select a different payment method.';

					this.$showTipMsg(standardError, 'error');

					// Fire specific exception to Snowplow
					// TODO: Update tracking data
					// this.$kvTrackEvent('registration', 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);

					// exit
					return kivaBraintreeResponse;
				}

				// Transaction is complete
				const subscriptionCreatedSuccessfully = _get(
					kivaBraintreeResponse,
					'data.my.createMonthlyGoodSubscription'
				);
				// redirect to thanks with KIVA transaction id
				if (subscriptionCreatedSuccessfully) {
					// Complete transaction handles additional analytics + redirect
					this.$emit('complete-transaction');
				}
				return kivaBraintreeResponse;
			}).finally(() => {
				this.submitting = false;
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
