import _throttle from 'lodash/throttle';
import { onBeforeUnmount, ref, watch } from 'vue';
import useBreakpoints from '#src/composables/useBreakpoints';

// The sticky lend box shows once the "Why loans" band is above the sticky line,
// until its bottom reaches the bottom of the tags section
export function isStickyLendBoxVisible({
	bandBottom, tagsBottom, stickyTop, stackHeight,
}) {
	return bandBottom <= stickyTop && tagsBottom > stickyTop + stackHeight;
}

/**
 * The second lend box of the new user borrower profile, which fades in and sticks on desktop.
 * The returned refs are bound in the template by the same names.
 */
export default function useStickyLendBoxClone() {
	const { isLarge } = useBreakpoints();
	const stickyPanel = ref(null);
	const stickyStack = ref(null);
	const whyLoansDesktop = ref(null);
	const tagsSection = ref(null);
	const stickyLendBoxVisible = ref(false);

	function updateStickyLendBox() {
		if (!stickyPanel.value) {
			stickyLendBoxVisible.value = false;
			return;
		}
		stickyLendBoxVisible.value = isStickyLendBoxVisible({
			bandBottom: whyLoansDesktop.value.$el.getBoundingClientRect().bottom,
			tagsBottom: tagsSection.value.getBoundingClientRect().bottom,
			stickyTop: parseFloat(getComputedStyle(stickyPanel.value).top),
			stackHeight: stickyStack.value.offsetHeight,
		});
	}

	const onScrollOrResize = _throttle(updateStickyLendBox, 100);
	let sizeObserver = null;

	function stopFollowing() {
		window.removeEventListener('scroll', onScrollOrResize);
		window.removeEventListener('resize', onScrollOrResize);
		onScrollOrResize.cancel();
		sizeObserver?.disconnect();
	}

	// The sticky lend box is added only on desktop after load, so scroll is followed only while it's there
	watch(stickyPanel, panel => {
		stopFollowing();
		if (panel) {
			window.addEventListener('scroll', onScrollOrResize, { passive: true });
			window.addEventListener('resize', onScrollOrResize);
			if (typeof ResizeObserver !== 'undefined') {
				sizeObserver = new ResizeObserver(updateStickyLendBox);
				sizeObserver.observe(stickyStack.value);
				sizeObserver.observe(tagsSection.value);
			}
		}
		updateStickyLendBox();
	}, { flush: 'post' });

	onBeforeUnmount(stopFollowing);

	return {
		isLarge,
		stickyPanel,
		stickyStack,
		whyLoansDesktop,
		tagsSection,
		stickyLendBoxVisible,
		updateStickyLendBox,
	};
}
