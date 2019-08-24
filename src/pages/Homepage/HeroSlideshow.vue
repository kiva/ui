<template>
	<div class="hero-slideshow">
		<kv-carousel @change="slideChange">
			<div class="slide-placeholder"></div>
			<kv-carousel-slide>
				<kv-responsive-image :images="heroImages(1)" />
			</kv-carousel-slide>
			<kv-carousel-slide>
				<kv-responsive-image :images="heroImages(2)" />
			</kv-carousel-slide>
			<kv-carousel-slide>
				<kv-responsive-image v-if="counter > 2" :images="heroImages(3)" />
			</kv-carousel-slide>
			<kv-carousel-slide>
				<kv-responsive-image v-if="counter > 3" :images="heroImages(4)" />
			</kv-carousel-slide>
			<kv-carousel-slide>
				<kv-responsive-image v-if="counter > 4" :images="heroImages(5)" />
			</kv-carousel-slide>
		</kv-carousel>
	</div>
</template>

<script>
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const imageRequire = require.context('@/assets/images/hero-slideshow/', true);

export default {
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvResponsiveImage,
	},
	data() {
		return {
			counter: 2,
		};
	},
	methods: {
		slideChange() {
			// count the number of slides shown to use for lazy-loading images with v-if
			if (this.counter < 5) this.counter += 1;
		},
		// return the responsive image array for a given numbered hero image
		heroImages(number) {
			return [
				['small', imageRequire(`./hero-${number}-sm-std.jpg`)],
				['small retina', imageRequire(`./hero-${number}-sm-retina.jpg`)],
				['medium', imageRequire(`./hero-${number}-med-std.jpg`)],
				['medium retina', imageRequire(`./hero-${number}-med-retina.jpg`)],
				['large', imageRequire(`./hero-${number}-lg-std.jpg`)],
				['large retina', imageRequire(`./hero-${number}-lg-retina.jpg`)],
				['xlarge', imageRequire(`./hero-${number}-xl-std.jpg`)],
				['xlarge retina', imageRequire(`./hero-${number}-xl-retina.jpg`)],
				['xxlarge', imageRequire(`./hero-${number}-xxl-std.jpg`)],
				['xxlarge retina', imageRequire(`./hero-${number}-xxl-retina.jpg`)],
			];
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.hero-slideshow {
	position: relative;
	width: 100%;

	.slide-placeholder {
		background-color: $kiva-bg-lightgray;
		width: 100%;
		padding-bottom: 600/480 * 100%;

		@include breakpoint(medium) {
			padding-bottom: 675/680 * 100%;
		}

		@include breakpoint(large) {
			padding-bottom: 545/1024 * 100%;
		}

		@include breakpoint(xlarge) {
			padding-bottom: 768/1440 * 100%;
		}

		@include breakpoint(xxlarge) {
			padding-bottom: 820/1920 * 100%;
		}
	}
}
</style>
