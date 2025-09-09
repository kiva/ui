<template>
	<KvImpactVerticalSelector
		:category-list="categories"
		:pre-selected-category="preSelectedCategory"
		@category-selected="$emit('category-selected', $event)"
	/>
</template>

<script setup>
import { KvImpactVerticalSelector } from '@kiva/kv-components';
import {
	defineProps, defineEmits, onMounted, inject
} from 'vue';

defineProps({
	categories: {
		type: Array,
		required: true,
	},
	preSelectedCategory: {
		type: String,
		default: '1',
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

defineEmits(['category-selected']);

onMounted(() => {
	$kvTrackEvent('portfolio', 'show', 'view-goal-categories');
});

</script>
