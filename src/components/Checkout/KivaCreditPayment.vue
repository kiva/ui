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
		managedAccountId: {
			type: String,
			default: '',
		},
		promoFundId: {
			type: String,
			default: ''
		}
	},
	methods: {
		validateCreditBasket() {
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Button Click');
			this.$emit('updating-totals', true);
			this.validateGuestPromoBasket(this.email, this.emailUpdates, 'kiva.org', this.managedAccountId)
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
					console.error(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket()
				.then(transactionResult => {
					if (typeof transactionResult !== 'object') {
						// succesful validation
						this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResult);
						// Complete transaction handles additional analytics + redirect
						this.$emit('complete-transaction', transactionResult);
					} else {
						// checkout failed
						this.$emit('updating-totals', false);
						const errorResult = transactionResult?.errors ?? [];
						this.showCheckoutError(errorResult);
						this.$emit('checkout-failure', errorResult);
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					console.error(errorResponse);
				});
		},
	}
};
</script>
