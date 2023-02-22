<template>
	<div
		class="tw-rounded tw-bg-brand-50 tw-w-full tw-py-1 tw-px-1 tw-mb-2 tw-mt-2"
	>
		<template v-if="promoAmount">
			<h4 class="tw-mt-2 tw-mb-1 tw-px-4">
				Let's Get Started
			</h4>
			<h3 class="tw-mb-2 tw-px-4">
				You have ${{ promoAmount | numeral }} in credit from {{ promoName }}
			</h3>
			<kv-progress-bar
				class="tw-mb-2"
				aria-label="Percentage of credit amount"
				:max="promoAmount.toString()"
				:value="(0).toString()"
			/>
		</template>

		<template v-if="creditAmountLeft >= '1.00' && creditAmountLeft !== promoAmount">
			<h4 class="tw-mb-1 tw-px-3">
				Keep Going!
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have $ {{ partialPromoAmount | numeral }}
				in credit left from {{ promoName }}
			</h3>
			<kv-progress-bar
				class="tw-mb-2"
				aria-label="Percentage of credit amount"
				:max="promoAmount.toString()"
				:value="(partialPromoAmount).toString()"
			/>
		</template>

		<template v-if="creditAmountLeft === promoAmount">
			<h4 class="tw-mb-1 tw-px-3">
				You Did It!
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have spent all your credit from {{ promoName }}
			</h3>
			<kv-progress-bar
				class="tw-mb-2"
				aria-label="Percentage of credit amount"
				:max="promoAmount.toString()"
				:value="(promoAmount).toString()"
			/>
		</template>
	</div>
</template>

<script>
import KvProgressBar from '@/components/Kv/KvProgressBar';

export default {
	name: 'CampaignProgressBar',
	components: {
		KvProgressBar
	},
	props: {
		promoAmount: {
			type: String,
			default: '$0.00'
		},
		creditAmountLeft: {
			type: String,
			default: '$0.00'
		},
		promoName: {
			type: String,
			default: null
		},
	},
	computed: {
		partialPromoAmount() {
			return (this.creditAmountLeft / this.promoAmount) * (100);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-bar {
	$background-color: $very-light-gray;
	$foreground-color: #2AA967;

	display: block;
	border-radius: 9999px;
	overflow: hidden;
	position: relative;
	right: 2rem;
	left: 2rem;
	width: 40%;
	background-color: $background-color;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	height: rem-calc(4);

	@include breakpoint(large) {
		height: rem-calc(9);
	}

	/* firefox */
	&::-moz-progress-bar {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
	}

	/* webkit browsers */
	&::-webkit-progress-bar {
		background: $background-color;
		background: var(--kv-progress-bar-background-color, $background-color);
		box-shadow: 0;
	}

	&::-webkit-progress-value {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
	}

	/* IE */
	&::-ms-fill {
		background: $foreground-color;
		background: var(--kv-progress-bar-foreground-color, $foreground-color);
		box-shadow: 0;
	}
}
</style>
