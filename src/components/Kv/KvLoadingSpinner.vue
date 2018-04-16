<template functional>
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
@import 'settings';
@import 'math';

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
			left: sin($num * -2 * pi() / $num-lines) * $dist-from-center + 50%;
			top: cos($num * 2 * pi() / $num-lines) * $dist-from-center + 50%;
			transform: translateX(-50%) translateY(-50%) rotate($num * 360deg / $num-lines);
			animation-delay: $num * ($length / $num-lines + 0s) - $length;
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
