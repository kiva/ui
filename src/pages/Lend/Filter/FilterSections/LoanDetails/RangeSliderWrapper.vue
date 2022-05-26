<template>
	<ais-range-input
		:attribute="queryAttribute"
		:precision="precision"
		class="tw-mb-2"
	>
		<div slot-scope="{ currentRefinement, range, refine }">
			<filter-range-slider
				:current-refinement="currentRefinement"
				:inbetween-label="inbetweenLabel"
				:maximum="maximum"
				:maximum-label="maximumLabel"
				:minimum="minimum"
				:minimum-label="minimumLabel"
				:is-slider-setting-minimum="isSliderSettingMinimum"
				:range="range"
				:refine="refine"
				:step="step"
				:title="title"
			/>
		</div>
	</ais-range-input>
</template>

<script>
import { AisRangeInput } from 'vue-instantsearch';
import FilterRangeSlider from '@/pages/Lend/Filter/FilterComponents/FilterRangeSlider';

export default {
	name: 'RangeSliderWrapper',
	components: {
		AisRangeInput,
		FilterRangeSlider
	},
	data() {
		return {
			rangeLabel: '',
			rangeValue: null,
			sliderStyle: '',
		};
	},
	props: {
		inbetweenLabel: {
			type: String,
			default: '',
			required: true
		},
		maximum: {
			type: Number,
			default: null,
			required: true
		},
		maximumLabel: {
			type: String,
			default: '',
		},
		isSliderSettingMinimum: {
			type: Boolean,
			default: false
		},
		minimum: {
			type: Number,
			default: null,
			required: true
		},
		minimumLabel: {
			type: String,
			default: '',
		},
		queryAttribute: {
			type: String,
			default: '',
			required: true
		},
		precision: {
			type: Number,
			default: 0
		},
		title: {
			type: String,
			default: '',
			required: true
		},
		step: {
			type: Number,
			default: 1
		}
	},
};
</script>
