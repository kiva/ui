<template>
	<div
		class="tw-mx-auto tw-flex tw-w-full tw-flex-col tw-bg-white"
		:class="wrapperClasses"
		:style="wrapperStyle"
	>
		<RecommendLoanForGoalHeader
			:title="headerTitle"
			:details="headerDetails"
		/>
		<RecommendLoanForGoalContent
			:heading="contentHeading"
			v-bind="contentCardProps"
			:is-adding="isAdding"
			@add-to-basket="$emit('add-to-basket', $event)"
			@remove-from-basket="$emit('remove-from-basket', $event)"
			@jump-filter-page="$emit('jump-filter-page', $event)"
			@close-button="$emit('close-button', $event)"
		/>
		<RecommendLoanForGoalFooter
			:is-adding="isAdding"
			:is-in-basket="isInBasket"
			:express-checkout-enabled="expressCheckoutEnabled"
			@primary-cta-click="$emit('primary-cta-click', $event)"
			@checkout-click="$emit('checkout-click', $event)"
			@secondary-cta-click="$emit('secondary-cta-click', $event)"
		/>
	</div>
</template>

<script setup>
import { computed, useAttrs } from 'vue';
import RecommendLoanForGoalContent from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContent';
import RecommendLoanForGoalFooter from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalFooter';
import RecommendLoanForGoalHeader from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalHeader';

defineOptions({
	name: 'RecommendLoanForGoalContainer',
	// Don’t auto-merge fallthrough attrs onto the root; apply only class/style via useAttrs() below.
	inheritAttrs: false,
});

defineProps({
	headerTitle: {
		type: String,
		required: true,
	},
	headerDetails: {
		type: Array,
		default: () => ([]),
	},
	contentHeading: {
		type: String,
		default: 'Start your goal with this recommended loan',
	},
	/**
	 * Props passed through to `KvCompactLoanCard` (e.g. loan, loanId, photoPath, kvTrackFunction).
	 */
	contentCardProps: {
		type: Object,
		required: true,
	},
	/**
	 * Only used in Thank you page for express checkout.
	 */
	expressCheckoutEnabled: {
		type: Boolean,
		default: false,
	},
	/**
	 * While add-to-basket is in flight; drives footer “Adding to basket” (see KvLendCta `isAdding`).
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
	/**
	 * When this loan is in the basket; footer primary becomes checkout (see KvLendCta `isInBasket`).
	 */
	isInBasket: {
		type: Boolean,
		default: false,
	},
});

defineEmits([
	'add-to-basket',
	'remove-from-basket',
	'jump-filter-page',
	'close-button',
	'primary-cta-click',
	'checkout-click',
	'secondary-cta-click',
]);

const attrs = useAttrs();

const wrapperClasses = computed(() => attrs.class);

const wrapperStyle = computed(() => attrs.style);
</script>
