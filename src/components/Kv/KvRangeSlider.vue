<template>
	<div class="kv-range-slider">
		<label
			class="label"
			:class="{ 'label--disabled': disabled }"
			:for="id"
		>
			<slot>A label is required, even if visually hidden with CSS</slot>
		</label>
		<slot name="value"></slot>
		<input
			class="input"
			type="range"
			:id="id"
			:disabled="disabled"
			:min="min"
			:max="max"
			:step="step"
			:value="value"
			:style="sliderStyle"
			@input="onInput($event)"
			@change="onChange($event)"
		>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		id: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		value: {
			type: Number,
			default: 0
		}
	},
	computed: {
		sliderStyle() {
			const sliderLeftColor = '#8ccb8c';
			const sliderRightColor = 'transparent';

			const snapped = Math.round(this.value / this.step) * this.step; // snap to the nearest :step
			const selectedStop = Math.abs(snapped - this.min) / Math.abs(this.max - this.min) * 100;

			const basicStyle = 'background-image: linear-gradient(to right,';
			const stop1 = `${sliderLeftColor} 0%,`;
			const stop2 = `${sliderLeftColor} ${selectedStop}%,`;
			const stop3 = `${sliderRightColor} ${selectedStop}%,`;
			const stop4 = `${sliderRightColor} 100%);`;

			return `${basicStyle}${stop1}${stop2}${stop3}${stop4}`;
		}
	},
	methods: {
		onInput($event) {
			this.$emit('input', parseFloat($event.target.value, 10));
		},
		onChange($event) {
			this.$emit('change', parseFloat($event.target.value, 10));
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$track-height: 0.375em;
$thumb-radius: 0.875em;

@mixin thumb {
	-webkit-appearance: none !important;
	background: #60b75f;
	border: 0.0625em solid #60b75f;
	border-radius: $thumb-radius;
	cursor: pointer;
	height: $thumb-radius;
	transition: 100ms;
	width: $thumb-radius;
}

@mixin track {
	-webkit-appearance: none;
	-moz-apperance: none;
	border-radius: 0.375em;
	margin: 0;
	outline: none;
	padding: 0;
	width: 100%;
	cursor: pointer;
	transition: all 300ms;
}

.kv-range-slider {
	.input {
		@include track;

		@media screen and (-webkit-min-device-pixel-ratio: 0) {
			background-color: $kiva-stroke-gray;
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

		&::-ms-thumb {
			@include thumb;
		}

		&::-ms-track {
			background-color: transparent;
			border-color: transparent;
			border-width: (0.9375em / 2) 0;
			color: transparent;
			height: $track-height;
		}

		&::-ms-fill-lower {
			background-color: $kiva-stroke-gray;
		}

		&::-ms-fill-upper {
			background-color: $kiva-stroke-gray;
		}

		&::-ms-tooltip {
			display: none;
		}

		&:focus {
			outline: 0;

			&::-webkit-slider-thumb {
				@include input-focus();
			}

			&::-moz-range-thumb {
				@include input-focus();
			}

			&::-ms-thumb {
				@include input-focus();
			}
		}

		&:active {
			&::-webkit-slider-thumb {
				background: $kiva-green;
			}

			&::-moz-range-thumb {
				background: $kiva-green;
			}

			&::-ms-thumb {
				background: $kiva-green;
			}
		}

		&[disabled] {
			@include disabled();

			&::-webkit-slider-thumb {
				cursor: default;
			}

			&::-moz-range-thumb {
				cursor: default;
			}

			&::-ms-thumb {
				cursor: default;
			}
		}
	}

	.label {
		display: inline-block;
		font-size: 1em;

		&--disabled {
			@include disabled();
		}
	}
}
</style>
