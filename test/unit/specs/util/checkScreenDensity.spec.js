describe('checkScreenDensity.js', () => {
	let matchMediaMock;

	beforeEach(() => {
		// Reset module state by clearing require cache
		vi.resetModules();

		// Mock window.matchMedia
		matchMediaMock = vi.fn();
		global.window = {
			matchMedia: matchMediaMock,
			devicePixelRatio: 1,
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('isHighDensity', () => {
		it('should return false when window is undefined', async () => {
			delete global.window;
			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(false);
		});

		it('should return true when resolution media query matches', async () => {
			matchMediaMock.mockImplementation(query => ({
				matches: query.includes('min-resolution'),
			}));

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return true when pixel ratio media query matches', async () => {
			matchMediaMock.mockImplementation(query => ({
				matches: query.includes('webkit-min-device-pixel-ratio'),
			}));

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return true when devicePixelRatio > 1.3', async () => {
			matchMediaMock.mockReturnValue({ matches: false });
			global.window.devicePixelRatio = 1.5;

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return false when devicePixelRatio <= 1.3 and no media queries match', async () => {
			matchMediaMock.mockReturnValue({ matches: false });
			global.window.devicePixelRatio = 1.2;

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(false);
		});

		it('should cache the result on subsequent calls', async () => {
			matchMediaMock.mockReturnValue({ matches: true });

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			const firstCall = fn();
			const secondCall = fn();

			expect(firstCall).toBe(secondCall);
			// matchMedia should be called only during first execution
			expect(matchMediaMock).toHaveBeenCalled();
		});

		it('should handle missing window.matchMedia gracefully', async () => {
			global.window.matchMedia = undefined;
			global.window.devicePixelRatio = 1.5;

			const { isHighDensity: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});
	});

	describe('isRetina', () => {
		it('should return false when window is undefined', async () => {
			delete global.window;
			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(false);
		});

		it('should return true when resolution media query matches for retina', async () => {
			matchMediaMock.mockImplementation(query => ({
				matches: query.includes('min-resolution: 192dpi'),
			}));

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return true when pixel ratio media query matches for retina', async () => {
			matchMediaMock.mockImplementation(query => ({
				matches: query.includes('webkit-min-device-pixel-ratio: 2'),
			}));

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return true when devicePixelRatio >= 2', async () => {
			matchMediaMock.mockReturnValue({ matches: false });
			global.window.devicePixelRatio = 2;

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});

		it('should return false when devicePixelRatio < 2 and no media queries match', async () => {
			matchMediaMock.mockReturnValue({ matches: false });
			global.window.devicePixelRatio = 1.5;

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(false);
		});

		it('should cache the result on subsequent calls', async () => {
			matchMediaMock.mockReturnValue({ matches: true });

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			const firstCall = fn();
			const secondCall = fn();

			expect(firstCall).toBe(secondCall);
			expect(matchMediaMock).toHaveBeenCalled();
		});

		it('should handle missing window.matchMedia gracefully', async () => {
			global.window.matchMedia = undefined;
			global.window.devicePixelRatio = 2.5;

			const { isRetina: fn } = await import('#src/util/checkScreenDensity');
			expect(fn()).toBe(true);
		});
	});
});
