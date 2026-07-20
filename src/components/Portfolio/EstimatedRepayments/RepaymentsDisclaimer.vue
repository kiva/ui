<template>
	<div class="tw-text-small tw-text-secondary tw-mt-3" data-testid="repayments-disclaimer">
		<!-- eslint-disable-next-line vue/no-v-html -- static/trusted copy from DISCLAIMER_PARAGRAPHS -->
		<p
			v-for="(paragraph, index) in paragraphs"
			:key="index"
			:class="{ 'tw-mt-1': index > 0 }"
			v-html="paragraph"
		></p>
	</div>
</template>

<script>
import { DISCLAIMER_PARAGRAPHS } from '#src/util/estimatedRepayments/estimatedRepaymentsConstants';

export default {
	name: 'RepaymentsDisclaimer',
	data() {
		return {
			paragraphs: DISCLAIMER_PARAGRAPHS,
		};
	},
};
</script>
