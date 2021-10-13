<template>
	<section-with-background-classic
		:background-content="background"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-grid>
				<div v-if="frequentlyAskedQuestionsHeadline">
					<h2 class="tw-text-h2">
						{{ frequentlyAskedQuestionsHeadline }}
					</h2>
				</div>
				<div v-if="frequentlyAskedQuestions" class="tw-divide-y">
					<kv-expandable-question
						v-for="(question, index) in frequentlyAskedQuestions"
						:key="index"
						:title="question.name"
						:content="convertFromRichTextToHtml(question.richText)"
						:id="question.name | changeCase('paramCase')"
					/>
				</div>
			</kv-grid>
		</template>
	</section-with-background-classic>
</template>

<script>
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		KvExpandableQuestion,
		KvGrid,
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
	data() {
		return {
		};
	},
	computed: {
		frequentlyAskedQuestionsHeadline() {
			return this.content?.title ?? null;
		},
		frequentlyAskedQuestions() {
			return this.content?.contents ?? null;
		},
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	},
	methods: {
		convertFromRichTextToHtml(rawRichText) {
			return rawRichText ? richTextRenderer(rawRichText) : '';
		}
	},
	mounted() {
		/** Scroll expandable question into view. */
		this.$nextTick(() => {
			if (this.$route.hash) {
				const el = document.querySelector(this.$route.hash);
				if (el) {
					el.scrollIntoView();
				}
			}
		});
	}
};
</script>
