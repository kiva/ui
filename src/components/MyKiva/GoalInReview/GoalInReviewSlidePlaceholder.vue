<template>
	<section
		class="tw-min-h-[calc(100vh-14rem)] tw-px-3 tw-py-4
			max-md:tw-min-h-[calc(90vh-3.5rem)] md:tw-px-6"
		:class="slideNumber % 2 === 0
			? 'tw-bg-white tw-text-primary'
			: 'tw-bg-eco-green-4 tw-text-white'"
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
