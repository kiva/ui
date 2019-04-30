<template functional>
	<div class="fundraising-meter progress">
		<span
			class="meter"
			:style="`width: ${ props.percentTowardGoal }%;`">
		</span>
		<div class="tick-wrapper">
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
			<span class="tick-lines"></span>
		</div>
		<span class="thermometer-bulb"></span>
	</div>
</template>

<style lang="scss">
@import 'settings';
	.fundraising-meter {
		height: 0.8125rem;
		width: 90%;
		border-radius: rem-calc(8);
		background-color: $platinum;
		margin: rem-calc(30) rem-calc(20);

		@include breakpoint(medium) {
			transform: rotate(270deg);
			width: rem-calc(145);
			margin: 0 auto;
			top: rem-calc(55);
			position: relative;
		}

		.meter {
			border-radius: rem-calc(8);
			background-color: $kiva-green;
			display: block;
			height: 100%;
			max-width: 100%;
			width: 0;
			transition: width 3500ms ease-in-out;
		}

		.tick-wrapper {
			position: relative;
			top: rem-calc(-13);
			height: 100%;
			width: 100%;

			.tick-lines {
				border-left: 1px solid #4faf4e;
				border-right: 1px solid #efefef;
				padding-right: 7%;
				height: 60%;
				float: left;
				top: rem-calc(3);
				position: relative;

				@include breakpoint(medium) {
					height: 55%;
					padding-right: rem-calc(10);
				}
			}
		}

		.thermometer-bulb {
			background-color: #4faf4e;
			position: relative;
			display: inline-block;
			border-radius: rem-calc(20);
			height: rem-calc(30);
			width: rem-calc(30);
			left: rem-calc(-10);
			top: -2.14rem;

			@include breakpoint(medium) {
				left: rem-calc(-24);
				top: -2.1rem;
			}
		}
	}
</style>
