<template>
	<div>
		<!-- Promo -->
		<kv-hero v-if="promoEnabled">
			<template #carousel>
				<kv-carousel
					@change="slideChange"
					:hide-arrows="true"
					:slide-interval="5"
					:embla-options="{draggable: false}"
					:pause-on-hover="false"
					indicator-style="none"
				>
					<kv-carousel-slide
						v-for="(imageSet, index) in promoContent.responsiveImageSet"
						:key="index"
					>
						<!-- eslint-disable max-len -->
						<router-link
							v-if="!promoContent.genericContentBlock.primaryCtaText && promoContent.genericContentBlock.primaryCtaLink"
							:to="promoContent.genericContentBlock.primaryCtaLink"
							:v-kv-track-event="[promoContent.genericContentBlock.primaryCtaKvTrackEvent]"
						>
							<kv-responsive-image
								:images="promoImages(imageSet.images)"
								:alt="imageSet.description"
							/>
						</router-link>
						<!-- eslint-enable max-len -->
						<kv-responsive-image
							v-else
							:images="promoImages(imageSet.images)"
							:alt="imageSet.description"
						/>
					</kv-carousel-slide>
				</kv-carousel>
			</template>
			<template
				v-if="promoContent.genericContentBlock.headline"
				#headlineTitle
			>
				{{ promoContent.genericContentBlock.headline }}
			</template>
			<template
				v-if="promoContent.genericContentBlock.subHeadline"
				#headlineBody
			>
				{{ promoContent.genericContentBlock.subHeadline }}
			</template>
			<template
				v-if="promoContent.genericContentBlock.primaryCtaText"
				#action
			>
				<kv-button
					:to="promoContent.genericContentBlock.primaryCtaLink"
					:v-kv-track-event="[promoContent.genericContentBlock.primaryCtaKvTrackEvent]"
				>
					{{ promoContent.genericContentBlock.primaryCtaText }}
				</kv-button>
			</template>
		</kv-hero>

		<!-- Default -->
		<kv-hero v-else>
			<template #carousel>
				<kv-carousel
					@change="slideChange"
					:hide-arrows="true"
					:slide-interval="5"
					:embla-options="{draggable: false}"
					:pause-on-hover="false"
					indicator-style="none"
				>
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
			<template #headlineTitle>
				Dreams are universal,<br class="smo"> opportunity is not.
			</template>
			<template #headlineBody>
				Lend as little as $25<br class="so">
				to create<br class="mo">
				opportunity<br class="so"><br class="lu">
				for people<br class="mo">
				around the world.
			</template>
			<template #action>
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
		// return the responsive image array from a contentful responsive image set.
		promoImages(responsiveImageSetImages) {
			if (responsiveImageSetImages) {
				return [
					['small', `${responsiveImageSetImages.find(item => item.responsiveSize === 'small').fields.file.url}?fm=jpg&fl=progressive&w=480&h=600&fit=fill`], // eslint-disable-line max-len
					['small retina', `${responsiveImageSetImages.find(item => item.responsiveSize === 'small retina').fields.file.url}?fm=jpg&fl=progressive&w=960&h=1200&fit=fill`], // eslint-disable-line max-len
					['medium', `${responsiveImageSetImages.find(item => item.responsiveSize === 'medium').fields.file.url}?fm=jpg&fl=progressive&w=680&h=675&fit=fill`], // eslint-disable-line max-len
					['medium retina', `${responsiveImageSetImages.find(item => item.responsiveSize === 'medium retina').fields.file.url}?fm=jpg&fl=progressive&w=1360&h=1350&fit=fill`], // eslint-disable-line max-len
					['large', `${responsiveImageSetImages.find(item => item.responsiveSize === 'large').fields.file.url}?fm=jpg&fl=progressive&w=1024&h=545&fit=fill`], // eslint-disable-line max-len
					['large retina', `${responsiveImageSetImages.find(item => item.responsiveSize === 'large retina').fields.file.url}?fm=jpg&fl=progressive&w=2048&h=1090&fit=fill`], // eslint-disable-line max-len
					['xga', `${responsiveImageSetImages.find(item => item.responsiveSize === 'xga').fields.file.url}?fm=jpg&fl=progressive&w=1440&h=768&fit=fill`], // eslint-disable-line max-len
					['xga retina', `${responsiveImageSetImages.find(item => item.responsiveSize === 'xga retina').fields.file.url}?fm=jpg&fl=progressive&w=2880&h=1535&fit=fill`], // eslint-disable-line max-len
					['wxga', `${responsiveImageSetImages.find(item => item.responsiveSize === 'wxga').fields.file.url}?fm=jpg&fl=progressive&w=1920&h=820&fit=fill`], // eslint-disable-line max-len
					['wxga retina', `${responsiveImageSetImages.find(item => item.responsiveSize === 'wxga retina').fields.file.url}?fm=jpg&fl=progressive&w=3840&h=1640&fit=fill`], // eslint-disable-line max-len
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
</style>
