<template>
	<KvLightbox
		:visible="show"
		title=""
		@lightbox-closed="handleClose"
		class="impact-insight-modal"
	>
		<template #header>
			<h2
				v-if="!isMobile"
				class="tw-mb-3 !tw-text-left"
			>
				A closer look at <u>{{ borrowerName }} world</u>
			</h2>
		</template>
		<h2
			v-if="isMobile"
			class="tw-mb-3 !tw-text-left"
		>
			A closer look at <u>{{ borrowerName }} world</u>
		</h2>
		<div class="tw-flex tw-flex-col tw-items-center tw-w-full">
			<KvCarousel
				ref="carouselRef"
				:is-dotted="true"
				:new-index="carouselIndex"
				:slide-max-width="''"
				:controls-top-right="false"
				:multiple-slides-visible="false"
				:embla-options="{ loop: false, startIndex: 0 }"
				class="impact-insight-carousel"
				@change="handleUserInteraction"
			>
				<template #slide1>
					<MyKivaImpactInsightScreen1 :latest-loan="latestLoan" />
				</template>
				<template #slide2>
					<MyKivaImpactInsightScreen2 :latest-loan="latestLoan" />
				</template>
				<template #slide3>
					<MyKivaImpactInsightScreen3 :latest-loan="latestLoan" />
				</template>
				<template #slide4>
					<MyKivaImpactInsightScreen4 :latest-loan="latestLoan" />
				</template>
				<!-- dots class: "tw-flex tw-justify-start tw-items-center tw-max-w-xl tw-gap-3 tw-absolute",
					style: "bottom: 13rem; left: 26%;" -->
			</KvCarousel>

			<div
				class="tw-static tw-w-full impact-insight-footer"
			>
				<div
					class="tw-flex tw-justify-self-end tw-w-full tw-h-6
							tw-gap-2 tw-float-end secondary-navigation-buttons"
				>
					<button
						v-if="currentSlide > 0 && !isMobile"
						class="tw-w-11 tw-text-center tw-border tw-rounded-lg
								tw-bg-white tw-text-gray-900 tw-font-medium"
						:disabled="currentSlide === 0"
						@click="goToPrev"
					>
						Back
					</button>
					<button
						class="tw-w-full md:tw-w-11 tw-text-center tw-rounded-lg tw-bg-action tw-text-white
								tw-font-medium hover:tw-bg-action-highlight"
						@click="handleNextOrDone"
					>
						{{ isLastSlide ? 'Done' : 'Next' }}
					</button>
				</div>
			</div>
		</div>
	</KvLightbox>
</template>

<script setup lang="ts">
import {
	ref, computed, defineProps, defineEmits,
	inject, onMounted
} from 'vue';

import { KvLightbox, KvCarousel } from '@kiva/kv-components';

import useBreakpoints from '#src/composables/useBreakpoints';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import MyKivaImpactInsightScreen1 from './MyKivaImpactInsightScreen1';
import MyKivaImpactInsightScreen2 from './MyKivaImpactInsightScreen2';
import MyKivaImpactInsightScreen3 from './MyKivaImpactInsightScreen3';
import MyKivaImpactInsightScreen4 from './MyKivaImpactInsightScreen4';

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	latestLoan: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(['close']);
const $kvTrackEvent = inject('$kvTrackEvent');

const currentSlide = ref(0);
const carouselRef = ref(null);

const totalSlides = 4;
const { isMobile } = useBreakpoints();

const borrowerName = computed(() => {
	return formatPossessiveName(props.latestLoan?.name) || '';
});

const isLastSlide = computed(() => currentSlide.value === totalSlides - 1);

const handleTrackEvent = () => {
	$kvTrackEvent('portfolio', 'view', `impact-education-screen-${currentSlide.value + 1}`);
};

const handleClose = () => {
	emit('close');
	currentSlide.value = 0;
};

const goToPrev = () => {
	if (currentSlide.value > 0) {
		const newIndex = currentSlide.value - 1;
		carouselRef.value?.goToSlide(newIndex);
		currentSlide.value = newIndex;
		$kvTrackEvent('portfolio', 'click', 'next-step-impact-education-back');
		handleTrackEvent();
	}
};

const goToNext = () => {
	if (currentSlide.value < totalSlides - 1) {
		const newIndex = currentSlide.value + 1;
		carouselRef.value?.goToSlide(newIndex);
		currentSlide.value = newIndex;
	}
};

const handleNextOrDone = () => {
	if (isLastSlide.value) {
		handleClose();
	} else {
		goToNext();
		$kvTrackEvent('portfolio', 'click', 'next-step-impact-education-next');
		handleTrackEvent();
	}
};

const handleUserInteraction = interaction => {
	const newIndex = interaction.value;
	if (typeof newIndex === 'number' && newIndex !== currentSlide.value) {
		currentSlide.value = newIndex;
		handleTrackEvent();
	}
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'view', 'impact-education-screen-1');
});

</script>

<style lang="postcss">
.impact-insight-modal ::v-deep #kvLightboxBody {
	height: 771px;
	width: 100%;

	@screen md {
		height: 384px;
		width: 952px;
	}
}

.impact-insight-modal {
	.impact-insight-carousel {
		@apply md:!tw-mb-2
	}

	.tw-bg-primary:has(#kvLightboxBody) {
		max-height: 528px;
	}

	.impact-insight-carousel div:has(.impact-insight-slide) {
		@apply tw-self-start md:tw-self-auto;
	}

	.impact-insight-carousel div:first-child {
		@apply !tw-items-center;
	}

	.kv-carousel__controls {
		gap: 10px;
		flex-wrap: wrap;

		@apply !tw-flex tw-items-center tw-gap-1 tw-mb-1.5 tw-z-sticky md:!tw-mt-5 md:!tw-mb-0;

		@screen md {
			max-width: 50%;
		}
	}

	.impact-insight-footer {
		max-height: 48px;

		.secondary-navigation-buttons {
			@apply md:!tw-absolute;

			@screen md {
				width: auto;
				bottom: 21%;
			}

		}
	}
}
</style>
