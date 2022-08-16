<template>
	<section-with-background-classic
		:background-content="background"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid
					class="tw-grid-cols-12 tw-gap-2 tw-items-center tw-justify-items-center"
					:style="customGridStyles"
				>
					<div
						class="tw-mx-auto tw-col-span-12"
						:class="{
							'md:tw-col-span-6': !singleColumn
						}"
						:style="maxWidthStyles"
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
							<component
								:is="buttonTo ? 'router-link' : 'span'"
								:to="buttonTo"
								v-kv-track-event="buttonTo ? [
									'Hero',
									'click-hero-loancards',
									heroMedia[0].description,
								] : null"
							>
								<kv-contentful-img
									v-if="heroMedia[0].url"
									class="tw-block tw-mx-auto tw-mt-0 tw-mb-4 md:tw-mb-0"
									:contentful-src="heroMedia[0].url"
									:width="500"
									fallback-format="jpg"
									:alt="heroMedia[0].description"
								/>
							</component>
						</template>
						<template v-if="isResponsiveHeroImage && responsiveHeroImages.length">
							<component
								:is="buttonTo ? 'router-link' : 'span'"
								:to="buttonTo"
								v-kv-track-event="buttonTo ? [
									'Hero',
									'click-hero-loancards',
									responsiveHeroDescription,
								] : null"
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
							</component>
						</template>
						<template v-if="isHeroVideo">
							<video
								:src="heroMedia[0].url"
								class="tw-rounded tw-overflow-hidden"
								:autoplay="videoSettings.autoplay === false ? null : true"
								:muted="videoSettings.muted === false ? null : true"
								loop
								playsinline
								:controls="showControls"
							></video>
						</template>
					</div>

					<div
						class="tw-col-span-12"
						:class="{
							'tw-order-first': swapOrder,
							'md:tw-col-span-6': !singleColumn
						}"
						:style="maxWidthStyles"
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
						<div v-if="heroBody" class="tw-prose tw-mb-2 md:tw-mb-3" ref="heroBodyCopy">
							<dynamic-rich-text :html="heroBody" />
						</div>
						<button-wrapper
							class="tw-w-full md:tw-w-auto"
							:content="buttonContent"
						/>
					</div>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import ButtonWrapper from '@/components/Contentful/ButtonWrapper';
import { responsiveImageSetSourceSets } from '@/util/contentfulUtils';
import { richTextRenderer, addBlankTargetToExternalLinks } from '@/util/contentful/richTextRenderer';
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
	name: 'DynamicHeroClassic',
	components: {
		ButtonWrapper,
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
	async mounted() {
		await this.$nextTick();
		addBlankTargetToExternalLinks(this.$refs.heroBodyCopy);
	},
	computed: {
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		buttonContent() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'button' : false;
			});
		},
		buttonTo() {
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

			return responsiveImageSetSourceSets(imageSet);
		},
		responsiveHeroDescription() {
			const imageSet = this.content?.contents?.find(({ contentType }) => contentType === 'responsiveImageSet');
			return imageSet?.description ?? '';
		},
		videoSettings() {
			return this.uiSetting?.dataObject?.video ?? {};
		},
		showControls() {
			if (this.videoSettings.autoplay === false || this.videoSettings.muted === false) {
				return true;
			}
			return null;
		}
	},
};
</script>
