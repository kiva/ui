<template functional>
	<div class="appeal-meter progress">
		<span
			class="meter"
			:style="`width: ${ props.percentTowardGoal }%;`"
		>
		</span>
		<span class="thermometer-bulb">
			<span class="inner-bulb"></span>
		</span>
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';

.appeal-meter {
	border: 3px solid black;
	padding: rem-calc(3);
	height: rem-calc(20);
	width: 90%;
	border-radius: rem-calc(8);
	background-color: $platinum;
	margin: rem-calc(30) rem-calc(20);

	@include breakpoint(medium) {
		transform: rotate(270deg);
		width: rem-calc(110);
		margin: 0 auto;
		top: rem-calc(55);
		position: relative;
	}

	.meter {
		border-radius: rem-calc(8);
		background-color: $kiva-accent-red;
		display: block;
		height: 100%;
		max-width: 100%;
		width: 0;
		transition: width 3500ms ease-in-out;
	}

	.thermometer-bulb {
		background-color: white;
		position: relative;
		display: inline-block;
		border-radius: rem-calc(20);
		height: rem-calc(30);
		width: rem-calc(30);
		left: rem-calc(-10);
		top: -2.14rem;
		// new
		border: 3px solid black;
		padding: rem-calc(3);

		@include breakpoint(medium) {
			left: rem-calc(-24);
			top: -1.25rem;
		}

		.inner-bulb {
			background-color: $kiva-accent-red;
			border-radius: rem-calc(20);
			position: fixed;
			height: rem-calc(18);
			width: rem-calc(18);
		}
	}
}
</style>
