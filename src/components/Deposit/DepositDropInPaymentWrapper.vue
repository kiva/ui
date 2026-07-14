<template>
	<div class="dropin-payment-holder tw-px-0 tw-mt-2">
		<braintree-drop-in-interface
			v-if="isClientReady"
			ref="braintreeDropInInterface"
			:amount="formattedAmount"
			flow="checkout"
			:payment-types="['paypal', 'card']"
			@transactions-enabled="enableConfirmButton = $event"
		/>

		<div id="dropin-submit">
			<kv-button
				class="tw-w-full md:tw-w-auto tw-mt-2"
				:state="buttonState"
				data-testid="deposit-submit"
				@click="submit"
				v-kv-track-event="['portfolio', 'click', 'Deposit continue']"
			>
				<span class="tw-inline-flex tw-items-center tw-justify-center">
					<kv-material-icon class="tw-w-3 tw-h-3 tw-mr-0.5" :icon="mdiLock" />
					Add credit
				</span>
			</kv-button>
		</div>

		<p class="tw-text-small tw-text-secondary tw-mt-3">
			Thanks to PayPal, Kiva receives free payment processing.
		</p>
	</div>
</template>

<script>
import numeral from 'numeral';
import { defineAsyncComponent } from 'vue';
import { mdiLock } from '@mdi/js';
import braintreeDropInError from '#src/plugins/braintree-dropin-error-mixin';
import logFormatter from '#src/util/logFormatter';
import depositWithBraintreeNonceMutation from '#src/graphql/mutation/deposit/depositWithBraintreeNonce.graphql';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';

export default {
	name: 'DepositDropInPaymentWrapper',
	components: {
		KvButton,
		KvMaterialIcon,
		BraintreeDropInInterface: defineAsyncComponent(() => import(
			'#src/components/Payment/BraintreeDropInInterface'
		)),
	},
	mixins: [braintreeDropInError],
	inject: ['apollo'],
	emits: ['complete-transaction', 'processing'],
	props: {
		amount: {
			type: [Number, String],
			default: 0,
		},
		// Parent-side validation (amount within min/max). Keeps the confirm button disabled
		// until the entered amount is valid, in addition to the drop-in being ready.
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			mdiLock,
			isClientReady: false,
			enableConfirmButton: false,
			submitting: false,
		};
	},
	watch: {
		// Let the parent lock the amount input while a charge is in flight.
		submitting(value) {
			this.$emit('processing', value);
		},
	},
	computed: {
		formattedAmount() {
			return numeral(this.amount).format('0.00');
		},
		buttonState() {
			if (this.submitting) {
				return 'loading';
			}
			if (this.disabled || !this.enableConfirmButton) {
				return 'disabled';
			}
			return '';
		},
	},
	methods: {
		submit() {
			if (this.disabled || !this.enableConfirmButton || this.submitting) {
				return;
			}
			this.submitting = true;
			// Snapshot the amount at submit time so the charge and the confirmation reflect the amount
			// the user confirmed, even if the input changes while the request is in flight.
			const { amount } = this;
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(paymentMethod => {
					const nonce = paymentMethod?.nonce;
					const deviceData = paymentMethod?.deviceData;
					const paymentType = paymentMethod?.type;
					if (!nonce) {
						this.submitting = false;
						return;
					}
					this.recordDeposit(nonce, deviceData, paymentType, amount);
				})
				.catch(error => {
					// requestPaymentMethod rejects when no valid payment method is selected.
					this.submitting = false;
					logFormatter(`Braintree requestPaymentMethod error: ${error}`, 'error');
				});
		},
		recordDeposit(nonce, deviceData, paymentType, amount) {
			this.apollo.mutate({
				mutation: depositWithBraintreeNonceMutation,
				variables: {
					amount: numeral(amount).format('0.00'),
					nonce,
					deviceData,
				},
			}).then(response => {
				const transactionId = response?.data?.my?.depositWithBraintreeNonce ?? null;
				if (response.errors || !transactionId) {
					this.handleFailure(response);
					return;
				}
				this.handleSuccess(transactionId, paymentType, amount);
			}).catch(error => {
				this.handleFailure(error);
			});
		},
		handleSuccess(transactionId, paymentType, amount) {
			// Legacy parity: mirrors DepositView.js trackAddCredit — the value is the deposit in cents.
			this.$kvTrackEvent(
				'Lending',
				'Add Credit',
				'Add Credit Page',
				null,
				Math.round(numeral(amount).value() * 100),
			);
			// Braintree drop-in success event, mirroring the sibling payment wrappers.
			this.$kvTrackEvent(
				'portfolio',
				`${paymentType} Braintree DropIn Deposit`,
				'Success',
				transactionId,
				transactionId,
			);
			this.submitting = false;
			this.$emit('complete-transaction', { transactionId, paymentType, amount });
		},
		handleFailure(response) {
			this.submitting = false;
			// Shows the standard payment-error tip + fires the error event (shared with checkout / auto-deposit).
			this.processBraintreeDropInError('Deposit', response);
			// Clear the failed payment selection so the lender can retry.
			this.$refs.braintreeDropInInterface?.btDropinInstance?.clearSelectedPaymentMethod?.();
		},
	},
	mounted() {
		this.isClientReady = typeof window !== 'undefined';
	},
};
</script>
