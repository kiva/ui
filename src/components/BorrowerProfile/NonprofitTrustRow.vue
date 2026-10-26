<template>
	<div
		class="tw-flex tw-items-center tw-justify-center tw-gap-2
			tw-text-small tw-text-secondary tw-text-center tw-whitespace-nowrap"
		data-testid="bp-nonprofit-trust-row"
	>
		<p class="tw-flex-1 tw-flex tw-flex-col tw-gap-0.5">
			<span class="tw-font-medium">501(c)3</span> <span>U.S. nonprofit</span>
		</p>
		<span class="tw-h-3 tw-border-l tw-border-tertiary" aria-hidden="true"></span>
		<p class="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-gap-0.5">
			<span class="tw-flex tw-gap-0.5" aria-hidden="true">
				<kv-material-icon
					v-for="star in 4"
					:key="star"
					class="tw-w-1.5 tw-h-1.5"
					:icon="mdiStar"
				/>
			</span>
			<span>Charity Navigator (4/4)</span>
		</p>
	</div>
</template>

<script setup>
import { mdiStar } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

defineOptions({ name: 'NonprofitTrustRow' });
</script>
