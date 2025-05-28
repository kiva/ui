<template>
	<div class="loading-spinner">
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>

		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	</div>
</template>

<style lang="scss">
@use 'sass:math';
@use '#src/assets/scss/settings' as *;
@use '#src/assets/scss/math' as *;

.loading-spinner {
	$loader-width: 4rem !default;
	$line-bg-color: $black !default;
	$num-lines: 8;
	$length: 0.7s;
	$line-width: 0.2;
	$line-length: 0.6;
	$dist-from-center: 35%;

	position: relative;
	display: inline-block;
	width: $loader-width;
	height: $loader-width;

	.line {
		position: absolute;
		width: $line-width * 50%;
		height: $line-length * 50%;
		background: $line-bg-color;
		animation: fade $length linear infinite;
	}

	@for $num from 1 through $num-lines {
		.line:nth-of-type(#{$num}) {
			left: sin(math.div($num * -2 * pi(), $num-lines)) * $dist-from-center + 50%;
			top: cos(math.div($num * 2 * pi(), $num-lines)) * $dist-from-center + 50%;
			transform: translateX(-50%) translateY(-50%) rotate(math.div($num * 360deg, $num-lines));
			animation-delay: $num * (math.div($length, $num-lines) + 0s) - $length;
		}
	}
}

@keyframes fade {
	0% {
		opacity: 1;
	}

	75%,
	100% {
		opacity: 0;
	}
}
</style>
