<template>
	<div class="dropin-payment-holder tw-px-0 tw-mt-2">
		<!-- Token fetch failed -->
		<div v-if="tokenError" data-testid="deposit-payment-error">
			<p>We couldn't load payment options. Please try again.</p>
			<kv-button
				class="tw-mt-2"
				@click="loadClientToken"
				v-kv-track-event="['portfolio', 'click', 'Deposit retry payment load']"
			>
				Try again
			</kv-button>
		</div>

		<!-- Once the client token resolves, KvPaymentSelect renders and owns its own
			loading spinner while the Braintree drop-in initializes. -->
		<template v-else-if="authToken">
			<!-- Lock the payment selection while a charge is in flight so the user can't
				swap the payment method mid-submit. -->
			<div
				data-testid="deposit-payment-wrap"
				:class="{ 'tw-pointer-events-none tw-opacity-low': submitting }"
				:inert="submitting || undefined"
			>
				<KvPaymentSelect
					ref="paymentSelect"
					:amount="formattedAmount"
					:auth-token="authToken"
					drop-in-name="deposit"
					flow="vault"
					:payment-types="paymentTypes"
					@transactions-enabled="enableConfirmButton = $event"
					@error="onPaymentError"
				/>
			</div>

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
		</template>
	</div>
</template>

<script>
import numeral from 'numeral';
import { mdiLock } from '@mdi/js';
import { getClientToken, KvPaymentSelect } from '@kiva/kv-shop';
import braintreeDropInError from '#src/plugins/braintree-dropin-error-mixin';
import logFormatter from '#src/util/logFormatter';
import depositWithBraintreeNonceMutation from '#src/graphql/mutation/deposit/depositWithBraintreeNonce.graphql';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';

export default {
	name: 'DepositDropInPaymentWrapper',
	components: {
		KvButton,
		KvMaterialIcon,
		KvPaymentSelect,
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
			// Preserve the original deposit payment options (PayPal + card) and order.
			paymentTypes: ['paypal', 'card'],
			authToken: '',
			tokenError: false,
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
		async loadClientToken() {
			this.tokenError = false;
			try {
				// Deposit is behind auth, so we always fetch a customer-scoped token
				// (getClientToken queries with useCustomerId: true) to support vaulting.
				this.authToken = await getClientToken(this.apollo) ?? '';
				if (!this.authToken) {
					this.tokenError = true;
				}
			} catch (error) {
				this.tokenError = true;
				logFormatter(`Deposit getClientToken error: ${error}`, 'error');
			}
		},
		onPaymentError(message) {
			const errorMsg = message || 'Something went wrong. Please refresh the page and try again.';
			this.$showTipMsg(errorMsg, 'error');
		},
		async submit() {
			if (this.disabled || !this.enableConfirmButton || this.submitting) {
				return;
			}
			this.submitting = true;
			// Snapshot the amount at submit time so the charge and the confirmation reflect the amount
			// the user confirmed, even if the input changes while the request is in flight.
			const { amount } = this;
			try {
				const paymentMethod = await this.$refs.paymentSelect.requestPaymentMethod();
				const nonce = paymentMethod?.nonce;
				if (!nonce) {
					// No requestable payment method (e.g. selection cleared). Let the user retry.
					this.submitting = false;
					return;
				}
				this.recordDeposit(nonce, paymentMethod?.deviceData, paymentMethod?.type, amount);
			} catch (error) {
				// requestPaymentMethod rejects when no valid payment method is selected.
				this.submitting = false;
				logFormatter(`KvPaymentSelect requestPaymentMethod error: ${error}`, 'error');
			}
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
			// Add Credit event: the value is the deposit amount
			this.$kvTrackEvent(
				'Lending',
				'Add Credit',
				'Add Credit Page',
				null,
				amount,
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
		},
	},
	mounted() {
		this.loadClientToken();
	},
};
</script>

<style lang="postcss" scoped>
/*
 * While the Braintree drop-in initializes it renders its own loader inside the
 * container, and KvPaymentSelect additionally renders its own KvLoadingSpinner
 * (a direct <svg> child of .kv-payment-select) — showing two spinners at once.
 * Hide the redundant KvPaymentSelect spinner and let the drop-in's own loader
 * be the single loading indicator.
 */
:deep(.kv-payment-select > svg) {
	@apply tw-hidden;
}
</style>
