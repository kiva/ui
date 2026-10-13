/**
 * Whether the visitor has asked for reduced motion. SSR-safe: without a `window` or a
 * `matchMedia` implementation this reads as no preference, so animations run by default
 * until the browser confirms otherwise.
 *
 * @returns {boolean} Whether prefers-reduced-motion: reduce is active.
 */
export function prefersReducedMotion() {
	return typeof window !== 'undefined'
		&& typeof window.matchMedia === 'function'
		&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
