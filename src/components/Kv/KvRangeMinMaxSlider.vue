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
			:style="sliderStyle"
			@input="onInput"
		>
	</div>
</template>

<script>
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
	},
	data() {
		return {
			minSelected: this.getValidatedValue(this.min),
			maxSelected: this.getValidatedValue(this.max),
		};
	},
	computed: {
		sliderStyle() {
			const rangeDistance = this.rangeMax - this.rangeMin;
			const fromPosition = this.minSelected - this.rangeMin;
			const toPosition = this.maxSelected - this.rangeMin;

			const fromFill = (fromPosition / rangeDistance) * 100;
			const toFill = (toPosition / rangeDistance) * 100;

			return `--from-fill: ${fromFill}%; --to-fill: ${toFill}%;`;
		},
		sliderMin: {
			get() {
				return this.minSelected;
			},
			set(value) {
				const parsed = this.getValidatedValue(parseInt(value, 10) || this.rangeMin);

				// Move max slider if new min selected value is above previous max
				if (parsed > this.maxSelected) {
					this.maxSelected = parsed;
				}

				this.minSelected = parsed;
			}
		},
		sliderMax: {
			get() {
				return this.maxSelected;
			},
			set(value) {
				const parsed = this.getValidatedValue(parseInt(value, 10) || this.rangeMax);

				// Move min slider if new max selected value is below previous min
				if (parsed < this.minSelected) {
					this.minSelected = parsed;
				}

				this.maxSelected = parsed;
			}
		}
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
	--thumb-fill: #4faf4e;
	--thumb-fill-active: #8ccb8c;
	--track-height: 0.375em;
	--track-background: #c3c3c3;
	--track-fill: #8ccb8c;

	position: relative;
	height: var(--thumb-diameter);
}

input[type=range] {
	position: absolute;
	-webkit-appearance: none;
	margin: 0;
	padding: 0;
	width: 100%;
	height: var(--thumb-diameter);
	background: transparent;
}

input[type=range]::-webkit-slider-runnable-track {
	/** Start track common CSS */
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
	/** End track common CSS */
}

input[type=range]::-moz-range-track {
	/** Start track common CSS */
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
	/** End track common CSS */
}

input[type=range]::-ms-track {
	/** Start track common CSS */
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
	/** End track common CSS */

	color: transparent;
}

input[type=range]::-moz-range-progress {
	height: var(--track-height);
	background: var(--track-fill);
}

input[type=range]::-ms-fill-lower {
	height: var(--track-height);
	background: var(--track-fill);
}

input[type=range]::-webkit-slider-thumb {
	/** Start thumb common CSS */
	z-index: 2;
	position: relative;
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	/** End thumb common CSS */

	-webkit-appearance: none;
	margin-top: calc(0.5 * (var(--track-height) - var(--thumb-diameter)));
}

input[type=range]::-moz-range-thumb {
	/** Start thumb common CSS */
	z-index: 2;
	position: relative;
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	/** End thumb common CSS */
}

input[type=range]::-ms-thumb {
	/** Start thumb common CSS */
	z-index: 2;
	position: relative;
	box-sizing: border-box;
	border: 0;
	width: var(--thumb-diameter);
	height: var(--thumb-diameter);
	border-radius: 50%;
	background: var(--thumb-fill);
	transform: scale(1);
	transition: all 100ms ease-in-out;
	/** End thumb common CSS */

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

input[type=range]:hover {
	cursor: pointer;
	overflow: visible;
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
</style>
