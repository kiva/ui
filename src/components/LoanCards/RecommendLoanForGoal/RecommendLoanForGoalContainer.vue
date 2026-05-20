<template>
	<div class="tw-mx-auto tw-flex tw-w-full tw-flex-col tw-bg-white">
		<RecommendLoanForGoalHeader
			:title="headerTitle"
			:details="headerDetails"
			:loaded-set-data="loadedSetData"
		/>
		<RecommendLoanForGoalContent
			ref="recommendLoanForGoalContentRef"
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
import { ref } from 'vue';
import RecommendLoanForGoalContent from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContent';
import RecommendLoanForGoalFooter from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalFooter';
import RecommendLoanForGoalHeader from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalHeader';

defineOptions({
	name: 'RecommendLoanForGoalContainer',
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
	/**
	 * Whether goal/loan data has finished loading; controls header loading placeholder.
	 */
	loadedSetData: {
		type: Boolean,
		default: true,
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

const recommendLoanForGoalContentRef = ref(null);

// Bridge the inner content's selected lend amount so parents using the
// container (not the content directly) can still read what the user picked.
defineExpose({
	getSelectedAmount: () => recommendLoanForGoalContentRef.value?.getSelectedAmount(),
});
</script>
