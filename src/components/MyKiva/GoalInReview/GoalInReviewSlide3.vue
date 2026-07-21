<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="3"
		placeholder="Placeholder for borrower list, borrower images, and borrower card details."
		title="Borrowers"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	borrowerList: {
		type: Array,
		default: () => [],
	},
});
</script>
