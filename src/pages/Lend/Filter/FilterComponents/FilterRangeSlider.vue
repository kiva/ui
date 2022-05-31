<template>
	<div>
		<kv-range-slider
			v-if="range.min !== range.max"
			:id="title|changeCase('paramCase')"
			:min="sliderMinimum"
			:max="sliderMaximum"
			:step="step"
			:value="sliderValue"
			@input="onSliderChange(refine, range, $event)"
		>
			<span class="title">
				{{ title }}
			</span>
			<template #value>
				<span class="range-label">
					({{ rangeLabel }})
				</span>
			</template>
		</kv-range-slider>

		<div v-else>
			<div class="header">
				<span class="title">
					{{ title }}
				</span>
				<span class="range-label">
					({{ rangeLabel }})
				</span>
				<div class="slider-unavailable">
					No refinements available
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvRangeSlider from '@/components/Kv/KvRangeSlider';

export default {
	name: 'FilterRangeSlider',
	components: {
		KvRangeSlider
	},
	props: {
		currentRefinement: {
			type: Object,
			required: true
		},
		range: {
			type: Object,
			required: true
		},
		refine: {
			type: Function,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		isSliderSettingMinimum: {
			type: Boolean,
			default: false
		},
		minimum: {
			type: Number,
			required: true,
		},
		maximum: {
			type: Number,
			required: true,
		},
		minimumLabel: {
			type: String,
			default: '',
		},
		maximumLabel: {
			type: String,
			default: '',
		},
		inbetweenLabel: {
			type: String,
			required: true
		},
		step: {
			type: Number,
			default: 1
		},
	},
	computed: {
		defaultRangeLabel() {
			return `${this.sliderValue}${this.inbetweenLabel}`;
		},
		rangeLabel() {
			/* eslint-disable */
			// TODO: Fix lint rule
			if (this.sliderValue <= this.sliderMinimum) {
				return this.isSliderSettingMinimum
					? 'All'
					: this.minimumLabel || this.defaultRangeLabel;
			} else if (this.sliderValue >= this.sliderMaximum) {
				return this.isSliderSettingMinimum
					? this.maximumLabel || this.defaultRangeLabel
					: 'All';
			}
			return this.defaultRangeLabel;
			/* eslint-enable */
		},
		sliderMinimum() {
			return Math.max(this.minimum, this.range.min);
		},
		sliderMaximum() {
			return Math.min(this.maximum, this.range.max);
		},
		sliderValue() {
			if (this.isSliderSettingMinimum) {
				return this.currentRefinement.min !== null ? this.currentRefinement.min : this.minimum;
			}
			return this.currentRefinement.max !== null ? this.currentRefinement.max : this.maximum;
		},
	},

	methods: {
		onSliderChange(refine, range, sliderValue) {
			if (
				(this.isSliderSettingMinimum === false && sliderValue === this.sliderMaximum)
				|| (this.isSliderSettingMinimum === true && sliderValue === this.sliderMinimum)
			) {
				refine({});
			}
			refine({
				min: this.isSliderSettingMinimum === true ? sliderValue : undefined,
				max: this.isSliderSettingMinimum === true ? undefined : sliderValue,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.range-input {
	margin-bottom: rem-calc(3);

	.title {
		color: $charcoal;
	}

	.range-label {
		color: #808080;
	}

	.slider-unavailable {
		color: #808080;
	}
}
</style>
