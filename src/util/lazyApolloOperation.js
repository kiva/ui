import { createIntersectionObserver } from '#src/util/observerUtils';

/**
 * Normalize an operation's `lazy` option into IntersectionObserver options plus an optional target ref name.
 *
 * @param {boolean|object} [lazy] - true, or IntersectionObserver options with an optional `target` ref name
 * @returns {object|null} null when the operation is not lazy
 */
export function parseLazy(lazy) {
	if (!lazy) return null;
	if (lazy === true) return { rootMargin: '500px' };
	const { target, ...options } = lazy;
	return { rootMargin: '500px', ...options, target };
}

function resolveTarget(instance, refName) {
	let target = refName ? instance.$refs?.[refName] : instance.$el;
	if (target && !(target instanceof Element) && target.$el) {
		target = target.$el;
	}
	// A fragment or v-if root leaves $el on a text or comment node
	while (target && !(target instanceof Element)) {
		target = target.nextSibling;
	}
	return target ?? null;
}

/**
 * Call `start` once the component's element is near the viewport: its root element, or the template ref
 * named by the lazy config's `target`. Starts immediately when there is no element to observe or the
 * browser has no IntersectionObserver.
 *
 * @param {object} options
 * @param {object} options.instance - Component public instance, for `$el` and `$refs`
 * @param {object} options.lazyConfig - Non-null result of parseLazy
 * @param {Function} options.start - Called at most once
 * @param {string} options.label - Prefix for the missing-element warning
 * @returns {IntersectionObserver|null} The observer to disconnect on unmount, or null when started immediately
 */
export function observeLazyOperation({
	instance,
	lazyConfig,
	start,
	label,
}) {
	const { target: refName, ...observerOptions } = lazyConfig;
	const target = resolveTarget(instance, refName);

	if (!target) {
		console.warn(`[${label}] No Element found for IntersectionObserver`);
		start();
		return null;
	}

	let started = false;
	const observer = createIntersectionObserver({
		targets: [target],
		options: observerOptions,
		callback: entries => {
			if (!started && entries.some(entry => entry.intersectionRatio > 0)) {
				started = true;
				observer.disconnect();
				start();
			}
		},
	});

	if (!observer) {
		start();
		return null;
	}

	return observer;
}
