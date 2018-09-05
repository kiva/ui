<template>
	<div class="featured-loans-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">Featured loans</h2>
			</div>

			<div class="column small-12 xxlarge-4">
				<h3>Research-backed impact</h3>
				<GridLoanCard
					class="is-in-featured"
					:loan="loan1"
					:category-id="featuredCategoryIds[0]"
				/>
			</div>

			<div class="column small-12 xxlarge-4">
				<h3>Almost funded</h3>
				<GridLoanCard
					class="is-in-featured"
					:loan="loan2"
					:category-id="featuredCategoryIds[1]"
				/>
			</div>

			<div class="column small-12 xxlarge-4">
				<h3>Trending now</h3>
				<GridLoanCard
					class="is-in-featured"
					:loan="loan3"
					:category-id="featuredCategoryIds[2]"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

export default {
	components: {
		GridLoanCard,
	},
	inject: ['apollo'],
	data() {
		return {
			// Hard-coded categories for now: research-backed=impact, almost-funded, trending-now
			featuredCategoryIds: [56, 60, 54],
			loan1: null,
			loan2: null,
			loan3: null,
			loading: false,
		};
	},
	apollo: {
		query: featuredLoansQuery,
		preFetch: true,
		variables() {
			return {
				ids: this.featuredCategoryIds,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.loan1 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
					'[0].loans.values[0]'
				);
				this.loan2 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[1]]),
					'[0].loans.values[0]'
				);
				this.loan3 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[2]]),
					'[0].loans.values[0]'
				);
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="scss" >
@import 'settings';

.featured-loans-wrapper {
	background-color: $kiva-bg-darkgray;
	margin-bottom: 2rem;
	padding: 2rem 0;
}

.section-name {
	font-weight: $global-weight-bold;
	margin-bottom: 1rem;
}

.column.is-in-featured {
	padding: 0;
}

</style>
