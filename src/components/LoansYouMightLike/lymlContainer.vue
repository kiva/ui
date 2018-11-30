<template>
	<div>
		<div class="row">
			<div class="column small-12">
				<h2 class="section-title featured-text">Similar loans you might like</h2>
				<!-- row for loan cards -->

				<minimal-loan-card
					:loan="loan"
				/>
				<minimal-loan-card />
				<minimal-loan-card />
			</div>
		</div>
	</div>
</template>

<script>
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';

export default {
	components: {
		MinimalLoanCard,
		initializeCheckout,
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

.section-title {
	margin-left: -0.5rem;
	font-weight: 400;
}

</style>
