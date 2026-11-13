<template>
	<div
		class="tw-flex tw-gap-0.5 tw-min-w-0"
		:class="footerBeside
			? `tw-flex-row tw-flex-wrap tw-items-center tw-justify-between tw-gap-x-1
				md:tw-flex-col md:tw-flex-nowrap md:tw-items-stretch md:tw-justify-start md:tw-gap-0.5`
			: 'tw-flex-col'"
	>
		<div class="tw-flex tw-flex-col tw-gap-0.5 tw-min-w-0">
			<div class="tw-flex tw-items-center tw-gap-0.5">
				<p class="tw-text-label tw-text-secondary">
					{{ label }}
				</p>
				<button
					:id="tooltipId"
					type="button"
					class="tw-inline-flex tw-text-secondary"
					:aria-label="`About ${label}`"
				>
					<KvMaterialIcon class="tw-w-2 tw-h-2" :icon="mdiInformationOutline" />
				</button>
				<KvTooltip :controller="tooltipId">
					{{ tooltip }}
				</KvTooltip>
			</div>
			<p class="tw-text-title tw-text-primary" :data-testid="valueTestId">
				<KvLoadingText v-if="loading" />
				<template v-else-if="value === null">
					—
				</template>
				<template v-else>
					{{ $filters.numeral(value, format) }}
				</template>
			</p>
		</div>
		<div v-if="$slots.default">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
import { useId } from 'vue';
import { mdiInformationOutline } from '@mdi/js';
import { KvLoadingText, KvMaterialIcon, KvTooltip } from '@kiva/kv-components';

defineOptions({ name: 'ImpactStat' });

defineProps({
	label: {
		type: String,
		required: true,
	},
	tooltip: {
		type: String,
		required: true,
	},
	valueTestId: {
		type: String,
		required: true,
	},
	value: {
		type: Number,
		default: null,
	},
	format: {
		type: String,
		default: '0,0',
	},
	loading: {
		type: Boolean,
		default: false,
	},
	footerBeside: {
		type: Boolean,
		default: false,
	},
});

const tooltipId = `impact-stat-tooltip-${useId()}`;
</script>
