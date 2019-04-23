<template>
	<ais-range-input
		:attribute="queryAttribute"
		:class-names="{
			'ais-RangeInput': 'range-input',
		}"
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
				:title="title"
			/>
		</div>
	</ais-range-input>
</template>

<script>
import { AisRangeInput } from 'vue-instantsearch';
import FilterRangeSlider from '@/pages/Lend/Filter/FilterComponents/FilterRangeSlider';

export default {
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
		title: {
			type: String,
			default: '',
			required: true
		},
	},
};
</script>
<style lang="scss" scoped>
@import 'settings';

.ais-RangeInput {
	margin-bottom: rem-calc(15);
}
</style>
