<template>
	<div
		class="kv-swashie"
		:class="`kv-swashie--${this.excitementLevel}`"
	>
		<div class="kv-swashie__wrapper">
			<div class="kv-swashie__circle">
				<!-- eslint-disable max-len -->
				<div class="kv-swashie__face">
					<svg viewBox="0 0 205 205" fill="none" xmlns="http://www.w3.org/2000/svg">
						<template v-if="excitementLevel === 'asleep'">
							<g class="kv-swashie__face-asleep">
								<path
									class="kv-swashie__face-open-eyes"
									d="M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z" fill="#3E4653"
								/>
								<path
									class="kv-swashie__face-open-eyes"
									d="M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z" fill="#3E4653"
								/>
								<path
									class="kv-swashie__face-flat-mouth"
									d="M89.6187 113.421H115.382C115.828 113.421 116.182 113.103 116.409 112.699C116.642 112.287 116.778 111.735 116.778 111.138C116.778 110.541 116.642 109.989 116.409 109.577C116.182 109.173 115.828 108.855 115.382 108.855H89.6187C89.1715 108.855 88.8179 109.174 88.5903 109.578C88.3583 109.991 88.2228 110.543 88.2228 111.138C88.2228 111.735 88.3588 112.287 88.5911 112.699C88.819 113.103 89.1727 113.421 89.6187 113.421Z" fill="#2E495D" stroke="#2E495D" stroke-width=".5"
								/>
							</g>
						</template>
						<template v-if="excitementLevel === 'sleepy'">
							<g class="kv-swashie__face-sleeping">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M137.08 96.0006C138.467 96.0006 139.591 97.1249 139.591 98.5117C139.591 101.52 142.031 103.961 145.04 103.961C148.048 103.961 150.489 101.52 150.489 98.5117C150.489 97.1249 151.613 96.0006 153 96.0006C154.387 96.0006 155.511 97.1249 155.511 98.5117C155.511 104.294 150.822 108.983 145.04 108.983C139.257 108.983 134.568 104.294 134.568 98.5117C134.568 97.1249 135.693 96.0006 137.08 96.0006Z" fill="#3E4653" />
								<path fill-rule="evenodd" clip-rule="evenodd" d="M52 96.0012C53.3869 96.0012 54.5112 97.1255 54.5112 98.5124C54.5112 101.521 56.9515 103.961 59.9602 103.961C62.9688 103.961 65.4092 101.521 65.4092 98.5124C65.4092 97.1255 66.5335 96.0012 67.9204 96.0012C69.3072 96.0012 70.4315 97.1255 70.4315 98.5124C70.4315 104.295 65.7426 108.984 59.9602 108.984C54.1778 108.984 49.4888 104.295 49.4888 98.5124C49.4888 97.1255 50.6131 96.0012 52 96.0012Z" fill="#3E4653" />
								<path
									class="kv-swashie__face-snore-mouth"
									d="M102.5 116.568C106.206 116.568 109.211 113.563 109.211 109.857C109.211 106.15 106.206 103.146 102.5 103.146C98.7935 103.146 95.7888 106.15 95.7888 109.857C95.7888 113.563 98.7935 116.568 102.5 116.568Z" fill="#3E4653"
								/>
							</g>
						</template>
						<template v-if="excitementLevel === 'content'">
							<path
								class="kv-swashie__face-open-eyes"
								d="M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z" fill="#3E4653"
							/>
							<path
								class="kv-swashie__face-open-eyes"
								d="M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z" fill="#3E4653"
							/>
							<path d="M120.581 98.4638C120.581 108.449 112.485 116.545 102.5 116.545C92.5151 116.545 84.4192 108.449 84.4192 98.4638" stroke="#3E4653" stroke-width="3.76773" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
						</template>
						<template v-if="excitementLevel === 'elated'">
							<path
								class="kv-swashie__face-open-eyes"
								d="M145.04 104.92C149.436 104.92 153 101.356 153 96.9602C153 92.5639 149.436 89 145.04 89C140.644 89 137.08 92.5639 137.08 96.9602C137.08 101.356 140.644 104.92 145.04 104.92Z" fill="#3E4653"
							/>
							<path
								class="kv-swashie__face-open-eyes"
								d="M59.9602 104.921C64.3565 104.921 67.9204 101.357 67.9204 96.9604C67.9204 92.5641 64.3565 89.0002 59.9602 89.0002C55.5639 89.0002 52 92.5641 52 96.9604C52 101.357 55.5639 104.921 59.9602 104.921Z" fill="#3E4653"
							/>
							<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="84" y="98" width="37" height="19">
								<path d="M84.3181 98.2867C84.3181 108.24 92.3886 116.311 102.342 116.311C112.296 116.311 120.366 108.24 120.366 98.2867H84.3181Z" fill="#3E4D61" />
							</mask>
							<g mask="url(#mask0)">
								<path d="M84.3181 98.2867C84.3181 108.24 92.3886 116.311 102.342 116.311C112.296 116.311 120.366 108.24 120.366 98.2867H84.3181Z" fill="#3E4653" />
								<path d="M120.367 125.323C120.367 115.369 112.296 107.299 102.342 107.299C92.3888 107.299 84.3183 115.369 84.3183 125.323H120.367Z" fill="#DF5D4F" />
							</g>
						</template>
					</svg>
				</div>
				<div
					v-if="showLiquid"
					class="kv-swashie__liquid"
					:style="{ transform: `translateY(${100 - fillLevel}%)` }"
				>
					<svg class="kv-swashie__liquid-svg" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 389">
						<path d="M139.749 20c-21.384-.4116-38.597-2.503-50.849-4.4953-13.4-2.2-26.5-5.2-27.3-5.4-7.2024-1.66204-11.9322-2.94046-15.9706-4.03202l-.0004-.00009C40.9207 4.79996 37.1521 3.78133 31.5 2.70474c-7.2-1.3-17.9-2.8-31.5-2.7V389h560V.00474c-13.6-.1-24.4 1.4-31.5 2.7-5.652 1.07659-9.421 2.09522-14.129 3.36785v.00009c-4.039 1.09156-8.769 2.36998-15.971 4.03202-.8.2-13.9 3.2-27.3 5.4-12.252 1.9923-29.465 4.0837-50.849 4.4953h-.502c-21.384-.4116-38.597-2.503-50.849-4.4953-13.4-2.2-26.5-5.2-27.3-5.4-7.203-1.6621-11.932-2.94053-15.971-4.03211-4.708-1.27263-8.477-2.29126-14.129-3.36785-7.2-1.3-17.9-2.8-31.5-2.7-13.6-.1-24.4 1.4-31.5 2.7-5.652 1.07659-9.421 2.09522-14.129 3.36785-4.039 1.09158-8.768 2.37001-15.971 4.03211-.8.2-13.9 3.2-27.3 5.4-12.252 1.9923-29.465 4.0837-50.849 4.4953h-.502z" />
					</svg>
				</div>
				<!-- eslint-enable max-len -->
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'SwashieFace',
	props: {
		percentFull: {
			type: Number,
			default: 0,
			validator(val) {
				return val >= 0 && val <= 100;
			}
		},
		showLiquid: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			fillLevel: null
		};
	},
	computed: {
		excitementLevel() {
			if (!this.fillLevel) {
				return 'asleep';
			}
			if (this.fillLevel >= 0 && this.fillLevel < 50) {
				return 'sleepy';
			}
			if (this.fillLevel >= 50 && this.fillLevel < 80) {
				return 'content';
			}
			if (this.fillLevel >= 80) {
				return 'elated';
			}
			return 'asleep';
		}
	},
	watch: {
		percentFull() {
			if (this.percentFull > 100) {
				this.fillLevel = 100;
			}

			if (!this.timer) {
				this.fillErUp();
			}
		}
	},
	mounted() {
		this.fillErUp();
	},
	beforeDestroy() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		fillErUp() {
			const fill = () => {
				if (this.fillLevel === this.percentFull) {
					clearInterval(this.timer);
					this.timer = null;
				} else {
					this.fillLevel += this.fillLevel < this.percentFull ? 1 : -1; // add or remove fluid
				}
			};
			this.timer = setInterval(fill, 50);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.kv-swashie {
	&__wrapper {
		width: 100%;
	}

	&__circle {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
		line-height: 0;
		position: relative;
		z-index: 2;
	}

	&__face {
		position: relative;
		transform: translateY(-55%);
		transition: transform 1.5s cubic-bezier(0.81, 0.41, 0.57, 1.25);
		z-index: 2;
	}

	&__liquid {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		transform: translateY(100%);
		transition: transform 1s ease-out;
		z-index: 1;
	}

	&__liquid-svg {
		fill: $mint;
		width: 225%;
		animation: wave-motion 2.5s infinite linear;
		transform-origin: bottom center;
	}

	&--asleep {
		.kv-swashie__face {
			transform: translateY(20%);

			&-asleep {
				transform-origin: center center;
				animation: float 3.5s infinite ease-in-out;
			}

			&-open-eyes {
				transform-origin: center center;
				animation: blink 3.5s infinite linear;
			}
		}
	}

	&--sleepy {
		.kv-swashie__face {
			transform: translateY(20%);

			&-sleeping {
				transform-origin: center center;
				animation: float 3.5s infinite ease-in-out;
			}

			&-snore-mouth {
				transform-origin: center center;
				animation: snore-mouth 3.5s infinite ease-in-out;
			}
		}
	}

	&--content {
		.kv-swashie__face {
			transform: translateY(20%);

			&-open-eyes {
				transform-origin: center center;
				animation: blink 3.5s infinite linear;
			}
		}
	}

	&--elated {
		.kv-swashie__face {
			transform: translateY(-12%);

			&-open-eyes {
				transform-origin: center center;
				animation: blink 3.5s infinite linear;
			}
		}
	}

	@keyframes wave-motion {
		0% {
			transform: translateX(-50%) scaleX(1);
		}

		50% {
			transform: translateX(-25%) scaleX(0.8);
		}

		100% {
			transform: translateX(0) scaleX(1);
		}
	}

	@keyframes blink {
		0%,
		79% {
			transform: scaleY(1);
		}

		80% {
			transform: scaleY(0.1);
		}

		81% {
			transform: scaleY(1);
		}

		85% {
			transform: scaleY(0.1);
		}

		86% {
			transform: scaleY(1);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(3%);
		}

		50% {
			transform: translateY(-3%);
		}
	}

	@keyframes snore-mouth {
		0%,
		100% {
			transform: scaleX(1.3);
		}

		50% {
			transform: scaleX(1);
		}
	}
}
</style>
