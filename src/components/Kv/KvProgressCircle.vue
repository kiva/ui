<template>
	<div>
		<!-- visually hidden, here for accessibility purposes -->
		<progress
			class="tw-sr-only"
			max="100"
			:value="value"
		>
		</progress>

		<div class="tw-w-full">
			<svg
				class="tw-block tw-overflow-visible"

				xmlns="http://www.w3.org/2000/svg"
				:viewBox="`0 0 ${radius * 2} ${radius * 2}`"
			>
				<!-- ring background -->
				<circle
					class="tw-origin-center tw-text-primary-inverse tw-stroke-current"
					:stroke-dasharray="circumference + ' ' + circumference"
					style="fill: transparent;
						stroke-linecap: round;
						transition: stroke-dashoffset 0.125s;"
					:style="{
						'strokeDashoffset': backgroundStrokeDashoffset,
						'transform': circleTransform
					}"
					:stroke-width="strokeWidth"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>

				<!-- ring foreground -->
				<circle
					class="tw-origin-center tw-text-brand tw-stroke-current"
					:stroke-dasharray="circumference + ' ' + circumference"
					style="fill: transparent;
						stroke-linecap: round;
						transition: stroke-dashoffset 0.125s;"
					:style="{
						'strokeDashoffset': strokeDashoffset,
						'transform': circleTransform
					}"
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
							class="tw-text-transparent tw-fill-current tw-origin-center"
							id="text_circle"
							:style="{
								'transform': `${textCircleTransform}`
							}"
						/>

						<!-- flipped path -->
						<path
							:d="`
							M ${radius}, ${radius}
							m -${radius}, 0
							a ${radius},${radius} 0 1,0 ${radius * 2},0
							a ${radius},${radius} 0 1,0 -${radius * 2},0
						`"
							class="tw-text-transparent tw-fill-current tw-origin-center"
							id="text_circle_flipped"
							:style="{
								'transform': `${textCircleTransform}`
							}"
						/>
					</defs>

					<!-- text background which acts as a stroke -->
					<text
						class="kv-progress-circle__ring-text-backdrop tw-text-white tw-fill-current tw-stroke-current"
						style="paint-order: stroke;
							stroke-width: 0.675em;
							stroke-linecap: butt;
							stroke-linejoin: round;
							font-weight: 900;
							text-anchor: start;
							letter-spacing: 0.1em;"
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
						class="kv-progress-circle__ring-text tw-text-brand tw-fill-current tw-stroke-current"
						style="font-weight: 900;
							text-anchor: start;
							letter-spacing: 0.1em;"
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
		 * Create an arc instead of a full circle. A percent.
		* */
		arcScale: {
			type: Number,
			default: 1,
		},
		/**
		 * Degrees to rotate the circle, used in tandem with arcScale.
		* */
		rotate: {
			type: Number,
			default: 0,
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
		},
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
			return this.circumference - (this.value / 100) * this.circumference * this.arcScale;
		},
		backgroundStrokeDashoffset() {
			return this.circumference - 1 * this.circumference * this.arcScale;
		},
		circleTransform() {
			const offset = 90;
			return `rotate(${offset + this.rotate}deg)`;
		},
		textCircleTransform() {
			const offset = -90;
			return `rotate(${offset + this.rotate}deg)`;
		},
		flipText() {
			return this.value > 75 || this.value < 25;
		},
		textDx() {
			if (this.flipText) {
				return this.circumference - (this.value / 100) * this.circumference * this.arcScale;
			}
			return (this.value / 100) * this.circumference * this.arcScale;
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

// Sadly firefox doesn't support transforms on SVG in the same way that Chrome and Safari do.
// Hide the percent text in FF for now since it appears broken otherwise.
@supports (-moz-appearance:none) {
	.kv-progress-circle__ring-text,
	.kv-progress-circle__ring-text-backdrop {
		display: none;
	}
}
</style>
