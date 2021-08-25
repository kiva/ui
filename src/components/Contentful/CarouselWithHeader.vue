<template>
	<section-with-background-classic
		:background-content="background"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid>
					<dynamic-rich-text class="tw-prose tw-text-center" :html="headerRichText" />
					<kv-carousel
						:embla-options="{ loop: false }"
						:multiple-slides-visible="true"
						slides-to-scroll="visible"
						class="tw-w-full"
						slide-max-width="21rem"
					>
						<template v-for="(slide, index) in carouselSlides" #[`slide${index}`]>
							<dynamic-rich-text :html="getRichText(slide.richText)" :key="index" />
						</template>
					</kv-carousel>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	components: {
		DynamicRichText,
		KvCarousel,
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
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
	computed: {
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		carousel() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'webCarousel' : false;
			});
		},
		carouselSlides() {
			return this.carousel?.slides ?? [];
		},
		headerRichText() {
			const richContent = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'richTextContent' : false;
			});
			const richText = richContent?.richText ?? '';
			return richText ? richTextRenderer(richText) : '';
		},
		verticalPadding() {
			const uiSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			return uiSetting?.dataObject?.verticalPadding ?? {};
		},
	}
};
</script>
