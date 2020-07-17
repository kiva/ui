<template functional>
	<span
		:class="[{ open: props.open }, 'thermometer-wrap']"
	>
		<!-- grey meter background -->
		<div class="thermometer meter-bg">
			<span class="inner-meter"></span>
		</div>
		<span class="thermometer-bulb meter-bg"></span>
		<!-- white meter middle-ground -->
		<div class="thermometer meter-center">
			<span class="inner-meter"></span>
		</div>
		<span class="thermometer-bulb meter-center"></span>
		<!-- meter foreground -->
		<div class="thermometer meter-fg">
			<span
				class="inner-meter"
				:style="`width:${ 5 + props.percentTowardGoal }%;`"
			></span>
		</div>
		<span class="thermometer-bulb"></span>
	</span>
</template>

<style lang="scss">
@import 'settings';

.thermometer-wrap {
	padding: 1rem;

	@include breakpoint(medium) {
		padding: 0;
		position: absolute;
		right: rem-calc(-85);
		top: 0;
		opacity: 0;
		transition: top 500ms ease-in-out, opacity 500ms ease-in-out;

		&.open {
			top: rem-calc(-51);
			opacity: 1;
		}
	}

	.thermometer {
		position: relative;
		border: none;
		padding: 0;
		margin-top: rem-calc(-47);
		height: rem-calc(6);
		margin-right: rem-calc(10);
		margin-bottom: 0;
		z-index: 10;

		@include breakpoint(medium) {
			transform: rotate(270deg);
			position: relative;
			width: rem-calc(150);
			top: rem-calc(88);
			left: rem-calc(-48);
			max-width: rem-calc(120);
		}

		.inner-meter {
			background-color: #D94830;
			display: block;
			height: 100%;
			float: left;
			border-radius: rem-calc(3);
			transition: width 2500ms ease-in-out;
			width: 0;
			max-width: 100%;
		}

		&.meter-bg {
			margin-top: rem-calc(-20);
			left: 0;
			height: rem-calc(22);
			border-radius: rem-calc(22);
			margin-right: 0;
			z-index: 2;

			@include breakpoint(medium) {
				left: rem-calc(-48);
				top: rem-calc(80);
			}

			.inner-meter {
				background: $kiva-text-dark;
				width: 100%;
				float: none;
				border-radius: rem-calc(22);
			}
		}

		&.meter-center {
			margin-top: rem-calc(-63);
			margin-left: rem-calc(-5);
			margin-right: rem-calc(4);
			height: rem-calc(14);
			z-index: 6;

			@include breakpoint(medium) {
				top: rem-calc(85);
				left: rem-calc(-43);
			}

			.inner-meter {
				width: 100%;
				background: $kiva-bg-lightgray;
				float: none;
				border-radius: rem-calc(7);
			}
		}
	}

	.thermometer-bulb {
		background-color: #D94830;
		position: relative;
		display: inline-block;
		border-radius: rem-calc(20);
		height: rem-calc(20);
		width: rem-calc(20);
		left: rem-calc(-10);
		top: rem-calc(-13);
		z-index: 9;

		@include breakpoint(medium) {
			left: rem-calc(2);
			top: rem-calc(131);
		}

		&.meter-bg {
			background: #484848;
			width: rem-calc(36);
			height: rem-calc(36);
			border-radius: rem-calc(36);
			left: rem-calc(-18);
			top: rem-calc(-29);
			z-index: 1;

			@include breakpoint(medium) {
				left: rem-calc(-6);
				top: rem-calc(115);
			}
		}

		&.meter-center {
			background: #FAFAFA;
			width: rem-calc(28);
			height: rem-calc(28);
			top: rem-calc(-21);
			left: rem-calc(-14);
			z-index: 5;

			@include breakpoint(medium) {
				left: rem-calc(-2);
				top: rem-calc(123);
			}
		}
	}
}

.thermometer-wrap.closed {
	top: 0;
	opacity: 0;
}

</style>
