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
				.then(async transactionResponse => {
					if (this.useAsyncCheckout && typeof transactionResponse !== 'object') {
						await pollForFinishedCheckout({
							apollo: this.apollo,
							transactionSagaId: transactionResponse,
						})
							.then(checkoutStatusResponse => {
								// eslint-disable-next-line max-len
								const checkoutId = checkoutStatusResponse?.data?.checkoutStatus?.receipt?.checkoutId ?? null;
								if (!checkoutId) {
									// setup default graphql error response
									let errors = checkoutStatusResponse?.errors ?? null;
									// check for checkoutStatus specific errors
									if (
										checkoutStatusResponse?.data?.checkoutStatus?.errorCode
										|| checkoutStatusResponse?.data?.checkoutStatus?.errorMessage
									) {
										// eslint-disable-next-line max-len
										errors = this.formatCheckoutStatusError(checkoutStatusResponse?.data?.checkoutStatus);
									}
									this.handleFailedCheckout(errors);
								}
								this.handleSuccessfulCheckout(checkoutId);
							}).catch(errorResponse => {
								// setup default graphql error response
								let errors = errorResponse?.errors ?? null;
								// check for checkoutStatus specific errors
								if (
									errorResponse?.data?.checkoutStatus?.errorCode
									|| errorResponse?.data?.checkoutStatus?.errorMessage
								) {
									errors = this.formatCheckoutStatusError(errorResponse?.data?.checkoutStatus);
								} else {
									this.handleFailedCheckout(errors);
								}
							});
					} else if (typeof transactionResponse !== 'object') {
						this.handleSuccessfulCheckout(transactionResponse);
					} else {
						// checkout failed
						const errorResult = transactionResponse?.errors ?? [];
						this.handleFailedCheckout(errorResult);
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					this.handleFailedCheckout(errorResponse);
				});
		},
		handleSuccessfulCheckout(transactionResponse) {
			// succesful validation
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResponse);
			// Complete transaction handles additional analytics + redirect
			this.$emit('complete-transaction', transactionResponse);
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
