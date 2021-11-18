<template>
	<div class="dropin-payment-holder">
		<braintree-drop-in-interface
			v-if="isClientReady"
			ref="braintreeDropInInterface"
			:amount="amount | numeral('0.00')"
			flow="vault"
			:payment-types="['paypal', 'card']"
			:preselect-vaulted-payment-method="action === 'Registration'"
			@transactions-enabled="enableConfirmButton = $event"
		/>
		<div id="dropin-button" class="tw-w-full">
			<kv-button
				:state="buttonState"
				@click="submitDropInCauses"
				class="tw-w-full tw-mb-2"
			>
				<kv-icon name="lock" />
				Confirm
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

import braintreeDropinError from '@/plugins/braintree-dropin-error-mixin';

import createSubscription from '@/graphql/mutation/createSubscription.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvButton,
		KvIcon,
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
		dayOfMonth: {
			type: Number,
			default: 1
		},
		causeCategoryId: {
			type: String,
			default: ''
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
			default: 'Registration',
			validator: value => {
				return ['Registration', 'Update'].indexOf(value) !== -1;
			}
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
		submitDropInCauses() {
			this.submitting = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeCausesSubscription(transactionNonce, deviceData, paymentType);
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
		doBraintreeCausesSubscription(nonce, deviceData, paymentType) {
			/** !TODO add if (this.action === 'Update') logic here similar to
			* src/components/MonthlyGood/MonthlyGoodDropInPaymentWrapper.vue
			* for editing a cause subscription GD-155
			*/
			if (this.action === 'Registration') {
				// Apollo call to the query mutation
				this.apollo.mutate({
					mutation: createSubscription,
					variables: {
						nonce,
						deviceData,
						amount: numeral(this.amount).format('0.00'),
						categoryId: this.causeCategoryId,
						donation: 0,
						noteSize: 5, // TODO make this some kind of global setting?
						dayOfMonth: numeral(this.dayOfMonth).value(),
						lendingDelay: 0,
						period: 'MONTHLY'
					}
				}).then(kivaBraintreeResponse => {
					// Check for errors in transaction
					if (kivaBraintreeResponse.errors) {
						this.processBraintreeDropInError(this.action, kivaBraintreeResponse);
						// Payment method failed, unselect attempted payment method
						this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
						// exit
						this.submitting = false;
						return kivaBraintreeResponse;
					}

					// Transaction is complete
					// eslint-disable-next-line max-len
					const causeSignUpSuccess = kivaBraintreeResponse.data?.id;

					if (causeSignUpSuccess) {
						// fire BT Success event
						this.$kvTrackEvent(
							this.action,
							`${paymentType} Braintree DropIn Causes Payment`,
							`${this.action.toLowerCase()}-causes-submit`
						);

						// Complete transaction handles additional analytics + redirect
						this.$emit('complete-transaction', paymentType);
					}
					return kivaBraintreeResponse;
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
