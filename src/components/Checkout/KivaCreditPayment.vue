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
import logFormatter from '@/util/logFormatter';
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
		handleTeamJoin: {
			type: Function,
			default: async () => {
				return { success: true, message: 'handleTeamJoin not passed' };
			}
		},
	},
	methods: {
		async validateCreditBasket() {
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Button Click');
			this.$emit('updating-totals', true);

			const validationStatus = await this.validateBasket();
			if (!validationStatus === true) {
				// validation failed
				this.$emit('updating-totals', false);
				this.showCheckoutError(validationStatus);
				this.$emit('refreshtotals');
				Promise.reject(validationStatus);
			}

			const handleTeamJoinResult = await this.handleTeamJoin;
			if (handleTeamJoinResult.success === false) {
				this.$emit('updating-totals', false);
				this.showCheckoutError(handleTeamJoinResult.message);
				this.$emit('refreshtotals');
				Promise.reject(handleTeamJoinResult);
			}

			await this.checkoutCreditBasket();
		},
		checkoutCreditBasket() {
			return this.checkoutBasket()
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
					Promise.resolve(transactionResult);
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					logFormatter('KivaCreditPayment Checkout Failed', 'error', errorResponse);
					Promise.reject(errorResponse);
				});
		},
	}
};
</script>
