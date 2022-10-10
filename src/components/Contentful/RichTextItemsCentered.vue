<template>
	<section-with-background-classic
		:background-content="sectionBackground"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid
					:style="customGridStyles"
					class="tw-grid-cols-12 tw-justify-items-center tw-text-center"
				>
					<div
						v-for="(item, index) in richContentfulContent"
						:key="index"
						:class="{
							'tw-col-span-12': true,
							'md:tw-col-span-6': richContentfulContent.length >= 2,
							'lg:tw-col-span-6': richContentfulContent.length === 2,
							'lg:tw-col-span-4': richContentfulContent.length === 3,
							'lg:tw-col-span-3': richContentfulContent.length === 4,
						}"
						:style="maxWidthStyles"
					>
						<div class="tw-pt-2">
							<dynamic-rich-text :html="parsedRichContent(item)" />
						</div>
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
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'RichTextItemsCentered',
	components: {
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
		DynamicRichText,
	},
	mixins: [contentfulStylesMixin],
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	methods: {
		parsedRichContent(item) {
			const richText = item?.richText ?? '';
			return richText ? richTextRenderer(richText) : '';
		}
	},
	computed: {
		sectionBackground() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		richContentfulContent() {
			const richContentfulData = this.content?.contents?.filter(({ contentType }) => {
				return contentType === 'richTextContent';
			});
			return richContentfulData;
		},
	}
};
</script>
