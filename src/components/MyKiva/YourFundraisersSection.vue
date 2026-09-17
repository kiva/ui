<template>
	<div>
		<div class="tw-flex tw-items-center tw-gap-1 tw-mb-2">
			<h2 class="!tw-text-title">
				Your fundraisers
			</h2>
			<a
				class="tw-relative tw-z-1 tw-flex tw-items-center tw-gap-0.5 tw-text-button-link
					tw-text-action tw-no-underline hover:tw-underline"
				href="/gfm"
				v-kv-track-event="['giving-funds', 'click', 'mykiva-manage-all-fundraisers']"
			>
				Manage All
				<KvMaterialIcon class="tw-h-2 tw-w-2" :icon="mdiArrowTopRight" />
			</a>
		</div>
		<KvCarousel
			class="tw-w-full tw--mt-5"
			controls-top-right
			:slide-max-width="singleSlideWidth"
			:embla-options="{ loop: false, align: 'start' }"
			:multiple-slides-visible="true"
		>
			<template v-for="(slide, idx) in slides" #[`slide${idx}`] :key="slide.key">
				<YourFundraiserCard v-if="slide.fund" :fund="slide.fund" />
				<FundraiserOccasionCard
					v-else
					compact
					:style="{ maxWidth: startAnotherMaxWidth }"
					id="start-another"
					title="Have another event you'd like to fundraise for?"
					link-label="Start another fund here"
					:to="FUNDRAISER_LANDING_PAGE"
					:image="communityImage.image"
					:image-alt="communityImage.imageAlt"
				/>
			</template>
		</KvCarousel>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvCarousel, KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';
import FundraiserOccasionCard from '#src/components/MyKiva/FundraiserOccasionCard';
import YourFundraiserCard from '#src/components/MyKiva/YourFundraiserCard';
import useBreakpoints from '#src/composables/useBreakpoints';
import { communityImage, FUNDRAISER_LANDING_PAGE } from '#src/util/fundraiserOccasions';

const props = defineProps({
	funds: {
		type: Array,
		required: true,
	},
});

const { isMedium, isLarge } = useBreakpoints();

/**
 * One list so the slot names stay in order: Vue puts a standalone dynamic slot ahead of the
 * ones a v-for generates, which put the closing card first.
 */
const slides = computed(() => [
	...props.funds.map(fund => ({ key: fund.id, fund })),
	{ key: 'start-another', fund: null },
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

// Its copy would otherwise wrap only at the slide cap, leaving it as wide as a fund card.
const startAnotherMaxWidth = computed(() => (
	isLarge.value ? `${IMPACT_CARD_WIDTH}px` : '100%'
));
</script>
