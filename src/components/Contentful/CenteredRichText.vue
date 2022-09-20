<template>
	<section-with-background-classic
		:background-content="background"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid class="tw-mx-auto tw-text-center tw-justify-items-center" :style="customGridStyles">
					<dynamic-rich-text
						:html="richContent"
						:style="maxWidthStyles"
					/>
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
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'CenteredRichText',
	components: {
		DynamicRichText,
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
		richContent() {
			const richContent = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'richTextContent' : false;
			});
			const richText = richContent?.richText ?? '';
			return richText ? richTextRenderer(richText) : '';
		},
	}
};
</script>
