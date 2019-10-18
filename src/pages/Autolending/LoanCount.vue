<template>
	<figure class="loan-count-figure" :class="{ zero: count === 0 }">
		<figcaption class="count-caption">
			<slot></slot>
		</figcaption>
		<span class="count-value" v-if="counting">
			<kv-loading-spinner />
		</span>
		<span class="count-value" v-else>
			{{ count | numeral('0,0') }}
		</span>
	</figure>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	inject: ['apollo'],
	components: {
		KvLoadingSpinner,
	},
	data() {
		return {
			count: 0,
			counting: false,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentLoanCount
				countingLoans
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.count = _get(data, 'autolending.currentLoanCount');
			this.counting = _get(data, 'autolending.countingLoans');
		},
	}
};
</script>
