<template>
	<div class="row align-center">
		<div class="dropin-payment-holder small-12 columns">
			<braintree-drop-in-interface
				v-if="isClientReady"
				ref="braintreeDropInInterface"
				:amount="amount | numeral('0.00')"
				flow="vault"
				:payment-types="['paypal', 'card']"
				:preselect-vaulted-payment-method="action === 'Registration'"
				@transactions-enabled="enableConfirmButton = $event"
			/>
			<div id="dropin-button">
				<kv-button
					value="submit"
					id="dropin-submit"
					class="button"
					:disabled="!enableConfirmButton || submitting"
					@click.native="submitDropInMonthlyGood"
				>
					<kv-icon name="lock" />
					Confirm <kv-loading-spinner v-if="submitting" />
				</kv-button>
			</div>

			<p class="dropin-wrapper-attribution-text">
				Thanks to PayPal, Kiva receives free payment processing for all loans.
			</p>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';

import braintreeDropinError from '@/plugins/braintree-dropin-error-mixin';

import braintreeCreateMonthlyGoodSubscription from '@/graphql/mutation/braintreeCreateMonthlyGoodSubscription.graphql';
import braintreeUpdateSubscriptionPaymentMethod from
	'@/graphql/mutation/braintreeUpdateSubscriptionPaymentMethod.graphql';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvButton,
		KvIcon,
		KvLoadingSpinner
	},
	inject: ['apollo'],
	mixins: [
		braintreeDropinError
	],
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
		},
		currentNonce: {
			type: String,
			default: ''
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
			isClientReady: false,
			submitting: false,
		};
	},
	mounted() {
		this.isClientReady = !this.$isServer;
	},
	methods: {
		submitDropInMonthlyGood() {
			this.submitting = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeMonthlyGood(transactionNonce, deviceData, paymentType);
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
		doBraintreeMonthlyGood(nonce, deviceData, paymentType) {
			if (this.action === 'Update') {
				// if nonce is the same, the payment method is the same and we do not need to call the update mutation
				if (nonce === this.currentNonce) {
					this.$emit('no-update');
					this.submitting = false;
				} else {
					// Apollo call to the query mutation
					this.apollo.mutate({
						mutation: braintreeUpdateSubscriptionPaymentMethod,
						variables: {
							paymentMethodNonce: nonce,
							deviceData,
						}
					}).then(kivaBraintreeResponse => {
						// Check for errors in transaction
						if (kivaBraintreeResponse.errors) {
							this.processBraintreeDropInError(this.action, kivaBraintreeResponse);
							// Payment method failed, unselect attempted payment method
							this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
							// exit
							return kivaBraintreeResponse;
						}
						// Transaction is complete
						const subscriptionUpdatedSuccessfully = kivaBraintreeResponse.data?.my?.updateAutoDeposit;

						if (subscriptionUpdatedSuccessfully) {
						// fire BT Success event
							this.$kvTrackEvent(
								this.action,
								`${paymentType} Braintree DropIn Subscription Payment Update`,
								`${this.action.toLowerCase()}-monthly-good-update`
							);

							// Complete transaction handles additional analytics + redirect
							this.$emit('complete-transaction', paymentType);
						}
						return kivaBraintreeResponse;
					}).finally(() => {
						this.submitting = false;
					});
				}
			}
			if (this.action === 'Registration') {
				// Apollo call to the query mutation
				this.apollo.mutate({
					mutation: braintreeCreateMonthlyGoodSubscription,
					variables: {
						paymentMethodNonce: nonce,
						amount: numeral(this.amount).format('0.00'),
						donateAmount: numeral(this.donateAmount).format('0.00'),
						dayOfMonth: numeral(this.dayOfMonth).value(),
						category: this.category,
						isOnetime: this.isOneTime,
						deviceData,
					}
				}).then(kivaBraintreeResponse => {
					// Check for errors in transaction
					if (kivaBraintreeResponse.errors) {
						this.processBraintreeDropInError(this.action, kivaBraintreeResponse);
						// Payment method failed, unselect attempted payment method
						this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
						// exit
						return kivaBraintreeResponse;
					}

					// Transaction is complete
					// eslint-disable-next-line max-len
					const subscriptionCreatedSuccessfully = kivaBraintreeResponse.data?.my?.createMonthlyGoodSubscription;

					if (subscriptionCreatedSuccessfully) {
						// fire BT Success event
						this.$kvTrackEvent(
							this.action,
							`${paymentType} Braintree DropIn Subscription Payment`,
							`${this.action.toLowerCase()}-monthly-good-submit`
						);

						// Complete transaction handles additional analytics + redirect
						this.$emit('complete-transaction', paymentType);
					}
					return kivaBraintreeResponse;
				}).finally(() => {
					this.submitting = false;
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
</style>
