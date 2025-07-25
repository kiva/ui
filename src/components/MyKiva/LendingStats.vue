<template>
	<div class="tw-mb-3.5">
		<h3 class="tw-text-primary tw-mb-1">
			Ready to grow your impact?
		</h3>
		<p class="tw-text-base">
			Next steps for you based on your lending history
		</p>
	</div>
	<div class="tw-bg-white tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-w-full" style="max-width: 800px;">
		<div ref="loanRegionsElement" class="tw-mb-4">
			<span
				v-if="pillHeader"
				class="tw-inline-flex tw-items-center tw-gap-1.5 tw-mb-2 md:tw-mb-3 tw-rounded tw-bg-eco-green-1
				tw-px-3 tw-py-1 tw-leading-tight"
				title="Your lending reach"
			>
				<GlobeSearch class="tw-w-3 tw-h-3 tw-text-brand-550 tw-align-middle" />
				<span class="tw-text-primary tw-font-medium">
					{{ pillHeader }}
				</span>
			</span>
			<div v-if="loanRegions" class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
				<ul
					class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-2 tw-gap-x-2 tw-w-full"
				>
					<li
						v-for="(region, idx) in props.regionsData"
						:key="region.name"
						class="tw-flex tw-items-center tw-min-w-0 tw-overflow-hidden tw-w-full"
					>
						<RoundCheckbox
							:id="`continent-checkbox-${idx}`"
							:checked="checkedArr[idx]"
							class="tw-mr-0.5"
							:readonly="true"
							:disabled="true"
						/>
						<div class="tw-flex-1 tw-min-w-0 tw-overflow-hidden">
							<span
								class="tw-font-medium md:tw-text-lg tw-text-primary
									tw-block tw-whitespace-nowrap tw-truncate tw-min-w-0 tw-w-full"
								style="line-height: 1.25;"
								:title="region.name"
							>
								{{ region.name }}
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<hr
			v-if="loanRegions"
			class="tw-my-4 tw-mx-auto tw-border-none"
			style="
				width: 219px;
				height: 1px;
				border-radius: 20px;
				background: var(--brand-greens-green-2, #78C79F);
			"
		>
		<section>
			<!-- Second major section content goes here -->
			<div class="tw-w-full" v-html="`Make your first loan in ${formattedPendingRegions}`"></div>
			<div class="tw-w-full tw-flex-wrap tw-gap-2 tw-mt-2">
				<a
					v-for="(region, idx) in pendingRegions"
					:key="idx"
					class="tw-flex tw-mb-2 tw-w-1/2 tw-cursor-pointer"
					@click="handleRecommendRegionClick(region)"
				>
					<div
						class="
						tw-flex tw-flex-col tw-w-full
						tw-bg-white tw-rounded tw-shadow hover:tw-shadow-lg
						tw-transition-shadow tw-duration-200"
					>
						<svg
							class="tw-w-full tw-h-16 tw-rounded-t tw-bg-gray-200"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<rect width="100" height="100" fill="#e5e7eb" />
						</svg>
						<div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-p-2">
							<span class="tw-justify-start tw-font-medium">Lend in {{ region?.name }}</span>
							<UpCornerArrow class="tw-justify-end tw-w-2 tw-h-2 tw-text-brand-550 tw-align-middle" />
						</div>
					</div>
				</a>
			</div>
		</section>
	</div>
</template>
<script setup>
import {
	computed,
	defineProps,
	inject,
	onMounted,
	onUnmounted,
	ref,
} from 'vue';
import RoundCheckbox from '#src/components/MyKiva/RoundCheckbox';
import GlobeSearch from '#src/assets/icons/inline/globe-search.svg';
import UpCornerArrow from '#src/assets/icons/inline/up-corner-arrow.svg';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';

const { delayUntilVisible } = useDelayUntilVisible();

const props = defineProps({
	regionsData: {
		type: Array,
		default: () => [],
		required: true,
	}
});

const $kvTrackEvent = inject('$kvTrackEvent');

const interval = ref(null);
const loanRegionsElement = ref(null);

const totalRegions = computed(() => props.regionsData.length);
const loanRegions = computed(() => props.regionsData.filter(region => region.hasLoans).length);

const pillHeader = computed(() => {
	if (totalRegions.value === 0) return '';
	if (loanRegions.value === 0) return 'Make a global impact';
	return `${loanRegions.value}/${totalRegions.value} Regions supported`;
});

const pendingRegions = computed(() => {
	return props.regionsData.filter(region => !region.hasLoans).sort(region => region.count);
});

const formattedPendingRegions = computed(() => {
	const regions = pendingRegions.value;
	if (!regions || regions.length === 0) return '';
	const formattedNames = regions.map(region => `<span class="tw-font-medium">
		${region.name === 'Middle East' ? 'the Middle East' : region.name}
		</span>`);
	if (formattedNames.length === 1) return formattedNames[0];
	if (formattedNames.length === 2) return `${formattedNames[0]} and ${formattedNames[1]}`;
	return `${formattedNames.slice(0, -1).join(', ')}, and ${formattedNames[formattedNames.length - 1]}`;
});

// Local checked state for fade effect
const checkedArr = ref(props.regionsData.map(() => false));

const handleRecommendRegionClick = region => {
	$kvTrackEvent('event-tracking', 'click', 'region-recommendation', region?.name);
	const formattedRegion = region?.name
		?.toLowerCase()
		?.replace(/\s+/g, '-')
		?.replace(/[^a-z0-9-]/g, '');
	window.location.href = `/impact/${formattedRegion}`;
};

onMounted(() => {
	delayUntilVisible(() => {
		setTimeout(() => {
			let currentIdx = 0;
			interval.value = setInterval(() => {
				// eslint-disable-next-line max-len
				currentIdx = props.regionsData.findIndex((region, i) => region.hasLoans && !checkedArr.value[i] && i >= currentIdx);
				if (currentIdx !== -1) {
					checkedArr.value[currentIdx] = true;
					currentIdx += 1;
				} else {
					clearInterval(interval.value);
				}
			}, 200);
		}, 800);
	}, [loanRegionsElement.value]);
});

onUnmounted(() => {
	if (interval.value) clearInterval(interval.value);
});

</script>
