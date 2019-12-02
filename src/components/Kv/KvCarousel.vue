<template>
	<div class="kv-carousel">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		autoplay: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			currentIndex: 0,
			interval: null,
			slides: [],
		};
	},
	mounted() {
		// get slide components
		this.slides = this.$children.filter(child => child.$options.name === 'KvCarouselSlide');

		// show initial slide
		if (this.slides.length) {
			this.slides[this.currentIndex].show();
		}

		// setup autoplay
		if (this.slides.length > 1 && this.autoplay) {
			this.interval = setInterval(() => {
				this.advance();
			}, 5000);
		}
	},
	beforeDestroy() {
		clearInterval(this.interval);
	},
	methods: {
		advance() {
			this.goToSlide(this.getNextIndex());
		},
		previous() {
			this.goToSlide(this.getPreviousIndex());
		},
		goToSlide(index) {
			this.slides[this.currentIndex].hide();
			this.currentIndex = index;
			this.slides[this.currentIndex].show();
			this.$emit('change', this.currentIndex);
		},
		getNextIndex() {
			console.log('get NEXT index triggered');
			const nextSlideIndex = this.currentIndex + 1;
			if (nextSlideIndex < this.slides.length) {
				return nextSlideIndex;
			}
			return 0;
		},
		getPreviousIndex() {
			console.log('get PREVIOUS index triggered');
			const previousSlideIndex = this.currentIndex - 1;
			if (previousSlideIndex >= 0) {
				return previousSlideIndex;
			}
			return this.slides.length - 1;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-carousel {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}
</style>
