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
import { pollForFinishedCheckout } from '~/@kiva/kv-shop';
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
				.then(async transactionResult => {
					if (this.useAsyncCheckout && typeof transactionResult !== 'object') {
						await pollForFinishedCheckout({
							apollo: this.apollo,
							transactionSagaId: transactionResult,
						})
							.then(checkoutStatusResponse => {
								// eslint-disable-next-line max-len
								this.handleSuccessfulCheckout(checkoutStatusResponse?.data?.checkoutStatus?.receipt?.checkoutId);
							}).catch(errorResponse => {
								// setup default graphql error response
								let errors = errorResponse?.errors ?? null;
								// check for checkoutStatus specific errors
								if (
									errorResponse?.data?.checkoutStatus?.errorCode
									|| errorResponse?.data?.checkoutStatus?.errorMessage
								) {
									errors = this.formatCheckoutStatusError(errorResponse?.data?.checkoutStatus);
								}
								this.handleFailedCheckout(errors);
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
