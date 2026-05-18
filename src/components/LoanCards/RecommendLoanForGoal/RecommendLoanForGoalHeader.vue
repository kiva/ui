<template>
	<div
		class="tw-flex tw-flex-col tw-items-center tw-justify-center
			tw-bg-gray-50 tw-p-3 tw-pb-2 tw-text-center tw-rounded"
		role="status"
	>
		<div
			class="tw-m-0.5 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-brand tw-p-0.25"
			aria-hidden="true"
		>
			<kv-material-icon
				class="tw-block tw-h-2.5 tw-w-2.5 tw-text-white"
				:icon="mdiCheck"
			/>
		</div>
		<h2 class="tw-mt-1 tw-mb-2 tw-font-bold tw-text-action-highlight">
			{{ title }}
		</h2>
		<p
			v-if="details.length"
			class="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-1"
		>
			<KvLoadingPlaceholder
				v-if="!loadedSetData"
				style="width: 150px;"
				class="!tw-h-2 !tw-rounded"
			/>
			<template
				v-else
				v-for="(detail, index) in details" :key="index"
			>
				<span
					v-if="index > 0"
					class="tw-inline-block tw-rounded-full tw-bg-tertiary"
					style="height: 0.25rem; width: 0.25rem;"
					aria-hidden="true"
				></span>
				<span class="tw-text-action-highlight">{{ detail }}</span>
			</template>
		</p>
	</div>
</template>

<script setup>
import { mdiCheck } from '@mdi/js';
import { KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';

defineOptions({ name: 'RecommendLoanForGoalHeader' });

defineProps({
	title: {
		type: String,
		required: true,
	},
	details: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Flag to indicate if the goal data has been loaded
	 */
	loadedSetData: {
		type: Boolean,
		default: false,
	},
});
</script>
