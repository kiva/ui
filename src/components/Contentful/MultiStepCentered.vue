<template>
	<section-with-background-classic class="how-it-works" :background-content="sectionBackground">
		<template #content>
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12 tw-text-center">
					<!-- <div
						class="tw-py-4 tw-col-span-12"
					>
						<dynamic-rich-text :html="sectionHeadings" />
					</div> -->

					<figure
						v-for="(item, index) in richContentfulContent"
						:key="index"
						class="tw-col-span-12 lg:tw-col-span-3
							tw-mb-2
							tw-bg-primary tw-rounded"
					>
						<div class="tw-pt-4 tw-pb-3">
							<dynamic-rich-text :html="parseRichContent(item)" />
						</div>
					</figure>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
		DynamicRichText,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	methods: {
		parseRichContent(item) {
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
		// sectionHeadings() {
		// 	const richText = this.content?.contents?.filter(({ contentType }) => {
		// 		return contentType === 'genericContentBlock';
		// 	});
		// 	const headings = richText;
		// 	return headings;
		// },
	}
};
</script>
