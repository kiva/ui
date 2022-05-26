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
	name: 'KvRangeSlider',
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
			const snapped = Math.round(this.value / this.step) * this.step; // snap to the nearest :step
			const percentFull = (Math.abs(snapped - this.min) / Math.abs(this.max - this.min)) * 100;
			return `--percent-full: ${percentFull}%`;
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

$thumb-diameter: 1.25em;
$thumb-fill: $input-checked-color;
$thumb-fill-active: $input-active-color;
$track-height: 0.375em;
$track-background: $input-border-color;
$track-fill: $input-checked-color;

@mixin thumb() {
	box-sizing: border-box;
	border: 0;
	width: $thumb-diameter;
	height: $thumb-diameter;
	border-radius: 50%;
	background: $thumb-fill;
	transform: scale(1);
	transition: all 100ms ease-in-out;
}

@mixin track() {
	box-sizing: border-box;
	width: 100%;
	height: $track-height;
	border: 0;
	outline: 0;
	background:
		$track-background
		linear-gradient(
			to right,
			$track-fill 0%,
			$track-fill var(--percent-full),
			$track-background var(--percent-full),
			$track-background 100%
		);
	border-radius: 1.5em;
}

@mixin fill() {
	height: $track-height;
	background: $track-fill;
}

.kv-range-slider {
	.input {
		--percent-full: 0%;

		-webkit-appearance: none;
		margin: 0;
		padding: 0;
		width: 100%;
		height: $thumb-diameter;
		background: transparent;

		&::-webkit-slider-runnable-track {
			@include track();
		}

		&::-moz-range-track {
			@include track();
		}

		&::-ms-track {
			@include track();

			color: transparent;
		}

		&::-moz-range-progress {
			@include fill();
		}

		&::-ms-fill-lower {
			@include fill();
		}

		&::-webkit-slider-thumb {
			@include thumb();

			-webkit-appearance: none;
			margin-top: 0.5 * ($track-height - $thumb-diameter);
		}

		&::-moz-range-thumb {
			@include thumb();
		}

		&::-ms-thumb {
			@include thumb();

			margin-top: 0;
		}

		&::-ms-tooltip {
			display: none;
		}

		&:active {
			&::-webkit-slider-thumb {
				transform: scale(1);
				background: $thumb-fill-active;
			}

			&::-moz-range-thumb {
				transform: scale(1);
				background: $thumb-fill-active;
			}

			&::-ms-thumb {
				transform: scale(1);
				background: $thumb-fill-active;
			}
		}

		&:focus {
			outline: 0;

			&::-moz-focus-outer {
				border: 0;
			}

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

		&:hover:not([disabled]) {
			cursor: pointer;
			overflow: visible;

			&::-webkit-slider-thumb {
				transform: scale(1.15);
			}

			&::-moz-range-thumb {
				transform: scale(1.15);
			}

			&::-ms-thumb {
				transform: scale(1.15);
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
