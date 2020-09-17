<template>
	<div class="timeline section">
		<div class="row">
			<div class="columns">
				<div class="timeline__header">
					<h2>15 Years of Impact</h2>
					<p>The history of Kiva, year by year</p>
				</div>

				<!-- CAROUSEL -->
				<div class="carousel">
					<kv-carousel
						class="carousel__body"
						ref="carousel_component"
						:hide-arrows="true"
						:autoplay="false"
						indicator-style="none"
						:embla-options="{ loop: false }"
						@change="onCarouselChange"
					>
						<kv-carousel-slide
							v-for="slide in slides"
							:key="`slide-${slide.year}`"
						>
							<div class="carousel__slide">
								<div class="carousel__body-header-wrap">
									<div class="carousel__body-img-wrapper">
										<img
											class="carousel__body-img"
											:class="stickerClasses(slide)"
											:src="getImage(`./stickers/${slide.sticker}`)"
											alt=""
											loading="lazy"
										>
									</div>
									<div class="carousel__body-header">
										<h3>{{ slide.year }}</h3>
										<h4>{{ slide.title }}</h4>
									</div>
								</div>
								<div class="carousel__body-content">
									<p>
										{{ slide.blurb }}
									</p>
									<router-link
										class="carousel__body-cta"
										:to="slide.link"
									>
										{{ slide.cta }}
									</router-link>
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
								name="small-chevron"
								:from-sprite="true"
							/>
							<span class="carousel__prevnext-btn-year">
								{{ slides[prevIndex].year }}
							</span>
						</button>
						<button
							class="carousel__prevnext-btn carousel__prevnext-btn--next"
							@click="goToSlide(nextIndex)"
							:disabled="currentIndex === slides.length - 1"
						>
							<span class="carousel__prevnext-btn-year">
								{{ slides[nextIndex].year }}
							</span>
							<kv-icon
								class="carousel__prevnext-btn-icon"
								name="small-chevron"
								:from-sprite="true"
							/>
						</button>
					</div>
				</div>

				<!-- NAV -->
				<ul class="bottom-nav" v-if="false">
					<li
						v-for="(navSlide, navIndex) in slides"
						:key="`bottom-nav-${navSlide.year}`"
						class="bottom-nav__item"
						:class="navIndex <= currentIndex ? 'bottom-nav__item--past' : ''"
					>
						<button
							class="bottom-nav__btn"
							@click="goToSlide(navIndex)"
							:disabled="navIndex < currentIndex"
						>
							<span class="bottom-nav__btn-img-wrap">
								<img
									class="bottom-nav__img"
									:src="getImage(`./stickers/${navSlide.sticker}.png`)"
									alt=""
									loading="lazy"
								>
							</span>
							<span class="bottom-nav__btn-text">{{ navIndex }} - {{ navSlide.year }}</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvIcon from '@/components/Kv/KvIcon';

import slideData from './15YearsSlideData';

const fifteenYearsImagesRequire = require.context('@/assets/images/15-years/', true);

export default {
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvIcon,
	},
	data() {
		return {
			slides: slideData,
			currentIndex: 0,
		}; /* eslint-enable max-len */
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
		getImage(image) {
			return fifteenYearsImagesRequire(image);
		},
		onCarouselChange(e) {
			this.currentIndex = e;
		},
		stickerClasses(slideObj) {
			const { sticker, year } = slideObj;

			let classNames = `carousel__body-img-${year}`;
			if (sticker.substr(sticker.length - 3) === 'svg') {
				classNames += ' carousel__body-img--svg';
			}
			return classNames;
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

	&:hover {
		background-color: $offwhite;
		color: $twighlight;
	}
}

.timeline {
	background: $twighlight;
	color: $offwhite;

	/* hides the scrollbar created by hacking the carousel below */
	width: 100%;
	overflow-x: hidden;

	&__header {

	}

	a {
		@include timeline-link();
	}
}

.carousel {
	$prev-next-size: rem-calc(75);

	position: relative;

	&__prevnext {
		display: flex;
		justify-content: space-between;
		pointer-events: none;

		@include breakpoint('large') {
			position: absolute;
			top: calc(50% - #{$prev-next-size / 2});
			width: 100%;
		}
	}

	&__prevnext-btn {
		@include timeline-link();

		pointer-events: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: $prev-next-size;
		height: $prev-next-size;
		border-radius: 50%;
		fill: $offwhite;
		color: $offwhite;
		// background: #000; // TODO: remove

		&--prev {
			.carousel__prevnext-btn-icon {
				transform: rotate(90deg);
			}

			@include breakpoint('large') {
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

			@include breakpoint('large') {
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

	&__prevnext-btn-year {
		@include breakpoint('large') {
			background: $offwhite;
			color: $twighlight;
			border-radius: rem-calc(16);
			padding: rem-calc(2) rem-calc(8);
		}
	}

	&__prevnext-btn-icon {
		width: rem-calc(18);
		height: rem-calc(8);
	}

	&__body { // this is kv-carousel
		overflow: visible;

		@include breakpoint('large') {
			width: calc(90% - #{$prev-next-size * 2});
			margin: 0 auto;
		}

		// carousel hacks to make the viewport match design
		&::v-deep {
			.kv-carousel__viewport {
				overflow: visible;
			}

			.kv-carousel-slide {
				opacity: 0.1;

				&.is-selected {
					opacity: 1;
				}
			}
		}
	}

	&__slide {
		padding: 1rem;
		display: flex;
		flex-direction: column;

		// @include breakpoint('xxlarge') {
		// 	flex-direction: row;
		// }
	}

	/*
								<div class="carousel__body-header-wrap">
									<div class="carousel__body-img-wrapper">
										<img
											class="carousel__body-img"
											:class="stickerClasses(slide)"
											:src="getImage(`./stickers/${slide.sticker}`)"
											alt=""
											loading="lazy"
										>
									</div>
									<div class="carousel__body-header">
										<h3>{{ slide.year }}</h3>
										<h4>{{ slide.title }}</h4>
									</div>
									<p class="carousel__body-content">
										{{ slide.blurb }}
									</p>
									<router-link
										class="carousel__body-cta"
										:to="slide.link"
									>
										{{ slide.cta }}
									</router-link>
								</div>
								*/
	&__body-header-wrap {
		display: flex;

		@include breakpoint('large') {
			flex-direction: column;
		}

		@include breakpoint('xxlarge') {
			flex-direction: row;
		}
	}

	&__body-img-wrapper {
		height: rem-calc(176);
		padding: 1rem;
		flex: 1;
		display: flex;
		align-items: center;

		// @include breakpoint('large') {
		// 	height: rem-calc(155);
		// }

		@include breakpoint('xxlarge') {
			flex: unset;
			width: rem-calc(280);
			height: rem-calc(310);
			margin-right: rem-calc(45);
		}
	}

	&__body-img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;

		&--svg {
			display: block;
			// flex: 1;
		}
	}

	&__body-header {
		padding: 1rem;
		flex: 1;

		@include breakpoint('large') {
			padding: 0;
		}
	}

	&__body-content {
		flex: 1;
	}

	&__body-cta {
		&::after {
			content: '➔';
		}
	}
}

.bottom-nav {
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;

	&__item {
		transition: transform 2s linear;

		&--past {
			// transform: scale(0.1);

			.bottom-nav__btn {
				width: rem-calc(80);
				height: rem-calc(80);
				border-radius: 50%;
				background: orange;
			}

			.bottom-nav__btn-img-wrap,
			.bottom-nav__btn-text {
				display: none;
			}
		}
	}

	&__btn {
		&[disabled] {
			pointer-events: none;
		}
	}

	&__btn-img-wrap {
		width: rem-calc(80);
		height: rem-calc(80);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}

	&__btn-text {

	}
}
</style>
