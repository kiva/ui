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

/**
 * Makes an IntersectionObserver report a target again on the next frame. With threshold 0 it
 * only reports state changes, so a target skipped before it had layout would never be
 * reported once it lays out. The observer is re-read inside the frame so a torn-down or
 * replaced one isn't re-armed.
 */
export function reobserveNextFrame(getObserver, target) {
	const observer = getObserver();
	observer?.unobserve(target);
	requestAnimationFrame(() => {
		if (observer && getObserver() === observer) {
			observer.observe(target);
		}
	});
}

/**
 * Whether an element overlaps a scroll root minus a strip at its bottom, matching a rootMargin
 * of `0px 0px -<bottomInset * 100>% 0px`. A 0-height element never counts.
 */
export function isInRevealArea(rect, rootRect, bottomInset = 0) {
	const revealBottom = rootRect.bottom - (bottomInset * rootRect.height);
	return rect.height > 0 && rect.top < revealBottom && rect.bottom > rootRect.top;
}

/**
 * Whether every sibling before an element has a non-zero height. Until they do, an element in
 * content that loads piece by piece sits higher than it will end up.
 */
export function previousSiblingsLaidOut(el) {
	for (let above = el?.previousElementSibling; above; above = above.previousElementSibling) {
		if (above.getBoundingClientRect().height === 0) {
			return false;
		}
	}
	return true;
}
