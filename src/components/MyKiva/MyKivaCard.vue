<template>
	<div
		class="tw-w-full tw-relative tw-rounded tw-bg-cover tw-bg-center tw-select-none tw-bg-white journey-card"
		:class="{ '!tw-bg-left-top': isBgTopAligned }"
		:style="{ backgroundImage: `url(${bgImage})` }"
	>
		<div
			v-if="images.length"
			class="tw-p-1"
			style="min-height: 235px;"
		>
			<KvCarousel
				class="carousel"
				:key="images.length"
				:embla-options="{ loop: false, align: 'center' }"
				:is-dotted="true"
			>
				<template v-for="(image, index) in images" #[`slide${index+1}`] :key="index">
					<img
						:src="image"
						class="tw-rounded tw-w-full tw-aspect-video tw-object-cover"
					>
				</template>
			</KvCarousel>
		</div>
		<div
			v-if="tagText"
			class="tw-absolute tw-bg-secondary tw-rounded tw-px-1.5 tw-py-0.5 tw-text-small tw-left-1.5 tw-top-1.5
				tw-drop-shadow-sm tw-font-medium tw-flex tw-items-center"
		>
			<TrophyIcon class="tw-mr-1" v-if="showTagIcon" />
			<span>{{ tagText }}</span>
		</div>
		<div
			class="
				tw-w-full
				tw-bottom-0
				tw-pb-1.5
				tw-px-1.5
				md:tw-pb-2
				md:tw-px-2
				tw-align-bottom
				tw-rounded-b
			"
			:class="{
				'slide-gradient': hasGradient,
				'tw-absolute': !images.length,
			}"
			:style="[
				{ 'height': overlayHeight },
			]"
		>
			<div class="tw-flex tw-flex-col tw-justify-end tw-h-full !tw-gap-1.5">
				<div class="tw-text-primary-inverse">
					<h2
						class="tw-text-h3"
						:class="titleClass"
					>
						{{ title }}
					</h2>
					<p
						v-if="subtitle"
						class="tw-text-small tw-font-medium"
						:class="{
							'tw-my-1 lg:tw-my-1.5 !tw-text-base !tw-text-gray-800': isBlackSubtitle,
						}"
					>
						{{ subtitle }}
					</p>
				</div>
				<div class="tw-flex tw-flex-col tw-gap-1.5">
					<button
						v-if="showSecondaryCta"
						@click="emit('secondary-cta-clicked')"
						variant="tertiary"
						class="tw-inline-flex tw-justify-center tw-items-center tw-rounded tw-py-1 tw-px-3
									tw-border tw-border-white tw-font-medium tw-text-center tw-text-white"
					>
						{{ secondaryCtaText }}
					</button>
					<KvButton
						@click="emit('primary-cta-clicked')"
						:variant="primaryCtaVariant"
						class="card-primary-cta"
						:class="{ 'tw-w-full': isFullWidthPrimaryCta }"
					>
						<div class="tw-flex tw-items-center tw-w-full">
							<span>
								{{ primaryCtaText }}
							</span>
							<KvMaterialIcon
								v-if="showCtaIcon"
								:icon="mdiArrowTopRight"
								class="!tw-w-2.5 !tw-h-2.5 tw-ml-2"
							/>
						</div>
					</KvButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
} from 'vue';
import TrophyIcon from '#src/assets/images/my-kiva/trophy.svg';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import { KvButton, KvMaterialIcon, KvCarousel } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';

const emit = defineEmits(['secondary-cta-clicked', 'primary-cta-clicked']);

const props = defineProps({
	/**
	 * Background image URL for the whole card.
	 */
	bgImage: {
		type: String,
		default: '',
	},
	/**
	 * Whether the background image should be aligned to the top left.
	 */
	isBgTopAligned: {
		type: Boolean,
		default: false,
	},
	/**
	 * Whether the card should have a gradient overlay at bottom.
	 */
	hasGradient: {
		type: Boolean,
		default: false,
	},
	/**
	 * Title of the card.
	 */
	title: {
		type: String,
		default: '',
	},
	/**
	 * Subtitle of the card. If not provided, the title will have more margin.
	 */
	subtitle: {
		type: String,
		default: '',
	},
	/**
	 * Text for the secondary call-to-action button.
	 */
	secondaryCtaText: {
		type: String,
		default: '',
	},
	/**
	 * Text for the primary call-to-action button.
	 */
	primaryCtaText: {
		type: String,
		default: '',
	},
	/**
	 * Whether the primary call-to-action button should take full width.
	 */
	isFullWidthPrimaryCta: {
		type: Boolean,
		default: false,
	},
	/**
	 * Variant of the primary call-to-action kv-button.
	 */
	primaryCtaVariant: {
		type: String,
		default: 'secondary',
	},
	/**
	 * Whether the title should use a sans-serif font.
	 */
	isTitleFontSans: {
		type: Boolean,
		default: false,
	},
	/**
	 * Color class for the title text. If provided, it will be applied to the title.
	 * This can be a Tailwind CSS color class like 'tw-text-gray-800'
	 */
	titleColor: {
		type: String,
		default: '',
	},
	/**
	 * Whether the subtitle should be styled as black text.
	 * This will apply specific styles to the subtitle if true.
	 */
	isBlackSubtitle: {
		type: Boolean,
		default: false,
	},
	/**
	 * Array of image URLs for the carousel.
	 */
	images: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Text for the tag displayed at the top of the card.
	 */
	tagText: {
		type: String,
		default: '',
	},
	/**
	 * Whether to show the call-to-action icon (arrow).
	 */
	showCtaIcon: {
		type: Boolean,
		default: false,
	},
	/**
	 * Whether to show the tag icon (TrophyIcon).
	 */
	showTagIcon: {
		type: Boolean,
		default: false,
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const showSecondaryCta = computed(() => !!props.secondaryCtaText);

const overlayHeight = computed(() => {
	return showSecondaryCta.value && isMobile.value ? '60%' : '50%';
});

const titleClass = computed(() => {
	let className = '';

	if (props.isTitleFontSans) {
		className += 'tw-font-sans';
	}

	if (props.titleColor) {
		className += ` ${props.titleColor}`;
	}

	if (!props.subtitle) {
		className += ' tw-mb-1.5';
	}

	return className;
});
</script>

<style lang="postcss" scoped>
.journey-card {
	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
	min-height: 382px;

	@screen md {
		min-height: 340px;
	}
}

.slide-gradient {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgb(0 0 0 / 0%) 100%);
}

.carousel :deep(.kv-carousel__controls) {
	@apply !tw-mt-2;
}

:deep(.card-primary-cta > span > span) {
	@apply tw-px-1;
}
</style>
