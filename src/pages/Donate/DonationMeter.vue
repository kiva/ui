<template>
	<div class="row align-center align-middle relative donation-meter">
		<div class="donation-meter__indicator shrink small-12 columns">
			<div
				class="indicator"
				:class="isLoading ? 'indicator--is-loading' : ''"
			>
				<kv-progress-circle
					class="indicator__progress-circle"
					:stroke-width="12"
					:value="goalPercent"
					:arc-scale=".8"
					:rotate="36"
					:show-number="false"
				/>
				<img
					v-if="imageUrl"
					class="indicator__image"
					:src="imageUrl"
					alt=""
				>
				<div
					class="indicator__goal-status"
					v-html="goalStatus"
				>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';

const meterStatsQuery = gql`query meterInfo {
	general {
		kivaStats {
			latestDonationCampaign {
				amount_raised
				target_amount
			}
		}
	}
}`;

export default {
	name: 'DonationMeter',
	components: {
		KvProgressCircle,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		content: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			amountRaised: null,
			targetAmount: 0,
		};
	},
	computed: {
		imageUrl() {
			return this.content?.images?.[0]?.file?.url || '';
		},
		isLoading() {
			return this.amountRaised === null;
		},
		goalPercent() {
			if (!this.targetAmount || !this.amountRaised) {
				return 0;
			}
			const percent = Math.floor((this.amountRaised / this.targetAmount) * 100);
			return percent > 100 ? 100 : percent;
		},

		goalStatus() {
			if (this.isLoading) {
				return 'loading...';
			}
			if (this.goalPercent === 100) {
				return 'Goal <br />reached!';
			}
			const nearestThousand = parseFloat(Number((this.targetAmount - this.amountRaised) / 1000).toPrecision(3));
			// const nearestThousand = numeral((this.targetAmount - this.amountRaised) / 1000).format('0.[00]');
			return `$${nearestThousand}k <br />to goal`;
		}
	},
	mounted() {
		this.fetchMeterStats();
	},
	methods: {
		fetchMeterStats() {
			this.apollo.query({
				query: meterStatsQuery
			}).then(({ data }) => {
				this.amountRaised = data?.general?.kivaStats?.latestDonationCampaign?.amount_raised; // eslint-disable-line
				this.targetAmount = data?.general?.kivaStats?.latestDonationCampaign?.target_amount; // eslint-disable-line
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-meter {
	letter-spacing: -0.02em;
	margin: 0 auto;

	&__indicator {
		margin-bottom: rem-calc(32);
		@include breakpoint('large') {
			margin: 0;
		}
	}
}

.indicator {
	position: relative;
	width: rem-calc(164);
	height: rem-calc(164);

	&__progress-circle,
	&__image {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	&__progress-circle {
		z-index: 2;

		--kv-progress-circle-foreground-color: #{$kiva-green};
	}

	&__goal-status {
		$width: 5rem;

		font-weight: bold;
		font-size: rem-calc(12);
		line-height: 1.2;
		text-align: center;
		width: $width;
		margin: 0 auto;
		position: absolute;
		bottom: 0;
		left: calc(50% - #{$width / 2});
		z-index: 2;
	}

	&--is-loading {
		.indicator__image {
			opacity: 0.3;
		}
	}
}

.relative {
	position: relative;
}
</style>
