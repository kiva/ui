<template>
	<www-page class="lend-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p>Each Kiva loan helps people build a better
				future for themselves and their families.</p>
			</div>

			<div class="columns small-12">
				<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
					<GridLoanCard
						v-for="loan in loans"
						:key="loan.id"
						:loan="loan"
						:is-visitor="isVisitor"
					/>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import loanCardQuery from '@/graphql/query/loanCardData.graphql';
import _get from 'lodash/get';

export default {
	components: {
		WwwPage,
		GridLoanCard,
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Fundraising loans'
	},
	data() {
		return {
			totalCount: 0,
			loans: [],
			isVisitor: true
		};
	},
	apollo: {
		query: loanCardQuery,
		preFetch: true,
		result({ data }) {
			this.totalCount = data.lend.loans.totalCount;
			this.loans = data.lend.loans.values;
			this.isVisitor = !_get(data, 'my.userAccount.id');
		}
	}
};
</script>

<style lang="scss">
	@import 'settings';

	.lend-page {
		background-color: $kiva-bg-lightgray;
	}

	.heading-region {
		margin-top: rem-calc(20);
		padding: rem-calc(10);

		@include breakpoint(large) {
			p {
				max-width: 75%;
			}
		}
	}
</style>
