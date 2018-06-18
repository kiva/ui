<template>
	<div class="column column-block grid-loan-card">
		<loan-card-image
			:id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
		/>

		<borrower-info
			:id="loan.id"
			:name="loan.name"
			:amount="loan.loanAmount"
			:use="loan.use"
			:country="loan.geocode.country.name"
		/>

		<div class="loan-card-footer-wrap">

		</div>

		<fundraising-status
			:amount-left="amountLeft"
			:percent-raised="percentRaised"
			:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
			:expiring-soon-message="expiringSoonMessage"
		/>

		<matching-text :matching-text="loan.matchingText" />
	</div>
</template>

<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';

export default {
	components: {
		LoanCardImage,
		BorrowerInfo,
		FundraisingStatus,
		MatchingText
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		amountLeft() {
			return this.loan.loanAmount - this.loan.loanFundraisingInfo.fundedAmount;
		},
		percentRaised() {
			return this.loan.loanFundraisingInfo.fundedAmount / this.loan.loanAmount;
		},
		expiringSoonMessage() {
			// let expiringSoonMessage = '';
			// if(loan.status === 'fundRaising') {
			// 	var expires = moment(loan.plannedExpirationDate);
			// 	var left = expires.diff(moment());
			//
			// 	if (left < moment.duration(1, 'minute').as('ms')) {
			// 		expiring_soon_message = 'Expiring now!';
			// 	}
			// 	else if (left < moment.duration(5.5, 'days').as('ms')) {
			// 		expiring_soon_message = 'Only ' + expires.fromNow(true) + ' left!';
			// 	}
			// }
			// placeholder for now
			return 'Only 19 minutes left!';
		}
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	.grid-loan-card {
		background-color: $white;
		border: 1px solid $kiva-stroke-gray;
	}

	.loan-card-footer-wrap {
		height: rem-calc(145);
		padding: rem-calc(10) rem-calc(20)rem-calc(20);
		text-align: center;
	}
</style>
