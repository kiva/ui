<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="2"
		placeholder="Placeholder for total lent, borrower count, loan count, and percent complete."
		title="Loan stats"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	loanStats: {
		type: Object,
		default: null,
	},
});
</script>
