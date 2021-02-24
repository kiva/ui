<template>
	<div class="small-12 large-10 large-offset-1 columns">
		<div class="stats-box">
			<div class="row">
				<!-- loans funded -->
				<div class="small-6 large-2 large-offset-1 columns stats-box__group stats-box__group--even">
					<div class="stats-box__stat">
						${{ amountFunded | numeral('0.0a') }}
					</div>
					<div class="stats-box__stat-label">
						loans funded
					</div>
				</div>
				<!-- # lenders  -->
				<div class="small-6 large-2 columns stats-box__group stats-box__group--odd">
					<div class="stats-box__stat">
						{{ numLenders | numeral('0.0a') }}
					</div>
					<div class="stats-box__stat-label">
						lenders
					</div>
				</div>
				<!-- repayment rate -->
				<div class="small-6 large-2 columns stats-box__group stats-box__group--even">
					<div class="stats-box__stat">
						{{ repaymentRate | numeral('0%') }}
					</div>
					<div class="stats-box__stat-label">
						repayment rate
					</div>
				</div>
				<!-- # countries  -->
				<div class="small-6 large-2 columns stats-box__group stats-box__group--odd">
					<div class="stats-box__stat">
						{{ numCountries }}
					</div>
					<div class="stats-box__stat-label">
						countries
					</div>
				</div>
				<!-- # years -->
				<div class="small-12 large-2 columns">
					<div class="stats-box__stat">
						{{ yearsSinceStartCalc }}
					</div>
					<div class="stats-box__stat-label">
						years
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { differenceInYears } from 'date-fns';
import homepageStatistics from '@/graphql/query/whyKivaData.graphql';

export default {
	data() {
		return {
			amountFunded: 1.4,
			numLenders: 1.9,
			repaymentRate: 0.96,
			numCountries: 77,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: homepageStatistics,
		preFetch: true,
		result({ data }) {
			this.amountFunded = _get(data, 'general.kivaStats.amountFunded');
			this.numLenders = _get(data, 'general.kivaStats.numLenders');
			this.repaymentRate = _get(data, 'general.kivaStats.repaymentRate') / 100;
			this.numCountries = _get(data, 'general.kivaStats.numCountries');
		},
	},
	computed: {
		yearsSinceStartCalc() {
			// Kiva was formally registered as a
			// non-profit on October 12, 2005
			const foundedDate = new Date(2005, 10, 12);
			return differenceInYears(Date.now(), foundedDate);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.stats-box {
	border-radius: rem-calc(25);
	background-color: $kiva-accent-blue;
	color: $white;
	padding: 3.5rem 0;

	&__group {
		margin-bottom: rem-calc(40);

		&--even {
			border-right: 3px solid rgba(0, 0, 0, 0.2);
		}

		@include breakpoint(large) {
			margin-bottom: 0;

			&--odd {
				border-right: 3px solid rgba(0, 0, 0, 0.2);
			}
		}
	}

	&__stat {
		text-transform: uppercase;
		line-height: 0.8;
		font-size: 1.5rem;
	}

	&__stat-label {
		line-height: 1.3;

		@include breakpoint(xxlarge) {
			white-space: nowrap;
		}
	}
}
</style>
