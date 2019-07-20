<template>
	<div
		class="fundraising-status"
	>
		<div class="funded-status-line">
			{{ percentRaised | numeral('0%') }} funded{{ lenderCount ? ` by ${lenderCount} lenders` : '' }}
		</div>
		<div
			class="fundraising-status-meter-wrapper"
		>
			<fundraising-status-meter
				:is-funded="isFunded"
				:percent-raised="percentRaised"
			/>
		</div>
		<div class="left-and-to-go-line">
			<span
				v-if="isFunded"
				class="funded"
			>
				Funded
			</span>
			<span
				:class="{'expiring-soon': expiringSoonMessage}"
				v-else
			>
				{{ timeLeftMessage }} / ${{ amountLeft | numeral('0,0') }} to go
			</span>
		</div>
	</div>
</template>

<script>
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';

export default {
	components: {
		FundraisingStatusMeter,
	},
	props: {
		expiringSoonMessage: {
			type: String,
			default: '',
		},
		timeLeftMessage: {
			type: String,
			default: '',
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		amountLeft: {
			type: Number,
			default: 0,
		},
		lenderCount: {
			type: Number,
			default: 0,
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.fundraising-status {
	display: flex;
	flex-direction: column;

	.fundraising-status-meter-wrapper {
		margin: 0.5rem 0;
	}

	.funded-status-line {
		height: $small-text-font-size;
		font-size: $small-text-font-size;
		line-height: $small-text-font-size;
		color: $kiva-green;
	}

	.left-and-to-go-line {
		height: $small-text-font-size;
		font-size: $small-text-font-size;
		line-height: $small-text-font-size;
		color: $gray;

		.funded,
		.expiring-soon {
			color: $kiva-text-dark;
		}
	}
}
</style>
