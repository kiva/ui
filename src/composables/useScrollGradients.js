import {
	nextTick, onMounted, onUnmounted, ref
} from 'vue';

/**
 * Tracks which way a horizontally scrolling element can still scroll, so a caller can show
 * an edge gradient only while there is more content that way.
 *
 * Bind `scrollContainer` as the scrolling element's ref and call `updateScrollGradients`
 * from its scroll handler, plus from any watcher whose data changes the content width.
 *
 * @returns {object} The container ref, a flag per direction, and the recompute function.
 */
export default () => {
	const scrollContainer = ref(null);
	const canScrollLeft = ref(false);
	const canScrollRight = ref(false);
	let resizeObserver = null;

	const updateScrollGradients = () => {
		const el = scrollContainer.value;
		if (!el) {
			canScrollLeft.value = false;
			canScrollRight.value = false;
			return;
		}
		// 1px tolerance so sub-pixel rounding at the extremes doesn't leave a gradient on.
		canScrollLeft.value = el.scrollLeft > 1;
		canScrollRight.value = el.scrollLeft < (el.scrollWidth - el.clientWidth - 1);
	};

	onMounted(() => {
		nextTick(updateScrollGradients);
		// The available width changes on viewport resize and on container resize, and neither
		// fires a scroll event, so recompute on both.
		window.addEventListener('resize', updateScrollGradients);
		if (typeof ResizeObserver !== 'undefined' && scrollContainer.value) {
			resizeObserver = new ResizeObserver(() => updateScrollGradients());
			resizeObserver.observe(scrollContainer.value);
		}
	});

	onUnmounted(() => {
		window.removeEventListener('resize', updateScrollGradients);
		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}
	});

	return {
		scrollContainer,
		canScrollLeft,
		canScrollRight,
		updateScrollGradients,
	};
};
