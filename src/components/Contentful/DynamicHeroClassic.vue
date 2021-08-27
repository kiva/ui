<template>
	<section-with-background-classic
		:background-content="background"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid
					class="tw-grid-cols-12 tw-gap-2 tw-items-center"
					:class="{ 'tw-grid-cols-1 tw-mx-auto': singleColumn }"
					:style="customGridStyles"
				>
					<div
						class="tw-mx-auto tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-5"
					>
						<!-- eslint-enable max-len -->
						<template v-if="isHeroCarousel">
							<kv-carousel
								indicator-style="bar"
							>
								<kv-carousel-slide v-for="(image, index) in heroMedia" :key="index">
									<kv-contentful-img
										v-if="image.url"
										:width="500"
										class="tw-block tw-mx-auto tw-mt-0 tw-mb-4 md:tw-mb-0"
										:contentful-src="image.url"
										fallback-format="jpg"
										:alt="image.description"
									/>
								</kv-carousel-slide>
							</kv-carousel>
						</template>
						<template v-if="isHeroImage">
							<router-link
								:to="buttonTo"
								v-kv-track-event="[
									'Hero',
									'click-hero-loancards',
									heroMedia[0].description,
								]"
							>
								<kv-contentful-img
									v-if="heroMedia[0].url"
									class="tw-block tw-mx-auto tw-mt-0 tw-mb-4 md:tw-mb-0"
									:contentful-src="heroMedia[0].url"
									:width="500"
									fallback-format="jpg"
									:alt="heroMedia[0].description"
								/>
							</router-link>
						</template>
						<template v-if="isResponsiveHeroImage && responsiveHeroImages.length">
							<router-link
								:to="buttonTo"
								v-kv-track-event="[
									'Hero',
									'click-hero-loancards',
									responsiveHeroDescription,
								]"
							>
								<kv-contentful-img
									class="tw-block tw-mx-auto tw-mt-0 tw-mb-4 md:tw-mb-0"
									:contentful-src="responsiveHeroImages[0].url"
									:width="responsiveHeroImages[0].width"
									:height="responsiveHeroImages[0].height"
									fallback-format="jpg"
									:alt="responsiveHeroDescription"
									:source-sizes="responsiveHeroImages"
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

					<div
						class="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-7"
						:class="{ 'tw-order-first': swapOrder }"
					>
						<h1
							v-if="heroHeadline"
							v-html="heroHeadline"
							class="tw-mb-2 md:tw-mb-3"
						></h1>
						<h2
							v-if="heroSubHeadline"
							v-html="heroSubHeadline"
							class="tw-mb-2 md:tw-mb-3"
						></h2>
						<div v-if="heroBody" class="tw-prose tw-mb-2 md:tw-mb-3">
							<dynamic-rich-text :html="heroBody" />
						</div>
						<kv-button
							v-if="buttonText"
							class="tw-w-full md:tw-w-auto"
							:to="buttonTo"
							:variant="buttonStyle"
							@click.native="buttonClick"
							v-kv-track-event="buttonAnalytics"
						>
							{{ buttonText }}
						</kv-button>
					</div>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

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
		DynamicRichText,
		KvContentfulImg,
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
	},
	mixins: [contentfulStylesMixin],
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
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		buttonAnalytics() {
			const defaults = ['Hero', 'click-hero-cta', this.buttonText];
			const contentfulAnaltyicsEvent = this.buttonContent?.analyticsClickEvent ?? null;
			return contentfulAnaltyicsEvent || defaults;
		},
		buttonContent() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'button' : false;
			});
		},
		buttonStyle() {
			return this.buttonContent?.style ?? 'primary';
		},
		buttonText() {
			return this.buttonContent?.label ?? null;
		},
		buttonTo() {
			if (this.$attrs?.customEventName) {
				return '';
			}
			return this.buttonContent?.webLink ?? '';
		},
		genericContentBlock() {
			const gcb = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'genericContentBlock' : false;
			});
			return gcb;
		},
		heroBody() {
			const text = this.genericContentBlock?.bodyCopy ?? '';
			return text ? richTextRenderer(text) : '';
		},
		heroHeadline() {
			return this.genericContentBlock?.headline ?? '';
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
		heroSubHeadline() {
			return this.genericContentBlock?.subHeadline ?? '';
		},
		isHeroCarousel() {
			return this.mediaArray.length > 1
			&& this.mediaArray.every(media => media?.file?.contentType.includes('image')
			&& !this.isResponsiveHeroImage);
		},
		isHeroImage() {
			return this.mediaArray.length === 1
				&& this.mediaArray?.[0]?.file?.contentType.includes('image')
				&& !this.isHeroCarousel
				&& !this.isResponsiveHeroImage;
		},
		isHeroVideo() {
			return this.mediaArray.length === 1 && this.mediaArray?.[0]?.file?.contentType.includes('video');
		},
		isResponsiveHeroImage() {
			return this.content?.contents?.find(
				({ contentType }) => contentType === 'responsiveImageSet'
			) !== undefined;
		},
		mediaArray() {
			return this.content?.media ?? [];
		},
		responsiveHeroImages() {
			const imageSet = this.content?.contents?.find(({ contentType }) => contentType === 'responsiveImageSet');
			if (!this.isResponsiveHeroImage || (imageSet.images && !imageSet.images.length)) return [];

			return imageSet.images.map(entry => {
				// TODO: Make this a util

				// All screen breakpoints:
				// small: 0,
				// medium: 481px,
				// large: 681px,
				// xlarge: 761px,
				// xxlarge: 989px,
				// xga: 1025px,
				// wxga: 1441px,

				// small size
				let mediaSize = 'min-width: 0';
				let width = 537;

				if (entry.title.indexOf('med') !== -1) {
					mediaSize = 'min-width: 681px';
					width = 397;
				} else if (entry.title.indexOf('lg') !== -1) {
					mediaSize = 'min-width: 1025px';
					width = 394;
				}

				const aspectRatio = (entry.file?.details?.image?.height ?? 0) / (entry.file?.details?.image?.width ?? 1); // eslint-disable-line max-len
				const height = aspectRatio ? Math.round(width * aspectRatio) : null;

				return {
					width,
					height,
					media: mediaSize,
					url: entry.file?.url ?? ''
				};
			});
		},
		responsiveHeroDescription() {
			const imageSet = this.content?.contents?.find(({ contentType }) => contentType === 'responsiveImageSet');
			return imageSet?.description ?? '';
		},
	},
	methods: {
		buttonClick(event) {
			const customEventName = this.$attrs?.customEventName ?? null;
			if (customEventName) {
				// Current behavior is to replace a button navigation if a custom event name is passed
				event.stopPropagation();
				// Emit root level event that any component can listen for
				this.$root.$emit(customEventName);
			}
		},
	}
};
</script>
