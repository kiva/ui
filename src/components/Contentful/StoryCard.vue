<template>
	<div class="tw-col-span-12">
		<h4>{{ kickerHeadline }}</h4>
		<dynamic-rich-text class="tw-text-center" :html="cardContent" />
		<dynamic-rich-text class="tw-text-center" :html="footer" />
		{{ theme }}
	</div>
</template>

<script>
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';

/**
* Story Card Component
* */

export default {
	components: {
		DynamicRichText
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
		theme() {
			return this.content?.theme ?? '';
		},
		footer() {
			const text = this.content?.footer ?? '';
			return text ? richTextRenderer(text) : '';
		},
		cardContent() {
			const text = this.content?.cardContent ?? '';
			return text ? richTextRenderer(text) : '';
		},
		kickerHeadline() {
			return this.content?.kickerHeadline ?? '';
		},
		backgroundMedia() {
			return this.content?.backgroundMedia ?? '';
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
