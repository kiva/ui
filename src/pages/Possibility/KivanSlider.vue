<template>
	<kv-carousel
		:autoplay="false"
		ref="KvCarousel"
		@change="slideTransition($event)"
	>
		<div class="slide-placeholder"></div>
		<div class="bullet-wrap text-center">
			<div
				v-for="(slide , index) in slidesData"
				:key="index"
				:class="['bullet', {active: currentIndex === index}]"
				@click="setSlide(index)"
			></div>
		</div>
		<button @click="previousSlide">
			<kv-icon
				name="small-chevron"
				class="left-arrow"
			/>
		</button>
		<kv-carousel-slide
			v-for="(slide , index) in slidesData"
			:key="`image-${index}`"
			:class="`slide-${index}`"
			:transition-name="transitionName"
		>
			<div class="row">
				<div class="small-12 large-6">
					<kv-responsive-image :images="slide.left" />
				</div>
				<div class="small-12 large-6">
					<kv-responsive-image :images="slide.right" />
				</div>
			</div>
		</kv-carousel-slide>
		<button @click="nextSlide">
			<kv-icon
				name="small-chevron"
				class="right-arrow"
			/>
		</button>
	</kv-carousel>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvIcon from '@/components/Kv/KvIcon';


const slidesImageRequire = require.context('@/assets/images/possibilities-banners/kivan-slider', true);

export default {
	components: {
		KvResponsiveImage,
		KvCarousel,
		KvCarouselSlide,
		KvIcon,
	},
	data() {
		return {
			slidesData:
			[
				{
					left: [
						['small', slidesImageRequire('./kivan-1a-std.jpg')],
						['small retina', slidesImageRequire('./kivan-1a-retina.jpg')]
					],
					right: [
						['small', slidesImageRequire('./kivan-1b-std.jpg')],
						['small retina', slidesImageRequire('./kivan-1b-retina.jpg')],
					]
				},
				{
					left: [
						['small', slidesImageRequire('./kivan-2a-std.jpg')],
						['small retina', slidesImageRequire('./kivan-2a-retina.jpg')],
					],
					right: [
						['small', slidesImageRequire('./kivan-2b-std.jpg')],
						['small retina', slidesImageRequire('./kivan-2b-retina.jpg')],
					]
				},
				{
					left: [
						['small', slidesImageRequire('./kivan-3a-std.jpg')],
						['small retina', slidesImageRequire('./kivan-3a-retina.jpg')],
					],
					right: [
						['small', slidesImageRequire('./kivan-3b-std.jpg')],
						['small retina', slidesImageRequire('./kivan-3b-retina.jpg')]
					]
				}
			],
			currentIndex: 0,
			transitionName: 'kv-slide-left'
		};
	},
	methods: {
		previousSlide() {
			this.transitionName = 'kv-slide-right';
			this.$nextTick(() => {
				this.$refs.KvCarousel.previous();
			});
		},
		nextSlide() {
			this.transitionName = 'kv-slide-left';
			this.$nextTick(() => {
				this.$refs.KvCarousel.advance();
			});
		},
		slideTransition(payload) {
			this.currentIndex = payload;
		},
		setSlide(index) {
			this.$refs.KvCarousel.goToSlide(index);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

$cta-color: #611b1f;
$cta-color2: #00244e;
$cta-color3: #02582e;

.kv-carousel {
	margin-bottom: 140px;

	.left-arrow,
	.right-arrow {
		z-index: 10000;
		stroke: $white;
		height: 30px;
		width: 30px;
		position: absolute;
		top: 190px;
		cursor: pointer;
	}

	.left-arrow {
		transform: rotate(90deg);
	}

	.right-arrow {
		right: 0;
		transform: rotate(-90deg);
	}

	.bullet-wrap {
		z-index: 10000;
		position: relative;
		bottom: -9%;
		margin: 0 auto;
		width: 100%;

		.bullet {
			width: 15px;
			height: 15px;
			border: 1px solid $white;
			border-radius: 50%;
			display: inline-block;
		}

		.bullet.active {
			background-color: $white;
		}
	}

	.kv-carousel-slide {
		width: 100%;
		background: $white;
	}

	.small-image {
		margin-bottom: 2rem;
	}

	.headline {
		color: $cta-color;
		font-weight: bold;
		max-width: 24rem;
		margin: 0 auto 1rem auto;
		text-align: center;

		@include breakpoint(large) {
			margin: unset;
			margin-bottom: 1rem;
			text-align: unset;
		}
	}

	.subheadline {
		font-weight: $global-weight-highlight;
		max-width: 24rem;
		margin: 0 auto 1.5rem auto;
		text-align: center;

		@include breakpoint(large) {
			margin: unset;
			margin-bottom: 2rem;
			text-align: unset;
		}
	}

	.action-button-wrapper {
		text-align: center;

		@include breakpoint(large) {
			text-align: unset;
		}

		.action-button {
			background-color: $cta-color;
			box-shadow: 0 2px darken($cta-color, 10%);

			&:hover,
			&:focus {
				background-color: darken($cta-color, 10%);
			}
		}
	}

	/* stylelint-disable */
	// Slide 2 color override
	.slide-1 {
		.headline {
			color: $cta-color2;
		}

		.action-button-wrapper .action-button {
			background-color: $cta-color2;
			box-shadow: 0 2px darken($cta-color2, 10%);

			&:hover,
			&:focus {
				background-color: darken($cta-color2, 10%);
			}
		}
	}

	// Slide 3 color override
	.slide-2 {
		.headline {
			color: $cta-color3;
		}

		.action-button-wrapper .action-button {
			background-color: $cta-color3;
			box-shadow: 0 2px darken($cta-color3, 10%);

			&:hover,
			&:focus {
				background-color: darken($cta-color3, 10%);
			}
		}
	}
	/* stylelint-enable */

	// This is brute force solution to the varing heights of the content within this component
	// In the furture slideshows should have a defined height, so we can avoid this customization.
	.slide-placeholder {
		padding-bottom: 39rem;

		@include breakpoint(360 up) {
			padding-bottom: 42rem;
		}

		@include breakpoint(420 up) {
			padding-bottom: 43rem;
		}

		@include breakpoint(481 up) {
			padding-bottom: 48rem;
		}

		@include breakpoint(510 up) {
			padding-bottom: 50rem;
		}

		@include breakpoint(535 up) {
			padding-bottom: 55rem;
		}

		@include breakpoint(630 up) {
			padding-bottom: 59rem;
		}

		@include breakpoint(680 up) {
			padding-bottom: 20rem;
		}
	}
}

</style>
