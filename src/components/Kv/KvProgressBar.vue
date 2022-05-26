<template>
	<progress
		class="kv-progress-bar" :max="max" :value="value"
	></progress>
</template>

<script>

export default {
	name: 'KvProgressBar',
	props: {
		max: {
			type: String,
			default: '100',
		},
		value: {
			type: String,
			required: true
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-bar {
	$background-color: #fff;
	$foreground-color: $kiva-accent-blue;

	display: block;
	width: 100%;
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
