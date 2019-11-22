<template>
	<div>
		<!-- Promo -->
		<kv-hero v-if="promoEnabled" headline-bg-color="#00244e" class="possibilities-promo">
			<template v-slot:images>
				<kv-carousel @change="slideChange">
					<kv-carousel-slide>
						<kv-responsive-image :images="possibilitiesImages(1)" />
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image :images="possibilitiesImages(2)" />
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image v-if="counter > 2" :images="possibilitiesImages(3)" />
					</kv-carousel-slide>
				</kv-carousel>
			</template>
			<template v-slot:headlineTitle>
				Make opportunity possible <br class="smo">for borrowers around the world.
			</template>
			<template v-slot:action>
				<div class="row">
					<div class="small-12 large-6 columns action-1">
						<kv-button
							class="action-button"
							to="/lend-by-category/"
							v-kv-track-event="['Home', 'possibility', 'click-Lend-now']"
						>
							Lend Now »
						</kv-button>
					</div>
					<div class="small-12 large-6 columns action-2">
						<kv-button
							class="action-button"
							to="/donate/supportus/"
							v-kv-track-event="['Home', 'possibility', 'click-Donate']"
						>
							Donate to Kiva »
						</kv-button>
					</div>
				</div>
			</template>
		</kv-hero>

		<!-- Default -->
		<kv-hero v-else>
			<template v-slot:images>
				<kv-carousel @change="slideChange">
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
			</template>
			<template v-slot:headlineTitle>
				Dreams are universal,<br class="smo"> opportunity is not.
			</template>
			<template v-slot:headlineBody>
				Lend as little as $25<br class="so">
				to create<br class="mo">
				opportunity<br class="so"><br class="lu">
				for people<br class="mo">
				around the world.
			</template>
			<template v-slot:action>
				<kv-button
					to="/lend-by-category"
					v-kv-track-event="['Home', 'EXP-HeroWhyKiva', 'click-Start-lending']"
				>
					Start lending »
				</kv-button>
			</template>
		</kv-hero>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import getCacheKey from '@/util/getCacheKey';

const imageRequire = require.context('@/assets/images/hero-slideshow/', true);
const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/homepage/', true);

export default {
	name: 'HeroSlideshow',
	serverCacheKey: props => {
		let cacheKey = 'DefaultHeroSlideshow';
		if (props.promoEnabled) {
			cacheKey = 'PromoSlideshow';
		}
		return getCacheKey(cacheKey);
	},
	components: {
		KvButton,
		KvCarousel,
		KvCarouselSlide,
		KvHero,
		KvResponsiveImage,
	},
	props: {
		promoEnabled: {
			type: Boolean,
			default: false
		},
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
				['xga', imageRequire(`./hero-${number}-xga-std.jpg`)],
				['xga retina', imageRequire(`./hero-${number}-xga-retina.jpg`)],
				['wxga', imageRequire(`./hero-${number}-wxga-std.jpg`)],
				['wxga retina', imageRequire(`./hero-${number}-wxga-retina.jpg`)],
			];
		},
		possibilitiesImages(number) {
			return [
				['small', possibilitiesImageRequire(`./Homepage${number}_sm_std.jpg`)],
				['small retina', possibilitiesImageRequire(`./Homepage${number}_sm_retina.jpg`)],
				['medium', possibilitiesImageRequire(`./Homepage${number}_med_std.jpg`)],
				['medium retina', possibilitiesImageRequire(`./Homepage${number}_med_retina.jpg`)],
				['large', possibilitiesImageRequire(`./Homepage${number}_lg_std.jpg`)],
				['large retina', possibilitiesImageRequire(`./Homepage${number}_lg_retina.jpg`)],
				['xga', possibilitiesImageRequire(`./Homepage${number}_xl_std.jpg`)],
				['xga retina', possibilitiesImageRequire(`./Homepage${number}_xl_retina.jpg`)],
				['wxga', possibilitiesImageRequire(`./Homepage${number}_xxl_std.jpg`)],
				['wxga retina', possibilitiesImageRequire(`./Homepage${number}_xxl_retina.jpg`)],
			];
		},
	},
};
</script>

<style lang="scss" scoped>
	@import "settings";
	@import "foundation";

	.possibilities-promo {
		$green: #02582e;
		$dark_green: #0b2a0d;
		$red:#611b15;
		$dark_red: #2e0004;
		$blue: #015a76;
		$dark_blue: #00244e;
		$gold: #ebdf7f;

		margin-bottom: 6rem;

		::v-deep .headline-main--has-action {
			padding-bottom: 7.125rem;
		}

		::v-deep .action--has-headline {
			margin-top: -5.65rem;
		}

		.action-button {
			@include button-style($blue, auto, #fff);

			box-shadow: 0 2px darken($blue, 10%);
			width: 80%;
		}

		@include breakpoint(large) {
			.action-1 {
				display: flex;
				justify-content: flex-end;
			}

			.action-2 {
				display: flex;
				justify-content: flex-start;
			}
		}
	}
</style>
