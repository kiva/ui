<template>
	<section
		class="goal-in-review-slide tw-px-3 tw-py-4 md:tw-px-6"
		:class="{ 'goal-in-review-slide--light': slideNumber % 2 === 0 }"
	>
		<div class="tw-w-full">
			<p class="tw-text-small tw-mb-1">
				Slide {{ slideNumber }}
			</p>
			<h3 class="tw-text-headline tw-mb-1">
				{{ title }}
			</h3>
			<p class="tw-text-small">
				{{ placeholder }}
			</p>
		</div>
	</section>
</template>

<script setup>
defineProps({
	slideNumber: {
		type: Number,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	placeholder: {
		type: String,
		required: true,
	},
});
</script>

<style lang="postcss" scoped>
.goal-in-review-slide {
	min-height: calc(100vh - 13.75rem);
	background-color: #123c2b;

	@apply tw-text-white;
}

.goal-in-review-slide--light {
	@apply tw-bg-white tw-text-primary;
}

@media (width < 768px) {
	.goal-in-review-slide {
		min-height: calc(90vh - 3.5rem);
	}
}
</style>
