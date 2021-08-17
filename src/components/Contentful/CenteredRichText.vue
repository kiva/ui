<template>
	<section-with-background-classic
		:background-content="background"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12 tw-text-center">
					<!-- md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-6 -->
					<div class="tw-prose tw-col-span-12">
						<dynamic-rich-text :html="richContent" />
					</div>
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

export default {
	components: {
		DynamicRichText,
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
	computed: {
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		richContent() {
			const richContent = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'richTextContent' : false;
			});
			const richText = richContent.richText ?? '';
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
