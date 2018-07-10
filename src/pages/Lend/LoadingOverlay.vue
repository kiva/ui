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
		onScroll() {
			// Keep the loading spinner centered on the part of this overlay that is visible within the viewport
			const bounds = this.$el.getBoundingClientRect();
			if (bounds.top < 0 && bounds.bottom > window.innerHeight) {
				this.top = '50%';
			} else {
				const topBound = Math.max(bounds.top, 0);
				const bottomBound = Math.min(bounds.bottom, window.innerHeight);
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

	.spinner-wrapper {
		position: fixed;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: top 100ms linear;
	}
}
</style>
