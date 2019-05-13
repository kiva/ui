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
		<div
			class="slider"
			v-if="range.min !== range.max"
		>
			<input
				type="range"
				:min="sliderMinimum"
				:max="sliderMaximum"
				:value="sliderValue"
				:style="sliderStyle"
				@input="onSliderChange(refine, range, $event)"
			>
		</div>
		<div class="slider-unavailable" v-else>No refinements available</div>
	</div>
</template>

<script>
import numeral from 'numeral';

export default {
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
		sliderStyle() {
			const sliderLeftColor = '#8ccb8c';
			const sliderRightColor = '#dbdbdb';

			const selectedStop = this.isSliderSettingMinimum
				? (this.sliderValue / this.sliderMaximum)
				: (Math.abs(this.sliderValue - this.sliderMinimum) / Math.abs(this.sliderMaximum - this.sliderMinimum));

			const basicStyle = 'background-image: -webkit-linear-gradient(left,';
			const stop1 = `${sliderLeftColor} 0%,`;
			const stop2 = `${sliderLeftColor} ${numeral(selectedStop).format('0%')},`;
			const stop3 = `${sliderRightColor} ${numeral(selectedStop).format('0%')},`;
			const stop4 = `${sliderRightColor} 100%);`;

			return `${basicStyle}${stop1}${stop2}${stop3}${stop4}`;
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
		onSliderChange(refine, range, event) {
			const sliderValue = parseInt(event.target.value, 10);

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

$track-height: rem-calc(6);
$thumb-radius: rem-calc(14);

@mixin thumb {
	-webkit-appearance: none !important;
	background: #60b75f;
	border: rem-calc(1) solid #60b75f;
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

	.title {
		color: $charcoal;
	}

	.range-label {
		color: #808080;
	}

	.slider {
		width: rem-calc(200);

		input[type='range'] {
			@include track;

			@media screen and (-webkit-min-device-pixel-ratio: 0) {
				background-color: #8ccb8c;
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
				background-color: #8ccb8c;
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

	.slider-unavailable {
		color: #808080;
	}
}
</style>
