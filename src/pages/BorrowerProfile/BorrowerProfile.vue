<template>
	<www-page id="borrower-profile">
		<div class="container">
			<div class="grid grid-cols-12 gap-x-2">
				<div class="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-7">
					<summary-card />
					<!-- Borrower details -->
				</div>
				<div class="col-span-12 md:col-start-6 md:col-span-6 lg:col-span-5">
					<lend-cta
						:loan-amount="loan.loanAmount"
						:funded-amount="loan.loanFundraisingInfo.fundedAmount"
						:reserved-amount="loan.loanFundraisingInfo.reservedAmount"
						:status="loan.status"
						:num-lenders="loan.lenders.totalCount"
						:lent-previously="loan.userProperties.lentTo"
						:amount-in-basket="loan.userProperties.amountInBasket"
						:min-note-size="loan.minNoteSize"
					/>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';

import WwwPage from '@/components/WwwFrame/WwwPage';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';
import borrowerProfile from '@/graphql/query/borrowerProfile.graphql';

export default {
	components: {
		SummaryCard,
		WwwPage,
		LendCta,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			loan: () => {},
			itemsInBasket: [],
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			const loanId = numeral(route?.params?.id).value();

			return client.query({
				query: borrowerProfile,
				variables: {
					id: loanId,
					basketId: cookieStore.get('kvbskt'),
				}
			}).then(({ data }) => {
				const loan = _get(data, 'lend.loan');
				if (loan === null || loan === 'undefined') {
					// redirect to legacy borrower profile
					return Promise.reject({
						path: `/lend/${loanId}`,
					});
				}
			});
		},
	},
	created() {
		// Read the page data from the cache
		let loanData = {};
		const loanIdFromRoute = numeral(_get(this.$route, 'params.id')).value();
		try {
			loanData = this.apollo.readQuery({
				query: borrowerProfile,
				variables: {
					id: loanIdFromRoute,
					basketId: this.cookieStore.get('kvbskt'),
				},
			});
			this.loan = _get(loanData, 'lend.loan');
			this.itemsInBasket = _get(loanData, 'shop.basket.items.values');
		} catch (e) {
			logReadQueryError(e, 'TailwindsBorrowerProfilePage tailwindsBorrowerProfile');
			this.$router.push({ path: `/lend/${loanIdFromRoute}` });
		}
	},
};
</script>
