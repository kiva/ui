<template>
	<div class="kv-progress-circle">
		<!-- visually hidden, here for accessibility purposes -->
		<progress class="kv-progress-circle__native-el" max="100" :value="progress"></progress>

		<div class="kv-progress-circle__wrapper">
			<svg
				class="kv-progress-circle__svg"

				xmlns="http://www.w3.org/2000/svg"
				:viewBox="`0 0 ${radius * 2} ${radius * 2}`"
			>
				<!-- progress ring background -->
				<circle
					class="kv-progress-circle__ring-background"
					:stroke-width="stroke"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>

				<!-- progress ring foreground -->
				<circle
					class="kv-progress-circle__ring-foreground"
					:stroke-dasharray="circumference + ' ' + circumference"
					:style="`stroke-dashoffset: ${strokeDashoffset}`"
					:stroke-width="stroke"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>

				<!-- text -->
				<defs>
					<!-- path the text should follow -->
					<path
						:d="`
							M ${radius}, ${radius}
							m -${radius}, 0
							a ${radius},${radius} 0 1,1 ${radius * 2},0
							a ${radius},${radius} 0 1,1 -${radius * 2},0
						`"
						id="text_circle"
						fill="transparent"
						:transform="textCircleTransform"
					/>

					<!-- flipped path -->
					<path
						:d="`
							M ${radius}, ${radius}
							m -${radius}, 0
							a ${radius},${radius} 0 1,0 ${radius * 2},0
							a ${radius},${radius} 0 1,0 -${radius * 2},0
						`"
						id="text_circle_flipped"
						fill="transparent"
						:transform="textCircleTransform"
					/>
				</defs>
				<!-- TODO dy should be related to font size and maybe normalizedradius -->
				<text
					class="kv-progress-circle__ring-text"
					:dy="-5"
				>
					<textPath :xlink:href="`#text_circle${progress > 75 || progress < 25 ? '_flipped' : ''}`">{{ progress }}</textPath>
				</text>
			</svg>
		</div>
	</div>
</template>

<script>

export default {
	name: 'KvProgressCircle',
	props: {
		progress: {
			default: 10,
			type: Number,
			validator(val) {
				return val >= 0 && val <= 100;
			}
		},
		stroke: {
			default: 1,
			type: Number
		},
	},
	data() {
		return {
			radius: 100,
			isMounted: false, // trick to get some computed properties that require $refs to refresh on mount.
		};
	},
	computed: {
		normalizedRadius() {
			return this.radius - (this.stroke / 2);
		},
		circumference() {
			return this.normalizedRadius * 2 * Math.PI;
		},
		strokeDashoffset() {
			return this.circumference - (this.progress / 100) * this.circumference;
		},
		textCircleTransform() {
			const offset = -90 + 4;
			return `rotate(${(this.progress * (360 / 100)) + offset} ${this.radius} ${this.radius})`;
		},
	},
	mounted() {
		this.isMounted = true;
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-progress-circle {
	&__wrapper {
		width: 100%;
	}

	&__native-el {
		@include visually-hidden();
	}

	&__svg {
		display: block;
	}

	&__ring-text {
		font-size: 1rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	&__ring-foreground {
		fill: transparent;
		transform: rotate(90deg);
		transform-origin: center center;
		stroke: green;
		transition: stroke-dashoffset 0.35s;
	}

	&__ring-background {
		fill: transparent;
		stroke: $kiva-bg-lightgray;
	}
}
</style>
