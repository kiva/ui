<template>
	<div
		class="kv-carousel"
		:class="carouselModifierClasses"
	>
		<div
			class="kv-carousel__arrows-viewport-wrapper"
			@mouseover="pauseOnHover ? paused = true : paused = false"
			@touchstart="pauseOnHover ? paused = true : paused = false"
			@mouseleave="paused = false"
			@touchend="paused = false"
		>
			<button
				class="kv-carousel__arrows-btn kv-carousel__arrows-btn--left"
				:disabled="embla && !canScrollPrev"
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
				:disabled="embla && !canScrollNext"
				@click="handleUserInteraction(nextIndex, 'click-right-arrow')"
			>
				<kv-icon
					class="kv-carousel__arrows-icon"
					name="fat-chevron"
					:from-sprite="true"
					title="Show next slide"
				/>
			</button>
			<div
				class="kv-carousel__viewport"
				ref="KvCarousel"
			>
				<div
					class="kv-carousel__container"
					@click.capture="onCarouselContainerClick"
				>
					<slot></slot>
				</div>
			</div>
		</div>

		<div
			class="kv-carousel__indicator"
			ref="KvCarouselIndicator"
		>
			<button
				v-for="(slide, index) in slideIndicatorList"
				:key="`indicator-${index}`"
				class="kv-carousel__indicator-btn"
				:class="[
					currentIndex === index ? 'kv-carousel__indicator-btn--active' : '',
					index < currentIndex ? 'kv-carousel__indicator-btn--viewed' : ''
				]"
				@click="handleUserInteraction(index, 'click-indicator-button')"
			>
				<span class="tw-sr-only">Show slide {{ index + 1 }}</span>
			</button>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import EmblaCarousel from 'embla-carousel';

import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'KvCarousel',
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
		 * Options for the embla carousel - // https://davidcetinkaya.github.io/embla-carousel/api#options
		* */
		emblaOptions: {
			type: Object,
			default() {
				return {};
			},
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
		},
		/**
		 * The type of logic to implement when deciding how many slides
		 * to scroll when pressing the next/prev button
		 * `visible, auto`
		* */
		slidesToScroll: {
			type: String,
			default: 'auto'
		},
	},
	data() {
		return {
			embla: null,
			slides: [],
			canScrollPrev: false,
			canScrollNext: true,
			currentIndex: 0,
			paused: false,
			intervalTimerCurrentTime: 0,
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
		},
		slideIndicatorList() {
			return this.embla ? this.embla.scrollSnapList() : 0;
		}
	},
	watch: {
		paused(isPaused) {
			if (this.indicatorStyle !== 'none') {
				// pause the css animation on the indicator
				this.$refs.KvCarouselIndicator.style.setProperty(
					'--kv-carousel-play-state', `${isPaused ? 'paused' : 'running'}`
				);
			}
		},
	},
	mounted() {
		// initialize Embla
		this.embla = EmblaCarousel(this.$refs.KvCarousel, {
			loop: true,
			containScroll: 'trimSnaps',
			inViewThreshold: 0.90,
			...this.emblaOptions,
		});

		if (this.slidesToScroll === 'visible') {
			this.reInitVisible();

			this.embla.on('resize', _throttle(() => {
				this.embla.reInit({
					slidesToScroll: this.embla.slidesInView(true).length,
					inViewThreshold: 0.90,
				});
			}, 250));
		}

		// get slide components
		this.slides = this.embla.slideNodes();

		// setup autoplay
		if (this.autoplay && this.slides.length > 1) {
			// init the CSS custom property for CSS animation
			this.$refs.KvCarouselIndicator.style.setProperty(
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

		this.embla.on('select', () => {
			this.currentIndex = this.embla.selectedScrollSnap();

			/**
			 * The index of the slide that the carousel has changed to
			 * @event change
			 * @type {Event}
			 */
			this.$emit('change', this.currentIndex);
		});
	},
	beforeDestroy() {
		if (this.autoplay) {
			clearInterval(this.intervalTimer);
		}
		// clean up event listeners
		this.embla.off('select');
		this.embla.destroy();
	},
	methods: {
		async handleUserInteraction(index, interactionType) {
			if (index !== null && typeof index !== 'undefined') {
				await this.$nextTick(); // wait for embla.
				this.goToSlide(index);
			}
			// Update navigation state
			this.canScrollPrev = this.embla.canScrollPrev();
			this.canScrollNext = this.embla.canScrollNext();
			/**
			 * Fires when the user interacts with the carousel.
			 * Contains the interaction type (swipe-left, click-left-arrow, etc.)
			 * @event interact-carousel
			 * @type {Event}
			 */
			this.$emit('interact-carousel', interactionType);
		},
		/**
		 * Jump to a specific slide index
		 *
		 * @param {Number} num Index of slide to show
		 * @public This is a public method
		 */
		goToSlide(index) {
			this.embla.scrollTo(index);
			this.intervalTimerCurrentTime = 0;
		},
		/**
		 * Reinitialize the carousel.
		 * Used after adding slides dynamically.
		 *
		 * @public This is a public method
		 */
		reInit() {
			this.embla.reInit();
			if (this.slidesToScroll === 'visible') {
				this.reInitVisible();
			}
			this.slides = this.embla.slideNodes();
			this.$forceUpdate(); // force a re-render so embla.canScrollNext() gets called in the template
		},
		reInitVisible() {
			const slidesInView = this.embla.slidesInView(true).length;
			if (slidesInView) {
				this.embla.reInit({
					slidesToScroll: slidesInView,
					inViewThreshold: 0.90,
				});
			}
		},
		onCarouselContainerClick(e) {
			// If we're dragging, block click handlers within slides
			if (this.embla && !this.embla.clickAllowed()) {
				e.preventDefault();
				e.stopPropagation();
			}
		}
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
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;

	&__viewport {
		overflow: hidden;
		width: 100%;
	}

	&__container {
		display: flex;
	}

	&__arrows-viewport-wrapper {
		display: flex;
	}

	&__arrows-btn {
		background: $kiva-text-light;
		border-radius: 50%;
		width: $arrow-width;
		height: $arrow-width;
		flex-shrink: 0;
		align-self: center;
		padding: 0.6rem 0.6rem 0.5rem;
		pointer-events: auto;
		overflow: hidden; // prevents a weird chrome twitch on click

		&--right {
			transform: rotate(270deg);
			margin-left: $arrow-margin;
			order: 3;
		}

		&--left {
			transform: rotate(90deg);
			margin-right: $arrow-margin;
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
		margin-left: #{$arrow-width + $arrow-margin};
		margin-right: #{$arrow-width + $arrow-margin};
		display: flex;
		justify-content: center;
		pointer-events: none;
		bottom: 0;
	}

	&__indicator-btn {
		margin: 0.5rem;
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
				background: hsla(0, 0%, 100%, 0.5);
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
		.kv-carousel__arrows-btn--right {
			position: absolute;
			z-index: 2;
			right: $arrow-margin;
		}

		.kv-carousel__arrows-btn--left {
			position: absolute;
			z-index: 2;
			left: $arrow-margin;
		}

		.kv-carousel__indicator {
			position: absolute;
			z-index: 2;
			margin: 0 auto;
			width: 100%;
		}
	}

	&--hide-arrows {
		.kv-carousel__arrows-btn {
			display: none;
		}

		.kv-carousel__indicator {
			margin-left: 0;
			margin-right: 0;
		}
	}

	&--indicator-bar {
		.kv-carousel__arrows-viewport-wrapper {
			order: 1;
		}

		.kv-carousel__indicator {
			order: 0;
			top: 0;
		}

		.kv-carousel__indicator-btn {
			height: $bar-indicator-height;
			border-radius: 0;
			width: auto;
			flex: 1;
			margin: 0 ($bar-indicator-margin / 2) $bar-indicator-margin;

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
					background: hsla(0, 0%, 100%, 0.5);
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	&--indicator-none {
		.kv-carousel__indicator {
			display: none;
		}
	}
}
</style>
