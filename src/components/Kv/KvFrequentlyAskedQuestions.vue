<template>
	<div class="frequently-asked-questions-section-wrapper row" id="frequently-asked-questions">
		<div class="small-12 columns">
			<h2>
				{{ headline }}
			</h2>
		</div>
		<div class="small-12 columns">
			<div class="row collapse">
				<kv-expandable-question
					v-for="(question, index) in faqsContentful"
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
		faqsContentful: {
			type: Array,
			default() {
				return [];
			}
		},
		headline: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
		};
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
