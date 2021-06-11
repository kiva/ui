<template>
	<div class="frequently-asked-questions-section-wrapper row" id="frequently-asked-questions">
		<div v-if="frequentlyAskedQuestionsHeadline" class="small-12 columns">
			<h2>
				{{ frequentlyAskedQuestionsHeadline }}
			</h2>
		</div>
		<div v-if="frequentlyAskedQuestions" class="small-12 columns">
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

<script>
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvExpandableQuestion
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
			return this.content?.name ?? null;
		},
		frequentlyAskedQuestions() {
			return this.content?.contents ?? null;
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

<style lang="scss" scoped>
@import 'settings';

.frequently-asked-questions-section-wrapper {
	margin-bottom: 4rem;

	h2 {
		margin-bottom: 1.85rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}
</style>
