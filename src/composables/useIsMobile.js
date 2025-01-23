import _throttle from 'lodash/throttle';
import kvTokensPrimitives from '@kiva/kv-tokens';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';

/**
 * Returns whether the viewport is mobile
 *
 * @param breakpoint Optional breakpoint override to use for mobile
 * @returns Whether the viewport is mobile
 */
export default breakpoint => {
	const isMobile = ref(false);

	const checkIsMobile = () => {
		isMobile.value = window?.innerWidth < (breakpoint ?? kvTokensPrimitives.breakpoints.md);
	};

	const checkIsMobileThrottled = _throttle(checkIsMobile, 100);

	onBeforeMount(() => {
		checkIsMobile();
		window.addEventListener('resize', checkIsMobileThrottled);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', checkIsMobileThrottled);
	});

	return { isMobile };
};
