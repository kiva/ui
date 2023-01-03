<template>
	<kv-grid>
		<div v-if="headline">
			<h2 class="tw-text-h2">
				{{ headline }}
			</h2>
		</div>
		<div v-if="questions" class="tw-divide-y tw-whitespace-normal">
			<kv-expandable-question
				v-for="(question, index) in questions"
				:key="index"
				:title="question.name"
				:content="convertFromRichTextToHtml(question.richText)"
				:id="question.name | changeCase('paramCase')"
				:active="isActive(question.name)"
				@toggle="setActiveAccordion"
			/>
		</div>
	</kv-grid>
</template>

<script>
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'KvFrequentlyAskedQuestions',
	components: {
		KvExpandableQuestion,
		KvGrid,
	},
	data() {
		return {
			activeAccordion: '',
		};
	},
	props: {
		/**
		 * FAQ Headline
		* */
		headline: {
			type: String,
			default: '',
		},
		/**
		 * Array of questions - output of contentful content field. each questions is a contentful rich text object
		* */
		questions: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		convertFromRichTextToHtml(rawRichText) {
			return rawRichText ? richTextRenderer(rawRichText) : '';
		},
		setActiveAccordion({ title }) {
			this.activeAccordion = title;
		},
		isActive(title) {
			return this.activeAccordion === title;
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
