<template>
	<kv-theme-provider :theme="darkGreenTheme">
		<div
			class="
			tw-bg-primary
			tw-py-2 md:tw-pt-6 md:tw-pb-5 lg:tw-py-7"
		>
			<!-- Headline Text -->
			<centered-rich-text class="tw-w-full" :content="headlineContent" />
			<!-- Columns Content -->
			<rich-text-items-centered id="rteContent" :content="columnsContent" />
		</div>
	</kv-theme-provider>
</template>

<script>
import CenteredRichText from '@/components/Contentful/CenteredRichText';
import RichTextItemsCentered from '@/components/Contentful/RichTextItemsCentered';
import { darkGreenTheme } from '~/@kiva/kv-tokens/configs/kivaColors.cjs';

import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	name: 'HowItWorks',
	components: {
		KvThemeProvider,
		CenteredRichText,
		RichTextItemsCentered
	},
	props: {
		headlineContent: {
			type: Object,
			default: () => {},
		},
		columnsContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return { darkGreenTheme };
	}
};

</script>

<style scoped>

#rteContent >>> figure {
	margin-bottom: 0;
}

</style>
