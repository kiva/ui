<template>
	<div
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white tw-shadow-lg
			tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4 tw-overflow-hidden"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<GoalSelector
			v-else
			:is-goal-set="isGoalSet"
			:categories-loan-count="categoriesLoanCount"
			:tiered-achievements="tieredAchievements"
			:is-editing="isEditing"
			:selected-category-id="selectedCategory.badgeId"
			:selected-category-name="selectedCategory.name"
			@set-goal-target="$emit('set-goal-target', $event)"
			@set-goal="$emit('set-goal', $event)"
			@edit-goal="$emit('edit-goal')"
		/>
	</div>
</template>

<script setup>
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';

defineEmits(['edit-goal', 'set-goal', 'set-goal-target']);

defineProps({
	/**
	 * Whether the component is in a loading state
	 */
	loading: {
		type: Boolean,
		default: false,
	},
	/**
	 * total number of loans made by the user
	 */
	totalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Categories loan count
	 */
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Whether the goal has been set on parent component
	 */
	isGoalSet: {
		type: Boolean,
		default: false,
	},
	/**
	 * Tiered achievements data
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Selected Category
	 */
	selectedCategory: {
		type: Object,
		default: () => ({}),
	},
});

</script>
