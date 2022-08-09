<template functional>
	<div class="fundraising-status-meter tw-bg-tertiary" :class="{short: props.shortMeter}">
		<span
			v-if="props.isFunded"
			class="meter tw-bg-brand"
			style="width: 100%;"
		>
		</span>
		<span
			v-else
			class="meter tw-bg-brand"
			:style="`width: ${(props.percentRaised * 100)}%;`"
		>
		</span>
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';
$loan-card-meter-height-short: rem-calc(4);
$loan-card-meter-height-medium: rem-calc(6);
$loan-card-meter-height: rem-calc(8);

.fundraising-status-meter {
	height: $loan-card-meter-height;
	width: 100%;
	border-radius: $loan-card-meter-height;

	.meter {
		border-radius: $loan-card-meter-height;
		display: block;
		height: 100%;
		transition: width 1s;
	}

	&.short {
		height: $loan-card-meter-height-short;

		.meter {
			border-radius: $loan-card-meter-height-short;
		}
	}

	&.medium {
		height: $loan-card-meter-height-medium;

		.meter {
			border-radius: $loan-card-meter-height-medium;
		}
	}

	&.square {
		.meter {
			border-radius: 0;
		}
	}
}
</style>
