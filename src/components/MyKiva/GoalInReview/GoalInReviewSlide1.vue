<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="1"
		placeholder="Placeholder for goal summary, headline, target, status, and completion state."
		title="Goal summary"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	goalSummary: {
		type: Object,
		default: null,
	},
});
</script>
