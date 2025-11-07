import _throttle from 'lodash/throttle';
import kvTokensPrimitives from '@kiva/kv-tokens';
import { onUnmounted, onMounted, ref } from 'vue';

/**
 * Returns reactive breakpoint states for the viewport
 *
 * @returns Object with breakpoint state flags (isMobile, isMedium, isLarge, isExtraLarge)
 */
export default () => {
	const isMobile = ref(false);
	const isMedium = ref(false);
	const isLarge = ref(false);
	const isExtraLarge = ref(false);

	const checkBreakpoints = () => {
		const width = window?.innerWidth;
		isMobile.value = width < kvTokensPrimitives.breakpoints.md;
		isMedium.value = width >= kvTokensPrimitives.breakpoints.md;
		isLarge.value = width >= kvTokensPrimitives.breakpoints.lg;
		isExtraLarge.value = width >= kvTokensPrimitives.breakpoints.xl;
	};

	const checkBreakpointsThrottled = _throttle(checkBreakpoints, 100);

	onMounted(() => {
		checkBreakpoints();
		window.addEventListener('resize', checkBreakpointsThrottled);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', checkBreakpointsThrottled);
	});

	return {
		isMobile, isMedium, isLarge, isExtraLarge,
	};
};
