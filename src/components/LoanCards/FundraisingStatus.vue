<template>
	<div
		class="fundraising-status"
		:class="{
			'single-line': singleLine,
			'hide-meter': singleLine && expiringSoonMessage,
			'left-and-to-go-on-top': leftAndToGoOnTop,
		}"
	>
		<fundraising-status-meter
			class="fundraising-status-meter"
			:is-funded="isFunded"
			:percent-raised="percentRaised"
			:short-meter="shortMeter"
		/>
		<div class="left-and-to-go-line">
			<span v-if="expiringSoonMessage !== ''"
				class="loan-message"
			>
				{{ expiringSoonMessage }}
			</span>
			<span v-if="isFunded" class="funded">Funded</span>
			<span v-else>${{ amountLeft | numeral('0,0') }} to go</span>
		</div>
	</div>
</template>

<script>
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatusMeter';

export default {
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
};
</script>

<style lang="scss" scoped>
@import 'settings';

.fundraising-status {
	display: flex;
	flex-direction: column;

	.fundraising-status-meter {
		margin-bottom: rem-calc(8);
	}

	.left-and-to-go-line {
		height: $small-text-font-size;
		font-size: $small-text-font-size;
		line-height: $small-text-font-size;
		font-style: italic;
		font-weight: $button-font-weight;
		color: $kiva-green;

		.loan-message {
			color: $kiva-text-dark;
		}

		.funded {
			font-style: normal;
		}
	}

	&.left-and-to-go-on-top {
		flex-direction: column-reverse;

		.fundraising-status-meter {
			margin-bottom: 0;
		}

		.left-and-to-go-line {
			margin-bottom: 0.25rem;
			font-weight: $global-weight-normal;
			font-style: normal;
		}
	}

	&.single-line {
		flex-direction: row-reverse;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.625rem;

		.fundraising-status-meter {
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

			.fundraising-status-meter {
				display: none;
			}
		}
	}
}
</style>
