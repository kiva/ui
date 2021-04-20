import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

import causeList from '../mock-data/cause-selector-data-mock';

const defaultCarouselSlides = `
	<template #default>
		<kv-carousel-slide style="background-color: green;">
			<img src="https://via.placeholder.com/300x220/e8f0f6/000000" style="width: 100%;">
		</kv-carousel-slide>
		<kv-carousel-slide style="background-color: green;">
			<img src="https://via.placeholder.com/300x220/a87c7c/000000" style="width: 100%;">
		</kv-carousel-slide>
		<kv-carousel-slide style="background-color: green;">
			<img src="https://via.placeholder.com/300x220/f6dbb8/000000" style="width: 100%;">
		</kv-carousel-slide>
		<kv-carousel-slide style="background-color: green;">
			<img src="https://via.placeholder.com/300x220/b39696/000000" style="width: 100%;">
		</kv-carousel-slide>
	</template>
`;

export default {
	title: 'Kv/KvCarousel',
	component: KvCarousel,
 };

export const Default = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel style="width: 400px;">
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const PauseOnHoverFalse = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			:pause-on-hover="false"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const AutoplayFalse = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			:autoplay="false"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const HideArrows = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			:hide-arrows="true"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const IndicatorStyleNone = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			indicator-style="none"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const HideArrowsTrueIndicatorNone = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			:hide-arrows="true"
			indicator-style="none"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const indicatorStyleBar = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			indicator-style="bar"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const indicatorStyleBarControlsInside = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			indicator-style="bar"
			:controls-inside="true"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const indicatorStyleBarHideArrowsTrue = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			indicator-style="bar"
			:hide-arrows="true"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const controlsInside = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide
	},
	template: `
		<kv-carousel
			:controls-inside="true"
			style="width: 400px;"
		>
			${defaultCarouselSlides}
		</kv-carousel>
	`,
});

export const MultipleLoanCards = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
	},
	template: `
		<kv-carousel
			:embla-options="{ loop: false }"
			style="width: 30rem;"
		>
			<kv-carousel-slide
				style="width: 10rem;"
			>
				<img width="100%" src="https://p11.f2.n0.cdn.getcloudapp.com/items/X6uNbg4d/Image%202020-08-24%20at%205.07.14%20PM.png?source=viewer&v=3a6ddf2dda936b41b04674cffc556b8b" />
			</kv-carousel-slide>
			<kv-carousel-slide
				style="width: 15rem;"
			>
				<img width="100%" src="https://p11.f2.n0.cdn.getcloudapp.com/items/X6uNbg4d/Image%202020-08-24%20at%205.07.14%20PM.png?source=viewer&v=3a6ddf2dda936b41b04674cffc556b8b" />
			</kv-carousel-slide>
			<kv-carousel-slide
				style="width: 15rem;"
			>
				<img width="100%" src="https://p11.f2.n0.cdn.getcloudapp.com/items/X6uNbg4d/Image%202020-08-24%20at%205.07.14%20PM.png?source=viewer&v=3a6ddf2dda936b41b04674cffc556b8b" />
			</kv-carousel-slide>
			<kv-carousel-slide
				style="width: 7rem;"
			>
				<img width="100%" src="https://p11.f2.n0.cdn.getcloudapp.com/items/X6uNbg4d/Image%202020-08-24%20at%205.07.14%20PM.png?source=viewer&v=3a6ddf2dda936b41b04674cffc556b8b" />
			</kv-carousel-slide>
			<kv-carousel-slide
				style="width: 15rem;"
			>
				<img width="100%" src="https://p11.f2.n0.cdn.getcloudapp.com/items/X6uNbg4d/Image%202020-08-24%20at%205.07.14%20PM.png?source=viewer&v=3a6ddf2dda936b41b04674cffc556b8b" />
			</kv-carousel-slide>
		</kv-carousel>
	`,
});

export const CauseSelectorCarousel = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvCauseSelector,
	},
	data() {
		return {
			causeList
		}
	},
	methods: {
		onChangeCause(e) {
			console.log(e);
		}
	},
	template: `
		<kv-carousel
			:controls-inside="true"
			:autoplay="false"
			indicator-style="none"
			:embla-options="{
				loop: false,
				containScroll: 'keepSnaps',

			}"
		>
			<kv-carousel-slide
				v-for="cause in causeList"
				:key="cause"
				style="width: auto; padding-top: .75rem;"
			>
				<kv-cause-selector
					:cause="cause"
					:as-radio="true"
					style="margin: 2rem 2rem 0"
					@change="onChangeCause"
				/>
			</kv-carousel-slide>
		</kv-carousel>
	`,
});

export const loanCardExample = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvLoadingSpinner
	},
	data() {
		return {
			loan2Loaded: false,
			loan3Loaded: false,
		}
	},
	template: `
		<div class="row">
			<div class="small-12 large-6 columns">
				<kv-carousel
					indicator-style="bar"
					@change="onCarouselSlideChange"
				>
					<kv-carousel-slide
						style="height: 0; padding-bottom: 135%;"
					>
						<div>Prefetched Loan card goes here</div>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<div v-if="loan2Loaded">
							Loan card goes here
						</div>
						<div v-else
							style="display: flex; align-items: center; justify-content: center; position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
						>
							<kv-loading-spinner />
						</div>
					</kv-carousel-slide>
					<kv-carousel-slide>
						<div v-if="loan3Loaded">
							Loan card goes here
						</div>
						<div v-else
							style="display: flex; align-items: center; justify-content: center; position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
						>
							<kv-loading-spinner />
						</div>
					</kv-carousel-slide>
				</kv-carousel>
			</div>
		</div>
	`,
	methods: {
		onCarouselSlideChange(slideIndex) {
			console.log(`carousel changed to slide: ${slideIndex}`);
			console.log('start fetching the next indexes loan data now');
		}
	}
});

const slidesImageRequire = require.context('@/assets/images/possibilities-banners/kivan-slider', true);
export const KivanSlider = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvResponsiveImage
	},
	props: {
		slidesData: {
			type: Array,
			default() {
				return [
					{
						left: [
							['small', slidesImageRequire('./kivan-1a-std.jpg')],
							['small retina', slidesImageRequire('./kivan-1a-retina.jpg')]
						],
						right: [
							['small', slidesImageRequire('./kivan-1b-std.jpg')],
							['small retina', slidesImageRequire('./kivan-1b-retina.jpg')],
						]
					},
					{
						left: [
							['small', slidesImageRequire('./kivan-2a-std.jpg')],
							['small retina', slidesImageRequire('./kivan-2a-retina.jpg')],
						],
						right: [
							['small', slidesImageRequire('./kivan-2b-std.jpg')],
							['small retina', slidesImageRequire('./kivan-2b-retina.jpg')],
						]
					},
					{
						left: [
							['small', slidesImageRequire('./kivan-3a-std.jpg')],
							['small retina', slidesImageRequire('./kivan-3a-retina.jpg')],
						],
						right: [
							['small', slidesImageRequire('./kivan-3b-std.jpg')],
							['small retina', slidesImageRequire('./kivan-3b-retina.jpg')]
						]
					}
				]
			}
		}
	},
	template: `
		<div>
			<kv-carousel
				:autoplay="false"
				:controls-inside="true"
			>
				<kv-carousel-slide
					v-for="(slide, index) in slidesData"
					:class="slide-index"
				>
					<div style="display: flex;">
						<div class="small-12 large-6">
							<kv-responsive-image :images="slide.left" alt="" />
						</div>
						<div class="small-12 large-6 show-for-large">
							<kv-responsive-image :images="slide.right" alt="" />
						</div>
					</div>
				</kv-carousel-slide>
			</kv-carousel>
		</div>
	`,
});

const imageRequire = require.context('@/assets/images/hero-slideshow/', true);
export const ImagesOnlyLazyLoadLikeHomepage = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvResponsiveImage,
	},
	data() {
		return {
			counter: 0,
		}
	},
	methods: {
		slideChange() {
			// count the number of slides shown to use for lazy-loading images with v-if
			if (this.counter < 5) {
				this.counter += 1;
			}
			console.log(this.counter);
		},
		heroImages(number) {
			return [
				['small', imageRequire(`./hero-${number}-sm-std.jpg`)],
				['small retina', imageRequire(`./hero-${number}-sm-retina.jpg`)],
				['medium', imageRequire(`./hero-${number}-med-std.jpg`)],
				['medium retina', imageRequire(`./hero-${number}-med-retina.jpg`)],
				['large', imageRequire(`./hero-${number}-lg-std.jpg`)],
				['large retina', imageRequire(`./hero-${number}-lg-retina.jpg`)],
				['xga', imageRequire(`./hero-${number}-xga-std.jpg`)],
				['xga retina', imageRequire(`./hero-${number}-xga-retina.jpg`)],
				['wxga', imageRequire(`./hero-${number}-wxga-std.jpg`)],
				['wxga retina', imageRequire(`./hero-${number}-wxga-retina.jpg`)],
			];
		},
	},
	template: `
		<div>
			<kv-carousel
				:hide-arrows="true"
				:slide-interval="5"
				:emblaOptions="{draggable: false}"
				:pause-on-hover="false"
				indicator-style="none"
				@change="slideChange"
			>
				<!-- eslint-disable max-len -->
				<kv-carousel-slide>
					<kv-responsive-image
						:images="heroImages(1)"
						alt="A woman laughs while sitting on a traditional wooden boat on the waterways of Southeast Asia."
					/>
				</kv-carousel-slide>
				<kv-carousel-slide>
					<kv-responsive-image
						:images="heroImages(2)"
						alt="Four women wear colorful, patterned African dresses and smile."
					/>
				</kv-carousel-slide>
				<kv-carousel-slide>
					<kv-responsive-image
						v-if="counter > 1"
						:images="heroImages(3)"
						alt="An older woman wearing a bright pink shirt smiles, standing in front of a tropical forest landscape."
					/>
				</kv-carousel-slide>
				<kv-carousel-slide>
					<kv-responsive-image
						v-if="counter > 2"
						:images="heroImages(4)"
						alt="An older Latin American farmer with a mustache smiles. He stands in front of tropical shrubbery."
					/>
				</kv-carousel-slide>
				<kv-carousel-slide>
					<kv-responsive-image
						v-if="counter > 3"
						:images="heroImages(5)"
						alt="A man wearing a light blue dashiki smiles in a workshop filled with traditional African crafts and jewelry."
					/>
				</kv-carousel-slide>
				<!-- eslint-enable max-len -->
			</kv-carousel>
		</div>
	`,

});

export const VisibleSlides = () => ({
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvCauseSelector,
	},
	data() {
		return {
			causeList
		}
	},
	methods: {
		onChangeCause(e) {
			console.log(e);
		}
	},
	template: `
		<kv-carousel
			:controls-inside="true"
			:autoplay="false"
			indicator-style="none"
			slides-to-scroll="visible"
			:embla-options="{
				loop: false,
			}"
		>
			<kv-carousel-slide
				v-for="cause in causeList"
				:key="cause"
				style="width: auto; padding-top: .75rem;"
			>
				<kv-cause-selector
					:cause="cause"
					:as-radio="true"
					style="margin: 2rem 2rem 0"
					@change="onChangeCause"
				/>
			</kv-carousel-slide>
		</kv-carousel>
	`,
});
