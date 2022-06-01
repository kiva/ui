<template>
	<div class="carousel">
		<kv-carousel
			class="carousel__body"
			ref="carousel_component"
			:hide-arrows="true"
			:autoplay="false"
			indicator-style="circle"
			@change="onCarouselChange"
		>
			<kv-carousel-slide
				v-for="(slide, index) in slides"
				:key="`slide-${slide.step}`"
				class="carousel__slide"
			>
				<div class="carousel__body-wrap">
					<div class="carousel__body-img-wrapper">
						<video
							class="carousel__body-img"
							:ref="`video${index}`"
							:src="slide.video"
							autoplay
							loop
							muted
							playsinline
						>
						</video>
					</div>
					<div class="carousel__body-header">
						<p class="tw-text-h4">
							{{ slide.step }}
						</p>
						<h3 class="tw-text-h2 tw-mb-2">
							{{ slide.title }}
						</h3>
					</div>

					<div class="carousel__body-content-wrap">
						<p>{{ slide.blurb }}</p>
					</div>
				</div>
			</kv-carousel-slide>
		</kv-carousel>

		<!-- PREV-NEXT BTNS -->
		<div class="carousel__prevnext">
			<button
				class="carousel__prevnext-btn carousel__prevnext-btn--prev"
				@click="goToSlide(prevIndex)"
				:disabled="currentIndex === 0"
				v-kv-track-event="[
					'Kiva15',
					'click-how-kiva-works',
					'Previous'
				]"
			>
				<kv-icon
					class="carousel__prevnext-btn-icon"
					name="fat-chevron"
					:from-sprite="true"
				/>
				<span class="carousel__prevnext-btn-year">
					0{{ prevIndex + 1 }}
				</span>
			</button>
			<button
				class="carousel__prevnext-btn carousel__prevnext-btn--next"
				@click="goToSlide(nextIndex)"
				:disabled="currentIndex === slides.length - 1"
				v-kv-track-event="[
					'Kiva15',
					'click-how-kiva-works',
					'Next'
				]"
			>
				<span class="carousel__prevnext-btn-year">
					0{{ nextIndex + 1 }}
				</span>
				<kv-icon
					class="carousel__prevnext-btn-icon"
					name="fat-chevron"
					:from-sprite="true"
				/>
			</button>
		</div>
	</div>
</template>

<script>
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: '15YearsHowKivaWorksCarousel',
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvIcon,
	},
	props: {
		slides: {
			type: Array,
			default() { return []; }
		}
	},
	data() {
		return {
			currentIndex: 0,
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
		prevIndex() {
			const previousSlideIndex = this.currentIndex - 1;
			if (previousSlideIndex >= 0) {
				return previousSlideIndex;
			}
			return this.slides.length - 1;
		},
	},
	methods: {
		goToSlide(slideIndex) {
			this.$refs.carousel_component.goToSlide(slideIndex);
			this.currentIndex = slideIndex;
		},
		onCarouselChange(e) {
			this.currentIndex = e;
			this.$refs[`video${this.currentIndex}`][0].currentTime = 0;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

/* themable properties
--fifteen-years-font-family-monospace
--fifteen-years-color-carousel-arrow-fill
--fifteen-years-color-carousel-arrow-fill-hover
--fifteen-years-color-carousel-btn-color
--fifteen-years-color-carousel-btn-background
--fifteen-years-color-carousel-btn-background-hover
--fifteen-years-color-carousel-btn-border-hover
--fifteen-years-color-carousel-btn-border-focus
*/

/* stylelint-disable no-descending-specificity */
// Duplicate of 15yearstimeline.vue
.carousel {
	$prev-next-size: rem-calc(75);

	position: relative;

	&__prevnext {
		display: flex;
		justify-content: space-between;
		pointer-events: none;
		margin-top: -3.5rem;

		@include breakpoint(large) {
			position: absolute;
			top: calc(50% - #{$prev-next-size / 2});
			width: 100%;
			margin-top: 0;
		}
	}

	&__prevnext-btn-year {
		border-radius: rem-calc(16);
		padding: rem-calc(2) rem-calc(8);
		border: rem-calc(2) solid transparent;
		background: $kiva-bg-lightgray;
		background: var(--fifteen-years-color-carousel-btn-background, #{$kiva-bg-lightgray});
		color: #{$body-font-color};
		color: var(--fifteen-years-color-carousel-btn-color, #{$body-font-color});
	}

	&__prevnext-btn-icon {
		width: rem-calc(35);
		height: rem-calc(18);
	}

	&__prevnext-btn {
		@include h5();

		pointer-events: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: $prev-next-size;
		height: $prev-next-size;
		border-radius: 50%;
		fill: $body-font-color;
		fill: var(--fifteen-years-color-carousel-arrow-fill, #{$body-font-color});
		color: var(--fifteen-years-color-carousel-btn-background, #{$body-font-color});
		color: $white;
		color: var(--fifteen-years-color-carousel-btn-color, #{$white});
		z-index: 3;

		&:hover {
			.carousel__prevnext-btn-year {
				background: $white;
				background: var(--fifteen-years-color-carousel-btn-background-hover, #{$white});
				border-color: $white;
				border-color: var(--fifteen-years-color-carousel-btn-border-hover, #{$white});
			}

			.carousel__prevnext-btn-icon {
				fill: $button-background-hover;
				fill: var(--fifteen-years-color-carousel-arrow-fill-hover, #{$button-background-hover});
			}
		}

		&:focus {
			outline: 0;

			.carousel__prevnext-btn-year {
				border-color: $button-background-hover;
				border-color: var(--fifteen-years-color-carousel-btn-border-focus, #{$button-background-hover});
			}
		}

		&--prev {
			.carousel__prevnext-btn-icon {
				transform: rotate(90deg);
			}

			@include breakpoint(large) {
				.carousel__prevnext-btn-year {
					order: 0;
					transform: rotate(-90deg);
				}

				.carousel__prevnext-btn-icon {
					order: 1;
				}
			}
		}

		&--next {
			.carousel__prevnext-btn-icon {
				transform: rotate(-90deg);
			}

			@include breakpoint(large) {
				.carousel__prevnext-btn-year {
					order: 1;
					transform: rotate(90deg);
				}

				.carousel__prevnext-btn-icon {
					order: 0;
				}
			}
		}

		&[disabled] {
			visibility: hidden;
		}
	}

	&__body { // this is kv-carousel
		overflow: visible;

		&::v-deep {
			// carousel hack to make the viewport match design
			.kv-carousel__viewport {
				overflow: visible; // TODO: this seems to cause a bug when tabbing through the carousel
			}

			.kv-carousel__indicator {
				margin-top: 2rem;
			}
		}

		@include breakpoint(large) {
			width: calc(90% - #{$prev-next-size * 2});
			margin: 0 auto;

			&::v-deep {
				.kv-carousel__indicator {
					margin-top: 0;
				}
			}
		}
	}

	&__slide {
		opacity: 0.1;
		padding: 1rem;

		@include breakpoint(xxlarge) {
			padding-top: 4.5rem;
			padding-bottom: 2rem;
		}

		&.is-selected {
			opacity: 1;

			.carousel__body-img {
				transform: scale(1);
				opacity: 1;
			}
		}
	}

	&__body-wrap {
		display: flex;
		flex-wrap: wrap;

		@include breakpoint(large) {
			flex-direction: column;
		}

		@include breakpoint(xxlarge) {
			@include clearfix();

			display: block;
		}
	}

	&__body-img-wrapper {
		height: rem-calc(176);
		width: 50%;
		display: flex;
		align-items: center;

		@include breakpoint(xxlarge) {
			flex: unset;
			float: left; // BOOM!
			width: rem-calc(270);
			width: 33%;
			height: rem-calc(310);
			margin-right: rem-calc(45);
		}
	}

	&__body-img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		transform: scale(0);
		opacity: 0;
		transition: transform 1s ease-in-out, opacity 1s ease-in-out;

		&--svg {
			display: block;
			width: 100%;
		}
	}

	&__body-header {
		padding: 1rem;
		width: 50%;

		@include breakpoint(large) {
			padding: 0;
			width: 100%;
		}
	}

	&__body-content-wrap {
		flex: 1 1 auto; // IE11;
		margin-bottom: 0;

		@include breakpoint(xxlarge) {
			float: left;
			width: calc(100% - 20.5rem);
		}
	}
}
</style>
