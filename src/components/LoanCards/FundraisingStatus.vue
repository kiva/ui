<template functional>
	<div :class="{ 'single-line': props.singleLine }">
		<div class="fundraising-meter progress">
			<span v-if="props.isFunded"
				class="meter"
				style="width: 100%;"></span>
			<span v-else
				class="meter"
				:style="{width: (props.percentRaised * 100) + '%'}"></span>
		</div>

		<div class="left-and-to-go-line">
			<span v-if="props.expiringSoonMessage !== ''"
				class="loan-message">{{ props.expiringSoonMessage }}</span>
			<span v-if="props.isFunded" class="funded">Funded</span>
			<span v-else>${{ props.amountLeft | numeral('0,0') }} to go</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import 'settings';
	$loan-card-meter-height: rem-calc(8);

	.fundraising-meter {
		height: $loan-card-meter-height;
		width: 100%;
		margin: 0 0 rem-calc(8);
		border-radius: $loan-card-meter-height;
		background-color: $kiva-stroke-gray;

		.meter {
			border-radius: $loan-card-meter-height;
			background-color: $kiva-green;
			display: block;
			height: 100%;
			transition: width 1s;
		}
	}

	.left-and-to-go-line {
		height: $small-text-font-size;
		font-size: $small-text-font-size;
		line-height: $small-text-font-size;
		font-style: italic;
		font-weight: $button-font-weight;
		color: $kiva-green;

		.funded {
			font-style: normal;
		}
	}

	.loan-message {
		color: $kiva-text-dark;
	}

	.single-line {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.625rem;

		.fundraising-meter {
			width: 60%;
			margin: 0;
		}

		.left-and-to-go-line {
			flex-shrink: 0;
			color: $subtle-gray;
			font-style: italic;
			font-weight: $global-weight-normal;
		}
	}
</style>
