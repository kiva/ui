<template>
	<div class="dropin-payment-holder tw-px-0 tw-mt-4">
		<braintree-drop-in-interface
			v-if="isClientReady"
			ref="braintreeDropInInterface"
			:amount="$filters.numeral(amount, '0.00')"
			flow="vault"
			:payment-types="['paypal', 'card']"
			:preselect-vaulted-payment-method="action === 'Registration'"
			@transactions-enabled="enableConfirmButton = $event"
		/>
		<div id="dropin-submit" class="tw-w-full">
			<kv-button
				class="tw-w-full tw-mb-2"
				:state="buttonState"
				@click="submitDropInAutoDeposit"
			>
				<kv-icon name="lock" />
				{{ buttonText }}
			</kv-button>
		</div>

		<p class="tw-text-small tw-text-secondary tw-text-center tw-px-2">
			Thanks to PayPal, Kiva receives free payment processing for all loans.
		</p>
	</div>
</template>

<script>
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import { defineAsyncComponent } from 'vue';

import braintreeDropInError from '#src/plugins/braintree-dropin-error-mixin';

import braintreeCreateAutoDepositSubscription from
	'#src/graphql/mutation/braintreeCreateAutoDepositSubscription.graphql';
import braintreeUpdateSubscriptionPaymentMethod from
	'#src/graphql/mutation/braintreeUpdateSubscriptionPaymentMethod.graphql';

import KvIcon from '#src/components/Kv/KvIcon';
import KvButton from '#kv-components/KvButton';

export default {
	name: 'AutoDepositDropInPaymentWrapper',
	components: {
		BraintreeDropInInterface: defineAsyncComponent(() => import(
			'#src/components/Payment/BraintreeDropInInterface'
		)),
		KvButton,
		KvIcon,
	},
	inject: ['apollo'],
	mixins: [braintreeDropInError],
	emits: ['complete-transaction', 'no-update'],
	props: {
		amount: {
			type: Number,
			default: 0
		},
		buttonText: {
			type: String,
			default: 'Confirm'
		},
		donateAmount: {
			type: Number,
			default: 0
		},
		dayOfMonth: {
			type: Number,
			default: 0
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
		this.isClientReady = typeof window !== 'undefined';
	},
	methods: {
		submitDropInAutoDeposit() {
			this.submitting = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeAutoDeposit(transactionNonce, deviceData, paymentType);
					}
				}).catch(btSubmitError => {
					this.submitting = false;
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage_dropin', 'btRequestPaymentMethodCatch');
						scope.setTag('bt_basket_validation_error', btSubmitError);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeAutoDeposit(nonce, deviceData, paymentType) {
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
								`${this.action.toLowerCase()}-auto-deposit-update`
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
					mutation: braintreeCreateAutoDepositSubscription,
					variables: {
						paymentMethodNonce: nonce,
						amount: numeral(this.amount).format('0.00'),
						donateAmount: numeral(this.donateAmount).format('0.00'),
						dayOfMonth: numeral(this.dayOfMonth).value(),
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
					const subscriptionCreatedSuccessfully = kivaBraintreeResponse.data?.my?.createAutoDeposit?.status;

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
			}
		},
	},
	computed: {
		buttonState() {
			if (this.submitting) return 'loading';
			if (!this.enableConfirmButton) return 'disabled';
			return '';
		}
	}
};
</script>
