<template>
	<kv-grid class="tw-grid-cols-12 tw-py-8 ">
		<dynamic-rich-text
			class="tw-col-span-12 md:tw-col-span-6"
			:html="parsedRichText"
		/>
		<!-- TODO: build out src-sizes -->
		<kv-contentful-img
			class="tw-col-span-12 md:tw-col-span-6 tw-w-full"
			v-if="parsedImg.src"
			width="522"
			fallback-format="png"
			:contentful-src="parsedImg.src"
			:alt="parsedImg.alt"
		/>
	</kv-grid>
</template>

<script>
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import { parseRichTextFromContentGroup } from './util';

import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		DynamicRichText,
		KvGrid,
		KvContentfulImg,
	},
	props: {
		contentGroup: {
			type: Object,
			default() {}
		}
	},
	computed: {
		parsedRichText() {
			return parseRichTextFromContentGroup(this.contentGroup);
		},
		parsedImg() {
			return {
				src: this.contentGroup?.media?.[0]?.file?.url ?? '',
				alt: this.contentGroup?.media?.[0]?.file?.description ?? '',
			};
		}
	}
};
</script>
