<template>
	<progress
		class="kv-progress-bar" :max="max" :value="value"
	></progress>
</template>

<script>

export default {
	props: {
		max: {
			type: Number,
			default: 100,
		},
		value: {
			type: Number,
			required: true
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-bar {
	$background-color: $kiva-stroke-gray;
	$foreground-color: $kiva-accent-darkblue;

	width: 100%;
	height: rem-calc(20);
	background-color: $background-color;

	/* firefox */
	&::-moz-progress-bar {
		background: $foreground-color;
	}

	/* webkit browsers */
	&::-webkit-progress-bar {
		background: $background-color;
		box-shadow: 0;
	}

	&::-webkit-progress-value {
		background: $foreground-color;
	}

	/* IE */
	&::-ms-fill {
		background: $foreground-color;
		box-shadow: 0;
	}
}
</style>
