<template>
	<div
		class="fundraiser-occasion-card tw-relative tw-flex tw-gap-1 tw-p-1 tw-bg-white tw-rounded
			hover:tw-shadow-md"
	>
		<img
			class="tw-w-10 tw-shrink-0 tw-rounded-sm tw-object-cover"
			:class="compact ? 'tw-h-10' : 'tw-h-12.5'"
			:src="optimizedImageUrl"
			:alt="imageAlt"
			loading="lazy"
			width="80"
			:height="compact ? 80 : 100"
		>
		<div class="tw-flex tw-flex-col tw-justify-center tw-gap-1 tw-py-0.5 tw-pr-0.5">
			<p class="tw-text-base">
				{{ title }}
			</p>
			<kv-text-link
				class="card-link tw-self-start"
				:href="to"
				v-kv-track-event="trackEvent"
			>
				{{ linkLabel }}
			</kv-text-link>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvTextLink } from '@kiva/kv-components';
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
	linkLabel: {
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
	/** Square image instead of 4:5, for the shorter card the owner state pairs with a fund summary. */
	compact: {
		type: Boolean,
		default: false,
	},
});

// Sources are square, so only the width is constrained and CSS crops to the card's 4:5 slot.
const optimizedImageUrl = computed(() => optimizeContentfulUrl(props.image, 160));

const trackEvent = computed(() => ['giving-funds', 'click', 'mykiva-fundraiser-occasion', props.id]);
</script>

<style lang="postcss" scoped>
/* Stretches the link's hit area over the whole card without nesting interactive elements. */
.card-link::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
}
</style>
