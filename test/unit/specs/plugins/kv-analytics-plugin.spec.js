import { createApp } from 'vue';
import kvAnalyticsPlugin from '#src/plugins/kv-analytics-plugin';

const { mockTrackFBTransaction } = vi.hoisted(() => ({ mockTrackFBTransaction: vi.fn() }));

// The Meta transaction behavior (Purchase gating, content_type, kivaCard/FTD signals) belongs to
// @kiva/kv-analytics and is tested there; here only the delegation is asserted. Everything else
// (trackFBPageView, trackFBCustomEvent) runs the real package code against the mocked window.fbq.
vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	trackFBTransaction: mockTrackFBTransaction,
}));

describe('kv-analytics-plugin', () => {
	let app;
	let mockWindow;
	let cookieValues;
	let mockCookieStore;

	beforeEach(() => {
		mockTrackFBTransaction.mockClear();
		// Create a fresh app instance for each test
		app = createApp({
			name: 'TestApp'
		});

		// Mock the isomorphic cookieStore the plugin reads transactor cookies through
		cookieValues = {};
		mockCookieStore = { get: name => cookieValues[name] };

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
			app.use(kvAnalyticsPlugin, { cookieStore: mockCookieStore });
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

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView', { user_type: 'non-transactor' });
		});

		it('should mark the pageview user_type as transactor when the has-lent cookie is set', () => {
			cookieValues.kvu_lb = 'true';

			app.config.globalProperties.$fireAsyncPageView('/test', '/home');

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView', { user_type: 'transactor' });
		});

		it('should mark the pageview user_type as transactor when the has-deposit cookie is set', () => {
			cookieValues.kvu_db = 'true';

			app.config.globalProperties.$fireAsyncPageView('/test', '/home');

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView', { user_type: 'transactor' });
		});

		it('should mark the pageview user_type as non-transactor when the cookie value is false', () => {
			cookieValues.kvu_lb = 'false';
			cookieValues.kvu_db = 'false';

			app.config.globalProperties.$fireAsyncPageView('/test', '/home');

			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView', { user_type: 'non-transactor' });
		});

		it('should not set referrer for initial page load', () => {
			const to = { path: '/lend', matched: [{ path: '/lend' }] };
			const from = { path: '', matched: [] };

			app.config.globalProperties.$fireAsyncPageView(to, from);

			expect(mockWindow.snowplow).not.toHaveBeenCalledWith('setReferrerUrl', expect.anything());
		});
	});

	describe('$fireAsyncPageView without a cookieStore', () => {
		// Installed without the cookieStore option, as some consumers do (e.g. LoanReservation.spec)
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		it('should default to non-transactor without throwing', () => {
			expect(() => {
				app.config.globalProperties.$fireAsyncPageView('/test', '/home');
			}).not.toThrow();
			expect(mockWindow.fbq).toHaveBeenCalledWith('track', 'PageView', { user_type: 'non-transactor' });
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

			// Facebook tracking is delegated to the shared package
			expect(mockTrackFBTransaction).toHaveBeenCalledExactlyOnceWith(transactionData);

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

		it('should include kiva cards in the GA purchase items', () => {
			const transactionData = {
				transactionId: 'TXN-KC',
				itemTotal: 100,
				loanTotal: 25,
				donationTotal: 0,
				depositTotal: 0,
				loans: [{ id: '1', __typename: 'Loan', price: 25 }],
				donations: [],
				isFTD: false,
				kivaCards: [{ id: '2', __typename: 'KivaCard', price: 75 }],
				kivaCardTotal: 75
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			const purchaseCall = mockWindow.gtag.mock.calls.find(call => call[1] === 'purchase');
			expect(purchaseCall[2].items).toHaveLength(2);
			expect(purchaseCall[2].items.map(item => item.id)).toEqual(['1', '2']);
		});

		it('should not track when the transaction ID is null', () => {
			// callers pass numeral(id).value(), which yields null — not '' — for a missing id
			const transactionData = {
				transactionId: null,
				itemTotal: 25,
				loanTotal: 25,
				donationTotal: 0,
				depositTotal: 0,
				loans: [],
				donations: [],
				isFTD: false,
				kivaCards: [],
				kivaCardTotal: 0
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockTrackFBTransaction).not.toHaveBeenCalled();
			expect(mockWindow.gtag).not.toHaveBeenCalled();
		});

		it('should not throw when window.optimizely is null', () => {
			// typeof null === 'object', so a naive guard would treat this as loaded and throw on .push
			mockWindow.optimizely = null;
			const transactionData = {
				transactionId: 'TXN-OPT',
				itemTotal: 25,
				loanTotal: 25,
				donationTotal: 0,
				depositTotal: 0,
				loans: [],
				donations: [],
				isFTD: false,
				kivaCards: [],
				kivaCardTotal: 0
			};

			expect(() => app.config.globalProperties.$kvTrackTransaction(transactionData)).not.toThrow();
			expect(mockTrackFBTransaction).toHaveBeenCalledExactlyOnceWith(transactionData);
		});

		it('should not track when transaction ID is empty', () => {
			const transactionData = {
				transactionId: '',
				itemTotal: 0,
				loans: [],
				donations: []
			};

			app.config.globalProperties.$kvTrackTransaction(transactionData);

			expect(mockTrackFBTransaction).not.toHaveBeenCalled();
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

	describe('lifecycle re-engagement events', () => {
		beforeEach(() => {
			app.use(kvAnalyticsPlugin);
		});

		const transaction = overrides => ({
			transactionId: 'TXN222',
			itemTotal: 50,
			loanTotal: 25,
			donationTotal: 0,
			depositTotal: 25,
			loans: [{ id: '1', __typename: 'Loan', price: 25 }],
			donations: [],
			isFTD: false,
			kivaCards: [],
			kivaCardTotal: 0,
			lifecycleStage: null,
			daysSinceLastLoan: null,
			reEngagementEvent: null,
			...overrides,
		});

		it('fires lapsedLenderReEngaged when a churned lender transacts', () => {
			app.config.globalProperties.$kvTrackTransaction(transaction({
				lifecycleStage: 'lapsedChurned',
				daysSinceLastLoan: 900,
				reEngagementEvent: 'lapsedLenderReEngaged',
			}));

			expect(mockWindow.fbq).toHaveBeenCalledWith('trackCustom', 'lapsedLenderReEngaged', {
				loanTotal: 25,
				itemTotal: 50,
				lifecycleStage: 'lapsedChurned',
				daysSinceLastLoan: 900,
			});
		});

		it.each(['idle90', 'idle180', 'idle365'])(
			'fires idleLenderReEngaged for %s, recording the bucket',
			stage => {
				app.config.globalProperties.$kvTrackTransaction(transaction({
					lifecycleStage: stage,
					daysSinceLastLoan: 200,
					reEngagementEvent: 'idleLenderReEngaged',
				}));

				expect(mockWindow.fbq).toHaveBeenCalledWith(
					'trackCustom',
					'idleLenderReEngaged',
					expect.objectContaining({ lifecycleStage: stage, daysSinceLastLoan: 200 })
				);
			}
		);

		it('does not fire on a deposit or donation without a loan purchase', () => {
			app.config.globalProperties.$kvTrackTransaction(transaction({
				lifecycleStage: 'lapsedChurned',
				daysSinceLastLoan: 900,
				reEngagementEvent: 'lapsedLenderReEngaged',
				loans: [],
				loanTotal: 0,
				donations: [{ id: 'd1', __typename: 'Donation', price: 5 }],
				donationTotal: 5,
			}));

			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'lapsedLenderReEngaged',
				expect.anything()
			);
		});

		it.each(['new', 'engaged', 'registered'])('fires neither event for %s lenders', stage => {
			app.config.globalProperties.$kvTrackTransaction(transaction({ lifecycleStage: stage }));

			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'lapsedLenderReEngaged',
				expect.anything()
			);
			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'idleLenderReEngaged',
				expect.anything()
			);
		});

		it('fires neither event when the transaction contains no loan purchase', () => {
			app.config.globalProperties.$kvTrackTransaction(transaction({
				lifecycleStage: 'lapsedChurned',
				daysSinceLastLoan: 900,
				reEngagementEvent: 'lapsedLenderReEngaged',
				loans: [],
				loanTotal: 0,
				kivaCards: [{ id: 'kc1', __typename: 'KivaCard', price: 50 }],
				kivaCardTotal: 50,
			}));

			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'lapsedLenderReEngaged',
				expect.anything()
			);
		});

		it('fires neither event for guests, who have no lifecycle stage', () => {
			app.config.globalProperties.$kvTrackTransaction(transaction({ lifecycleStage: null }));

			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'lapsedLenderReEngaged',
				expect.anything()
			);
			expect(mockWindow.fbq).not.toHaveBeenCalledWith(
				'trackCustom',
				'idleLenderReEngaged',
				expect.anything()
			);
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
