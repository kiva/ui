import { prefersReducedMotion } from '#src/util/animation/motionUtils';

describe('motionUtils', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns false when matchMedia is unavailable, as in SSR', () => {
		vi.stubGlobal('window', {});
		expect(prefersReducedMotion()).toBe(false);
	});

	it('returns true when the browser reports a reduced-motion preference', () => {
		vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
		expect(prefersReducedMotion()).toBe(true);
	});

	it('returns false when the browser reports no reduced-motion preference', () => {
		vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
		expect(prefersReducedMotion()).toBe(false);
	});

	it('queries the reduced-motion media feature', () => {
		const matchMedia = vi.fn(() => ({ matches: false }));
		vi.stubGlobal('window', { matchMedia });

		prefersReducedMotion();

		expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
	});
});
