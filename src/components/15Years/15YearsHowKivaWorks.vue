<template>
	<div class="works section">
		<div class="row">
			<div class="columns">
				<fifteen-years-section-header class="works__header">
					<template v-slot:header>
						How Kiva Works
					</template>
					<template v-slot:subhead>
						A Step-by-Step<br class="smo"><br class="xxlu"> Guide
					</template>
				</fifteen-years-section-header>

				<p class="works__subhead">
					By lending as little as $25 on Kiva, you can support the causes you care
					about and make a real personal impact.
				</p>

				<!-- CAROUSEL -->
				<div class="carousel">
					<kv-carousel
						class="carousel__body"
						ref="carousel_component"
						:hide-arrows="true"
						:autoplay="false"
						:embla-options="{ loop: false }"
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
									<h3 class="carousel__body-subtitle">
										{{ slide.step }}
									</h3>
									<h4 class="carousel__body-title">
										{{ slide.title }}
									</h4>
								</div>

								<div class="carousel__body-content-wrap">
									<p class="carousel__body-content">
										{{ slide.blurb }}
									</p>
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
			</div>
		</div>
	</div>
</template>

<script>
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvIcon from '@/components/Kv/KvIcon';
import FifteenYearsSectionHeader from './15YearsSectionHeader';

const step1Video = require('@/assets/media/15-years/step1.mp4');
const step2Video = require('@/assets/media/15-years/step2.mp4');
const step3Video = require('@/assets/media/15-years/step3.mp4');
const step4Video = require('@/assets/media/15-years/step4.mp4');

export default {
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvIcon,
		FifteenYearsSectionHeader,
	},
	data() {
		return {
			slides: [
				{
					step: 'Step One',
					title: 'Choose a borrower',
					blurb: 'Browse by category and find an entrepeneur to support',
					video: step1Video,
				},
				{
					step: 'Step Two',
					title: 'Make a loan',
					blurb: 'Help fund a loan with as little as $25',
					video: step2Video,
				},
				{
					step: 'Step Three',
					title: 'Get repaid',
					blurb: 'Kiva borrowers have a 96% repayment rate historically.',
					video: step3Video,
				},
				{
					step: 'Step Four',
					title: 'Repeat',
					blurb: 'Relend your money or withdraw your funds.',
					video: step4Video,
				},
			],
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

@mixin timeline-link() {
	@include link();

	color: $mint;
}

/* stylelint-disable no-descending-specificity */

.works {
	background: #fff;
	color: $twilight;

	/* hides the horizontal scrollbar created by hacking the carousel below */
	width: 100%;
	overflow-x: hidden;

	&__subhead {
		@include h4();

		max-width: rem-calc(913);
	}

	&__header {
		--section-header-line-color: #{$twilight};

		margin-bottom: 2rem;

		@include breakpoint('xxlarge') {
			margin-bottom: 4rem;
		}
	}
}

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
		background: $offwhite;
		color: $twilight;
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
		fill: $twilight;
		color: $offwhite;
		z-index: 3;

		&:hover {
			.carousel__prevnext-btn-year {
				background: #fff;
				color: $twilight;
				border: rem-calc(2) solid #fff;
			}

			.carousel__prevnext-btn-icon {
				fill: $mint;
			}
		}

		&:focus {
			outline: 0;

			.carousel__prevnext-btn-year {
				border: rem-calc(2) solid $mint;
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

	&__body-subtitle {
		@include h5();

		margin-bottom: 0.5rem;
	}

	&__body-title {
		@include h3();

		line-height: 1;
		margin-bottom: 0.5rem;
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
		flex: 1;
		margin-bottom: 0;

		@include breakpoint(xxlarge) {
			float: left;
			width: calc(100% - 20.5rem);
		}
	}

	&__body-content {
		margin-bottom: 0;
	}
}

</style>
