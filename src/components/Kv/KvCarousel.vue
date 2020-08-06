<template>
	<div
		class="kv-carousel"
		:class="carouselModifierClasses"
		ref="KvCarousel"
	>
		<div class="kv-carousel__slides"
			@mouseover="pauseOnHover ? paused = true : paused = false"
			@touchstart="pauseOnHover ? paused = true : paused = false"
			@mouseleave="paused = false"
			@touchend="paused = false"
			v-touch:swipe.left="() => handleUserInteraction(nextIndex, 'swipe-left')"
			v-touch:swipe.right="() => handleUserInteraction(previousIndex, 'swipe-right')"
		>
			<slot :transitionName="transitionName"></slot>
		</div>

		<div class="kv-carousel__arrows">
			<button
				class="kv-carousel__arrows-btn kv-carousel__arrows-btn--left"
				@click="handleUserInteraction(previousIndex, 'click-left-arrow')"
			>
				<kv-icon
					class="kv-carousel__arrows-icon"
					name="fat-chevron"
					:from-sprite="true"
					title="Show previous slide"
				/>
			</button>
			<button
				class="kv-carousel__arrows-btn kv-carousel__arrows-btn--right"
				@click="handleUserInteraction(nextIndex, 'click-right-arrow')"
			>
				<kv-icon
					class="kv-carousel__arrows-icon"
					name="fat-chevron"
					:from-sprite="true"
					title="Show next slide"
				/>
			</button>
		</div>

		<div class="kv-carousel__indicator">
			<button
				v-for="(slide, index) in slides"
				:key="`indicator-${index}`"
				class="kv-carousel__indicator-btn"
				:class="[
					currentIndex === index ? 'kv-carousel__indicator-btn--active' : '',
					index < currentIndex ? 'kv-carousel__indicator-btn--viewed' : ''
				]"
				@click="handleUserInteraction(index, 'click-indicator-button')"
			>
				<span class="show-for-sr">Show slide {{ index + 1 }}</span>
			</button>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
	props: {
		autoplay: {
			type: Boolean,
			default: true
		},
		/**
		 * Duration in seconds between how long a slide is in view if autoplay is active
		* */
		autoplayInterval: {
			type: Number,
			default: 5,
		},
		/**
		 * Pauses the carousel autoplay if the user is hovering or touching the slides
		* */
		pauseOnHover: {
			type: Boolean,
			default: true,
		},
		/**
		 * Hide the left and right slide arrows
		* */
		hideArrows: {
			type: Boolean,
			default: false,
		},
		/**
		 * The style of the indicator
		 * `circle, bar, none`
		* */
		indicatorStyle: {
			type: String,
			default: 'circle'
		},
		/**
		 * Cover the slide contents with the arrows and indicator
		* */
		controlsInside: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			slides: [],
			currentIndex: 0,
			paused: false,
			intervalTimerCurrentTime: 0,
			transitionName: 'kv-slide-left',
		};
	},
	computed: {
		nextIndex() {
			const nextSlideIndex = this.currentIndex + 1;
			if (nextSlideIndex < this.slides.length) {
				return nextSlideIndex;
			}
			return 0;
		},
		previousIndex() {
			const previousSlideIndex = this.currentIndex - 1;
			if (previousSlideIndex >= 0) {
				return previousSlideIndex;
			}
			return this.slides.length - 1;
		},
		carouselModifierClasses() {
			let classes = '';
			if (this.controlsInside) {
				classes += 'kv-carousel--controls-inside ';
			}
			if (this.hideArrows) {
				classes += 'kv-carousel--hide-arrows ';
			}
			if (this.indicatorStyle === 'bar') {
				classes += 'kv-carousel--indicator-bar ';
			}
			if (this.indicatorStyle === 'none') {
				classes += 'kv-carousel--indicator-none ';
			}
			return classes;
		}
	},
	watch: {
		paused(isPaused) {
			if (this.indicatorStyle !== 'none') {
				// pause the css animation on the indicator
				this.$refs.KvCarousel.style.setProperty(
					'--kv-carousel-play-state', `${isPaused ? 'paused' : 'running'}`
				);
			}
		},
	},
	mounted() {
		// get slide components
		this.slides = this.$children.filter(child => child.$options.name === 'KvCarouselSlide');

		// show initial slide
		if (this.slides.length) {
			this.slides[this.currentIndex].show();
		}

		// setup autoplay
		if (this.autoplay && this.slides.length > 1) {
			// init the CSS custom property for CSS animation
			this.$refs.KvCarousel.style.setProperty(
				'--kv-carousel-autoplay-interval', `${this.autoplayInterval}s`
			);

			const refreshRate = 0.1; // 100 milliseconds
			this.intervalTimerCurrentTime = 0;
			this.intervalTimer = setInterval(() => {
				if (!this.paused) {
					this.intervalTimerCurrentTime += refreshRate;
				}
				if (this.intervalTimerCurrentTime >= this.autoplayInterval) {
					this.intervalTimerCurrentTime = 0;
					this.goToSlide(this.nextIndex);
				}
			}, refreshRate * 1000); // 100 milliseconds
		}
	},
	beforeDestroy() {
		if (this.autoplay) {
			clearInterval(this.intervalTimer);
		}
	},
	methods: {
		/**
		 * Fires when the user interacts with the carousel.
		 * Contains the interaction type (swipe-left, click-left-arrow, etc.)
		 * @event interact-carousel
		 * @type {Event}
		 */
		handleUserInteraction(index, interactionType) {
			this.goToSlide(index);
			this.$emit('interact-carousel', interactionType);
		},
		/**
		 * Jump to a specific slide index
		 *
		 * @param {Number} num Index of slide to show
		 * @public This is a public method
		 */
		goToSlide(index) {
			let direction;
			if (this.currentIndex === 0 && index === this.slides.length - 1) { // first slide to last
				direction = 'right';
			} else if (this.currentIndex === this.slides.length - 1 && index === 0) { // last slide to first
				direction = 'left';
			} else if (index < this.currentIndex) {
				direction = 'right';
			} else if (index > this.currentIndex) {
				direction = 'left';
			}
			this.transitionName = `kv-slide-${direction}`;

			// wait for the transition to be applied
			this.$nextTick(() => {
				this.intervalTimerCurrentTime = 0;
				this.slides[this.currentIndex].hide();
				this.currentIndex = index;
				this.slides[this.currentIndex].show();

				/**
				 * The index of the slide that the carousel has changed to
				 * @event change
				 * @type {Event}
				 */
				this.$emit('change', this.currentIndex);
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

$arrow-width: rem-calc(41);
$arrow-margin: rem-calc(8);
$circle-indicator-height: rem-calc(16);
$circle-indicator-margin: rem-calc(8);
$bar-indicator-height: rem-calc(4);
$bar-indicator-margin: rem-calc(4);

.kv-carousel {
	position: relative;
	display: flex;
	overflow: hidden;
	width: 100%;
	// you'll aways need to add either a height: 123px; or height: 0; padding-bottom: 123% when you put it on the page.

	&__slides {
		position: absolute;
		top: 0;
		right: #{$arrow-width + $arrow-margin};
		bottom: #{$circle-indicator-height + $circle-indicator-margin * 2};
		left: #{$arrow-width + $arrow-margin};
		flex: 1;
		overflow: hidden;
	}

	&__arrows {
		position: absolute;
		top: 0;
		left: 0;
		bottom: #{$circle-indicator-height + $circle-indicator-margin * 2};
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		pointer-events: none;
	}

	&__arrows-btn {
		background: $kiva-text-light;
		border-radius: 50%;
		width: $arrow-width;
		height: $arrow-width;
		padding: 0.6rem 0.6rem 0.5rem;
		pointer-events: auto;
		overflow: hidden; // prevents a weird chrome twitch on click

		&--right {
			transform: rotate(270deg);
		}

		&--left {
			transform: rotate(90deg);
		}

		&:focus {
			outline: 0;
			background: #000;
		}

		&:hover {
			background: $anchor-color-hover;
		}

		&[disabled] {
			@include button-disabled();

			background: $kiva-text-light;
		}
	}

	&__arrows-icon {
		fill: #fff;
		width: rem-calc(21);
		height: rem-calc(23);
	}

	&__indicator {
		position: absolute;
		left: #{$arrow-width + $arrow-margin};
		right: #{$arrow-width + $arrow-margin};
		bottom: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	&__indicator-btn {
		margin: 0.5rem;
		margin-left: 0;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: $kiva-text-light;
		pointer-events: auto;
		position: relative;
		overflow: hidden;

		&:focus {
			outline: 0;
			background: #000;
		}

		&:hover {
			background: $anchor-color-hover;
		}

		&:first-child {
			margin-left: 0;
		}

		&:last-child {
			margin-right: 0;
		}

		&--active {
			@keyframes scaleX {
				0% {
					transform: scaleX(0);
				}

				100% {
					transform: scaleX(1);
				}
			}

			&::after {
				display: block;
				content: '';
				background: hsla(0, 0, 100, 0.5);
				width: 100%;
				height: 100%;
				transform-origin: left;
				animation-name: scaleX;
				animation-duration: var(--kv-carousel-autoplay-interval);
				animation-play-state: paused;
				animation-play-state: var(--kv-carousel-play-state, 'playing');
				animation-timing-function: linear;
			}
		}
	}

	// carousel modifiers
	&--controls-inside {
		.kv-carousel__slides {
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		.kv-carousel__arrows {
			left: $arrow-margin;
			right: $arrow-margin;
			top: 0;
			bottom: 0;
		}

		.kv-carousel__indicator {
			left: 0;
			right: 0;
			z-index: 2;
		}
	}

	&--hide-arrows {
		.kv-carousel__arrows {
			display: none;
		}

		.kv-carousel__slides,
		.kv-carousel__indicator {
			left: 0;
			right: 0;
		}
	}

	&--indicator-bar {
		.kv-carousel__indicator {
			top: 0;
			bottom: initial;
		}

		.kv-carousel__indicator-btn {
			height: $bar-indicator-height;
			border-radius: 0;
			width: auto;
			flex: 1;
			margin: 0 ($bar-indicator-margin / 2);

			&:first-child {
				margin-left: 0;
			}

			&:last-child {
				margin-right: 0;
			}

			&--viewed {
				&::after {
					display: block;
					content: '';
					background: hsla(0, 0, 100, 0.5);
					width: 100%;
					height: 100%;
				}
			}
		}

		.kv-carousel__slides,
		.kv-carousel__arrows {
			top: $bar-indicator-height + $bar-indicator-margin;
			bottom: 0;
		}
	}

	&--indicator-none {
		.kv-carousel__indicator {
			display: none;
		}

		.kv-carousel__slides,
		.kv-carousel__arrows {
			bottom: 0;
		}
	}
}
</style>
