<template>
	<a
		class="tw-flex tw-items-center tw-gap-1 tw-p-1 tw-bg-white tw-rounded tw-shadow tw-text-primary
			tw-no-underline hover:tw-shadow-md hover:tw-text-primary"
		:href="to"
		v-kv-track-event="trackEvent"
	>
		<img
			v-if="optimizedImageUrl"
			class="tw-w-14 tw-h-14 tw-shrink-0 tw-rounded-sm tw-shadow tw-object-cover"
			:src="optimizedImageUrl"
			:alt="imageAlt"
			loading="lazy"
			width="112"
			height="112"
		>
		<div class="tw-flex tw-flex-col tw-flex-1 tw-min-w-0 tw-gap-0.5">
			<div class="tw-flex tw-items-center tw-justify-between">
				<p class="tw-text-button-link">
					{{ title }}
				</p>
				<KvMaterialIcon class="tw-w-3 tw-h-3 tw-shrink-0" :icon="mdiChevronRight" />
			</div>
			<p class="tw-text-small tw-text-secondary">
				{{ description }}
			</p>
		</div>
	</a>
</template>

<script setup>
import { computed } from 'vue';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiChevronRight } from '@mdi/js';
import { optimizeContentfulUrl } from '#src/util/imageUtils';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	to: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: '',
	},
	imageAlt: {
		type: String,
		default: '',
	},
});

const optimizedImageUrl = computed(() => optimizeContentfulUrl(props.image, 224));

const trackEvent = computed(() => ['giving-funds', 'click', 'mykiva-fundraiser-occasion', props.id]);
</script>
