<template>
	<section
		ref="globalReachSection"
		class="tw-w-full tw-bg-marigold-1 tw-px-2.5 tw-pt-4 md:!tw-pt-5 tw-pb-6 md:!tw-pb-4 md:tw-px-4"
		:class="{ 'is-in-view': globalReachInView }"
		data-animate-on-view
		data-testid="goal-in-review-global-reach"
	>
		<p class="tw-text-label tw-text-eco-green-3 tw-mb-0.5 md:tw-mb-1 kv-fade-up global-reach-eyebrow">
			Global reach
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-3 kv-fade-up global-reach-headline">
			Your goal crossed
			<span class="tw-text-marigold">{{ borderCount }} {{ borderNoun }}.</span>
		</h1>

		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 md:tw-items-center">
			<KvSimpleMap
				class="tw-rounded tw-overflow-hidden tw-w-full"
				:countries="simpleMapCountries"
				:aspect-ratio="1.8"
				:fit-to-countries="true"
				:fit-padding="0.05"
				:allow-dragging="true"
				:show-zoom-controls="true"
				:zoom-factor="2"
				:base-color="MAP_BASE_COLOR"
				:autoplay="false"
			>
				<template #popup="{ country }">
					<div class="tw-text-label tw-text-eco-green-4">
						{{ country.name }}
					</div>
				</template>
			</KvSimpleMap>

			<ul
				class="tw-flex tw-flex-wrap tw-gap-1 tw-justify-center md:tw-justify-start
					tw-list-none tw-p-0 tw-m-0"
				data-testid="goal-in-review-global-reach-countries"
			>
				<li
					v-for="(country, index) in visibleCountries"
					:key="country.id ?? country.isoCode ?? country.name"
					class="tw-inline-flex tw-items-center tw-gap-0.5 tw-bg-white
						tw-rounded-full tw-py-0.5 tw-px-1.5 kv-scale-in"
					:style="pillDelay(index)"
				>
					<KvMaterialIcon :icon="mdiMapMarker" class="tw-w-2 tw-h-2 tw-text-eco-green-4" />
					<span class="tw-text-label tw-text-eco-green-4">{{ country.name }}</span>
				</li>

				<li
					v-if="otherCount > 0"
					class="tw-inline-flex tw-items-center tw-gap-0.5 tw-bg-white
						tw-rounded-full tw-py-0.5 tw-px-1.5 kv-scale-in"
					:style="pillDelay(visibleCountries.length)"
					data-testid="goal-in-review-global-reach-other-pill"
				>
					<KvMaterialIcon :icon="mdiMapMarker" class="tw-w-2 tw-h-2 tw-text-eco-green-4" />
					<span class="tw-text-label tw-text-eco-green-4">Other ({{ otherCount }})</span>
				</li>
			</ul>
		</div>
	</section>

	<section
		v-if="sectorValues.length"
		ref="sectorsSection"
		class="tw-w-full tw-bg-marigold-1 tw-p-4 md:!tw-pb-6"
		:class="{
			'is-in-view': sectorsInView,
			'tw-min-h-half-screen': !sectorsInView,
		}"
		data-animate-on-view
		data-testid="goal-in-review-global-reach-sectors"
	>
		<p class="tw-text-label tw-text-eco-green-3 tw-mb-0.5 md:tw-mb-1 kv-fade-up global-reach-eyebrow">
			Sectors Funded
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4 md:tw-mb-3 kv-fade-up global-reach-headline">
			You backed
			<span class="tw-text-marigold">{{ sectorCount }} {{ sectorNoun }}</span> of opportunity.
		</h1>

		<div
			v-if="sectorsInView"
			class="sectors-chart tw-mx-auto md:tw-max-w-3xl"
		>
			<!-- Kept mounted (not v-if'd) so its footprint is reserved up front: the
				skeleton ring holds the donut's responsive layout, so there's no jump
				when the section is reached. `loading` flips false on reveal, which
				fires the chart's own draw animation then — not on modal open,
				off-screen. -->
			<KvPieChartV2
				:values="sectorValues"
				:stroke-width="36"
				:shown-segments="sectorValues.length"
				:grow-duration="200"
				:initial-delay="100"
				unit="percent"
			/>
		</div>
	</section>
</template>

<script setup>
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
} from 'vue';
import { KvMaterialIcon, KvPieChartV2, KvSimpleMap } from '@kiva/kv-components';
import kvTokensPrimitives from '@kiva/kv-tokens';
import { mdiMapMarker } from '@mdi/js';
import {
	getNamedSectorCount,
	getSectorChartValues,
} from '#src/util/goalInReview';
import { createIntersectionObserver } from '#src/util/observerUtils';

const MAX_VISIBLE_COUNTRIES = 14;

const props = defineProps({
	countries: {
		type: Array,
		default: () => [],
	},
	sectors: {
		type: Array,
		default: null,
	},
});

const MAP_BASE_COLOR = kvTokensPrimitives.colors.gray[400];
const simpleMapCountries = computed(() => {
	const maxFunds = props.countries.reduce((max, c) => Math.max(max, c.fundsLentInCountry ?? 0), 0);
	return props.countries.flatMap(country => {
		if (!country.isoCode) return [];
		const funds = country.fundsLentInCountry ?? 0;
		const intensity = maxFunds > 0 ? 4 + Math.round((funds / maxFunds) * 11) : 4;
		return [{
			id: country.isoCode,
			name: country.name,
			loanCount: intensity,
		}];
	});
});

const borderCount = computed(() => props.countries.length);
const borderNoun = computed(() => (borderCount.value === 1 ? 'border' : 'borders'));
const visibleCountries = computed(() => props.countries.slice(0, MAX_VISIBLE_COUNTRIES));
const otherCount = computed(() => Math.max(props.countries.length - MAX_VISIBLE_COUNTRIES, 0));

const sectorValues = computed(() => getSectorChartValues(props.sectors));
const sectorCount = computed(() => getNamedSectorCount(sectorValues.value));
const sectorNoun = computed(() => (sectorCount.value === 1 ? 'sector' : 'sectors'));

const pillDelay = index => ({ animationDelay: `${0.1 + index * 0.08}s` });

// The map and sectors sections stack taller than the viewport, so each reveals
// its own entrance animations only when it scrolls into view — otherwise the
// lower one would animate while still off-screen.
const globalReachSection = ref(null);
const sectorsSection = ref(null);
const globalReachInView = ref(false);
const sectorsInView = ref(false);
let sectionObserver = null;

const revealSection = target => {
	if (target === globalReachSection.value) {
		globalReachInView.value = true;
	} else if (target === sectorsSection.value) {
		sectorsInView.value = true;
	}
};

onMounted(() => {
	const sections = [globalReachSection.value, sectorsSection.value].filter(Boolean);
	sectionObserver = createIntersectionObserver({
		targets: sections,
		callback: entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					revealSection(entry.target);
					sectionObserver?.unobserve(entry.target);
				}
			});
		},
		options: {
			root: globalReachSection.value?.closest('#kvLightboxBody'),
			rootMargin: '0px 0px -10% 0px', // reveal early: as the section clears the modal's bottom edge
			threshold: 0,
		},
	});
	if (!sectionObserver) {
		// IntersectionObserver unsupported — reveal both rather than hide them.
		globalReachInView.value = true;
		sectorsInView.value = true;
	}
});

onBeforeUnmount(() => sectionObserver?.disconnect());
</script>

<style lang="postcss" scoped>
.global-reach-eyebrow,
.global-reach-headline {
	/* Eyebrow + headline share one start so the header lands as a unit. */
	--kv-fade-up-distance: 24px;
}

/*
 * KvPieChartV2 renders its ring + legend stacked, with gray pills centered below
 * the donut. The design wants a 2-column grid of white pills, sitting beside the
 * donut on desktop. There is no prop/slot to reshape the legend, so we reach into
 * the component's structure with :deep(). Selectors are tied to KvPieChartV2's
 * markup (ring wrapper = first child, legend = second child) — revisit if that
 * component's template changes.
 */
 .sectors-chart :deep(.kv-pie-chart-v2) {
	@apply tw-gap-4;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:first-child) {
	/* Cap the donut at the design's 240x240 (square viewBox, so max-width caps both).
	Centered on mobile by the component's own items-center; @screen md keeps it left. */
	max-width: 240px;

	@apply tw-mx-auto;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2)) {
	/* Legend: 2-column grid of pills at every breakpoint. */
	@apply tw-grid tw-grid-cols-2 tw-gap-y-1 tw-gap-x-2 md:!tw-gap-x-3;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *) {
	/* Pills: white background, label left / value right, filling the grid cell. */
	@apply !tw-bg-white tw-w-full tw-justify-between;

	/* Per-item inline delays aren't possible on a child component's
	internals, so the stagger is driven by the :nth-child rules below. */
	animation: kv-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(1)) {
	animation-delay: 0.1s;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(2)) {
	animation-delay: 0.18s;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(3)) {
	animation-delay: 0.26s;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(4)) {
	animation-delay: 0.34s;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(5)) {
	animation-delay: 0.42s;
}

.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(6)) {
	animation-delay: 0.5s;
}

/* 7th pill onward (rare) share one delay rather than trailing off indefinitely. */
.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *:nth-child(n+7)) {
	animation-delay: 0.58s;
}

@media (prefers-reduced-motion: reduce) {
	.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2) > *) {
		animation: none;
	}
}

@screen md {
	.sectors-chart :deep(.kv-pie-chart-v2) {
		/* Donut on the left, legend on the right. */
		@apply tw-flex-row tw-items-center tw-gap-x-6 tw-gap-y-3;
	}

	.sectors-chart :deep(.kv-pie-chart-v2 > div:first-child) {
		@apply tw-w-1/2 tw-shrink-0;
	}

	.sectors-chart :deep(.kv-pie-chart-v2 > div:nth-of-type(2)) {
		@apply tw-w-auto tw-flex-1;
	}
}
</style>
