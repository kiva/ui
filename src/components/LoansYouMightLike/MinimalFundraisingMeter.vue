<template functional>
	<div>
		<div class="fundraising-meter progress">
			<span v-if="props.isFunded"
				class="meter"
				style="width: 100%;"></span>
			<span v-else
				class="meter"
				:style="{width: (props.percentRaised * 100) + '%'}"></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import 'settings';
	$loan-card-meter-height: rem-calc(4);

	.fundraising-meter {
		height: $loan-card-meter-height;
		width: 100%;
		border-radius: $loan-card-meter-height;
		background-color: $kiva-stroke-gray;

		.meter {
			border-radius: $loan-card-meter-height;
			background-color: $kiva-green;
			display: block;
			height: 100%;
		}
	}
</style>
