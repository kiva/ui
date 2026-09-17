<template>
	<div>
		<div class="tw-flex tw-flex-col tw-gap-1 tw-mb-2">
			<div class="tw-flex tw-flex-col-reverse tw-items-start tw-gap-1 md:tw-flex-row md:tw-items-center">
				<h2 class="!tw-text-title">
					Fundraisers with Kiva
				</h2>
				<KvPill
					bg-class="tw-bg-brand tw-text-primary-inverse"
					rounded-class="tw-rounded"
				>
					<template #icon>
						<KvMaterialIcon class="tw-h-2 tw-w-2" :icon="mdiBullhornOutline" />
					</template>
					New!
				</KvPill>
			</div>
			<div class="tw-flex tw-items-start tw-gap-0.5">
				<p class="tw-text-base">
					Easily create and share fundraisers that support the communities and places you choose.
				</p>
				<div class="tw-z-tooltip tw-shrink-0 tw-mt-0.5">
					<button
						type="button"
						aria-label="About fundraisers at Kiva"
						id="mykiva-fundraisers-tooltip"
					>
						<KvMaterialIcon
							class="tw-text-secondary tw-h-2 tw-w-2"
							:icon="mdiInformationOutline"
						/>
					</button>
					<KvTooltip
						controller="mykiva-fundraisers-tooltip"
						placement="bottom"
					>
						<template #title>
							<p class="tw-text-label">
								Fundraisers at Kiva
							</p>
						</template>
						<p class="tw-text-small">
							Fundraisers make it easy to share Kiva with others and donate together.
							Learn more about fundraisers and how they work here.
						</p>
						<template #action>
							<kv-text-link :href="FUNDRAISER_LANDING_PAGE">
								More about fundraisers
							</kv-text-link>
						</template>
					</KvTooltip>
				</div>
			</div>
		</div>
		<KvCarousel
			class="fundraisers-carousel tw-w-full"
			:class="{ 'tw--mt-6': controlsTopRight }"
			:controls-top-right="controlsTopRight"
			:slide-max-width="singleSlideWidth"
			:embla-options="{ loop: false, align: 'start' }"
			:multiple-slides-visible="true"
		>
			<template v-for="(card, idx) in cards" #[`slide${idx}`] :key="card.id">
				<FundraiserOccasionCard v-bind="card" />
			</template>
		</KvCarousel>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import {
	KvCarousel,
	KvMaterialIcon,
	KvPill,
	KvTextLink,
	KvTooltip,
} from '@kiva/kv-components';
import { mdiBullhornOutline, mdiInformationOutline } from '@mdi/js';
import FundraiserOccasionCard from '#src/components/MyKiva/FundraiserOccasionCard';
import useBreakpoints from '#src/composables/useBreakpoints';
import { fundraiserOccasionCards, FUNDRAISER_LANDING_PAGE } from '#src/util/fundraiserOccasions';

defineProps({
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
});

const { isMedium, isLarge } = useBreakpoints();

const cards = fundraiserOccasionCards;

const singleSlideWidth = computed(() => {
	if (isLarge.value) {
		return 'calc((100% - 64px) / 3)';
	}
	if (isMedium.value) {
		return '336px';
	}
	return '90%';
});
</script>
