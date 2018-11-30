<template>
	<div>
		<div class="row">
			<div class="column small-12">
				<h2 class="section-title featured-text">Similar loans you might like</h2>
				<!-- row for loan cards -->

				<!--
				<minimal-loan-card
					:loan="loan"
				/>
				<minimal-loan-card />
				<minimal-loan-card />
				-->
			</div>
		</div>
	</div>
</template>

<script>
// import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';

export default {
	components: {
		/* MinimalLoanCard, */
		loansYouMightLikeData,
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
	data() {
		return {
			randomLoan: [],
			sameCountry: [],
			sameActivity: [],
		};
	},
	inject: ['apollo'],
	apollo: {
		query: loansYouMightLikeData,
		preFetch: true,
		result({ data }) {
			const { randomLoan, sameCountry, sameActivity } = data.lend;
			this.randomLoan = randomLoan.values;
			this.sameCountry = sameCountry.values;
			this.sameActivity = sameActivity.values;
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
