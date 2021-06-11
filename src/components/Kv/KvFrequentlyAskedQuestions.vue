<template>
	<section-with-background
		v-if="frequentlyAskedQuestionsHeadline || frequentlyAskedQuestions"
		class="frequently-asked-questions-section-wrapper tw-mb-4"
		:background-content="sectionBackground"
	>
		<template #content>
			<div class="row" id="frequently-asked-questions">
				<div v-if="frequentlyAskedQuestionsHeadline" class="small-12 columns">
					<h2 class="tw-text-h2">
						{{ frequentlyAskedQuestionsHeadline }}
					</h2>
				</div>
				<div v-if="frequentlyAskedQuestions" class="small-12 columns tw-py-2">
					<div class="row collapse">
						<kv-expandable-question
							v-for="(question, index) in frequentlyAskedQuestions"
							:key="index"
							:title="question.name"
							:content="convertFromRichTextToHtml(question.richText)"
							class="small-12 columns"
							:id="question.name | changeCase('paramCase')"
						/>
					</div>
				</div>
			</div>
		</template>
	</section-with-background>
</template>

<script>
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvExpandableQuestion,
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
		sectionBackground() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	},
	methods: {
		convertFromRichTextToHtml(rawRichText) {
			return documentToHtmlString(rawRichText);
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
