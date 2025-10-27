<template>
	<div>
		<div class="tw-flex tw-justify-center tw-items-center tw-gap-3.5 tw-mb-5">
			<button
				class="tw-flex tw-shadow tw-rounded-full tw-p-0.5"
				:class="{ 'tw-invisible': count <= MIN_COUNT }"
				@click="decrementCount"
			>
				<KvMaterialIcon class="tw-w-3 tw-h-3" :icon="mdiMinus" />
			</button>
			<span class="tw-text-jumbo">{{ count }}</span>
			<button
				class="tw-flex tw-shadow tw-rounded-full tw-p-0.5"
				:class="{ 'tw-invisible': count >= MAX_COUNT }"
				@click="incrementCount"
			>
				<KvMaterialIcon class="tw-w-3 tw-h-3" :icon="mdiPlus" />
			</button>
		</div>
		<kv-card-frame
			bg-color-class="tw-bg-secondary"
			border-class="tw-border-2 tw-border-action"
			class="tw-transition-all tw-duration-200 hover:tw-shadow-lg tw-mx-auto"
			style="max-width: 375px;"
		>
			<div
				class="
						tw-p-2 tw-flex tw-flex-row
						tw-items-center tw-cursor-pointer
					"
			>
				<img
					class="tw-shrink-0 tw-mr-2"
					:alt="`${selectedCategory.name} image`"
					:src="selectedCategory.customImage"
					:width="IMAGE_WIDTH"
				>
				<div>
					<p class="tw-mb-0.5 tw-font-medium">
						{{ selectedCategory.name }}
					</p>
					<p class="tw-text-small">
						{{ selectedCategory.description }}
					</p>
				</div>
			</div>
		</kv-card-frame>
	</div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { mdiPlus, mdiMinus } from '@mdi/js';
import { KvMaterialIcon, KvCardFrame } from '@kiva/kv-components';

const MAX_COUNT = 50;
const MIN_COUNT = 1;
const IMAGE_WIDTH = 64;

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	selectedGoalNumber: {
		type: Number,
		default: 0,
	},
	selectedCategory: {
		type: Object,
		required: true,
	}
});

const emit = defineEmits(['number-changed']);

const count = ref(props.selectedGoalNumber || 0);

const incrementCount = () => {
	if (count.value >= MAX_COUNT) return;
	count.value += 1;
	$kvTrackEvent('portfolio', 'modify-goal-amount', 'increase-goal', undefined, count.value);
	emit('number-changed', count.value);
};

const decrementCount = () => {
	if (MIN_COUNT >= count.value) return;
	count.value -= 1;
	$kvTrackEvent('portfolio', 'modify-goal-amount', 'decrease-goal', undefined, count.value);
	emit('number-changed', count.value);
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'show', 'view-goal-number', undefined, count.value);
});

</script>
