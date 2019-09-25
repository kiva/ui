<template>
	<div class="hero-slideshow">
		<kv-carousel @change="slideChange" v-if="showMgPromo">
			<div class="slide-placeholder"></div>
			<kv-carousel-slide>
				<kv-responsive-image :images="mgHeroImages(1)" />
			</kv-carousel-slide>
		</kv-carousel>
		<kv-carousel @change="slideChange" v-else>
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
		<div class="headline-bar">
			<div class="mask">
				&nbsp;
			</div>
			<div class="headline" v-if="showMgPromo">
				<span class="headline-title">Make a bigger impact.</span>
				<p class="headline-body">
					A Monthly Good subscription<br class="su">
					makes supporting entrepreneurs<br class="su">
					part of your routine with monthly contributions.
				</p>
			</div>
			<div class="headline" v-else>
				<span class="headline-title">Dreams are universal,<br class="smo"> opportunity is not.</span>
				<p class="headline-body">
					Lend as little as $25<br class="so">
					to create<br class="mo">
					opportunity<br class="so"><br class="lu">
					for people<br class="mo">
					around the world.
				</p>
			</div>
			<div class="mask">
				&nbsp;
			</div>
		</div>
		<div class="action-button-wrapper">
			<kv-button
				v-if="showMgPromo"
				class="slideshow-action-button"
				to="/monthlygood"
				v-kv-track-event="['Home', 'EXP-Montly-Good-Promo', 'click-Sign-up']"
			>
				Sign up
				<span v-if="showDoubleArrowButton"> >></span>
			</kv-button>
			<kv-button
				v-else
				class="slideshow-action-button"
				to="/lend-by-category"
				v-kv-track-event="['Home', 'EXP-HeroWhyKiva', 'click-Start-lending', null, 'true']"
			>
				Start lending
				<span v-if="showDoubleArrowButton"> >></span>
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const imageRequire = require.context('@/assets/images/hero-slideshow/', true);
const mgPromoImageRequire = require.context('@/assets/images/mg-hero-slideshow/', true);

export default {
	name: 'HeroSlideshow',
	// I need to return the props.doubleArrowButtonExp like the following example is doing for mgPromoExp
	serverCacheKey: props => {
		// props.doubleArrowButtonExp.version === 'shown' ? 'DoubleArrowButttonExp' : 'DefaultStartButton';
		return props.mgPromoExp.version === 'shown' ? 'MgSlideshow' : 'DefaultHeroSlideshow';
	},
	inject: ['apollo'],
	components: {
		KvButton,
		KvCarousel,
		KvCarouselSlide,
		KvResponsiveImage,
	},
	props: {
		mgPromoExp: {
			type: Object,
			default: () => {},
		},
		doubleArrowButtonExp: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			counter: 2,
		};
	},
	computed: {
		showMgPromo() {
			return this.mgPromoExp.version === 'shown';
		},
		showDoubleArrowButton() {
			return this.doubleArrowButtonExp.version === 'shown';
		}
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
				['xga', imageRequire(`./hero-${number}-xga-std.jpg`)],
				['xga retina', imageRequire(`./hero-${number}-xga-retina.jpg`)],
				['wxga', imageRequire(`./hero-${number}-wxga-std.jpg`)],
				['wxga retina', imageRequire(`./hero-${number}-wxga-retina.jpg`)],
			];
		},
		mgHeroImages(number) {
			return [
				['small', mgPromoImageRequire(`./mg-hppromo-${number}-sm-std.jpg`)],
				['small retina', mgPromoImageRequire(`./mg-hppromo-${number}-sm-retina.jpg`)],
				['medium', mgPromoImageRequire(`./mg-hppromo-${number}-med-std.jpg`)],
				['medium retina', mgPromoImageRequire(`./mg-hppromo-${number}-med-retina.jpg`)],
				['large', mgPromoImageRequire(`./mg-hppromo-${number}-lg-std.jpg`)],
				['large retina', mgPromoImageRequire(`./mg-hppromo-${number}-lg-retina.jpg`)],
				['xga', mgPromoImageRequire(`./mg-hppromo-${number}-xga-std.jpg`)],
				['xga retina', mgPromoImageRequire(`./mg-hppromo-${number}-xga-retina.jpg`)],
				['wxga', mgPromoImageRequire(`./mg-hppromo-${number}-wxga-std.jpg`)],
				['wxga retina', mgPromoImageRequire(`./mg-hppromo-${number}-wxga-retina.jpg`)],
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
	margin-bottom: 5rem;

	@include breakpoint(medium) {
		margin-bottom: 6rem;
	}

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

		@include breakpoint(xga) {
			padding-bottom: 768/1440 * 100%;
		}

		@include breakpoint(wxga) {
			padding-bottom: 820/1920 * 100%;
		}
	}

	.kv-carousel-slide img {
		width: 100%;
	}

	.headline-bar {
		display: flex;
		position: absolute;
		bottom: 0;
		width: 100%;

		.mask {
			flex-grow: 1;
			transform: scaleY(0.51) translateY(50%);
			background-color: $white;
		}

		.headline {
			flex-grow: 1;
			max-width: rem-calc(750);
			padding: 1.125rem 0.5rem 2rem;
			color: $white;
			background-color: rgba($kiva-green, 0.9);
			text-align: center;

			@include breakpoint(medium) {
				padding: 1.125rem 1.25rem 2rem;
			}
		}

		.headline-title {
			display: block;
			margin-bottom: 0.5rem;
			font-size: 1.75rem;
			line-height: 2rem;
			font-weight: 400;

			@include breakpoint(medium) {
				font-size: 2.25rem;
				line-height: 2.5rem;
			}

			@include breakpoint(large only) {
				font-size: 2.1rem;
			}
		}

		.headline-body {
			font-size: 1.25rem;
			line-height: 1.5rem;

			@include breakpoint(medium) {
				font-size: 1.75rem;
				line-height: 2rem;
			}
		}
	}

	.action-button-wrapper {
		position: absolute;
		width: 100%;
		bottom: 0;
		text-align: center;
	}

	.slideshow-action-button {
		margin-bottom: -1rem;

		@include breakpoint(medium) {
			margin-bottom: -2rem;
		}
	}
}
</style>
