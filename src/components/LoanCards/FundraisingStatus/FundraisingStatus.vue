<template>
	<div
		class="fundraising-status"
		:class="{
			'single-line': singleLine,
			'hide-meter': hideMeter,
			'left-and-to-go-on-top': leftAndToGoOnTop,
		}"
	>
		<div
			class="fundraising-status-meter-wrapper"
		>
			<fundraising-status-meter
				:is-funded="isFunded"
				:percent-raised="percentRaised"
				:short-meter="shortMeter"
			/>
		</div>
		<div
			class="left-and-to-go-line tw-text-small"
			:class="{
				'tw-font-medium tw-italic tw-text-brand' : !leftAndToGoOnTop,
				'tw-font-book tw-text-secondary' : leftAndToGoOnTop
			}"
		>
			<span
				v-if="expiringSoonMessage !== ''"
				class="tw-text-primary"
			>
				{{ expiringSoonMessage }}
			</span>
			<span v-if="isFunded" class="tw-font-book">Funded</span>
			<span v-else>${{ $filters.numeral(amountLeft, '0,0') }} to go</span>
		</div>
	</div>
</template>

<script>
import FundraisingStatusMeter from '#src/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';

export default {
	name: 'FundraisingStatus',
	components: {
		FundraisingStatusMeter,
	},
	props: {
		singleLine: {
			type: Boolean,
			default: false,
		},
		leftAndToGoOnTop: {
			type: Boolean,
			default: false,
		},
		shortMeter: {
			type: Boolean,
			default: false,
		},
		expiringSoonMessage: {
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
	},
	computed: {
		hideMeter() {
			return this.singleLine && this.expiringSoonMessage;
		},
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.fundraising-status {
	display: flex;
	flex-direction: column;

	.fundraising-status-meter-wrapper {
		margin-bottom: rem-calc(8);
	}

	&.left-and-to-go-on-top {
		flex-direction: column-reverse;

		.fundraising-status-meter-wrapper {
			margin-bottom: 0;
		}

		.left-and-to-go-line {
			margin-bottom: 0.25rem;
		}
	}

	&.single-line {
		flex-direction: row-reverse;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.625rem;

		.fundraising-status-meter-wrapper {
			width: 60%;
			margin: 0;
		}

		.left-and-to-go-line {
			flex-shrink: 0;
			color: $subtle-gray;
			font-style: italic;
			font-weight: $global-weight-normal;
		}

		&.hide-meter {
			flex-direction: row;

			.fundraising-status-meter-wrapper {
				display: none;
			}
		}
	}
}
</style>
