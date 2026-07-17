<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="6"
		placeholder="Placeholder for goal-setter insights, set month, and percentile."
		title="Goal insights"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	goalInsights: {
		type: Object,
		default: null,
	},
});
</script>
