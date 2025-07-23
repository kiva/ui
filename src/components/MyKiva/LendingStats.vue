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
				<span class="tw-text-primary" tw-font-medium>
					{{ pillHeader }}
				</span>
			</span>
			<div v-if="loanRegions" class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
				<ul
					class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4
						tw-gap-y-2 tw-gap-x-2 tw-w-full md:[&>li]:tw-max-w-[170x]"
				>
					<li
						v-for="(region, idx) in props.regions"
						:key="region.name"
						class="tw-flex tw-items-center tw-w-full tw-overflow-hidden tw-min-w-0"
					>
						<RoundCheckbox
							:id="`continent-checkbox-${idx}`"
							:checked="checkedArr[idx]"
							class="tw-mr-0.5"
							:readonly="true"
							:disabled="true"
						>
							<div
								class="tw-block tw-min-w-0 tw-w-full tw-max-w-[90px]
							sm:tw-max-w-[120px] md:tw-max-w-[160px] lg:tw-max-w-[200px]"
							>
								<span
									class="tw-font-medium md:tw-text-lg tw-text-primary tw-block tw-whitespace-nowrap
									tw-truncate sm:tw-whitespace-normal sm:tw-truncate-none"
									style="line-height: 1.25;"
									:title="region.name"
								>
									{{ region.name }}
								</span>
							</div>
						</RoundCheckbox>
					</li>
				</ul>
			</div>
		</div>
		<hr
			v-if="loanRegions"
			class="tw-my-4 tw-mx-auto"
			style="
				width: 219px;
				height: 1px;
				border-radius: 20px;
				background: var(--brand-greens-green-2, #78C79F);
				border: none;
			"
		>
		<div>
			<!-- Second major section content goes here -->
			<p class="tw-text-base tw-text-gray-700">
			</p>
		</div>
	</div>
</template>

<script setup>
import {
	computed, ref, onUnmounted, onMounted
} from 'vue';
import RoundCheckbox from '#src/components/MyKiva/RoundCheckbox';
import GlobeSearch from '#src/assets/icons/inline/globe-search.svg';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';

const { delayUntilVisible } = useDelayUntilVisible();

const props = defineProps({
	regions: {
		type: Array,
		default: () => []
	}
});

const interval = ref(null);
const loanRegionsElement = ref(null);

const totalRegions = computed(() => props.regions.length);
const loanRegions = computed(() => props.regions.filter(region => region.hasLoans).length);

const pillHeader = computed(() => {
	if (totalRegions.value === 0) {
		return '';
	}
	if (loanRegions.value === 0) {
		return 'Make a global impact';
	}
	return `${loanRegions.value}/${totalRegions.value} Regions supported`;
});

// Local checked state for fade effect
const checkedArr = ref(props.regions.map(() => false));

onMounted(() => {
	delayUntilVisible(() => {
		setTimeout(() => {
			let currentIdx = 0;
			interval.value = setInterval(() => {
				// eslint-disable-next-line max-len
				currentIdx = props.regions.findIndex((region, i) => region.hasLoans && !checkedArr.value[i] && i >= currentIdx);
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
	if (interval.value) {
		clearInterval(interval.value);
	}
});

</script>
