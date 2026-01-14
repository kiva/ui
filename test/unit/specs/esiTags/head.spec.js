import renderESIHead from '#src/esiTags/head';
import createApolloClient from '#src/api/apollo';
import renderCssVariables from '#src/rendering/cssVariables';
import renderDocumentCookies from '#src/rendering/documentCookies';
import { renderOptInExternals } from '#src/rendering/externals';
import renderGlobals from '#src/rendering/globals';
import { shouldShowAppInstallPrompt, renderAppInstallPrompt } from '#src/util/appInstallPrompt';
import setBasketCookie from '#src/util/basketCookie';
import { assignAllActiveExperiments } from '#src/util/experiment/experimentUtils';
import { setUserDataCookies } from '#src/util/optimizelyUserMetrics';
import setVisitorIdCookie from '#src/util/visitorCookie';

// Mock Apollo client with default query responses
const mockApollo = {
	query: vi.fn(({ query }) => {
		const queryString = query.loc?.source?.body || '';

		if (queryString.includes('esiHead')) {
			return Promise.resolve({
				data: {
					contentful: {
						entries: [],
					},
					my: {
						id: 'user123',
						userAccount: {
							firstName: 'Test',
							lastName: 'User',
						},
						promoBalance: {
							available: '10.00',
						},
					},
					shop: {
						id: 'basket123',
						basketCount: 2,
						hasPromo: true,
					},
				},
			});
		}

		if (queryString.includes('hasEverLoggedIn')) {
			return Promise.resolve({
				data: {
					my: {
						userAccount: {
							hasEverLoggedIn: true,
						},
					},
				},
			});
		}

		return Promise.resolve({ data: {} });
	}),
	cache: {
		extract: vi.fn(() => ({ test: 'apollo-state' })),
	},
};

// Mock dependencies
vi.mock('#src/api/apollo', () => ({
	default: vi.fn(() => mockApollo),
}));

vi.mock('#src/rendering/cssVariables', () => ({
	default: vi.fn(() => '<style>css-vars</style>'),
}));

vi.mock('#src/rendering/documentCookies', () => ({
	default: vi.fn(() => '<script>cookies</script>'),
}));

vi.mock('#src/rendering/externals', () => ({
	renderOptInExternals: vi.fn(() => '<script>externals</script>'),
}));

vi.mock('#src/rendering/globals', () => ({
	default: vi.fn(() => '<script>globals</script>'),
}));

vi.mock('#src/util/appInstallPrompt', () => ({
	shouldShowAppInstallPrompt: vi.fn(async () => true),
	renderAppInstallPrompt: vi.fn(() => '<div>app-install</div>'),
}));

vi.mock('#src/util/basketCookie', () => ({
	default: vi.fn(async () => {}),
}));

vi.mock('#src/util/experiment/experimentUtils', () => ({
	assignAllActiveExperiments: vi.fn(async () => {}),
}));

vi.mock('#src/util/optimizelyUserMetrics', () => ({
	setUserDataCookies: vi.fn(async () => {}),
}));

vi.mock('#src/util/visitorCookie', () => ({
	default: vi.fn(),
}));

describe('renderESIHead', () => {
	let mockCookieStore;
	let mockContext;
	let mockFetch;
	let mockKvAuth0;

	beforeEach(() => {
		// Setup mock cookie store
		mockCookieStore = {
			get: vi.fn(key => {
				if (key === 'kvbskt') return 'test-basket-id';
				return null;
			}),
			set: vi.fn(),
		};

		// Setup mock context
		mockContext = {
			config: {
				transport: 'https',
				host: 'www.kiva.org',
				graphqlUri: 'https://api.kiva.org/graphql',
				graphqlPossibleTypes: {},
			},
			kivaUserAgent: 'test-user-agent',
			forceHeader: false,
			esi: {
				topUrl: '/lend',
			},
		};

		mockFetch = vi.fn();
		mockKvAuth0 = {};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should render ESI head HTML successfully', async () => {
		const result = await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(result).toBeDefined();
		expect(result.html).toBeDefined();
		expect(typeof result.html).toBe('string');
	});

	it('should initialize Apollo client with correct configuration', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(createApolloClient).toHaveBeenCalledWith({
			appConfig: mockContext.config,
			cookieStore: mockCookieStore,
			kvAuth0: mockKvAuth0,
			fetch: mockFetch,
			userAgent: mockContext.kivaUserAgent,
			uri: mockContext.config.graphqlUri,
			types: mockContext.config.graphqlPossibleTypes,
			route: { query: {} },
			forceHeader: mockContext.forceHeader,
		});
	});

	it('should pass single setuiab param to Apollo client route', async () => {
		const contextWithSetuiab = {
			...mockContext,
			esi: { topUrl: '/lend?setuiab=test_exp.b' },
		};

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: contextWithSetuiab,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(createApolloClient).toHaveBeenCalledWith(
			expect.objectContaining({
				route: { query: { setuiab: 'test_exp.b' } },
			}),
		);
	});

	it('should pass multiple setuiab params to Apollo client route as array', async () => {
		const contextWithSetuiab = {
			...mockContext,
			esi: { topUrl: '/lend?setuiab=exp1.a&setuiab=exp2.b' },
		};

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: contextWithSetuiab,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(createApolloClient).toHaveBeenCalledWith(
			expect.objectContaining({
				route: { query: { setuiab: ['exp1.a', 'exp2.b'] } },
			}),
		);
	});

	it('should handle invalid topUrl gracefully and pass empty route query', async () => {
		const contextWithInvalidUrl = {
			...mockContext,
			esi: { topUrl: ':::invalid-url:::' },
		};

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: contextWithInvalidUrl,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		// Should not throw and should pass empty query
		expect(createApolloClient).toHaveBeenCalledWith(
			expect.objectContaining({
				route: { query: {} },
			}),
		);
	});

	it('should set visitor ID cookie', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(setVisitorIdCookie).toHaveBeenCalledWith(mockCookieStore);
	});

	it('should set basket cookie', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(setBasketCookie).toHaveBeenCalledWith(mockCookieStore, mockApollo);
	});

	it('should fetch user data globals with basket ID', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(mockApollo.query).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: {
					basketId: 'test-basket-id',
				},
			})
		);
	});

	it('should check if user has ever logged in', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		// Should make multiple queries including hasEverLoggedIn
		expect(mockApollo.query).toHaveBeenCalled();
		const { calls } = mockApollo.query.mock;
		const hasLoginQuery = calls.some(call => {
			const queryString = call[0]?.query?.loc?.source?.body || '';
			return queryString.includes('hasEverLoggedIn');
		});
		expect(hasLoginQuery).toBe(true);
	});

	it('should set user data cookies', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(setUserDataCookies).toHaveBeenCalledWith(mockCookieStore, mockApollo);
	});

	it('should assign all active experiments', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(assignAllActiveExperiments).toHaveBeenCalledWith(mockApollo);
	});

	it('should check app install prompt status', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(shouldShowAppInstallPrompt).toHaveBeenCalled();
		// Check that it was called with URL object
		const callArgs = shouldShowAppInstallPrompt.mock.calls[0];
		expect(callArgs[0]).toBeInstanceOf(URL);
		expect(callArgs[1]).toBe(mockCookieStore);
		expect(callArgs[2]).toBe(mockApollo);
	});

	it('should render document cookies', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderDocumentCookies).toHaveBeenCalledWith(mockCookieStore);
	});

	it('should render opt-in externals', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderOptInExternals).toHaveBeenCalledWith(mockContext.config, mockCookieStore);
	});

	it('should render app install prompt when shown', async () => {
		shouldShowAppInstallPrompt.mockResolvedValue(true);

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderAppInstallPrompt).toHaveBeenCalledWith(true);
	});

	it('should render app install prompt when not shown', async () => {
		shouldShowAppInstallPrompt.mockResolvedValue(false);

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderAppInstallPrompt).toHaveBeenCalledWith(false);
	});

	it('should render globals with Apollo state', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderGlobals).toHaveBeenCalledWith({
			__APOLLO_STATE_ESI__: { test: 'apollo-state' },
		});
	});

	it('should render CSS variables with user data', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderCssVariables).toHaveBeenCalledWith(
			expect.any(Object),
			'ui-data'
		);
	});

	it('should construct URL correctly with topUrl', async () => {
		const customContext = {
			...mockContext,
			esi: {
				topUrl: '/portfolio',
			},
		};

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: customContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		// Should still process successfully
		expect(mockApollo.query).toHaveBeenCalled();
	});

	it('should handle different transport protocols', async () => {
		const httpContext = {
			...mockContext,
			config: {
				...mockContext.config,
				transport: 'http',
			},
		};

		const result = await renderESIHead({
			cookieStore: mockCookieStore,
			context: httpContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(result.html).toBeDefined();
	});

	it('should handle empty basket ID', async () => {
		const emptyCookieStore = {
			get: vi.fn(() => null),
			set: vi.fn(),
		};

		await renderESIHead({
			cookieStore: emptyCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(mockApollo.query).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: {
					basketId: null,
				},
			})
		);
	});

	it('should extract Apollo cache state', async () => {
		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(mockApollo.cache.extract).toHaveBeenCalled();
	});

	it('should execute async operations in parallel', async () => {
		// Mock to track call order
		const callOrder = [];
		shouldShowAppInstallPrompt.mockImplementation(async () => {
			callOrder.push('shouldShowAppInstallPrompt');
			return true;
		});
		setUserDataCookies.mockImplementation(async () => {
			callOrder.push('setUserDataCookies');
		});
		assignAllActiveExperiments.mockImplementation(async () => {
			callOrder.push('assignAllActiveExperiments');
		});

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		// All should have been called
		expect(callOrder).toContain('shouldShowAppInstallPrompt');
		expect(callOrder).toContain('setUserDataCookies');
		expect(callOrder).toContain('assignAllActiveExperiments');
	});

	it('should concatenate all rendered HTML components', async () => {
		const result = await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		// Check that HTML includes all expected parts
		expect(result.html).toContain('cookies');
		expect(result.html).toContain('externals');
		expect(result.html).toContain('app-install');
		expect(result.html).toContain('globals');
		expect(result.html).toContain('css-vars');
	});

	it('should handle force header option', async () => {
		const contextWithForceHeader = {
			...mockContext,
			forceHeader: true,
		};

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: contextWithForceHeader,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(createApolloClient).toHaveBeenCalledWith(
			expect.objectContaining({
				forceHeader: true,
			})
		);
	});
});
