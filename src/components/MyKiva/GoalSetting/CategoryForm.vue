<template>
	<div class="tw-grid md:tw-grid-cols-2 tw-gap-2 md:tw-gap-3">
		<CategoryCard
			v-for="category in categories"
			:key="category.id"
			:category="category"
			:selected-category-id="selectedCategoryId"
			@select-category="$emit('select-category', $event)"
		/>
	</div>
</template>

<script setup>
import {
	defineProps, defineEmits, onMounted, inject
} from 'vue';
import CategoryCard from './CategoryCard';

defineProps({
	categories: {
		type: Array,
		required: true,
	},
	selectedCategoryId: {
		type: Number,
		default: 1,
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

defineEmits(['select-category']);

onMounted(() => {
	$kvTrackEvent('portfolio', 'show', 'view-goal-categories');
});

</script>
