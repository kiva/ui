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
			:goal-loans="goalLoans"
			:goal-progress="goalProgress"
			:goal-progress-percentage="goalProgressPercentage"
			:go-to-url="goToUrl"
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
	/**
	 * Whether the user is editing their goal category
	 */
	isEditing: {
		type: Boolean,
		default: false,
	},
	/**
	 * Target number of loans for the goal
	 */
	goalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Current progress (number of loans made toward goal)
	 */
	goalProgress: {
		type: Number,
		default: 0,
	},
	/**
	 * Progress percentage (0-100)
	 */
	goalProgressPercentage: {
		type: Number,
		default: 0,
	},
	/**
	 * URL to navigate to after setting goal
	 */
	goToUrl: {
		type: String,
		default: '/mykiva',
	},
});

</script>
