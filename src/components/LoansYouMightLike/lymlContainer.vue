<template>
	<div>
		<div class="row">
			<div class="column small-12">
				<h2 class="section-title featured-text">Similar loans you might like</h2>
				<!-- row for loan cards -->
				<minimal-loan-card
					class="minimal-loan-card"
					:loan="loan1"
					category-set-id="loans-you-might-like"
					:card-number="1"
					:items-in-basket="itemsInBasket"
					:enable-tracking="true"
				/>
				<!-- <minimal-loan-card
					class="minimal-loan-card"
					:loan="loan2"
					category-set-id="loans-you-might-like"
					:card-number="2"
					:items-in-basket="itemsInBasket"
					:enable-tracking="true"
				/>
				<minimal-loan-card
					class="minimal-loan-card"
					:loan="loan3"
					category-set-id="loans-you-might-like"
					:card-number="3"
					:items-in-basket="itemsInBasket"
					:enable-tracking="true"
				/> -->
			</div>
		</div>
	</div>
</template>

<script>
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';
import _get from 'lodash/get';

export default {
	components: {
		MinimalLoanCard,
	},
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			sameCountry: ['US'],
			sameActivity: [120],
			randomLoan: [],
			loan1: null,
			loading: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: loansYouMightLikeData,
		preFetch: true,
		preFetchVariable() {
			return {
				country: this.sameCountry,
				activity: this.sameActivity
			};
		},
		variables() {
			return {
				country: this.sameCountry,
				activity: this.sameActivity
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
				console.log('Loading is true');
			} else {
				// const { randomLoan, sameCountry, sameActivity } = data.lend;
				if (data.lend.sameCountry) {
					this.loan1 = _get(data.lend, 'sameCountry.values[0]');
					this.loading = false;
				} else {
					this.loan1 = _get(data.lend, 'randomLoan.values[1]');
					this.loading = false;
				}
				console.log('Loading is false');
				console.log(data.lend);
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
