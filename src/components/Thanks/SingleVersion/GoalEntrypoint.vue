<template>
	<div
		class="tw-rounded md:tw-rounded-xl tw-bg-white tw-overflow-hidden"
	>
		<KvLoadingPlaceholder v-if="loading" class="goal-entrypoint-loading !tw-rounded" />
		<template v-else>
			<RecommendLoanForGoalContainer
				v-if="showRecommendLoanAfterGoalView"
				ref="recommendLoanForGoalRef"
				header-title="Goal set!"
				:header-details="recommendLoanHeaderDetails"
				:content-card-props="recommendLoanCardProps"
				express-checkout-enabled
				:is-adding="isAdding"
				:is-in-basket="recommendLoanIsInBasket"
				:loaded-set-data="loadedSetData"
				@primary-cta-click="handleAddToBasket"
			/>
			<div
				v-else
				class="
					tw-shadow-lg
					tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4"
			>
				<GoalSelector
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
					:custom-goal-amount-enable="customGoalAmountEnable"
					@set-goal-target="$emit('set-goal-target', $event)"
					@set-goal="$emit('set-goal', $event)"
					@edit-goal="$emit('edit-goal')"
				/>
			</div>
		</template>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import RecommendLoanForGoalContainer from
	'#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContainer';

const emit = defineEmits([
	'edit-goal',
	'set-goal',
	'set-goal-target',
	'add-to-basket',
]);

const props = defineProps({
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
	/**
	 * Whether the custom goal amount feature is enabled (from experiment)
	 */
	customGoalAmountEnable: {
		type: Boolean,
		default: false,
	},
	/**
	 * Whether to show the recommended-loan step instead of the goal selector.
	 * Already accounts for the `goalRecommendedLoanEnable` flag and the goal being set.
	 */
	showRecommendLoanAfterGoalView: {
		type: Boolean,
		default: false,
	},
	/**
	 * Props passed through to the recommended loan card (loan, loanId, photoPath, etc.)
	 */
	recommendLoanCardProps: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Header detail segments for the recommended-loan step
	 */
	recommendLoanHeaderDetails: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Whether the recommended loan is already in the user's basket
	 */
	recommendLoanIsInBasket: {
		type: Boolean,
		default: false,
	},
	/**
	 * Whether goal/loan data has finished loading; drives the header placeholder
	 */
	loadedSetData: {
		type: Boolean,
		default: false,
	},
	/**
	 * True while the add-to-basket request is in flight
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
});

const recommendLoanForGoalRef = ref(null);

const handleAddToBasket = () => {
	const { loanId } = props.recommendLoanCardProps;
	if (!loanId) return;
	const lendAmount = recommendLoanForGoalRef.value?.getSelectedAmount();
	emit('add-to-basket', { loanId, lendAmount });
};
</script>

<style lang="postcss" scoped>
.goal-entrypoint-loading {
	min-height: 546px;

	@screen md {
		min-height: 583px;
	}
}
</style>
