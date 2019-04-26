<template functional>
	<div class="thermometer-holder">
		<div class="fundraising-meter progress thermometer-wrap">
			<span v-if="props.isFunded"
				class="meter inner-meter"
				style="width: 100%;"></span>
			<span v-else
				class="meter inner-meter"
				:style="`width: ${(props.percentRaised * 100)}%;`"></span>
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
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';

// .thermometer-holder {
// 		@media #{$medium-up} {
// 			height: rem-calc(185);
// 		}

		.thermometer-wrap {
			padding: 1rem;

			.thermometer {
				background-color: #efefef;
				border: none;
				padding: 0;
				border-radius: rem-calc(15);
				height: rem-calc(13);

				@media #{$medium-up} {
					transform: rotate(270deg);
					position: relative;
					width: rem-calc(150);
					top: rem-calc(53);
					left: rem-calc(-47);
				}

				@media #{$large-up} {
					left: rem-calc(-28);
				}

				@media #{$xlarge-up} {
					left: rem-calc(-14);
				}

				@media #{$xxlarge-up} {
					left: rem-calc(-5);
				}

				.inner-meter {
					background-color: #4faf4e;
					display: block;
					height: 100%;
					float: left;
					border-radius: rem-calc(7);
					transition: width 3500ms ease-in-out;
					width: 0;
					max-width: 100%;
				}

				.tick-wrapper {
					position: absolute;
					height: 100%;
					width: 100%;

					.tick-lines {
						border-left: 1px solid #4faf4e;
						border-right: 1px solid #efefef;
						padding-right: 7%;
						height: 9%;
						float: left;
						top: rem-calc(3);
						position: relative;

						@media #{$medium-up} {
							height: 55%;
							padding-right: rem-calc(10);
						}
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
				top: rem-calc(-32);

				@media #{$medium-up} {
					left: rem-calc(13);
					top: rem-calc(96);
				}

				@media #{$large-up} {
					left: rem-calc(32);
				}

				@media #{$xlarge-up} {
					left: rem-calc(46);
				}

				@media #{$xxlarge-up} {
					left: rem-calc(55);
				}
			}
		}
	// }

</style>
