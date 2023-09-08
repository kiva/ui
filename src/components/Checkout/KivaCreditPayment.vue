<template>
	<kv-button
		type="submit"
		id="kiva-credit-submit"
		class="tw-mb-2"
		v-kv-track-event="['payment.continueBtn']"
		title="Checkout using your Kiva credit"
		@click.native.prevent="validateCreditBasket"
	>
		<slot>Complete order</slot>
	</kv-button>
</template>

<script>
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import { pollForCheckoutStatus } from '@/util/checkoutUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'KivaCreditPayment',
	components: {
		KvButton
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		checkoutUtils
	],
	props: {
		useAsyncCheckout: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		validateCreditBasket() {
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Button Click');
			this.$emit('updating-totals', true);
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// succesful validation
						this.checkoutCreditBasket();
					} else {
						// validation failed
						this.$emit('updating-totals', false);
						this.showCheckoutError(validationStatus);
						this.$emit('refreshtotals');
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					this.showCheckoutError(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket(false, this.useAsyncCheckout)
				.then(transactionResult => {
					if (this.useAsyncCheckout && typeof transactionResult !== 'object') {
						pollForCheckoutStatus(this.apollo, transactionResult)
							.then(checkoutStatusResponse => {
								this.handleSuccessfulCheckout(checkoutStatusResponse?.receipt?.checkoutId);
							}).catch(errorResponse => {
								this.handleFailedCheckout([
									{
										error: errorResponse.errorCode,
										message: `${errorResponse?.errorMessage}, ${errorResponse?.status}`,
									}
								]);
							});
					} else if (typeof transactionResult !== 'object') {
						this.handleSuccessfulCheckout(transactionResult);
					} else {
						// checkout failed
						const errorResult = transactionResult?.errors ?? [];
						this.handleFailedCheckout(errorResult);
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					this.handleFailedCheckout(errorResponse);
				});
		},
		handleSuccessfulCheckout(transactionResult) {
			// succesful validation
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResult);
			// Complete transaction handles additional analytics + redirect
			this.$emit('complete-transaction', transactionResult);
		},
		handleFailedCheckout(errorResult) {
			// checkout failed
			this.$emit('updating-totals', false);
			this.showCheckoutError(errorResult);
			this.$emit('checkout-failure', errorResult);
		}
	}
};
</script>
