import { shallowRef } from 'vue';
import { getLifecycleData } from '#src/util/lifecycleStage';

/**
 * Captures lifecycle data before checkout completes and exposes the in-flight
 * promise so transaction analytics can wait for the same request.
 *
 * @param {Object} apollo Apollo Client instance
 * @returns {Object}
 */
export default function useLifecycleCapture(apollo) {
	const lifecycleDataPromise = shallowRef(null);

	function startLifecycleCapture() {
		if (lifecycleDataPromise.value || typeof window === 'undefined') {
			return;
		}
		lifecycleDataPromise.value = getLifecycleData(apollo);
	}

	return {
		lifecycleDataPromise,
		startLifecycleCapture,
	};
}
