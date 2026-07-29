import { shallowRef } from 'vue';
import { getLifecycleData } from '#src/util/lifecycleStage';

/**
 * Captures the lender's lifecycle stage before checkout completes, and exposes the
 * in-flight request so transaction analytics can wait on that same lookup.
 *
 * The promise is stored rather than its resolved value: checkout can complete before
 * the request returns, and reading a value that has not arrived yet silently drops
 * the re-engagement event.
 *
 * @param {Object} apollo Apollo Client instance
 * @returns {Object}
 */
export default function useLifecycleCapture(apollo) {
	const lifecycleDataPromise = shallowRef(null);

	/**
	 * Starts the lookup once. Callers decide when a logged-in lender is known.
	 */
	function startLifecycleCapture() {
		// no pixel on the server, so there is nothing to report from an SSR pass
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
