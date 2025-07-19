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
				class="tw-inline-flex tw-items-center tw-justify-center tw-gap-[10px] tw-mb-4"
				title="Your lending reach"
				style="
					padding: 8px 12px;
					border-radius: 12px;
					background: #EDF4F1;
					color: #000;
					font-family: 'Kiva Post Grot', sans-serif;
					font-size: 14px;
					font-weight: 621;
					line-height: 1;
				"
			>
				<GlobeSearch style="vertical-align: middle;" />
				{{ loanRegions }}/{{ totalRegions }} Regions supported
			</span>
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
				<ul class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-2 tw-gap-x-4 tw-w-full">
					<li
						v-for="(region, idx) in props.regions"
						:key="region.name"
						class="tw-flex tw-items-center"
					>
						<RoundCheckbox
							:id="`continent-checkbox-${idx}`"
							:checked="region.hasLoans"
							class="tw-mr-2"
							:readonly="true"
							change="() => {}"
						>
							<span
								class="tw-font-bold tw-text-base md:tw-text-lg tw-whitespace-nowrap"
								style="
									color: #000;
									font-family: 'Kiva Post Grot', sans-serif;
									font-weight: 621;
									line-height: 1.25;
								"
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
				background: var(--Brand-Greens-Green-2, #78C79F);
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
