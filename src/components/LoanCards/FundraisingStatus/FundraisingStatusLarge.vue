<template>
	<div
		class="fundraising-status"
	>
		<div class="funded-status-line tw-text-brand tw-text-small">
			{{ percentRaised | numeral('0%') }} funded{{ lenderCount ? ` by ${lenderCount} lenders` : '' }}
		</div>
		<div
			class="fundraising-status-meter-wrapper"
		>
			<fundraising-status-meter
				:is-funded="isFunded"
				:percent-raised="percentRaised"
				:short-meter="true"
			/>
		</div>
		<div class="left-and-to-go-line tw-text-small tw-text-secondary">
			<span
				v-if="isFunded"
				class="tw-text-primary"
			>
				Funded
			</span>
			<span v-else>
				{{ timeLeftMessage }} / ${{ amountLeft | numeral('0,0') }} to go
			</span>
		</div>
	</div>
</template>

<script>
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';

export default {
	name: 'FundraisingStatusLarge',
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
	}

	.left-and-to-go-line {
		height: $small-text-font-size;
	}
}
</style>
