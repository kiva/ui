<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="7"
		placeholder="Placeholder for closing message, community impact, and share CTA state."
		title="Wrap up"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	wrapUp: {
		type: Object,
		default: null,
	},
});
</script>
