<template>
	<div class="minimal-loan-card">
		<!-- Image -->

		<!-- is-visitor set to false is hiding the loan favorite star on borrower images -->
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
		/>

		<div class="minimal-loan-card-data-wrap">
			<p
				:loan-id="loan.id"
				:name="loan.name"
				class="small-text name"
			>{{ loan.name }}</p>

			<!-- loan meter	 -->
			<minimal-fundraising-meter
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:is-funded="loan.status==='funded'"
			/>
			<!-- Country -->
			<p
				class="small-text loan-data"
				:country="loan.geocode.country.name"
				:sector="loan.activity.name">
				{{ loan.geocode.country.name }} <br> {{ loan.activity.name }}
			</p>
			<!-- Add to basket text -->
			<a v-if="!isFunded" class="card-action">Add to basket</a>
			<p v-if="isFunded" class="card-action">Fully funded</p>
		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MinimalFundraisingMeter from '@/components/LoansYouMightLike/MinimalFundraisingMeter';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';

export default {
	components: {
		LoanCardImage,
		MinimalFundraisingMeter,
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
		},
		isVisitor: {
			type: Boolean,
			default: true
		},
		country: {
			type: String,
			default: ''
		},
		sector: {
			type: String,
			default: ''
		},
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
	height: rem-calc(296);
	border: 1px solid $kiva-stroke-gray;
	display: inline-block;
	margin: rem-calc(10);
}

.minimal-loan-card-data-wrap {
	padding: 15px;
}

.name {
	font-weight: 400;
	color: $kiva-text-dark;
	margin-bottom: 10px;
}

.loan-data {
	color: $kiva-text-light;
	padding: 13px 0;
	margin-bottom: 0;
}

.card-action {
	margin-bottom: 15px;
	font-weight: 400;
}
</style>
