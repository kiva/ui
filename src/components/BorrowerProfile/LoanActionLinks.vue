<template>
	<div class="tw-flex tw-items-center tw-justify-end tw-gap-3 tw-w-full">
		<button
			type="button"
			class="
				tw-inline-flex tw-items-center tw-gap-0.5 tw-min-h-4
				tw-text-action tw-text-button-link hover:tw-underline
			"
			data-testid="bp-summary-loan-details-link"
			@click="$emit('loan-details')"
		>
			<kv-material-icon class="tw-w-3 tw-h-3 tw-shrink-0" :icon="mdiFormatListBulleted" />
			Loan details
		</button>
		<button
			type="button"
			class="
				tw-inline-flex tw-items-center tw-gap-0.5 tw-min-h-4
				tw-text-action tw-text-button-link hover:tw-underline
			"
			data-testid="bp-summary-share-link"
			@click="$emit('share')"
		>
			<kv-material-icon class="tw-w-2.5 tw-h-2.5 tw-shrink-0" :icon="mdiExportVariant" />
			Share
		</button>
	</div>
</template>

<script>
import { mdiExportVariant, mdiFormatListBulleted } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

/**
 * "Loan details" and "Share" shown inside the borrower profile top card (new user version,
 * tablet and desktop). Presentational: the parent decides what each action does.
 */
export default {
	name: 'LoanActionLinks',
	components: {
		KvMaterialIcon,
	},
	emits: ['loan-details', 'share'],
	data() {
		return {
			mdiExportVariant,
			mdiFormatListBulleted,
		};
	},
};
</script>
