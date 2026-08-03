<template>
	<section
		class="tw-w-full tw-bg-marigold-1 tw-px-2.5 tw-py-4 md:tw-px-4 md:tw-py-7.5"
		data-testid="goal-in-review-slide-3"
	>
		<p class="tw-text-label tw-text-eco-green-3 tw-mb-1">
			Global reach
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4">
			Your goal crossed
			<span class="tw-text-marigold">{{ borderCount }} borders.</span>
		</h1>

		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 md:tw-items-center">
			<KvMap
				class="tw-rounded tw-overflow-hidden tw-w-full"
				:map-id="3"
				:aspect-ratio="1.8"
				:lat="20"
				:long="10"
				:zoom-level="2"
				:use-leaflet="true"
				:show-labels="false"
				:show-tooltips="false"
				:countries-data="countriesData"
			/>

			<ul
				class="tw-flex tw-flex-wrap tw-gap-1 tw-justify-center md:tw-justify-start
					tw-list-none tw-p-0 tw-m-0"
				data-testid="goal-in-review-slide-3-countries"
			>
				<li
					v-for="country in visibleCountries"
					:key="country.id ?? country.isoCode ?? country.name"
					class="tw-inline-flex tw-items-center tw-gap-0.5 tw-bg-white
						tw-rounded-full tw-py-0.5 tw-px-1.5"
				>
					<KvMaterialIcon :icon="mdiMapMarker" class="tw-w-2 tw-h-2 tw-text-eco-green-4" />
					<span class="tw-text-label tw-text-eco-green-4">{{ country.name }}</span>
				</li>

				<li
					v-if="otherCount > 0"
					class="tw-inline-flex tw-items-center tw-gap-0.5 tw-bg-white
						tw-border tw-border-tertiary tw-rounded-full tw-py-0.5 tw-px-1.5"
					data-testid="goal-in-review-slide-3-other-pill"
				>
					<KvMaterialIcon :icon="mdiMapMarker" class="tw-w-2 tw-h-2 tw-text-eco-green-4" />
					<span class="tw-text-label tw-text-eco-green-4">Other ({{ otherCount }})</span>
				</li>
			</ul>
		</div>
	</section>

	<section
		v-if="sectorValues.length"
		class="tw-w-full tw-bg-marigold-1 tw-p-4"
		data-testid="goal-in-review-slide-3-sectors"
	>
		<p class="tw-text-label tw-text-eco-green-3 tw-mb-1">
			Sectors Funded
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4">
			You backed
			<span class="tw-text-marigold">{{ sectorCount }} sectors</span> of opportunity.
		</h1>

		<div class="sectors-chart tw-mx-auto md:tw-max-w-3xl">
			<KvPieChartV2
				:values="sectorValues"
				:stroke-width="36"
				:shown-segments="sectorValues.length"
				unit="percent"
			/>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import { KvMap, KvMaterialIcon, KvPieChartV2 } from '@kiva/kv-components';
import { mdiMapMarker } from '@mdi/js';
import { getSectorChartValues, getNamedSectorCount } from '#src/util/goalInReviewSectors';

// Show this many country pills before collapsing the rest into an "Other (n)" pill.
const MAX_VISIBLE_COUNTRIES = 14;

const props = defineProps({
	countries: {
		type: Array,
		default: () => [],
	},
	// Raw userAchievementProgress.tieredLendingAchievements. Grouped into
	// chart-ready sector values via getSectorChartValues.
	sectors: {
		type: Array,
		default: null,
	},
});

// Map the raw Country objects to the shape KvMap expects. `numLoansFundraising`
// is intentionally omitted — this recap map is a static highlight, not interactive.
const countriesData = computed(() => props.countries.map(country => ({
	label: country.name,
	value: country.fundsLentInCountry,
	lat: country.geocode?.latitude,
	long: country.geocode?.longitude,
	isoCode: country.isoCode,
})));

const borderCount = computed(() => props.countries.length);
const visibleCountries = computed(() => props.countries.slice(0, MAX_VISIBLE_COUNTRIES));
const otherCount = computed(() => Math.max(props.countries.length - MAX_VISIBLE_COUNTRIES, 0));

const sectorValues = computed(() => getSectorChartValues(props.sectors));
const sectorCount = computed(() => getNamedSectorCount(sectorValues.value));
</script>

<style lang="postcss" scoped>
/*
 * KvPieChartV2 renders its ring + legend stacked, with gray pills centered below
 * the donut. The design wants a 2-column grid of white pills, sitting beside the
 * donut on desktop. There is no prop/slot to reshape the legend, so we reach into
 * the component's structure with :deep(). Selectors are tied to KvPieChartV2's
 * markup (ring wrapper = first child, legend = second child) — revisit if that
 * component's template changes.
 */
.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2)) {
	/* Legend: 2-column grid of pills at every breakpoint. */
	@apply tw-grid tw-grid-cols-2 tw-gap-y-1 tw-gap-x-2 md:!tw-gap-x-3;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *) {
	/* Pills: white background, label left / value right, filling the grid cell. */
	@apply !tw-bg-white tw-w-full tw-justify-between;
}

@screen md {
	.sectors-chart :deep(.kv-pie-chart-v2) {
		/* Donut on the left, legend on the right. */
		@apply tw-flex-row tw-items-center tw-gap-4;
	}

	.sectors-chart :deep(.kv-pie-chart-v2 > div:first-child) {
		@apply tw-w-1/2 tw-shrink-0;
	}

	.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2)) {
		@apply tw-w-auto tw-flex-1;
	}
}
</style>
