import { setDonationAmount, setLendAmount } from '@/util/basketUtils';
import checkInjections from '@/util/injectionCheck';
import logFormatter from '@/util/logFormatter';

const injections = ['apollo', 'cookieStore'];

export default {
	mounted() {
		checkInjections(this, injections);

		// Handle expired basket cookie after refresh
		const failedLoan = this.cookieStore.get('kvatbid');
		const failedDonation = this.cookieStore.get('kvatbamt');

		// Handle Failed Donation add to basket
		if (failedDonation) {
			const failedDonationData = JSON.parse(failedDonation);
			const donationAmount = failedDonationData?.donationAmount;

			this.$kvTrackEvent(
				'donation',
				'add-to-basket',
				'donation-one-time-retry-after-basket-cookie-refresh',
				null,
				donationAmount
			);
			setDonationAmount({
				apollo: this.apollo,
				donationAmount,
			}).then(() => {
				this.$showTipMsg('Your donation has been added to the basket.');
				if (failedDonationData?.navigateToCheckout) {
					this.$router.push({
						path: '/checkout',
					});
				}
			}).catch(e => {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem adding the donation to your basket', 'error');
			});
			this.cookieStore.remove('kvatbamt');
		}

		// Handle Failed Loan add to basket
		if (failedLoan) {
			this.$kvTrackEvent('Lending', 'Add to basket', 'Retry after basket cookie refresh');
			const loan = JSON.parse(failedLoan);
			setLendAmount({
				apollo: this.apollo,
				amount: loan.price,
				loanId: loan.id,
			}).then(() => {
				this.$showTipMsg('Your loan has been added to the basket.');
				this.$emit('add-to-basket', { loanId: loan.id, success: true });
			}).catch(e => {
				const msg = e[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e[0]?.message
					: 'There was a problem adding the loan to your basket';

				logFormatter(msg, 'error');
				this.$showTipMsg(msg, 'error');
			});
			this.cookieStore.remove('kvatbid');
		}
	}
};
