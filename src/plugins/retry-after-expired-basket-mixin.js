import { setLendAmount } from '@/util/basketUtils';
import checkInjections from '@/util/injectionCheck';
import addToBasketInsterstitial from '@/plugins/add-to-basket-show-interstitial';

const injections = ['apollo', 'cookieStore'];

export default {
	mixins: [addToBasketInsterstitial],
	mounted() {
		checkInjections(this, injections);

		// Handle expired basket cookie after refresh
		const failedLoan = this.cookieStore.get('kvatbid');
		if (failedLoan) {
			this.$kvTrackEvent('Lending', 'Add to basket', 'Retry after basket cookie refresh');
			const loan = JSON.parse(failedLoan);
			setLendAmount({
				apollo: this.apollo,
				amount: loan.price,
				loanId: loan.id,
			}).then(() => {
				this.triggerAddToBasketInterstitial(loan.id);
				this.$emit('add-to-basket', { loanId: loan.id, success: true });
			}).catch(e => {
				const msg = e[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e[0]?.message
					: 'There was a problem adding the loan to your basket';

				this.$showTipMsg(msg, 'error');
			});
			this.cookieStore.remove('kvatbid');
		}
	}
};
