<template>
	<div class="tw-mb-6">
		<h3 class="tw-text-primary tw-mb-2">
			Ready to grow your impact?
		</h3>
		<p class="tw-text-base">
			Next steps for you based on your lending history
		</p>
	</div>
	<div class="tw-bg-white tw-rounded tw-shadow tw-p-4 tw-w-full" style="max-width: 800px;">
		<div class="tw-mb-4">
			<!-- Pill above the list -->
			<span
				class="tw-inline-flex tw-items-center tw-gap-2 tw-mb-4 tw-rounded-full tw-bg-eco-green-1
				tw-px-3 tw-py-1 tw-text-[13px] tw-leading-tight"
				title="Your lending reach"
			>
				<GlobeSearch
					class="tw-w-3 tw-h-3 tw-text-brand-700"
					style="vertical-align: middle;"
				/>
				<span class="tw-text-primary" style="font-weight: 621;">
					{{ loanRegions }}/{{ totalRegions }} Regions supported
				</span>
			</span>
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
				<ul class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-2 tw-gap-x-2 tw-w-full">
					<li
						v-for="(region, idx) in props.regions"
						:key="region.name"
						class="tw-flex tw-items-center tw-w-full tw-overflow-hidden tw-min-w-0"
					>
						<RoundCheckbox
							:id="`continent-checkbox-${idx}`"
							:checked="region.hasLoans"
							class="tw-mr-2"
							:readonly="true"
						>
							<span
								class="tw-text-base md:tw-text-lg tw-text-primary tw-block tw-whitespace-nowrap
								tw-truncate sm:tw-whitespace-normal sm:tw-truncate-none"
								style="line-height: 1.25; font-weight: 621;"
								:title="region.name"
							>
								{{ region.name }}
							</span>
						</RoundCheckbox>
					</li>
				</ul>
			</div>
		</div>
		<hr
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

import RoundCheckbox from '#src/components/MyKiva/RoundCheckbox';
import GlobeSearch from '#src/assets/icons/inline/globe-search.svg';

const props = defineProps({
	regions: {
		type: Array,
		default: () => []
	}
});

const totalRegions = props.regions.length;
const loanRegions = props.regions.filter(region => region.hasLoans).length;
</script>
