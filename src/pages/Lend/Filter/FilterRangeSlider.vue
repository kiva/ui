<template>
	<ais-range-input :attribute="queryAttribute" :min="minimumValue" :max="maximumValue">
		<div slot-scope="{ range, refine }">
			<div class="header">
				<span class="title">
					{{ title }}
				</span>
				<span class="range-label">
					({{ rangeLabel }})
				</span>
			</div>
			<input
				:id="id"
				type="range"
				:min="minimum"
				:max="maximum"
				:value="rangeValue"
				:style="sliderStyle"
				@input="onSliderChange(
					refine,
					range,
					$event)"
			>
		</div>
	</ais-range-input>
</template>

<script>
import { AisRangeInput } from 'vue-instantsearch';
import numeral from 'numeral';

export default {
	components: {
		AisRangeInput,
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
		id: {
			type: String,
			default: '',
			required: true
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
	methods: {
		onSliderChange(refine, range, event) {
			let minimumValue = parseInt(range.min, 10);
			let selectedRangeValue = parseInt(event.target.value, 10);

			// maximum value
			if (selectedRangeValue === range.max) {
				this.rangeLabel = this.maximumLabel;

				// set min/max to large values to allow for 'any' values
				minimumValue = -1;
				selectedRangeValue = 1000;

				// eslint-disable-next-line no-param-reassign
				range.min = -1;

				// eslint-disable-next-line no-param-reassign
				range.max = 1000;

			// minimum value
			} else if (selectedRangeValue === range.min) {
				if (this.minimumValueLabel === false) {
					this.rangeLabel = this.minimumLabel;
				} else {
					this.rangeLabel = `${event.target.value}${this.minimumLabel}`;
				}

			// values in between min/max value
			} else {
				this.rangeLabel = `${event.target.value}${this.inbetweenLabel}`;
			}

			this.rangeValue = selectedRangeValue;
			let sliderPositionPercent = '100%';

			if (this.minimumMaximumSwap === true) {
				if (minimumValue === null && selectedRangeValue === null) {
					minimumValue = range.max;
					selectedRangeValue = range.max;
				} else {
					minimumValue = selectedRangeValue;
					selectedRangeValue = range.max;
				}

				sliderPositionPercent = numeral(minimumValue / selectedRangeValue).format('0%');
			} else if (selectedRangeValue !== null) {
				// eslint-disable-next-line max-len
				sliderPositionPercent = numeral(Math.abs(selectedRangeValue - minimumValue) / Math.abs(range.max - minimumValue)).format('0%');
			}

			// set colors of upper/lower range slider
			// eslint-disable-next-line max-len
			this.sliderStyle = `background: linear-gradient(to right, #4faf4e 0%, #4faf4e ${sliderPositionPercent}, #dbdbdb ${sliderPositionPercent}, #dbdbdb 100%)`;

			refine({ min: minimumValue, max: selectedRangeValue });
		},
	},
	created() {
		if (this.minimumMaximumSwap === true) {
			this.rangeLabel = this.minimumLabel;
			this.sliderStyle = 'background: #dbdbdb';
		} else {
			this.rangeLabel = this.maximumLabel;
		}

		this.rangeValue = this.value;
	},
	mounted() {
		this.minimumValue = this.minimum;
		this.maximumValue = this.maximum;
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.range-label {
	color: $kiva-text-light;
}

input[type=range] {
	-webkit-appearance: none;
	-moz-apperance: none;
	background-color: $kiva-green;
	border-radius: rem-calc(6);
	height: rem-calc(6);
	outline: none;
	width: 75%;
}

input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none !important;
	background-color: $kiva-green;
	border: rem-calc(1) solid $kiva-green;
	border-radius: 50%;
	cursor: pointer;
	height: rem-calc(15);
	transition: 100ms;
	width: rem-calc(15);
}

input[type=range]::-moz-range-track {
	border-color: #dbdbdb;
	border-radius: rem-calc(6);
	cursor: pointer;
	height: rem-calc(6);
	outline: none !important;
}

input[type=range]::-moz-range-thumb {
	background-color: $kiva-green;
	border: 0;
	cursor: pointer;
	height: rem-calc(15);
	width: rem-calc(15);
}

input[type=range]::-moz-focus-outer {
	border: 0;
}

input[type=range]::-moz-range-progress {
	background-color: $kiva-green;
	border: rem-calc(1) solid $kiva-green;
}
</style>
