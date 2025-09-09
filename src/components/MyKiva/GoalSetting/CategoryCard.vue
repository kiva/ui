<template>
	<div
		class="tw-rounded-md tw-border-2 tw-shadow-lg"
		:class="selectedCategoryId === category.id ?
			'tw-border-eco-green-3 tw-bg-brand-100' : 'tw-border-transparent'"
	>
		<label
			class="tw-flex md:tw-flex-col md:tw-text-center tw-items-center tw-gap-2
        tw-cursor-pointer tw-px-1.5 tw-py-2 md:tw-py-3"
		>
			<div>
				<img
					:src="`/src/assets/images/my-kiva/goal-setting/${category.icon}`"
					:alt="`${category.name} icon`"
					class="tw-w-6 tw-h-6"
				>
			</div>
			<div class="tw-flex tw-flex-col tw-justify-center">
				<input
					type="radio"
					:value="category.id"
					v-model="selectedCategoryId"
					@change="$emit('select-category', category)"
					class="tw-sr-only tw-mr-3 text-kiva-green-600 focus:tw-ring-brand-400"
				>
				<p class="tw-text-eco-green-4 tw-font-medium">{{ category.name }}</p>
				<p class="tw-text-eco-green-4">
					{{ category.description }}
				</p>
			</div>
		</label>
	</div>
</template>

<script setup>

import {
	ref, defineProps, defineEmits,
	watch,
} from 'vue';

const props = defineProps({
	category: {
		type: Object,
		default: () => ({}),
	},
	selectedCategoryId: {
		type: Number,
		default: 1,
	},
});

defineEmits(['select-category']);

const selectedCategoryId = ref(props.selectedCategoryId);

watch(() => props.selectedCategoryId, newVal => {
	selectedCategoryId.value = newVal;
});

</script>
