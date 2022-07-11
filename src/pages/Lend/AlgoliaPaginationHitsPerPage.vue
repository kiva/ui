<template>
	<div class="hits-per-page tw-flex tw-items-center tw-justify-center tw-my-3">
		<div class="title tw-text-secondary tw-whitespace-nowrap tw-mr-2">
			Loans per page
		</div>
		<ais-hits-per-page
			:items="[
				{ label: '15', value: 15, default: true },
				{ label: '25', value: 25 },
				{ label: '50', value: 50 },
			]"
		/>
	</div>
</template>

<script>
import { AisHitsPerPage } from 'vue-instantsearch';

export default {
	name: 'AlgoliaPaginationHitsPerPage',
	components: {
		AisHitsPerPage,
	},
};
</script>

<style lang="postcss">
.ais-HitsPerPage-select {
	/* from kv-select */
	@apply tw-text-base tw-bg-primary;
	@apply tw-w-full tw-h-6 tw-px-2;
	@apply tw-border tw-border-tertiary tw-rounded-sm tw-ring-inset;
	@apply focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-action focus:tw-border-transparent;
}
</style>
