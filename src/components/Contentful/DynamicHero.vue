<template>
	<section-with-background class="contentful-hero" :background-content="heroBackground">
		<template #content>
			<div class="row align-center">
				<!-- hero media -->
				<div
					class="small-12 medium-10 large-6 xlarge-5 columns"
				>
					<template v-if="isHeroCarousel">
						<kv-carousel
							indicator-style="bar"
						>
							<kv-carousel-slide v-for="(image, index) in heroMedia" :key="index">
								<kv-contentful-img
									v-if="image.url"
									:height="557"
									:width="500"
									class="contentful-hero__img"
									:contentful-src="image.url"
									fallback-format="jpg"
									:alt="image.description"
								/>
							</kv-carousel-slide>
						</kv-carousel>
					</template>
					<template v-if="isHeroImage">
						<router-link
							:to="heroButton.link"
							v-kv-track-event="[
								'Hero',
								'click-hero-loancards',
								heroMedia[0].description,
							]"
						>
							<kv-contentful-img
								v-if="heroMedia[0].url"
								class="contentful-hero__img"
								:contentful-src="heroMedia[0].url"
								:width="500"
								:height="527"
								fallback-format="jpg"
								:alt="heroMedia[0].description"
							/>
						</router-link>
					</template>
					<template v-if="isHeroVideo">
						<video
							:src="heroMedia[0].url"
							class="contentful-hero__video-wrapper--video"
							autoplay
							loop
							muted
							playsinline
						></video>
					</template>
				</div>
				<!-- eslint-disable-next-line max-len -->
				<div class="small-10 large-6 xlarge-7 align-self-middle columns contentful-hero__cta_wrapper">
					<h1 class="contentful-hero__header" v-html="heroHeadline">
					</h1>
					<div class="contentful-hero__body" v-html="heroBody">
					</div>
					<kv-button
						:class="`${buttonClass} show-for-large rounded`"
						:to="buttonTo"
						@click.native="buttonClick"
						v-kv-track-event="[
							'Hero',
							'click-hero-cta',
							heroButton.text,
						]"
					>
						{{ heroButton.text }}
					</kv-button>
				</div>
			</div>
			<!-- Button in different element order for mobile only -->
			<div class="row align-center hide-for-large">
				<div class="small-10">
					<kv-button
						:class="`${buttonClass} rounded expanded`"
						:to="buttonTo"
						@click.native="buttonClick"
						v-kv-track-event="[
							'Hero',
							'click-hero-cta',
							heroButton.text,
						]"
					>
						{{ heroButton.text }}
					</kv-button>
				</div>
			</div>
		</template>
	</section-with-background>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

/**
* Dynamic Hero Component
* This component will display a Hero driven by a Contentful Content Group
* Depending on the number and type of media attached to the content group
* on contentful, the left side will either be an image, a video or a carousel.
* */

export default {
	components: {
		KvButton,
		KvCarousel: () => import('@/components/Kv/KvCarousel'),
		KvCarouselSlide: () => import('@/components/Kv/KvCarouselSlide'),
		KvContentfulImg,
		SectionWithBackground,
	},
	props: {
		/**
		 * Content group content from Contentful
		* */
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		mediaArray() {
			return this.content?.media ?? [];
		},
		isHeroVideo() {
			return this.mediaArray.length === 1 && this.mediaArray?.[0]?.file?.contentType.includes('video');
		},
		isHeroImage() {
			return this.mediaArray.length === 1
				&& this.mediaArray?.[0]?.file?.contentType.includes('image')
				&& !this.isHeroCarousel;
		},
		isHeroCarousel() {
			return this.mediaArray.length !== 1
			&& this.mediaArray.every(media => media?.file?.contentType.includes('image'));
		},
		buttonClass() {
			return this.$attrs?.customCtaButtonClass ?? '';
		},
		buttonTo() {
			if (this.$attrs?.customCtaFunction) {
				return null;
			}
			return this.heroButton.link;
		},
		buttonClick() {
			return this.$attrs?.customCtaFunction ?? null;
		},
		heroMedia() {
			return this.mediaArray.map(media => {
				return {
					description: media.description ?? '',
					title: media.title ?? '',
					url: media.file?.url ?? ''
				};
			});
		},
		heroText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('hero-text') > -1);
		},
		heroHeadline() {
			return this.heroText?.headline ?? '';
		},
		heroBody() {
			const text = this.heroText?.bodyCopy ?? '';
			return text ? documentToHtmlString(text) : '';
		},
		heroButton() {
			return {
				text: this.heroText?.primaryCtaText ?? '',
				link: this.heroText?.primaryCtaLink ?? '',
			};
		},
		heroBackground() {
			return this.content?.contents?.find(({ key }) => key.indexOf('background') > -1);
		},

	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.contentful-hero {
	.row {
		max-width: 70rem;
	}

	&__cta_wrapper {
		padding: 0;

		@include breakpoint(medium) {
			padding: 0 2rem;
		}

		@include breakpoint(xxlarge) {
			padding: 0 2rem 0 4rem;
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__header {
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		font-weight: 500;

		::v-deep a,
		::v-deep em,
		::v-deep i {
			font-style: normal;
			color: $kiva-green;
		}

		@include breakpoint(xlarge) {
			@include huge-headline();
		}
	}

	&__body {
		margin: 2.25rem auto 0;
		white-space: pre-wrap;

		@include breakpoint(medium) {
			margin: 2.25rem auto 2.25rem;
		}

		::v-deep p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();

				line-height: rem-calc(36);
			}
		}
	}

	&__video-wrapper {
		margin-top: 2.5rem;

		@include breakpoint(large) {
			margin-top: 0;
		}

		&--video {
			width: 100%;
			border-radius: rem-calc(10);
		}
	}
}
</style>
