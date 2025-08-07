<template>
	<div
		:class="[
			// eslint-disable-next-line max-len
			'tw-w-full tw-relative tw-rounded tw-bg-center tw-select-none tw-bg-white journey-card tw-flex tw-flex-col tw-h-full',
			backgroundSize,
			{ 'tw-bg-top tw-bg-no-repeat': isBgTopAligned },
			{ 'single-image': hasSingleBorrowerImage }
		]"
		:style="{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }"
	>
		<div
			v-if="loans"
			class="tw-py-1 tw-px-1 md:tw-pt-2 md:tw-px-2 tw-grow tw-min-h-0"
		>
			<img
				v-if="loans"
				:src="fallbackImage"
				class="tw-rounded tw-w-full tw-h-full tw-object-cover tw-object-top"
				style="max-height: 300px;"
			>
			<KvCarousel
				v-else
				class="carousel tw-h-full"
				:embla-options="{ loop: false, align: 'center' }"
				:is-dotted="true"
			>
				<template v-for="(loan, index) in loans" #[`slide${index+1}`] :key="index">
					<KvBorrowerImage
						class="tw-relative tw-w-full tw-bg-black tw-rounded"
						:alt="`Photo of ${loan.name}`"
						:aspect-ratio="3 / 4"
						:default-image="{ width: 336 }"
						:hash="loan.image.hash"
						:images="[{ width: 336 }]"
						:photo-path="$appConfig.photoPath"
					/>
				</template>
			</KvCarousel>
		</div>
		<div
			v-if="tagText"
			class="
				tw-absolute
				tw-bg-secondary
				tw-rounded
				tw-px-1.5
				tw-py-0.5
				tw-text-small
				tw-left-1.5
				tw-top-1.5
				md:tw-left-2.5
				md:tw-top-2.5
				tw-drop-shadow-sm
				tw-font-medium
				tw-flex
				tw-items-center"
		>
			<TrophyIcon class="tw-mr-1" v-if="showTagIcon" />
			<span>{{ tagText }}</span>
		</div>
		<div
			class="
				tw-w-full
				tw-bottom-0
				tw-align-bottom
				tw-rounded-b
				tw-flex
				tw-flex-col
				tw-pb-1
				tw-px-1
				md:tw-pb-2
				md:tw-px-2
			"
			:class="[
				{
					'slide-gradient': hasGradient,
					'tw-absolute': !loans,
				}
			]"
		>
			<div class="tw-flex tw-flex-col tw-justify-end tw-shrink-0 tw-gap-0.5">
				<div class="text-content tw-text-primary-inverse">
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

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import {
	KvButton,
	KvMaterialIcon,
	KvBorrowerImage,
	KvCarousel,
} from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';
import NoLoansImg from '#src/assets/images/my-kiva/no-loans-image.jpg';
import FallbackBasicNeedsImg from '#src/assets/images/my-kiva/fallback-category-images/basic-needs.jpg';
import FallbackClimateActionImg from '#src/assets/images/my-kiva/fallback-category-images/climate-action.jpg';
import FallbackRefugeeEqualityImg from '#src/assets/images/my-kiva/fallback-category-images/refugee-equality.jpg';
// eslint-disable-next-line max-len
import FallbackUsEconomicEqualityImg from '#src/assets/images/my-kiva/fallback-category-images/us-economic-equality.jpg';
import FallbackWomensEqualityImg from '#src/assets/images/my-kiva/fallback-category-images/womens-equality.jpg';
import {
	ID_BASIC_NEEDS,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

const TrophyIcon = defineAsyncComponent(() => import('#src/assets/images/my-kiva/trophy.svg'));

const emit = defineEmits(['secondary-cta-clicked', 'primary-cta-clicked']);

const props = defineProps({
	/**
	 * Background size class for the card.
	 * This should be a string of Tailwind CSS classes.
	 */
	backgroundSize: {
		type: String,
		default: 'tw-bg-cover',
	},
	/**
	 * Classes to apply to the content area of the card.
	 * This should be a string of Tailwind CSS classes.
	 */
	cardContentClasses: {
		type: String,
		default: 'tw-pb-1.5 tw-px-1.5 md:tw-pb-2 md:tw-px-2',
	},
	/**
	 * The category of the card, used to determine fallback image if no loans are provided.
	 */
	category: {
		type: String,
		default: undefined,
	},
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
	 * Array of loan objects to display in the carousel.
	 * Fallback image will be used if empty array is provided.
	 */
	loans: {
		type: Array,
		default: undefined,
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

const showSecondaryCta = computed(() => !!props.secondaryCtaText);

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

const hasSingleBorrowerImage = computed(() => props?.loans && props.loans.length <= 1);

const fallbackImage = computed(() => {
	switch (props.category) {
		case ID_BASIC_NEEDS:
			return FallbackBasicNeedsImg;
		case ID_CLIMATE_ACTION:
			return FallbackClimateActionImg;
		case ID_REFUGEE_EQUALITY:
			return FallbackRefugeeEqualityImg;
		case ID_US_ECONOMIC_EQUALITY:
			return FallbackUsEconomicEqualityImg;
		case ID_WOMENS_EQUALITY:
			return FallbackWomensEqualityImg;
		default:
			return NoLoansImg;
	}
});
</script>

<style lang="postcss" scoped>
.journey-card {
	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
	min-height: 340px;

	@screen md {
		.journey-card {
			min-height: 382px;
		}
	}
}

.slide-gradient {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgb(0 0 0 / 0%) 100%);
}

.carousel > :deep(div:first-child) {
	height: calc(100% - 28px);
}

.single-image {
	.text-content {
		@apply tw-grow tw-content-center;
	}

	.carousel > :deep(div:first-child) {
		@apply tw-h-full;
	}
}

.carousel :deep(img) {
	@apply tw-h-full;
}

.carousel :deep(picture) {
	@apply md:!tw-pb-0 tw-h-full;
}

.carousel :deep(picture img) {
	@apply tw-object-cover;
}

.carousel :deep(.kv-carousel__controls) {
	@apply !tw-mt-2;
}

:deep(.card-primary-cta > span > span) {
	@apply tw-px-1;
}
</style>
