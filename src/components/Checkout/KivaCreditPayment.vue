<template>
	<kv-button
		type="submit"
		class="smaller"
		v-kv-track-event="['payment.continueBtn']"
		title="Checkout using your Kiva credit"
		@click.prevent.native="validateCreditBasket">
		<slot>Complete order</slot>
	</kv-button>
</template>

<script>
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton
	},
	inject: ['apollo'],
	mixins: [
		checkoutUtils
	],
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
					console.error(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket()
				.then(transactionResult => {
					if (typeof transactionResult !== 'object') {
						// succesful validation
						this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResult);
						this.redirectToThanks(transactionResult);
					} else {
						// checkout failed
						this.$emit('updating-totals', false);
						this.showCheckoutError(transactionResult);
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					console.error(errorResponse);
				});
		},
	}
};
</script>

<style>

</style>
