<template>
	<div
		class="blog-card tw-w-full tw-relative tw-rounded tw-bg-cover
				tw-bg-center tw-bg-white tw-block focus:tw-outline-none cursor-pointer hover:tw-shadow-md"
		@click="handleCardClick"
		role="link"
		@keydown.enter="handleCardClick"
	>
		<div
			class="tw-bg-cover tw-bg-center tw-rounded-t"
			:style="`background-image: url('${optimizedImageUrl}'); height: 55%; width: 100%;`"
		></div>

		<div class="tw-pt-2 tw-pl-2 tw-flex tw-whitespace-nowrap tw-w-full">
			<span
				v-if="category"
				class="loan-callout tw-text-ellipsis tw-overflow-hidden tw-rounded-full
				tw-font-medium tw-py-0.5 tw-px-1 tw-mr-0.5 tw-mb-0.5 tw-text-small"
				:title="category"
				style="background-color: #f1f1f1;"
			>
				{{ category }}
			</span>
		</div>

		<div class="tw-px-2 tw-pt-1.5 tw-flex-1 tw-flex tw-flex-col">
			<p class="tw-font-medium tw-leading-snug tw-line-clamp-3 tw-text-black">
				<span class="blog-card-title tw-text-black tw-font-bold tw-no-underline">
					{{ title }}
				</span>
			</p>
		</div>
		<div class="tw-absolute tw-left-0 tw-bottom-0 tw-pl-2 tw-pb-2 tw-text-gray-500 tw-text-small">
			<p v-if="date">
				{{ formattedDate }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { optimizeContentfulUrl } from '#src/util/imageUtils';

const emit = defineEmits(['track']);

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

const optimizedImageUrl = computed(() => {
	if (!props.image) return '';
	return optimizeContentfulUrl(props.image, 336);
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

function handleCardClick() {
	emit('track', `${props.category.replace(/\./g, '').replace(/\s+/g, '-')}`);
	window.open(`/blog/${props.slug}`, '_blank', 'noopener');
}
</script>

<style lang="postcss" scoped>

.blog-card {
	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
	height: 420px;
	padding-bottom: 1rem;
	cursor: pointer;

	@screen md {
		height: 380px;
	}
}

.blog-card-title {
	transition: text-decoration 0.2s;
}

.blog-card:hover .blog-card-title {
	text-decoration: underline;
}

</style>
