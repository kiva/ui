<template>
	<div class="loan-category-row">
		<h2>{{ name }}</h2>
		<p>
			{{ description }}
		</p>
		<div class="row small-up-1 large-up-2 xxlarge-up-3">
			<GridLoanCard
				v-for="loan in loans"
				:key="loan.id"
				:loan="loan"
			/>
		</div>
	</div>
</template>

<script>
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

export default {
	components: {
		GridLoanCard,
	},
	props: {
		category: {
			type: Object,
			default: () => ({ id: 1, filter: { gender: 'female' } }),
		}
	},
	inject: ['apollo'],
	data() {
		return {
			loading: false,
			offset: null,
			name: '',
			description: '',
			loans: {},
		};
	},
	apollo: {
		query: loanChannelQuery,
		variables() {
			return {
				offset: this.category.id,
				filters: this.category.filter,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.name = data.lend.loanChannels.values[0].name;
				this.description = data.lend.loanChannels.values[0].description;
				this.loans = data.lend.loans.values;
				this.loading = false;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
	.loan-category-row {

	}
</style>
