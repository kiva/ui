import _throttle from 'lodash/throttle';
import { onBeforeUnmount, ref, watch } from 'vue';
import useBreakpoints from '#src/composables/useBreakpoints';

// The sticky lend box shows once the "Why loans" band is above the sticky line
export function isStickyLendBoxVisible({ bandBottom, stickyTop }) {
	return bandBottom <= stickyTop;
}

/**
 * Fade-in state of the new user borrower profile's second lend box on desktop.
 * The returned refs are bound in the template by the same names.
 */
export default function useStickyLendBoxClone() {
	const { isLarge } = useBreakpoints();
	const stickyBox = ref(null);
	const whyLoansDesktop = ref(null);
	const stickyLendBoxVisible = ref(false);

	function updateStickyLendBox() {
		if (!stickyBox.value) {
			stickyLendBoxVisible.value = false;
			return;
		}
		stickyLendBoxVisible.value = isStickyLendBoxVisible({
			bandBottom: whyLoansDesktop.value.$el.getBoundingClientRect().bottom,
			stickyTop: parseFloat(getComputedStyle(stickyBox.value.$el).top),
		});
	}

	const onScrollOrResize = _throttle(updateStickyLendBox, 100);

	function stopFollowing() {
		window.removeEventListener('scroll', onScrollOrResize);
		window.removeEventListener('resize', onScrollOrResize);
		onScrollOrResize.cancel();
	}

	// The sticky lend box is added only on desktop after load, so scroll is followed only while it's there
	watch(stickyBox, box => {
		stopFollowing();
		if (box) {
			window.addEventListener('scroll', onScrollOrResize, { passive: true });
			window.addEventListener('resize', onScrollOrResize);
		}
		updateStickyLendBox();
	}, { flush: 'post' });

	onBeforeUnmount(stopFollowing);

	return {
		isLarge,
		stickyBox,
		whyLoansDesktop,
		stickyLendBoxVisible,
		updateStickyLendBox,
	};
}
