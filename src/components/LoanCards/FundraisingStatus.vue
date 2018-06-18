<template functional>
	<div>
		<div class="fundraising-meter progress">
			<span class="meter" :style="{width: (props.percentRaised * 100) + '%'}"></span>
		</div>

		<div class="left-and-to-go-line">
			<span v-if="props.isExpiringSoon" class="loan-message">{{ props.expiringSoonMessage }}</span>
			${{ props.amountLeft | numeral('0,0') }} to go
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
		}
	}

	.left-and-to-go-line {
		height: $small-font-size;
		font-size: $small-font-size;
		line-height: $small-font-size;
		font-style: italic;
		color: $kiva-green;
		margin-bottom: rem-calc(10);
	}
</style>
