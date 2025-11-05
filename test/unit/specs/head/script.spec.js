describe('head/script.js', () => {
	let scriptModule;
	let mockConfig;
	let mockGlobalOneTrustEvent;
	let originalDocument;
	let originalWindow;

	beforeEach(() => {
		// Save originals
		originalDocument = global.document;
		originalWindow = global.window;

		// Setup mock DOM
		const mockHead = {
			appendChild: vi.fn(),
			parentNode: {
				insertBefore: vi.fn(),
			},
		};

		global.document = {
			cookie: '',
			getElementsByTagName: vi.fn(() => [mockHead]),
			createElement: vi.fn(() => ({
				async: false,
				src: '',
			})),
		};

		global.window = {
			dataLayer: [],
			gtag: vi.fn(),
			snowplow: vi.fn(),
			optimizely: {
				push: vi.fn(),
			},
			hj: vi.fn(),
			recaptchaLoaded: null,
			recaptchaOnloadCallback: null,
			OptanonWrapper: null,
		};

		mockConfig = {
			gaId: 'UA-12345',
			snowplowUri: 'https://snowplow.example.com',
			googleTagmanagerId: 'GTM-12345',
			hotjarId: 12345,
			enableAnalytics: true,
			enableGA: true,
			enableSnowplow: true,
			enableGTM: true,
			enableHotjar: true,
			enableOptimizely: true,
			oneTrust: {
				enable: false,
			},
		};

		mockGlobalOneTrustEvent = vi.fn();
	});

	afterEach(() => {
		global.document = originalDocument;
		global.window = originalWindow;
		vi.resetModules();
	});

	describe('basic initialization', () => {
		it('should export a function', async () => {
			scriptModule = (await import('#src/head/script')).default;
			expect(typeof scriptModule).toBe('function');
		});

		it('should initialize dataLayer on window', async () => {
			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.dataLayer).toBeDefined();
			expect(Array.isArray(global.window.dataLayer)).toBe(true);
		});

		it('should set up recaptchaLoaded promise', async () => {
			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.recaptchaLoaded).toBeInstanceOf(Promise);
			expect(typeof global.window.recaptchaOnloadCallback).toBe('function');
		});
	});

	describe('cookie parsing', () => {
		it('should parse kvgdpr cookie with opted_out=true', async () => {
			global.document.cookie = 'kvgdpr=opted_out=true';
			scriptModule = (await import('#src/head/script')).default;

			// With optout=true, analytics scripts should not be inserted
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			// Since optout is true, GA and GTM should not be called
			expect(global.document.getElementsByTagName).not.toHaveBeenCalledWith('script');
		});

		it('should parse kvgdpr cookie with pii_opted_out=true', async () => {
			global.document.cookie = 'kvgdpr=pii_opted_out=true';
			scriptModule = (await import('#src/head/script')).default;

			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			// PII optout should prevent GA and GTM
			expect(global.document.getElementsByTagName).not.toHaveBeenCalledWith('script');
		});

		it('should handle multiple cookies', async () => {
			global.document.cookie = 'session=abc123; kvgdpr=opted_out=false; other=value';
			scriptModule = (await import('#src/head/script')).default;

			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.dataLayer).toBeDefined();
		});

		it('should handle empty cookie string', async () => {
			global.document.cookie = '';
			scriptModule = (await import('#src/head/script')).default;

			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.dataLayer).toBeDefined();
		});
	});

	describe('analytics scripts - legacy mode (oneTrust disabled)', () => {
		it('should insert Google Analytics when enabled and not opted out', async () => {
			mockConfig.oneTrust.enable = false;
			mockConfig.enableGA = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.document.getElementsByTagName).toHaveBeenCalledWith('script');
			expect(global.document.createElement).toHaveBeenCalledWith('script');
		});

		it('should not insert GA when opted out', async () => {
			global.document.cookie = 'kvgdpr=opted_out=true';
			mockConfig.oneTrust.enable = false;
			mockConfig.enableGA = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.document.getElementsByTagName).not.toHaveBeenCalledWith('script');
		});

		it('should not insert GA when pii opted out', async () => {
			global.document.cookie = 'kvgdpr=pii_opted_out=true';
			mockConfig.oneTrust.enable = false;
			mockConfig.enableGA = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.document.getElementsByTagName).not.toHaveBeenCalledWith('script');
		});

		it('should activate Optimizely when enabled and not opted out', async () => {
			mockConfig.oneTrust.enable = false;
			mockConfig.enableOptimizely = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.optimizely.push).toHaveBeenCalledWith({
				type: 'sendEvents',
			});
		});

		it('should not activate Optimizely when opted out', async () => {
			global.document.cookie = 'kvgdpr=opted_out=true';
			mockConfig.oneTrust.enable = false;
			mockConfig.enableOptimizely = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.optimizely.push).not.toHaveBeenCalled();
		});

		it('should insert Snowplow when enabled', async () => {
			mockConfig.oneTrust.enable = false;
			mockConfig.enableSnowplow = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			// Snowplow should initialize regardless of opt-out
			expect(global.window.snowplow).toBeDefined();
		});

		it('should not insert scripts when analytics is disabled', async () => {
			mockConfig.enableAnalytics = false;
			mockConfig.oneTrust.enable = false;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.document.getElementsByTagName).not.toHaveBeenCalledWith('script');
			expect(global.window.optimizely.push).not.toHaveBeenCalled();
		});
	});

	describe('OneTrust mode', () => {
		beforeEach(() => {
			global.OneTrust = {
				InsertHtml: vi.fn((html, target, callback) => {
					// Simulate OneTrust calling the callback
					if (callback) callback();
				}),
			};
		});

		it('should set up OptanonWrapper when OneTrust is enabled', async () => {
			mockConfig.oneTrust.enable = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(typeof global.window.OptanonWrapper).toBe('function');
		});

		it('should call globalOneTrustEvent when OptanonWrapper is executed', async () => {
			mockConfig.oneTrust.enable = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			// Execute the OptanonWrapper
			global.window.OptanonWrapper();

			expect(mockGlobalOneTrustEvent).toHaveBeenCalled();
		});

		it('should use OneTrust.InsertHtml for analytics scripts', async () => {
			mockConfig.oneTrust.enable = true;
			mockConfig.enableGA = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			// Execute OptanonWrapper to trigger script insertion
			global.window.OptanonWrapper();

			expect(global.OneTrust.InsertHtml).toHaveBeenCalled();
		});

		it('should respect opt-out flags in OneTrust mode', async () => {
			global.document.cookie = 'kvgdpr=opted_out=true';
			mockConfig.oneTrust.enable = true;
			mockConfig.enableOptimizely = true;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			global.window.OptanonWrapper();

			// Optimizely should not be inserted when opted out
			const { calls } = global.OneTrust.InsertHtml.mock;
			const optimizelyCall = calls.find(call => {
				const callback = call[2];
				return callback && callback.name === 'activateOptimizely';
			});
			expect(optimizelyCall).toBeUndefined();
		});
	});

	describe('edge cases', () => {
		it('should handle document being undefined (server-side)', async () => {
			global.document = undefined;

			scriptModule = (await import('#src/head/script')).default;

			// Server-side should not have analytics enabled
			const serverConfig = { ...mockConfig, enableAnalytics: false };

			expect(() => {
				scriptModule(serverConfig, mockGlobalOneTrustEvent);
			}).not.toThrow();
		});

		it('should preserve existing dataLayer', async () => {
			global.window.dataLayer = ['existing', 'data'];

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.dataLayer).toContain('existing');
			expect(global.window.dataLayer).toContain('data');
		});

		it('should handle missing config properties gracefully', async () => {
			const minimalConfig = {
				enableAnalytics: false,
			};

			scriptModule = (await import('#src/head/script')).default;

			expect(() => {
				scriptModule(minimalConfig, mockGlobalOneTrustEvent);
			}).not.toThrow();
		});

		it('should handle config with all analytics disabled', async () => {
			mockConfig.enableGA = false;
			mockConfig.enableSnowplow = false;
			mockConfig.enableGTM = false;
			mockConfig.enableHotjar = false;
			mockConfig.enableOptimizely = false;

			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			expect(global.window.dataLayer).toBeDefined();
		});
	});

	describe('recaptcha promise', () => {
		it('should resolve recaptchaLoaded when callback is called', async () => {
			scriptModule = (await import('#src/head/script')).default;
			scriptModule(mockConfig, mockGlobalOneTrustEvent);

			const promise = global.window.recaptchaLoaded;
			global.window.recaptchaOnloadCallback();

			await expect(promise).resolves.toBe(true);
		});
	});
});
