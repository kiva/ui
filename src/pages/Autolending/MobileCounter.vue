<template>
	<figure class="mobile-counter" :class="classNames">
		<template v-if="count < warningThreshold">
			<div class="warning-text">
				{{ count > 0 ? 'Only ' : '' }}
				<loan-count-span class="count-value" :count="count" :counting="counting" /> matching
				{{ count === 1 ? ' loan' : ' loans' }}
			</div>
			<figcaption class="count-caption">
				Broaden your criteria to ensure your money gets lent.
			</figcaption>
		</template>
		<template v-else>
			<figcaption class="count-caption">
				Currently matching loans:
			</figcaption>
			<loan-count-span class="count-value" :count="count" :counting="counting" />
		</template>
	</figure>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import LoanCountSpan from './LoanCountSpan';

export default {
	inject: ['apollo'],
	components: {
		LoanCountSpan,
	},
	data() {
		return {
			count: 0,
			counting: false,
			warningThreshold: 0,
		};
	},
	computed: {
		classNames() {
			return {
				'good-amount': this.count >= this.warningThreshold,
			};
		},
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentLoanCount
				countingLoans
				warningThreshold
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.count = _get(data, 'autolending.currentLoanCount');
			this.counting = _get(data, 'autolending.countingLoans');
			this.warningThreshold = _get(data, 'autolending.warningThreshold');
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.mobile-counter {
	text-align: center;
	margin-bottom: 0.75rem;

	.loading-spinner {
		vertical-align: middle;
		margin-top: -0.25rem;
		width: 1rem;
		height: 1rem;
	}

	.warning-text {
		margin: 0.5rem 0;
		font-size: rem-calc(18);
		font-weight: 500;
		color: $kiva-accent-red;

		.loading-spinner >>> .line {
			background-color: $kiva-accent-red;
		}
	}

	.count-caption {
		line-height: 1.3;
		margin: 0 auto;
		max-width: 15rem;
	}

	&.good-amount {
		color: $kiva-green;

		.count-caption {
			display: inline;
			font-size: rem-calc(18);
			padding: 0;
			margin-right: 0.25rem;
			color: $kiva-green;
		}

		.count-value {
			font-size: rem-calc(28);
			font-weight: 500;
		}

		.loading-spinner {
			width: 1.75rem;
			height: 1.75rem;

			& >>> .line {
				background-color: $kiva-green;
			}
		}
	}
}
</style>
