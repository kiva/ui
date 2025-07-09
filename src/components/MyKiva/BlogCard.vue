<template>
	<div
		class="tw-flex tw-flex-col tw-rounded-lg tw-bg-white tw-shadow tw-overflow-hidden
		tw-transition hover:tw-shadow-lg tw-group tw-border tw-border-gray-100 tw-h-full"
	>
		<div class="tw-relative tw-aspect-[4/3] tw-bg-gray-100">
			<img
				:src="image"
				:alt="title"
				class="tw-w-full tw-h-full tw-object-cover"
			>
		</div>
		<div class="tw-pl-2">
			<summary-tag
				class="tw-inline-block tw-mt-2 tw-mb-0 tw-text-small"
			>
				{{ category }}
			</summary-tag>
		</div>
		<div class="tw-pl-2 tw-pt-0 tw-pb-1 tw-pr-2 tw-flex-1 tw-flex tw-flex-col">
			<p class="tw-font-semibold tw-text-base tw-leading-snug tw-mb-0 truncate-3-lines">
				<a
					:href="`/blog/${slug}`"
					class="tw-no-underline hover:tw-underline"
					@click="$emit('track', { title, slug, category })"
				>
					{{ title }}
				</a>
			</p>
		</div>
		<div class="tw-pl-2 tw-pb-2 tw-text-gray-500 tw-text-small">
			<p v-if="date">
				{{ formattedDate }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import summaryTag from '#src/components/BorrowerProfile/SummaryTag';

const props = defineProps({
	image: {
		type: String,
		default: '',
	},
	category: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
	date: {
		type: String,
		default: '',
	},
	slug: {
		type: String,
		required: true,
	},
});

const formattedDate = computed(() => {
	if (!props.date) return '';
	const dateObj = new Date(props.date);
	return dateObj.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
});
</script>

<style scoped>
.truncate-3-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
