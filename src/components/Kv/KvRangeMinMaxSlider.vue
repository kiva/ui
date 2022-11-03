<template>
	<div class="kv-range-min-max-slider">
		<input
			type="range"
			:min="rangeMin"
			:max="rangeMax"
			:step="step"
			v-model="sliderMin"
			@input="onInput"
		>
		<input
			type="range"
			:min="rangeMin"
			:max="rangeMax"
			:step="step"
			v-model="sliderMax"
			:style="sliderMaxStyle"
			@input="onInput"
		>
		<div id="range-min-tooltip" :style="sliderMinTooltipStyle">
			{{ getDisplayedNumber(minSelected, isPercentage, displayedUnit, step) }}
		</div>
		<div id="range-max-tooltip" :style="sliderMaxTooltipStyle">
			{{ getDisplayedNumber(maxSelected, isPercentage, displayedUnit, step) }}
		</div>
	</div>
</template>

<script>
import { isNumber } from '@/util/numberUtils';
import { getDisplayedNumber } from '@/util/loanSearch/filterUtils';

export default {
	name: 'KvRangeMinMaxSlider',
	props: {
		rangeMin: {
			type: Number,
			default: 0
		},
		rangeMax: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		isPercentage: {
			type: Boolean,
			default: false
		},
		displayedUnit: {
			type: String,
			default: undefined
		},
	},
	data() {
		return {
			minSelected: this.getValidatedValue(this.min),
			maxSelected: this.getValidatedValue(this.max),
			getDisplayedNumber,
		};
	},
	computed: {
		sliderStyle() {
			const rangeDistance = this.rangeMax - this.rangeMin;
			const fromPosition = this.minSelected - this.rangeMin;
			const toPosition = this.maxSelected - this.rangeMin;

			const fromFill = (fromPosition / rangeDistance) * 100;
			const toFill = (toPosition / rangeDistance) * 100;

			const labelAdjustment = this.displayedUnit ? 22 : 25;

			const fromLeft = `calc(${fromFill}% + ${10 - (fromFill * 0.2)}px - ${labelAdjustment}px)`;
			const toLeft = `calc(${toFill}% + ${10 - (toFill * 0.2)}px - ${labelAdjustment}px)`;

			return {
				fromFill,
				fromLeft,
				toFill,
				toLeft,
			};
		},
		sliderMaxStyle() {
			return `--from-fill: ${this.sliderStyle.fromFill}%; --to-fill: ${this.sliderStyle.toFill}%;`;
		},
		sliderMinTooltipStyle() {
			return `--from-left: ${this.sliderStyle.fromLeft};`;
		},
		sliderMaxTooltipStyle() {
			return `--to-left: ${this.sliderStyle.toLeft};`;
		},
		sliderMin: {
			get() {
				return this.minSelected;
			},
			set(value) {
				const parsed = +value;

				const validated = isNumber(parsed) ? this.getValidatedValue(parsed) : this.rangeMin;

				// Move max slider if new min selected value is above previous max
				if (validated > this.maxSelected) {
					this.maxSelected = validated;
				}

				this.minSelected = validated;
			}
		},
		sliderMax: {
			get() {
				return this.maxSelected;
			},
			set(value) {
				const parsed = +value;

				const validated = isNumber(parsed) ? this.getValidatedValue(parsed) : this.rangeMax;

				// Move min slider if new max selected value is below previous min
				if (validated < this.minSelected) {
					this.minSelected = validated;
				}

				this.maxSelected = validated;
			}
		},
	},
	methods: {
		getValidatedValue(value) {
			// Ensure selected value doesn't go outside range
			if (value > this.rangeMax) {
				return this.rangeMax;
			}
			if (value < this.rangeMin) {
				return this.rangeMin;
			}
			return value;
		},
		onInput() {
			this.$emit('change', { min: this.minSelected, max: this.maxSelected });
		},
	},
	watch: {
		min(value) {
			this.sliderMin = value;
		},
		max(value) {
			this.sliderMax = value;
		},
	}
};
</script>

<style lang="postcss" scoped>
.kv-range-min-max-slider {
	--thumb-diameter: 1.25em;
	--thumb-fill: rgb(var(--bg-action));
	--thumb-fill-active: rgb(var(--bg-action-highlight));
	--track-height: 0.375em;
	--track-background: rgb(var(--bg-tertiary));
	--track-fill: rgb(var(--bg-action));

	position: relative;
	height: calc(var(--thumb-diameter) + 24px);
}

input[type=range] {
	position: absolute;
	-webkit-appearance: none;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 0;
	pointer-events: none;
	background: transparent;
	top: 14px;
}

input[type=range]::-webkit-slider-runnable-track {
	/** Track common CSS */
	box-sizing: border-box;
	width: 100%;
	height: var(--track-height);
	border: 0;
	outline: 0;
	background:
		var(--track-background)
		linear-gradient(
			to right,
			var(--track-background) 0%,
			var(--track-background) var(--from-fill),
			var(--track-fill) var(--from-fill),
			var(--track-fill) var(--to-fill),
			var(--track-background) var(--to-fill),
			var(--track-background) 100%
		);
	border-radius: 1.5em;
}

input[type=range]::-moz-range-track {
	/** Track common CSS */
	box-sizing: border-box;
	width: 100%;
	height: var(--track-height);
	border: 0;
	outline: 0;
	background:
		var(--track-background)
		linear-gradient(
			to right,
			var(--track-background) 0%,
			var(--track-background) var(--from-fill),
			var(--track-fill) var(--from-fill),
			var(--track-fill) var(--to-fill),
			var(--track-background) var(--to-fill),
			var(--track-background) 100%
		);
	border-radius: 1.5em;
}

input[type=range]::-ms-track {
	/** Track common CSS */
	box-sizing: border-box;
	width: 100%;
	height: var(--track-height);
	border: 0;
	outline: 0;
	background:
		var(--track-background)
		linear-gradient(
			to right,
			var(--track-background) 0%,
			var(--track-background) var(--from-fill),
			var(--track-fill) var(--from-fill),
			var(--track-fill) var(--to-fill),
			var(--track-background) var(--to-fill),
			var(--track-background) 100%
		);
	border-radius: 1.5em;

	/** MS-specific CSS */
	color: transparent;
}

input[type=range]::-ms-fill-lower {
	height: var(--track-height);
	background: var(--track-fill);
}

input[type=range]:first-of-type {
	z-index: 1;
}

input[type=range]::-webkit-slider-thumb {
	/** Thumb common CSS */
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	pointer-events: all;

	/** Webkit-specific CSS */
	-webkit-appearance: none;
	margin-top: calc(0.5 * (var(--track-height) - var(--thumb-diameter)));
}

input[type=range]::-moz-range-thumb {
	/** Thumb common CSS */
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	pointer-events: all;
}

input[type=range]::-ms-thumb {
	/** Thumb common CSS */
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	pointer-events: all;

	/** MS-specific CSS */
	margin-top: 0;
}

input[type=range]::-ms-tooltip {
	display: none;
}

input[type=range]:active::-webkit-slider-thumb {
	transform: scale(1);
	background: var(--thumb-fill-active);
}

input[type=range]:active::-moz-range-thumb {
	transform: scale(1);
	background: var(--thumb-fill-active);
}

input[type=range]:active::-ms-thumb {
	transform: scale(1);
	background: var(--thumb-fill-active);
}

input[type=range]:focus {
	outline: 0;
}

input[type=range]:hover {
	cursor: pointer;
	overflow: visible;
}

input[type=range]:focus::-moz-focus-outer {
	border: 0;
}

input[type=range]:focus::-webkit-slider-thumb {
	outline: 0;
}

input[type=range]:focus::-moz-range-thumb {
	outline: 0;
}

input[type=range]:focus::-ms-thumb {
	outline: 0;
}

input[type=range]:hover::-webkit-slider-thumb {
	transform: scale(1.15);
}

input[type=range]:hover::-moz-range-thumb {
	transform: scale(1.15);
}

input[type=range]:hover::-ms-thumb {
	transform: scale(1.15);
}

#range-min-tooltip, #range-max-tooltip {
	@apply tw-absolute tw-text-center tw-text-small;
	top: 26px;
	height: 24px;
    width: 50px;
}

#range-min-tooltip {
	left: var(--from-left);
}

#range-max-tooltip {
	left: var(--to-left);
}
</style>
