<template>
	<div class="row align-center">
		<div class="payment-holder small-12 medium-8 columns">
			<braintree-drop-in-interface
				ref="braintreeDropInInterface"
				:amount="amount | numeral('0.00')"
				flow="vault"
				:payment-types="['paypal', 'card']"
				@transactions-enabled="enableConfirmButton = $event"
			/>
			<div id="dropin-button">
				<kv-button
					value="submit"
					id="dropin-submit"
					class="button"
					:disabled="!enableConfirmButton || submitting"
					@click.native="submitDropInAutoDeposit"
				>
					<kv-icon name="lock" />
					Confirm <kv-loading-spinner v-if="submitting" />
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
import * as Sentry from '@sentry/browser';
import braintreeCreateAutoDepositSubscription from '@/graphql/mutation/braintreeCreateAutoDepositSubscription.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import BraintreeDropInInterface from '@/components/Payment/BraintreeDropInInterface';

export default {
	components: {
		KvButton,
		KvIcon,
		BraintreeDropInInterface,
		KvLoadingSpinner
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
		/**
		 * Context that this payment wrapper is used in:
		 * Must be one of 2 strings 'Registration' or 'Update'
		* */
		action: {
			type: String,
			default: 'Registration'
		}
	},
	data() {
		return {
			enableConfirmButton: false,
			submitting: false,
		};
	},
	methods: {
		submitDropInAutoDeposit() {
			this.submitting = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = _get(btSubmitResponse, 'nonce');
					const paymentType = _get(btSubmitResponse, 'type');
					if (typeof transactionNonce !== 'undefined') {
						this.doBraintreeAutoDeposit(transactionNonce, paymentType);
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
		doBraintreeAutoDeposit(nonce, paymentType) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeCreateAutoDepositSubscription,
				variables: {
					paymentMethodNonce: nonce,
					amount: numeral(this.amount).format('0.00'),
					donateAmount: numeral(this.donateAmount).format('0.00'),
					dayOfMonth: numeral(this.dayOfMonth).value(),
				}
			}).then(kivaBraintreeResponse => {
				// Check for errors in transaction
				if (kivaBraintreeResponse.errors) {
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
					this.$kvTrackEvent(this.action, 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);

					// exit
					return kivaBraintreeResponse;
				}

				// Transaction is complete
				const subscriptionCreatedSuccessfully = _get(
					kivaBraintreeResponse,
					'data.my.createAutoDeposit.status'
				);

				if (subscriptionCreatedSuccessfully === 'active') {
					// fire BT Success event
					this.$kvTrackEvent(
						this.action,
						`${paymentType} Braintree DropIn Subscription Payment`,
						`${this.action.toLowerCase()}-auto-deposit-submit`
					);

					// Complete transaction handles additional analytics + redirect
					this.$emit('complete-transaction', paymentType);
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

			.loading-spinner {
				vertical-align: middle;
				width: 1rem;
				height: 1rem;
			}

			.loading-spinner .line {
				background-color: $white;
			}
		}
	}
}
</style>
