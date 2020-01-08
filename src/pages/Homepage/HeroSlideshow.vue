<template>
	<div>
		<!-- Promo -->
		<kv-hero v-if="promoEnabled">
			<template v-slot:images>
				<kv-carousel @change="slideChange">
					<kv-carousel-slide>
						<kv-responsive-image
							:images="promoImages(1)"
							alt="Todo"
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							:images="promoImages(2)"
							alt="Todo"
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							v-if="counter > 2"
							:images="promoImages(3)"
							alt="Todo"
						/>
					</kv-carousel-slide>
				</kv-carousel>
			</template>
			<template v-slot:headlineTitle>
				{{ promoContent.genericContentBlock.headline }}
			</template>
			<template v-slot:headlineBody>
				<span class="featured-medium-up"></span>
				{{ promoContent.genericContentBlock.subHeadline }}
			</template>
			<template v-slot:action>
				<kv-button
					:to="promoContent.ctaButton.link"
					:v-kv-track-event="[promoContent.ctaButton.kvTrackEvent]"
				>
					{{ promoContent.ctaButton.buttonText }}
				</kv-button>
			</template>
		</kv-hero>

		<!-- Default -->
		<kv-hero v-else>
			<template v-slot:images>
				<kv-carousel @change="slideChange">
					<!-- eslint-disable max-len -->
					<kv-carousel-slide>
						<kv-responsive-image
							:images="heroImages(1)"
							alt="A woman laughs while sitting on a traditional wooden boat on the waterways of Southeast Asia."
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							:images="heroImages(2)"
							alt="Four women wear colorful, patterned African dresses and smile. One holds a baby and another holds a silver bowl full of fish."
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							v-if="counter > 2"
							:images="heroImages(3)"
							alt="An older woman wearing a bright pink shirt smiles, standing in front of a tropical forest landscape."
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							v-if="counter > 3"
							:images="heroImages(4)"
							alt="An older Latin American farmer with a mustache smiles. He stands in front of tropical shrubbery."
						/>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<kv-responsive-image
							v-if="counter > 4"
							:images="heroImages(5)"
							alt="A man wearing a light blue dashiki smiles in a workshop filled with traditional African crafts and jewelry."
						/>
					</kv-carousel-slide>
					<!-- eslint-enable max-len -->
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
		promoContent: {
			type: Object,
			default() {
				return {
					slideshow: {
						images: []
					}
				};
			}
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
		promoImages(number) {
			if (this.promoContent.slideshow.images[number - 1].fields) {
				return [
					['small', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=480&h=600&fit=fill&f=faces`], // eslint-disable-line max-len
					['small retina', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=960&h=1200&fit=fill&f=faces`], // eslint-disable-line max-len
					['medium', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=680&h=675&fit=fill&f=faces`], // eslint-disable-line max-len
					['medium retina', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=1360&h=1350&fit=fill&f=faces`], // eslint-disable-line max-len
					['large', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=1024&h=545&fit=fill&f=faces`], // eslint-disable-line max-len
					['large retina', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=2048&h=1090&fit=fill&f=faces`], // eslint-disable-line max-len
					['xga', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=1440&h=768&fit=fill&f=faces`], // eslint-disable-line max-len
					['xga retina', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=2880&h=1535&fit=fill&f=faces`], // eslint-disable-line max-len
					['wxga', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=1920&h=820&fit=fill&f=faces`], // eslint-disable-line max-len
					['wxga retina', `${this.promoContent.slideshow.images[number - 1].fields.file.url}?w=3840&h=1640&fit=fill&f=faces`], // eslint-disable-line max-len
				];
			}
			return [];
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
			padding-bottom: 6.125rem;

			@include breakpoint(large) {
				padding-bottom: 3.125rem;
			}
		}

		::v-deep .action--has-headline {
			margin-top: -4.65rem;

			@include breakpoint(large) {
				margin-top: -1.75rem;
				margin-bottom: -2.125rem;
			}
		}

		.action-button {
			@include button-style($blue, auto, #fff);

			box-shadow: 0 2px darken($blue, 10%);
			width: 50%;

			@include breakpoint(large) {
				width: 88%;
			}
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
