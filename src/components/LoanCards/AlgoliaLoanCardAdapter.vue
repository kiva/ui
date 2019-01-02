<template>
	<div class="algolia-loan-card-adapter column column-block">
		<GridLoanCard
			:key="loan.id"
			:loan="adaptedLoan"
			:is-visitor="true"
			:items-in-basket="itemsInBasket" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

export default {
	components: {
		GridLoanCard
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
	},
	computed: {
		adaptedLoan() {
			// TODO: There must be a better way
			const defaultImage = `https://www-dev-kiva-org.global.ssl.fastly.net/img/w480h360/${_get(this.loan, 'image.hash')}.jpg`; // eslint-disable-line
			const retinaImage = `https://www-dev-kiva-org.global.ssl.fastly.net/img/w960h720/${_get(this.loan, 'image.hash')}.jpg`; // eslint-disable-line
			const exprirationDate = new Date(_get(this.loan, 'plannedExpirationDate') * 1000);

			return {
				id: _get(this.loan, 'id'),
				borrowerCount: _get(this.loan, 'borrowerCount'),
				geocode: {
					country: {
						name: _get(this.loan, 'geocode.country.name')
					},
				},
				image: {
					default: defaultImage,
					retina: retinaImage
				},
				loanAmount: _get(this.loan, 'loanAmount.amount'),
				loanFundraisingInfo: {
					fundedAmount: _get(this.loan, 'loanFundraisingInfo.fundedAmount.amount'),
					isExpiringSoon: _get(this.loan, 'loanFundraisingInfo.isExpiringSoon'),
					reservedAmount: _get(this.loan, 'loanFundraisingInfo.reservedAmount.amount'),
				},
				loanUse: _get(this.loan, 'use'),
				matchingText: '',
				name: _get(this.loan, 'name'),
				partnerName: _get(this.loan, 'partnerName'),
				plannedExpirationData: exprirationDate.toISOString(),
				// TODO: figure out how to get these efficiently...maybe after page load?
				userProperties: {
					favorited: false,
					lentTo: false
				},
			};
		}
	}
};
</script>

<style lang="scss">
.algolia-loan-card-adapter {
	padding: 0;
}
</style>
