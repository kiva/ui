/**
 * Returns true if this browser supports IntersectionObserver.
 * Adapted from https://github.com/w3c/IntersectionObserver/issues/296#issuecomment-452230176
 */
export function checkIntersectionObserverSupport() {
	if (typeof window === 'undefined'
		|| !('IntersectionObserver' in window)
		|| !('IntersectionObserverEntry' in window)
		|| !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
		return false;
	}
	return true;
}

/**
 * Creates an IntersectionObserver and uses that observer to observe the given targets.
 * Returns the created observer or undefined when IntersectionObserver is not supported.
 */
export function createIntersectionObserver({ callback, options, targets } = {}) {
	if (checkIntersectionObserverSupport()) {
		const observer = new IntersectionObserver(callback, options);
		targets.forEach(target => observer.observe(target));
		return observer;
	}
}
