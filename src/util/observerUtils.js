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
 * Makes an IntersectionObserver report a target's state again on the next frame. With
 * threshold 0, an observer only reports a target when its intersection state changes, so a
 * target skipped while it had no layout yet (e.g. a wrapper around an async component) would
 * otherwise never be reported again once it lays out. Unobserving and re-observing makes the
 * observer treat it as newly watched.
 *
 * @param {Function} getObserver Returns the current observer; re-read inside the frame so an
 *   observer torn down or replaced before the frame fires is not re-armed.
 * @param {Element} target Element to re-observe.
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
 * Whether an element's box overlaps a scroll root's reveal area: the root minus a strip at its
 * bottom, matching an IntersectionObserver rootMargin of `0px 0px -<bottomInset * 100>% 0px`.
 * A 0-height element never counts, since it has no layout to reveal yet.
 *
 * @param {{top: number, bottom: number, height: number}} rect Element box, e.g. from
 *   getBoundingClientRect.
 * @param {{top: number, bottom: number, height: number}} rootRect Scroll root box, in the
 *   same coordinates.
 * @param {number} [bottomInset] Fraction of the root's height excluded at its bottom.
 * @returns {boolean} Whether the element overlaps the reveal area.
 */
export function isInRevealArea(rect, rootRect, bottomInset = 0) {
	const revealBottom = rootRect.bottom - (bottomInset * rootRect.height);
	return rect.height > 0 && rect.top < revealBottom && rect.bottom > rootRect.top;
}

/**
 * Whether every sibling before an element has laid out (non-zero height). Content that loads
 * piece by piece, like a list of async components, can lay out one item while items above it
 * are still empty; until those have laid out, the item sits higher than it will end up.
 *
 * @param {Element|null} el Element to check; null counts as laid out, having nothing above it.
 * @returns {boolean} Whether every earlier sibling has a non-zero height.
 */
export function previousSiblingsLaidOut(el) {
	for (let above = el?.previousElementSibling; above; above = above.previousElementSibling) {
		if (above.getBoundingClientRect().height === 0) {
			return false;
		}
	}
	return true;
}
