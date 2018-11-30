<template>
	<div class="wrapper">
		<!-- Image -->
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
		/>

		<div>
			<!-- Name in small-text -->
			<div class="small-text name"
				name="{ loan.name }"></div>

			<!-- loan meter	 -->
			<fundrasing-status
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
				:is-funded="loan.status==='funded'"
			/>

			<!-- Need to add loan activity to borrower info -->
			<borrower-info
				:loan-id="loan.id"
				:name="loan.name"
				:country="loan.geocode.country.name"
			/>
			<!-- Country -->

			<!-- Sector -->

			<!-- Add to basket text -->

		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';

export default {
	components: {
		LoanCardImage,
		FundraisingStatus,
		shopBasketUpdate,
	},
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {},
					},
					image: {},
				};
			}
		},
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

.wrapper {
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
