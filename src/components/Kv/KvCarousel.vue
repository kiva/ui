<template>
	<div class="kv-carousel">
		<slot></slot>
	</div>
</template>

<script>
export default {
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
		if (this.slides.length > 1) {
			this.interval = setInterval(() => {
				this.slides[this.currentIndex].hide();
				this.currentIndex = this.getNextIndex();
				this.slides[this.currentIndex].show();
				this.$emit('change', this.currentIndex);
			}, 5000);
		}
	},
	beforeDestroy() {
		clearInterval(this.interval);
	},
	methods: {
		getNextIndex() {
			const nextSlideIndex = this.currentIndex + 1;
			if (nextSlideIndex < this.slides.length) {
				return nextSlideIndex;
			}
			return 0;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-carousel {
	position: relative;
	overflow: hidden;
	width: 100%;
}
</style>
