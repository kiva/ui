<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="5"
		placeholder="Placeholder for sectors backed and sector distribution data."
		title="Sectors"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	sectors: {
		type: Array,
		default: () => [],
	},
});
</script>
