<template>
	<div class="kv-progress-circle">
		<!-- visually hidden, here for accessibility purposes -->
		<progress class="kv-progress-circle__native-el" max="100" :value="value"></progress>

		<div class="kv-progress-circle__wrapper">
			<svg
				class="kv-progress-circle__svg"

				xmlns="http://www.w3.org/2000/svg"
				:viewBox="`0 0 ${radius * 2} ${radius * 2}`"
			>
				<!-- ring background -->
				<circle
					class="kv-progress-circle__ring-background"
					:stroke-width="strokeWidth"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>

				<!-- ring foreground -->
				<circle
					class="kv-progress-circle__ring-foreground"
					:stroke-dasharray="circumference + ' ' + circumference"
					:style="`stroke-dashoffset: ${strokeDashoffset}`"
					:stroke-width="strokeWidth"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>

				<template v-if="showNumber">
					<defs>
						<!-- path the text should follow -->
						<path
							:d="`
							M ${radius}, ${radius}
							m -${radius}, 0
							a ${radius},${radius} 0 1,1 ${radius * 2},0
							a ${radius},${radius} 0 1,1 -${radius * 2},0
						`"
							class="kv-progress-circle__ring-text-path"
							id="text_circle"
							:style="textCircleTransform"
						/>

						<!-- flipped path -->
						<path
							:d="`
							M ${radius}, ${radius}
							m -${radius}, 0
							a ${radius},${radius} 0 1,0 ${radius * 2},0
							a ${radius},${radius} 0 1,0 -${radius * 2},0
						`"
							class="kv-progress-circle__ring-text-path"
							id="text_circle_flipped"
							:style="textCircleTransform"
						/>
					</defs>

					<!-- text background which acts as a stroke -->
					<text
						class="kv-progress-circle__ring-text-backdrop"
						:dy="textDy"
						:dx="textDx"
						:font-size="fontSize"
					>
						<textPath
							:xlink:href="`#text_circle${flipText ? '_flipped' : ''}`"
						>
							{{ value }}%
						</textPath>
					</text>

					<!-- text foreground -->
					<text
						class="kv-progress-circle__ring-text"
						:dy="textDy"
						:dx="textDx"
						:font-size="fontSize"
					>
						<textPath
							:xlink:href="`#text_circle${flipText ? '_flipped' : ''}`"
						>
							{{ value }}%
						</textPath>
					</text>
				</template>
			</svg>
		</div>
	</div>
</template>

<script>

export default {
	name: 'KvProgressCircle',
	props: {
		value: {
			type: Number,
			required: true,
			validator(val) {
				return val >= 0 && val <= 100;
			}
		},
		/**
		 * Stroke width as a percent of the circle
		* */
		strokeWidth: {
			default: 8,
			type: Number
		},
		/**
		 * Whether to show the value as a number
		* */
		showNumber: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			radius: 100,
		};
	},
	computed: {
		fontSize() {
			return this.strokeWidth * 3;
		},
		normalizedRadius() {
			return this.radius - (this.strokeWidth / 2);
		},
		circumference() {
			return this.normalizedRadius * 2 * Math.PI;
		},
		strokeDashoffset() {
			return this.circumference - (this.value / 100) * this.circumference;
		},
		textCircleTransform() {
			const offset = -90;
			return { transform: `rotate(${offset}deg)` };
		},
		flipText() {
			return this.value > 75 || this.value < 25;
		},
		textDx() {
			if (this.flipText) {
				return this.circumference - (this.value / 100) * this.circumference;
			}
			return (this.value / 100) * this.circumference;
		},
		textDy() {
			if (this.flipText) {
				return 0;
			}
			return this.fontSize * 0.625;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-circle {
	$foreground-color: $kiva-accent-blue;
	$background-color: $kiva-bg-lightgray;

	&__wrapper {
		width: 100%;
	}

	&__native-el {
		@include visually-hidden();
	}

	&__svg {
		display: block;
		overflow: visible;
	}

	&__ring-text-path {
		fill: transparent;
		transform-origin: center;
	}

	&__ring-text,
	&__ring-text-backdrop {
		font-family: $body-font-family;
		font-weight: 900;
		text-anchor: start;
		letter-spacing: 0.1em;
	}

	&__ring-text {
		fill: $kiva-accent-blue;
		fill: var(--kv-progress-circle-foreground-color, $foreground-color);
	}

	&__ring-text-backdrop {
		paint-order: stroke;
		fill: #fff;
		stroke: #fff;
		stroke-width: 0.675em;
		stroke-linecap: butt;
		stroke-linejoin: round;
	}

	&__ring-foreground {
		fill: transparent;
		transform: rotate(90deg);
		transform-origin: center center;
		stroke: $kiva-accent-blue;
		stroke: var(--kv-progress-circle-foreground-color, $foreground-color);
		stroke-linecap: round;
		transition: stroke-dashoffset 0.125s;
	}

	&__ring-background {
		fill: transparent;
		stroke: $kiva-bg-lightgray;
		stroke: var(--kv-progress-circle-background-color, $background-color);
	}
}

// Sadly firefox doesn't support transforms on SVG in the same way that Chrome and Safari do.
// Hide the percent text in FF for now since it appears broken otherwise.
@supports (-moz-appearance:none) {
	.kv-progress-circle__ring-text,
	.kv-progress-circle__ring-text-backdrop {
		display: none;
	}
}
</style>
