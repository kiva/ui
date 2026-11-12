<template>
	<div
		class="tw-flex tw-flex-wrap tw-items-center tw-gap-2 md:tw-gap-3
			tw-bg-white tw-rounded tw-shadow-lg tw-p-2.5 md:tw-p-3"
	>
		<dl class="tw-grid tw-grid-cols-2 tw-gap-2 md:tw-gap-3 tw-min-w-0 tw-grow-[999] tw-basis-[19rem]">
			<div
				v-for="stat in stats"
				:key="stat.testId"
				class="tw-flex tw-flex-col tw-gap-0.5 tw-min-w-0"
			>
				<dt class="tw-text-label tw-text-tertiary">
					{{ stat.label }}
				</dt>
				<dd
					class="tw-text-title"
					:class="stat.highlight ? 'tw-text-action' : 'tw-text-primary'"
					:data-testid="stat.testId"
				>
					<KvLoadingText v-if="loading" />
					<template v-else>
						{{ formatMoney(stat.value) }}
					</template>
				</dd>
			</div>
		</dl>
		<div class="tw-flex tw-grow">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
import numeral from 'numeral';
import { KvLoadingText } from '@kiva/kv-components';

defineOptions({ name: 'AccountStatCard' });

defineProps({
	/**
	 * Each stat's label, amount (null when unknown), value test id, and whether the amount takes the action color
	 */
	stats: {
		type: Array,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

const formatMoney = value => (value === null || value === undefined ? '—' : numeral(value).format('$0,0.00'));
</script>
