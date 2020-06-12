<template>
	<grid-loan-card class="loan-card" :loan="loan" :is-visitor="true" />
</template>

<script>
import numeral from 'numeral';
import _get from 'lodash/get';

import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import recommendationsByLoginIdData from '@/graphql/query/loansYouMightLike/recommendationsByLoginIdData.graphql';

export default {
	components: {
		GridLoanCard,
	},
	inject: ['apollo'],
	apollo: {
		query: recommendationsByLoginIdData,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loginId: numeral((route.query.loginId)).value(),
				// offset: numeral((route.query.offset)).value(),
			};
		},
		variables() {
			return {
				loginId: numeral((this.$route.query.loginId)).value(),
				// offset: numeral((this.$route.query.offset)).value()
			};
		},
		result({ data }) {
			this.loan = _get(data, 'ml.recommendationsByLoginId.values[0]');
		},
	},
	data() {
		return {
			loan: {}
		};
	}
};
</script>

<style lang="scss" scoped>
.loan-card {
	width: 300px;
}

.loan-card ::v-deep {
	.lend-increment-dropdown-container { // hide the $ amount select
		display: none;
	}

	.lend-button {
		margin-left: 0;
	}

	.borrower-info-body {
		// multiline ellipsis hack
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
}
</style>
