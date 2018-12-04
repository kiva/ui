<template>
	<div class="minimal-loan-card">
		<!-- Image -->
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
		/>

		<div>
			<!-- Need to add loan activity to borrower info -->
			<borrower-info
				:loan-id="loan.id"
				:name="loan.name"
			/>

			<!-- loan meter	 -->
			<!-- <fundrasing-status
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
				:is-funded="loan.status==='funded'"
			/> -->
			<!-- Country -->
			<!-- Sector -->
			<!-- Add to basket text -->
		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
// import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';

export default {
	components: {
		LoanCardImage,
		BorrowerInfo,
		// FundraisingStatus,
		shopBasketUpdate
	},
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {}
					},
					image: {}
				};
			}
		}
	},
	computed: {
		amountLeft() {
			const { fundedAmount, reservedAmount } = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
		isFunded() {
			return this.loan.status === 'funded' || this.amountLeft <= 0;
		},
		percentRaised() {
			return (this.loan.loanAmount - this.amountLeft) / this.loan.loanAmount;
		}
	}
};
</script>
<style lang="scss" scoped>
@import "settings";

.minimal-loan-card {
  width: rem-calc(180);
  height: rem-calc(280);
  border: 1px solid $kiva-stroke-gray;
  display: inline-block;
  margin: rem-calc(10);
}

.name {
  font-weight: 400;
  color: $kiva-text-dark;
}
</style>
