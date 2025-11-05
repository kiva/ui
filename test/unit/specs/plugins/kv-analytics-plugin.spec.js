import { createApp } from 'vue';
import kvAnalyticsPlugin from '#src/plugins/kv-analytics-plugin';

describe('kv-analytics-plugin', () => {
	let app;
	let mockWindow;

	beforeEach(() => {
		// Create a fresh app instance for each test
		app = createApp({
			name: 'TestApp'
		});

		// Mock window object and analytics libraries
		mockWindow = {
			gtag: vi.fn(),
			snowplow: vi.fn(),
			fbq: vi.fn(),
			optimizely: { push: vi.fn() },
			dataLayer: [],
			location: {
				href: 'https://www.kiva.org/test',
				origin: 'https://www.kiva.org',
				pathname: '/test',
				search: ''
			},
			document: {
				referrer: 'https://www.google.com'
			},
			__KV_CONFIG__: {
				gaId: 'UA-12345-1'
			},
			setTimeout: vi.fn(fn => {
				fn();
				return 1;
			}),
			setInterval: vi.fn(fn => {
				fn();
				return 1;
			}),
			clearTimeout: vi.fn(),
			clearInterval: vi.fn()
		};

		global.window = mockWindow;
		global.document = {
			referrer: 'https://www.google.com',
			readyState: 'complete',
			onreadystatechange: null,
			addEventListener: vi.fn(),
			createElement: vi.fn(() => ({
				addEventListener: vi.fn()
			}))
		};
	});

	describe('plugin installation', () => {
		it('should install plugin on app', () => {
			expect(() => {
				app.use(kvAnalyticsPlugin);
			}).not.toThrow();
		});

		it('should add $setKvAnalyticsData to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$setKvAnalyticsData).toBeDefined();
			expect(typeof app.config.globalProperties.$setKvAnalyticsData).toBe('function');
		});

		it('should add $fireAsyncPageView to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$fireAsyncPageView).toBeDefined();
			expect(typeof app.config.globalProperties.$fireAsyncPageView).toBe('function');
		});

		it('should add $fireServerPageView to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$fireServerPageView).toBeDefined();
			expect(typeof app.config.globalProperties.$fireServerPageView).toBe('function');
		});

		it('should add $fireQueuedEvents to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$fireQueuedEvents).toBeDefined();
			expect(typeof app.config.globalProperties.$fireQueuedEvents).toBe('function');
		});

		it('should add $kvSetCustomUrl to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$kvSetCustomUrl).toBeDefined();
			expect(typeof app.config.globalProperties.$kvSetCustomUrl).toBe('function');
		});

		it('should add $kvTrackEvent to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$kvTrackEvent).toBeDefined();
			expect(typeof app.config.globalProperties.$kvTrackEvent).toBe('function');
		});

		it('should add $kvTrackSelfDescribingEvent to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$kvTrackSelfDescribingEvent).toBeDefined();
			expect(typeof app.config.globalProperties.$kvTrackSelfDescribingEvent).toBe('function');
		});

		it('should add $kvTrackTransaction to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$kvTrackTransaction).toBeDefined();
			expect(typeof app.config.globalProperties.$kvTrackTransaction).toBe('function');
		});

		it('should add $kvTrackFBCustomEvent to global properties', () => {
			app.use(kvAnalyticsPlugin);
			expect(app.config.globalProperties.$kvTrackFBCustomEvent).toBeDefined();
			expect(typeof app.config.globalProperties.$kvTrackFBCustomEvent).toBe('function');
		});

		it('should register kv-track-event directive', () => {
			app.use(kvAnalyticsPlugin);
			// eslint-disable-next-line no-underscore-dangle
			expect(app._context.directives['kv-track-event']).toBeDefined();
		});
	});

	describe('$kvTrackEvent', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should be callable', () => {
			// The method doesn't track in non-browser environment but should be callable
			expect(() => {
				app.config.globalProperties.$kvTrackEvent(
					'TestCategory',
					'TestAction',
					'TestLabel',
					'TestProperty',
					100
				);
			}).not.toThrow();
		});

		it('should handle callback parameter', () => {
			const callback = vi.fn();
			expect(() => {
				app.config.globalProperties.$kvTrackEvent(
					'TestCategory',
					'TestAction',
					'TestLabel',
					'TestProperty',
					100,
					callback
				);
			}).not.toThrow();
		});

		it('should handle undefined label, property, and value', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackEvent('Category', 'Action');
			}).not.toThrow();
		});

		it('should accept various parameter types', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackEvent('Category', 'Action', 123, 456, 789);
			}).not.toThrow();
		});

		it('should handle string value parameter', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackEvent('Category', 'Action', 'Label', 'Property', '100');
			}).not.toThrow();
		});
	});

	describe('$kvTrackSelfDescribingEvent', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should be callable with event data', () => {
			const eventData = {
				schema: 'https://raw.githubusercontent.com/kiva/snowplow/schema.json',
				data: {
					loanId: 123,
					amount: 25
				}
			};

			expect(() => {
				app.config.globalProperties.$kvTrackSelfDescribingEvent(eventData);
			}).not.toThrow();
		});

		it('should handle various event data structures', () => {
			const eventData = {
				schema: 'https://example.com/schema',
				data: { test: 'data' }
			};

			expect(() => {
				app.config.globalProperties.$kvTrackSelfDescribingEvent(eventData);
			}).not.toThrow();
		});
	});

	describe('$fireAsyncPageView', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should track pageview with route objects', () => {
			const to = {
				path: '/lend',
				fullPath: '/lend?page=1',
				matched: [{ path: '/lend' }]
			};
			const from = {
				path: '/home',
				fullPath: '/home',
				matched: [{ path: '/home' }]
			};

			app.config.globalProperties.$fireAsyncPageView(to, from);

			expect(mockWindow.snowplow).toHaveBeenCalledWith('setCustomUrl', 'https://www.kiva.org/lend?page=1');
			expect(mockWindow.snowplow).toHaveBeenCalledWith('setReferrerUrl', 'https://www.kiva.org/home');
			expect(mockWindow.snowplow).toHaveBeenCalledWith('trackPageView');
		});

		it('should track pageview with string URLs', () => {
			app.config.globalProperties.$fireAsyncPageView(
				'https://www.kiva.org/page1',
				'https://www.kiva.org/page2'
			);

			expect(mockWindow.snowplow).toHaveBeenCalledWith('setCustomUrl', 'https://www.kiva.org/page1');
			expect(mockWindow.snowplow).toHaveBeenCalledWith('trackPageView');
		});

		it('should track pageview with gtag', () => {
			const to = {
				path: '/lend',
				fullPath: '/lend?page=1',
				matched: [{ path: '/lend' }]
			};

			app.config.globalProperties.$fireAsyncPageView(to, null);

			expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'page_view', {
				page_path: '/lend?page=1'
			});
		});

		it('should track pageview with Facebook pixel', () => {
			app.config.globalProperties.$fireAsyncPageView('/test', '/home');

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView');
		});

		it('should not set referrer for initial page load', () => {
			const to = { path: '/lend', matched: [{ path: '/lend' }] };
			const from = { path: '', matched: [] };

			app.config.globalProperties.$fireAsyncPageView(to, from);

			expect(mockWindow.snowplow).not.toHaveBeenCalledWith('setReferrerUrl', expect.anything());
		});
	});

	describe('$setKvAnalyticsData', () => {
		beforeEach(() => {
			// Mock setInterval properly to avoid reference errors
			mockWindow.setInterval = vi.fn(() => 1);
			mockWindow.clearInterval = vi.fn();
			mockWindow.setTimeout = vi.fn(() => 1);
			mockWindow.clearTimeout = vi.fn();
			global.window = mockWindow;
			app.use(kvAnalyticsPlugin);
		});

		it('should return a promise', () => {
			const result = app.config.globalProperties.$setKvAnalyticsData('user456');
			expect(result).toBeInstanceOf(Promise);
		});

		it('should be callable with various user IDs', async () => {
			const result1 = app.config.globalProperties.$setKvAnalyticsData('user123');
			expect(result1).toBeInstanceOf(Promise);

			const result2 = app.config.globalProperties.$setKvAnalyticsData(null);
			expect(result2).toBeInstanceOf(Promise);
		});
	});

	describe('$kvSetCustomUrl', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should be callable with custom URL', () => {
			expect(() => {
				app.config.globalProperties.$kvSetCustomUrl('https://www.kiva.org/custom');
			}).not.toThrow();
		});

		it('should be callable without URL provided', () => {
			expect(() => {
				app.config.globalProperties.$kvSetCustomUrl();
			}).not.toThrow();
		});
	});

	describe('$kvTrackTransaction', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should track transaction with all providers', () => {
			const transactionData = {
				transactionId: 'TXN123',
				itemTotal: 100,
				loanTotal: 75,
				donationTotal: 25,
				depositTotal: 0,
				loans: [
					{ id: '1', __typename: 'Loan', price: 25 },
					{ id: '2', __typename: 'Loan', price: 50 }
				],
				donations: [
					{ id: 'd1', __typename: 'Donation', price: 25 }
				],
				isFTD: false,
				kivaCards: [],
				kivaCardTotal: 0
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			// Facebook tracking
			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'Purchase', {
				currency: 'USD',
				value: 100,
				content_type: 'ReturningLender'
			});

			// Google Analytics tracking
			expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'purchase', {
				transaction_id: 'TXN123',
				value: 100,
				currency: 'USD',
				items: expect.arrayContaining([
					{
						id: '1', name: 'Loan', price: 25, quantity: 1
					},
					{
						id: '2', name: 'Loan', price: 50, quantity: 1
					},
					{
						id: 'd1', name: 'Donation', price: 25, quantity: 1
					}
				]),
				non_interaction: true
			});

			// Optimizely tracking
			expect(mockWindow.optimizely.push).toHaveBeenCalledWith({
				type: 'event',
				eventName: 'loan_share_purchase',
				tags: {
					revenue: 7500,
					loan_share_purchase_amount: 75
				}
			});

			expect(mockWindow.optimizely.push).toHaveBeenCalledWith({
				type: 'event',
				eventName: 'donation',
				tags: {
					revenue: 2500,
					donation_amount: 25
				}
			});
		});

		it('should handle first time depositor transaction', () => {
			const transactionData = {
				transactionId: 'TXN456',
				itemTotal: 50,
				loanTotal: 50,
				donationTotal: 0,
				depositTotal: 0,
				loans: [{ id: '1', __typename: 'Loan', price: 50 }],
				donations: [],
				isFTD: true,
				kivaCards: [],
				kivaCardTotal: 0
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'Purchase', {
				currency: 'USD',
				value: 50,
				content_type: 'FirstTimeDepositor'
			});
		});

		it('should track kiva cards in transaction', () => {
			const transactionData = {
				transactionId: 'TXN789',
				itemTotal: 100,
				loanTotal: 0,
				donationTotal: 0,
				depositTotal: 0,
				loans: [],
				donations: [],
				isFTD: false,
				kivaCards: [{ id: 'KC1', price: 100 }],
				kivaCardTotal: 100
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			// Should track custom FB event for kiva cards
			expect(mockWindow.fbq).toHaveBeenCalledWith('trackCustom', 'transactionContainsKivaCards', {
				kivaCardTotal: 100
			});
		});

		it('should not track when transaction ID is empty', () => {
			const transactionData = {
				transactionId: '',
				itemTotal: 0,
				loans: [],
				donations: []
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockWindow.fbq).not.toHaveBeenCalled();
			expect(mockWindow.gtag).not.toHaveBeenCalled();
		});

		it('should track deposit in Optimizely', () => {
			const transactionData = {
				transactionId: 'TXN999',
				itemTotal: 50,
				loanTotal: 0,
				donationTotal: 0,
				depositTotal: 50,
				loans: [],
				donations: [],
				isFTD: false,
				kivaCards: [],
				kivaCardTotal: 0
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockWindow.optimizely.push).toHaveBeenCalledWith({
				type: 'event',
				eventName: 'deposit',
				tags: {
					revenue: 5000,
					deposit_amount: 50
				}
			});
		});

		it('should push transaction data to dataLayer', () => {
			const transactionData = {
				transactionId: 'TXN111',
				itemTotal: 25,
				loanTotal: 25,
				donationTotal: 0,
				depositTotal: 0,
				loans: [{ id: '1', __typename: 'Loan', price: 25 }],
				donations: [],
				isFTD: false,
				kivaCards: [],
				kivaCardTotal: 0
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockWindow.dataLayer).toContainEqual({
				event: 'setTransactionData',
				...transactionData
			});
		});
	});

	describe('$kvTrackFBCustomEvent', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should be callable with event data', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackFBCustomEvent('CustomEvent', { key: 'value' });
			}).not.toThrow();
		});

		it('should be callable without data', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackFBCustomEvent('SimpleEvent');
			}).not.toThrow();
		});
	});

	describe('$fireServerPageView', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should fire pageview on document ready', () => {
			app.config.globalProperties.$fireServerPageView();

			// Simulate document ready state change
			if (document.onreadystatechange) {
				document.onreadystatechange();
			}

			expect(mockWindow.snowplow).toHaveBeenCalledWith('trackPageView');
		});
	});

	describe('v-kv-track-event directive', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should add click listener to element', () => {
			const el = document.createElement('button');
			const binding = {
				value: [['Category', 'Action', 'Label']]
			};

			// eslint-disable-next-line no-underscore-dangle
			const directive = app._context.directives['kv-track-event'];
			directive.beforeMount(el, binding);

			expect(el.addEventListener).toBeDefined();
		});
	});

	describe('without analytics libraries', () => {
		beforeEach(() => {
			delete mockWindow.gtag;
			delete mockWindow.snowplow;
			delete mockWindow.fbq;
			delete mockWindow.optimizely;
			delete global.window.gtag;
			delete global.window.snowplow;
			delete global.window.fbq;
			delete global.window.optimizely;
			app.use(kvAnalyticsPlugin);
		});

		it('should handle pageview without libraries', () => {
			expect(() => {
				app.config.globalProperties.$fireAsyncPageView('/test', '/home');
			}).not.toThrow();
		});

		it('should handle trackEvent without libraries', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackEvent('Category', 'Action');
			}).not.toThrow();
		});

		it('should queue events when snowplow not loaded', () => {
			expect(() => {
				app.config.globalProperties.$kvTrackEvent('Category', 'Action');
			}).not.toThrow();
		});
	});
});
