<template>
	<div class="donation-nudge-boxes-container">
		<div class="row nudge-box-row">
			<div
				v-for="{percentage, appeal, appealIsHorizontallyPadded} in percentageRows"
				:key="percentage"
				class="medium-4 columns nudge-box-top-container nudge-box-container"
			>
				<div
					:class="`nudge-box-top ${appealIsHorizontallyPadded ? 'nudge-box-padded' : ''}`"
					@click="setDonationAndClose(getDonationByPercent(percentage))"
				>
					{{ appeal }}
				</div>
			</div>
		</div>
		<div class="row nudge-box-row">
			<div
				v-for="{percentage} in percentageRows"
				:key="percentage"
				class="medium-4 columns nudge-box-middle-container nudge-box-container"
			>
				<div
					class="nudge-box-middle"
					@click="setDonationAndClose(getDonationByPercent(percentage))"
				>
					${{ getDonationByPercent(percentage) }}
				</div>
			</div>
		</div>
		<div class="row nudge-box-row">
			<div
				v-for="{percentage} in percentageRows"
				:key="percentage"
				class="medium-4 columns nudge-box-bottom-container nudge-box-container"
			>
				<div
					class="nudge-box-bottom"
					@click="setDonationAndClose(getDonationByPercent(percentage))"
				>
					<kv-button class="smaller nudge-box-button">
						Select
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		percentageRows: {
			type: Array,
			required: true,
		},
		setDonationAndClose: {
			type: Function,
			required: true,
		},
	},
	methods: {
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-nudge-boxes-container {
	.nudge-box-row {
		$nudge-box-border: 1px solid #eee;

		.nudge-box-shared {
			background: $white;
			border-left: $nudge-box-border;
			border-right: $nudge-box-border;
			padding: 0 0.5rem;
			height: 100%;
			cursor: pointer;
			user-select: none;
		}

		.nudge-box-container {
			.nudge-box-top {
				@extend .nudge-box-shared;

				display: flex;
				align-items: center;
				padding-top: 1rem;
				border-top: $nudge-box-border;

				&.nudge-box-padded {
					padding-left: 2rem;
					padding-right: 2rem;
				}
			}

			.nudge-box-middle {
				@extend .nudge-box-shared;

				padding: 1.5rem 0;
				font-size: 1.5rem;
			}

			.nudge-box-bottom {
				@extend .nudge-box-shared;

				padding-bottom: 1rem;
				border-bottom: $nudge-box-border;

				@include breakpoint(large only) {
					button.button.smaller.nudge-box-button {
						padding: 0.75rem 1.5rem;
					}
				}
			}
		}
	}
}
</style>
