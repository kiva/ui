<template>
	<div class="loading-overlay">
		<div class="spinner-wrapper" :style="{ top }">
			<kv-loading-spinner />
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvLoadingSpinner
	},
	data() {
		return {
			top: null,
		};
	},
	computed: {
		throttledScroll() {
			// prevent onScroll from being called more than once every 100ms
			return _throttle(this.onScroll, 100);
		}
	},
	methods: {
		// Keep the loading spinner centered on the part of this overlay that is visible within the viewport
		onScroll() {
			// get the bounds of the entire overlay
			let { top, bottom } = this.$el.getBoundingClientRect();

			// adjust the top and bottom with the height of the spinner itself
			top += this.$el.firstChild.offsetHeight;
			bottom -= this.$el.firstChild.offsetHeight;

			if (top < 0 && bottom > window.innerHeight) {
				// in this case, it just needs to be centered in the screen
				this.top = '50%';
			} else {
				// calculate the position needed to remain centered in the visible portion of the overlay
				const topBound = Math.max(top, 0);
				const bottomBound = Math.min(bottom, window.innerHeight);
				this.top = `${((bottomBound - topBound) / 2) + topBound}px`;
			}
		}
	},
	mounted() {
		this.onScroll();
		window.addEventListener('scroll', this.throttledScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.throttledScroll);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loading-overlay {
	position: absolute;
	background-color: rgba($kiva-bg-lightgray, 0.7);
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;

	.spinner-wrapper {
		position: fixed;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: top 100ms linear;
	}
}
</style>
