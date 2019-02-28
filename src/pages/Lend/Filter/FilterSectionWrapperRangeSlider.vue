<template>
	<ais-range-input
		:attribute="queryAttribute"
		:min="minimumValue"
		:max="maximumValue"
		:class-names="{
			'ais-RangeInput': 'range-input',
		}"
	>
		<div slot-scope="{ currentRefinement, range, refine }">
			<filter-range-slider
				:current-refinement="currentRefinement"
				:filter-menu-open="filterMenuOpen"
				:inbetween-label="inbetweenLabel"
				:maximum="maximum"
				:maximum-label="maximumLabel"
				:maximum-value-label="maximumValueLabel"
				:minimum="minimum"
				:minimum-label="minimumLabel"
				:minimum-maximum-swap="minimumMaximumSwap"
				:minimum-value-label="minimumValueLabel"
				:query-attribute="queryAttribute"
				:range="range"
				:refine="refine"
				:title="title"
				:value="value"
			/>
		</div>
	</ais-range-input>
</template>

<script>
import { AisRangeInput } from 'vue-instantsearch';
import FilterRangeSlider from '@/pages/Lend/Filter/FilterRangeSlider';

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
			minimumValue: -1,
			maximumValue: 1000,
		};
	},
	props: {
		filterMenuOpen: {
			type: Boolean,
			default: false,
		},
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
			required: true
		},
		maximumValueLabel: {
			type: Boolean,
			default: true
		},
		minimumMaximumSwap: {
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
			required: true
		},
		minimumValueLabel: {
			type: Boolean,
			default: true
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
		value: {
			type: Number,
			default: null,
			required: true
		},
	},
	mounted() {
		this.minimumValue = this.minimum;
		this.maximumValue = this.maximum;
	}
};
</script>
<style lang="scss" scoped>
@import 'settings';

.ais-RangeInput {
	margin-bottom: rem-calc(15);
}
</style>
