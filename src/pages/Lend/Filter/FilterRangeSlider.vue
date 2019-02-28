<template>
	<div>
		<div class="header">
			<span class="title">
				{{ title }}
			</span>
			<span class="range-label">
				({{ rangeLabel }})
			</span>
		</div>
		<div class="slider">
			<input
				type="range"
				:min="minimum"
				:max="maximum"
				:value="sliderValue"
				:style="sliderStyle"
				@input="onSliderChange(
					refine,
					range,
					$event)">

			<div class="hide">
				<!-- TODO: create new component to replace this hidden element computed property -->
				{{ sliderPosition }}
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';

export default {
	data() {
		return {
			sliderValue: this.value,
		};
	},
	props: {
		currentRefinement: {
			type: Object,
			required: true
		},
		filterMenuOpen: {
			type: Boolean,
			default: false,
		},
		inbetweenLabel: {
			type: String,
			required: true
		},
		maximum: {
			type: Number,
			required: true
		},
		maximumLabel: {
			type: String,
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
			required: true
		},
		minimumLabel: {
			type: String,
			required: true
		},
		minimumValueLabel: {
			type: Boolean,
			default: true
		},
		queryAttribute: {
			type: String,
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
		value: {
			type: Number,
			required: true
		},
	},
	computed: {
		// set label for slider
		rangeLabel() {
			let value = this.maximumLabel;

			if (this.sliderValue === this.maximum) {
				value = this.maximumLabel;

			// minimum value
			} else if (this.sliderValue === this.minimum) {
				if (this.minimumValueLabel === false) {
					value = this.minimumLabel;
				} else {
					value = `${this.sliderValue}${this.minimumLabel}`;
				}

			// values in between min/max value
			} else {
				value = `${this.sliderValue}${this.inbetweenLabel}`;
			}

			return value;
		},

		// set slider position only when filter menu is closed
		// eslint-disable-next-line max-len
		// NOTE: The computed property, slidePosition(), exists solely to allow the setting of the position of the slider when a refinement is deleted
		sliderPosition() {
			//	eslint-disable-next-line max-len
			if (this.filterMenuOpen === false && this.currentRefinement.min === null && this.currentRefinement.max === null) {
				this.setSliderValue();
			}

			return '';
		},

		// set style for slider
		sliderStyle() {
			const sliderLeftColor = '#4faf4e';
			const sliderRightColor = '#dbdbdb';

			const selectedStop = this.minimumMaximumSwap === true
				? (this.sliderValue / this.maximum)
				: (Math.abs(this.sliderValue - this.minimum) / Math.abs(this.maximum - this.minimum));

			const basicStyle = 'background-image: -webkit-linear-gradient(left,';
			const stop1 = `${sliderLeftColor} 0%,`;
			const stop2 = `${sliderLeftColor} ${numeral(selectedStop).format('0%')},`;
			const stop3 = `${sliderRightColor} ${numeral(selectedStop).format('0%')},`;
			const stop4 = `${sliderRightColor} 100%);`;

			return `${basicStyle}${stop1}${stop2}${stop3}${stop4}`;
		}
	},
	methods: {
		onSliderChange(refine, range, event) {
			const sliderValue = parseInt(event.target.value, 10);
			let refineMinimum = this.minimumMaximumSwap === true ? sliderValue : parseInt(this.minimum, 10);
			let refineMaximum = this.minimumMaximumSwap === true ? parseInt(this.maximum, 10) : sliderValue;

			// maximum value
			// eslint-disable-next-line max-len
			if ((this.minimumMaximumSwap === false && sliderValue === range.max) || (this.minimumMaximumSwap === true && sliderValue === range.min)) {
				// set min/max to large values to allow for 'any' values beyond loan details min/max
				refineMinimum = -1;
				refineMaximum = 1000;

				// eslint-disable-next-line no-param-reassign
				range.min = refineMinimum;

				// eslint-disable-next-line no-param-reassign
				range.max = refineMaximum;
			}

			refine({ min: refineMinimum, max: refineMaximum });

			// set label of slider based on current position
			this.sliderValue = sliderValue;
		},
		setSliderValue() {
			this.sliderValue = this.value;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$track-height: rem-calc(5);
$thumb-radius: rem-calc(15);

@mixin thumb {
	-webkit-appearance: none !important;
	background: $kiva-green;
	border: rem-calc(1) solid $kiva-green;
	border-radius: $thumb-radius;
	cursor: pointer;
	height: $thumb-radius;
	transition: 100ms;
	width: $thumb-radius;
}

@mixin track {
	-webkit-appearance: none;
	-moz-apperance: none;
	border-radius: rem-calc(6);
	margin: 0;
	outline: none;
	padding: 0;
	width: 100%;
	cursor: pointer;
	transition: all 300ms;
}

.range-input {
	margin-bottom: rem-calc(3);

	.range-label {
		color: $kiva-text-light;
	}

	.slider {
		width: 75%;

		input[type='range'] {
			@include track;

			@media screen and (-webkit-min-device-pixel-ratio: 0) {
				background-color: $kiva-green;
				height: $track-height;
			}

			@supports (-ms-ime-align:auto) {
				background-color: transparent;
				height: $track-height * 4;
			}

			&::-moz-focus-outer {
				border: 0;
			}

			&::-webkit-slider-thumb {
				@include thumb;
			}

			&::-moz-range-thumb {
				@include thumb;
			}

			&::-ms-track {
				background-color: transparent;
				border-color: transparent;
				border-width: (15px / 2) 0;
				color: transparent;
				height: $track-height;
			}

			&::-ms-thumb {
				@include thumb;
			}

			&::-ms-fill-lower {
				background-color: #4faf4e;
			}

			&::-ms-fill-upper {
				background-color: #dbdbdb;
			}

			&::-ms-tooltip {
				display: none;
			}

			&:focus {
				outline: 0;
			}
		}
	}
}
</style>
