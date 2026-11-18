<template>
	<div>
		<div class="tw-flex tw-items-baseline tw-justify-between tw-gap-1 tw-mb-2">
			<h2 class="!tw-text-title">
				Your fundraisers
			</h2>
			<a
				class="tw-relative tw-z-1 tw-flex tw-items-center tw-gap-0.5 tw-text-button-link
					tw-text-action tw-no-underline hover:tw-underline"
				:class="{ 'md:tw-mr-11.5': hasCarousel }"
				href="/gfm"
				v-kv-track-event="['giving-funds', 'click', 'mykiva-manage-all-fundraisers']"
			>
				Manage funds
				<KvMaterialIcon class="tw-h-2 tw-w-2" :icon="mdiArrowTopRight" />
			</a>
		</div>
		<KvCarousel
			v-if="hasCarousel"
			:key="isMedium"
			class="tw-w-full tw--mt-5"
			controls-top-right
			:slide-max-width="singleSlideWidth"
			:embla-options="{ loop: false, align: 'start' }"
			:multiple-slides-visible="true"
		>
			<template v-for="(slide, idx) in slides" #[`slide${idx}`] :key="slide.key">
				<YourFundraiserCard v-if="slide.fund" :fund="slide.fund" />
				<StartAnotherFundCard v-else :style="{ maxWidth: startAnotherMaxWidth }" />
			</template>
		</KvCarousel>
		<div v-else class="tw-flex tw-flex-col tw-gap-2 lg:tw-flex-row lg:tw-gap-4">
			<YourFundraiserCard :fund="funds[0]" :style="{ width: singleFundWidth }" class="tw-shrink-0 lg:tw-h-auto" />
			<StartAnotherFundCard class="lg:tw-flex-1 lg:tw-h-auto" />
		</div>
		<StartAnotherFundCard v-if="hasCarousel && !isMedium" class="tw-mt-2" />
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvCarousel, KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';
import StartAnotherFundCard from '#src/components/MyKiva/StartAnotherFundCard';
import YourFundraiserCard from '#src/components/MyKiva/YourFundraiserCard';
import useBreakpoints from '#src/composables/useBreakpoints';

const props = defineProps({
	funds: {
		type: Array,
		required: true,
	},
});

const { isMedium, isLarge } = useBreakpoints();

const hasCarousel = computed(() => props.funds.length > 1);

/**
 * One list so the slot names stay in order: Vue puts a standalone dynamic slot ahead of the
 * ones a v-for generates, which put the closing card first. KvCarousel ignores slides added
 * after mount, so the carousel is keyed on the breakpoint that toggles the closing card.
 */
const slides = computed(() => [
	...props.funds.map(fund => ({ key: fund.id, fund })),
	...(isMedium.value ? [{ key: 'start-another', fund: null }] : []),
]);

/**
 * Impact progress sits directly below this row and pins its cards to a fixed width, so a
 * percentage here drifts out of alignment at every viewport but one. Spanning two of those
 * cards plus the carousel gap keeps the two rows on the same grid.
 */
const IMPACT_CARD_WIDTH = 336;
const IMPACT_CARD_GAP = 32;

const singleSlideWidth = computed(() => {
	if (isLarge.value) {
		return `${(IMPACT_CARD_WIDTH * 2) + IMPACT_CARD_GAP}px`;
	}
	if (isMedium.value) {
		return '80%';
	}
	return '90%';
});

const singleFundWidth = computed(() => (isLarge.value ? singleSlideWidth.value : '100%'));

// Its copy would otherwise wrap only at the slide cap, leaving it as wide as a fund card.
const startAnotherMaxWidth = computed(() => (
	isLarge.value ? `${IMPACT_CARD_WIDTH}px` : '100%'
));
</script>
