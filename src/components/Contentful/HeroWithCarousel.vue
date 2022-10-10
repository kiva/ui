<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12">
					<div class="tw-col-span-12" :class="customTextAlignment">
						<dynamic-rich-text :html="heroRichText" />
					</div>
					<div class="tw-col-span-12">
						<kv-carousel
							:embla-options="{ loop: false }"
							:multiple-slides-visible="true"
							slides-to-scroll="visible"
							class="tw-w-full tw-overflow-visible md:tw-overflow-hidden"
							:slide-max-width="singleSlideWidth"
						>
							<template v-for="(slide, index) in carouselSlides" #[`slide${index}`]>
								<story-card
									:content="slide"
									:key="index"
									v-if="slide.contentType === 'storyCard'"
								/>
								<dynamic-rich-text
									:html="getRichText(slide.richText)"
									:key="index"
									v-if="slide.contentType === 'richTextContent'"
								/>
							</template>
						</kv-carousel>
					</div>
					<div class="tw-col-span-12 tw-text-center">
						<button-wrapper
							class="tw-w-full md:tw-w-auto tw-mt-2"
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
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import ButtonWrapper from '@/components/Contentful/ButtonWrapper';

import StoryCard from '@/components/Contentful/StoryCard';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

/**
* Hero With Carousel Component
* This component will display a Hero driven by a Contentful Content
* Group of type heroWithCarousel. Content will be displayed above a
* full width carousel.
* */

export default {
	name: 'HeroWithCarousel',
	components: {
		ButtonWrapper,
		DynamicRichText,
		KvCarousel,
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
		StoryCard,
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
	methods: {
		getRichText(richText) {
			return richText ? richTextRenderer(richText) : '';
		}
	},
	mixins: [contentfulStylesMixin],
	computed: {
		buttonContent() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'button' : false;
			});
		},
		heroText() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'richTextContent' : false;
			});
		},
		heroRichText() {
			return this.heroText ? richTextRenderer(this.heroText.richText) : '';
		},
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		carousel() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'carousel' : false;
			});
		},
		carouselSlides() {
			return this.carousel?.slides ?? [];
		},
		/**
		 * Depends on various custom properties on Contentful dataObject
		 */
		customTextAlignment() {
			// Check for custom text alignment
			const textAlign = this.uiSetting?.dataObject?.textAlign ?? null;
			if (textAlign === 'center') {
				return 'tw-text-center';
			}
			// default class string for left aligned text
			return '';
		},
		singleSlideWidth() {
			// tw-grid width is 1072px == 67 rem
			const twGridRemWidth = 67;
			const slidesToShow = this.carousel?.slidesToShow ?? 1;
			const columnGaps = (this.carousel?.slidesToShow - 1) * 2;
			const availableSpaceForSlides = twGridRemWidth - columnGaps;
			return `${Math.floor(availableSpaceForSlides / slidesToShow)}rem`;
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
