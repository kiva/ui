<template>
	<GoalInReviewSlidePlaceholder
		:slide-number="4"
		placeholder="Placeholder for geography, countries supported, borders crossed, and map data."
		title="Geography"
	/>
</template>

<script setup>
import GoalInReviewSlidePlaceholder from '#src/components/MyKiva/GoalInReview/GoalInReviewSlidePlaceholder';

defineProps({
	geography: {
		type: Object,
		default: null,
	},
});
</script>
