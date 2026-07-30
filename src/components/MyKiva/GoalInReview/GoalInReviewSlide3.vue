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
						tw-border tw-border-tertiary tw-rounded-full tw-py-0.5 tw-px-1.5"
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
</template>

<script setup>
import { computed } from 'vue';
import { KvMap, KvMaterialIcon } from '@kiva/kv-components';
import { mdiMapMarker } from '@mdi/js';

// Show this many country pills before collapsing the rest into an "Other (n)" pill.
const MAX_VISIBLE_COUNTRIES = 14;

const props = defineProps({
	countries: {
		type: Array,
		default: () => [],
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
</script>
