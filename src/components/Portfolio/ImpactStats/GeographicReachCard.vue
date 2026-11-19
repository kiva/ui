<template>
	<ImpactSectionCard
		title="Geographic Reach"
		subtitle="Countries where you have lent"
		flush
		:loading="loading"
		:error="error"
		data-testid="impact-geographic-reach"
	>
		<template v-if="showPill" #pill>
			<span data-testid="impact-geographic-reach-count">
				{{ countriesLentTo }} of {{ countriesAvailable }} countries
			</span>
		</template>
		<template #loading>
			<KvLoadingPlaceholder class="tw-w-full" :style="{ aspectRatio: MAP_ASPECT_RATIO }" />
		</template>

		<div aria-hidden="true">
			<div class="tw-border-t tw-border-tertiary">
				<KvSimpleMap
					:countries="mapCountries"
					:loan-count-tiers="LOAN_COUNT_TIERS"
					:fit-to-countries="false"
					:allow-dragging="false"
					:show-zoom-controls="false"
					:ocean-color="MAP_OCEAN_COLOR"
				/>
			</div>
			<ul
				class="tw-flex tw-flex-wrap tw-gap-x-2 tw-gap-y-1 tw-px-2.5 md:tw-px-3 tw-py-2
					tw-border-t tw-border-tertiary"
				data-testid="impact-geographic-reach-key"
			>
				<li v-for="item in MAP_KEY" :key="item.label" class="tw-flex tw-items-center tw-gap-0.5">
					<span class="geographic-reach__swatch tw-rounded-xs" :class="item.swatchClass"></span>
					<span class="tw-text-caption tw-text-secondary tw-whitespace-nowrap">{{ item.label }}</span>
				</li>
			</ul>
		</div>

		<div class="tw-columns-2 md:tw-columns-3 tw-gap-x-2 md:tw-gap-x-4 tw-px-2.5 md:tw-px-3 tw-pb-0.5 md:tw-pb-0">
			<div
				v-for="region in regions"
				:key="region.name"
				class="tw-break-inside-avoid tw-pb-2 md:tw-pb-3"
				data-testid="impact-region"
			>
				<div class="tw-flex tw-items-center tw-justify-between tw-gap-1 tw-mb-1">
					<h4 class="tw-text-label tw-text-primary">
						{{ region.name }}
					</h4>
					<KvPill
						v-if="region.complete"
						size="small"
						class="tw-shrink-0"
						data-testid="impact-region-complete"
					>
						Complete
					</KvPill>
				</div>
				<ul class="tw-flex tw-flex-col tw-gap-0.5">
					<li
						v-for="country in region.countries"
						:key="country.isoCode"
						class="tw-flex tw-items-center tw-gap-0.5"
						data-testid="impact-country-row"
					>
						<template v-if="country.tier !== null">
							<KvMaterialIcon
								:icon="mdiCheckCircle"
								class="tw-w-2 tw-h-2 tw-shrink-0"
								:class="TIER_ICON_CLASSES[country.tier]"
							/>
							<span class="tw-sr-only">Lent to</span>
						</template>
						<span v-else class="tw-flex tw-items-center tw-justify-center tw-w-2 tw-h-2 tw-shrink-0">
							<span class="geographic-reach__dot tw-rounded-full tw-bg-gray-300"></span>
						</span>
						<span class="tw-flex-1 tw-min-w-0 tw-break-words tw-hyphens-auto">
							<a
								v-kv-track-event="['portfolio', 'click', 'geographic-reach-country', country.isoCode]"
								:href="`/lend/filter?country=${country.isoCode}`"
								class="tw-text-caption tw-underline"
								:class="country.tier !== null ? 'tw-text-action' : 'tw-text-primary'"
							>{{ country.name }}</a>
						</span>
						<span v-if="country.share !== null" class="tw-shrink-0 tw-text-caption tw-text-tertiary">
							{{ formatShare(country.share) }}
						</span>
					</li>
				</ul>
			</div>
		</div>
	</ImpactSectionCard>
</template>

<script setup>
import { computed } from 'vue';
import { mdiCheckCircle } from '@mdi/js';
import {
	KvLoadingPlaceholder, KvMaterialIcon, KvPill, KvSimpleMap,
} from '@kiva/kv-components';
import kvTokens from '@kiva/kv-tokens';
import ImpactSectionCard from '#src/components/Portfolio/ImpactStats/ImpactSectionCard';
import useGeographicReach from '#src/composables/useGeographicReach';
import useImpactStats from '#src/composables/useImpactStats';
import { LOAN_COUNT_TIERS, formatShare } from '#src/util/geographicReach';

defineOptions({ name: 'GeographicReachCard' });

const MAP_ASPECT_RATIO = '1300.02 / 571.784';

const MAP_OCEAN_COLOR = kvTokens.colors.gray[100];

const TIER_ICON_CLASSES = [
	'tw-text-brand-400',
	'tw-text-brand-500',
	'tw-text-brand',
	'tw-text-brand-800',
	'tw-text-brand-1000',
];

const MAP_KEY = [
	{ label: 'No loans yet', swatchClass: 'tw-bg-gray-200' },
	{ label: '1–3', swatchClass: 'tw-bg-brand-400' },
	{ label: '4–6', swatchClass: 'tw-bg-brand-500' },
	{ label: '7–9', swatchClass: 'tw-bg-brand' },
	{ label: '10–12', swatchClass: 'tw-bg-brand-800' },
	{ label: '13+ loans', swatchClass: 'tw-bg-brand-1000' },
];

const {
	regions,
	mapCountries,
	loading,
	error,
} = useGeographicReach();

const { countriesLentTo, countriesAvailable } = useImpactStats();

const showPill = computed(() => countriesLentTo.value !== null && countriesAvailable.value !== null);
</script>

<style lang="postcss" scoped>
.geographic-reach__swatch {
	width: 1.5rem;
	height: 1rem;
}

.geographic-reach__dot {
	width: 0.375rem;
	height: 0.375rem;
}

@screen md {
	.geographic-reach__swatch {
		width: 1.875rem;
		height: 1.125rem;
	}
}
</style>
