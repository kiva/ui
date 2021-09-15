<template>
	<kv-grid class="tw-grid-cols-12">
		<div class="tw-col-span-12 md:tw-col-span-8">
			<dynamic-rich-text
				class="tw-py-8"
				:html="parsedRichText"
			/>
		</div>
	</kv-grid>
</template>

<script>
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import { parseRichTextFromContentGroup } from './util';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		DynamicRichText,
		KvGrid,
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
		}
	}
};
</script>
