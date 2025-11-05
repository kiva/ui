import {
	registerServiceWorker,
	isSubscribed,
	unsubscribe,
} from '#src/util/pushNotificationsManager';

describe('pushNotificationsManager', () => {
	let mockServiceWorkerRegistration;
	let mockSubscription;
	let originalNavigator;
	let originalFetch;

	beforeEach(() => {
		// Store original navigator
		originalNavigator = global.navigator;
		originalFetch = global.fetch;

		// Setup mock subscription
		mockSubscription = {
			endpoint: 'https://test-endpoint.com',
			unsubscribe: vi.fn(() => Promise.resolve(true)),
		};

		// Setup mock service worker registration
		mockServiceWorkerRegistration = {
			pushManager: {
				subscribe: vi.fn(() => Promise.resolve(mockSubscription)),
				getSubscription: vi.fn(() => Promise.resolve(mockSubscription)),
			},
		};

		// Setup mock navigator with service worker support
		global.navigator = {
			serviceWorker: {
				register: vi.fn(() => Promise.resolve(mockServiceWorkerRegistration)),
				ready: Promise.resolve(mockServiceWorkerRegistration),
				getRegistration: vi.fn(() => Promise.resolve(mockServiceWorkerRegistration)),
			},
		};

		// Setup mock fetch
		global.fetch = vi.fn(() => Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ success: true }),
		}));
	});

	afterEach(() => {
		// Restore original navigator and fetch
		global.navigator = originalNavigator;
		global.fetch = originalFetch;
		vi.clearAllMocks();
	});

	describe('registerServiceWorker', () => {
		it('should register service worker successfully', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			}));

			await registerServiceWorker();

			expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith(
				'/js/kv-notifications/kvPushNotificationsServiceWorker.js',
				{ scope: '/' }
			);
		});

		it('should subscribe to push notifications', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			}));

			await registerServiceWorker();

			expect(mockServiceWorkerRegistration.pushManager.subscribe)
				.toHaveBeenCalledWith({ userVisibleOnly: true });
		});

		it('should send endpoint to server', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			}));

			await registerServiceWorker();

			expect(global.fetch).toHaveBeenCalledWith(
				'/ajax/addPushEndpoint',
				{ endpoint: 'https://test-endpoint.com' }
			);
		});

		it('should resolve when server returns success true', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			}));

			const result = await registerServiceWorker();

			expect(result).toBeUndefined();
		});

		it('should unsubscribe and throw error when fetch fails', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: false,
				json: () => Promise.resolve({}),
			}));

			await expect(registerServiceWorker()).rejects.toThrow(
				'Oops - setting up notifications didn\'t work. Please refresh the page and try again.'
			);

			expect(mockSubscription.unsubscribe).toHaveBeenCalled();
		});

		it('should unsubscribe and throw error when response success is false', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: false }),
			}));

			await expect(registerServiceWorker()).rejects.toThrow(
				'Oops - setting up notifications didn\'t work. Please refresh the page and try again.'
			);

			expect(mockSubscription.unsubscribe).toHaveBeenCalled();
		});

		it('should reject when service worker registration fails', async () => {
			const error = new Error('Registration failed');
			global.navigator.serviceWorker.register = vi.fn(() => Promise.reject(error));

			await expect(registerServiceWorker()).rejects.toThrow('Registration failed');
		});

		it('should reject with generic message when error is falsy', async () => {
			global.navigator.serviceWorker.register = vi.fn(() => Promise.reject(null));

			await expect(registerServiceWorker()).rejects.toBe(
				'Oops - setting up notifications didn\'t work.'
			);
		});

		it('should reject when service worker is not supported', async () => {
			global.navigator = {};

			await expect(registerServiceWorker()).rejects.toBe(
				'Oops - setting up notifications didn\'t work.'
			);
		});

		it('should handle subscription failure', async () => {
			mockServiceWorkerRegistration.pushManager.subscribe = vi.fn(
				() => Promise.reject(new Error('Subscription failed'))
			);

			await expect(registerServiceWorker()).rejects.toThrow('Subscription failed');
		});
	});

	describe('isSubscribed', () => {
		it('should resolve when subscription exists', async () => {
			await expect(isSubscribed()).resolves.toBeUndefined();
		});

		it('should call getRegistration', async () => {
			await isSubscribed();

			expect(global.navigator.serviceWorker.getRegistration).toHaveBeenCalled();
		});

		it('should reject when no subscription exists', async () => {
			mockServiceWorkerRegistration.pushManager.getSubscription = vi.fn(
				() => Promise.resolve(null)
			);

			await expect(isSubscribed()).rejects.toBeUndefined();
		});

		it('should reject when no registration exists', async () => {
			global.navigator.serviceWorker.getRegistration = vi.fn(() => Promise.resolve(null));

			await expect(isSubscribed()).rejects.toBeUndefined();
		});

		it('should reject when service worker is not supported', async () => {
			global.navigator = {};

			await expect(isSubscribed()).rejects.toBeUndefined();
		});

		it('should reject when getRegistration fails', async () => {
			const error = new Error('Get registration failed');
			global.navigator.serviceWorker.getRegistration = vi.fn(() => Promise.reject(error));

			await expect(isSubscribed()).rejects.toThrow('Get registration failed');
		});

		it('should reject when getSubscription fails', async () => {
			const error = new Error('Get subscription failed');
			mockServiceWorkerRegistration.pushManager.getSubscription = vi.fn(
				() => Promise.reject(error)
			);

			await expect(isSubscribed()).rejects.toThrow('Get subscription failed');
		});
	});

	describe('unsubscribe', () => {
		it('should unsubscribe successfully', async () => {
			await unsubscribe();

			expect(mockSubscription.unsubscribe).toHaveBeenCalled();
		});

		it('should send remove endpoint request to server', async () => {
			await unsubscribe();

			expect(global.fetch).toHaveBeenCalledWith(
				'/ajax/removePushEndpoint',
				{ endpoint: 'https://test-endpoint.com' }
			);
		});

		it('should resolve when unsubscription is successful', async () => {
			const result = await unsubscribe();

			expect(result).toBeUndefined();
		});

		it('should resolve when server response is "no such token"', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: false, message: 'no such token' }),
			}));

			await expect(unsubscribe()).resolves.toBeUndefined();
			expect(mockSubscription.unsubscribe).toHaveBeenCalled();
		});

		it('should throw error when fetch fails', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: false,
				json: () => Promise.resolve({}),
			}));

			await expect(unsubscribe()).rejects.toThrow(
				'Oops - unsubscribing didn\'t work. Please refresh the page and try again.'
			);
		});

		it('should throw error when response is not successful and not "no such token"', async () => {
			global.fetch = vi.fn(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: false, message: 'other error' }),
			}));

			await expect(unsubscribe()).rejects.toThrow(
				'Oops - unsubscribing didn\'t work. Please refresh the page and try again.'
			);
		});

		it('should reject when no registration exists', async () => {
			global.navigator.serviceWorker.getRegistration = vi.fn(() => Promise.resolve(null));

			await expect(unsubscribe()).rejects.toBeUndefined();
		});

		it('should reject when service worker is not supported', async () => {
			global.navigator = {};

			await expect(unsubscribe()).rejects.toBe(
				'Oops - unsubscribing didn\'t work. Please refresh the page and try again.'
			);
		});

		it('should reject with error message when getRegistration fails', async () => {
			global.navigator.serviceWorker.getRegistration = vi.fn(
				() => Promise.reject(new Error('Failed'))
			);

			await expect(unsubscribe()).rejects.toBe(
				'Oops - unsubscribing didn\'t work. Please refresh the page and try again.'
			);
		});

		it('should handle fetch rejection', async () => {
			global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

			await expect(unsubscribe()).rejects.toBe(
				'Oops - unsubscribing didn\'t work. Please refresh the page and try again.'
			);
		});
	});
});
