import renderESIHead from '#src/esiTags/head';

// Mock dependencies
vi.mock('#src/api/apollo');
vi.mock('#src/rendering/cssVariables');
vi.mock('#src/rendering/documentCookies');
vi.mock('#src/rendering/externals');
vi.mock('#src/rendering/globals');
vi.mock('#src/util/appInstallPrompt');
vi.mock('#src/util/basketCookie');
vi.mock('#src/util/experiment/experimentUtils');
vi.mock('#src/util/optimizelyUserMetrics');
vi.mock('#src/util/visitorCookie');

describe('renderESIHead', () => {
	let mockCookieStore;
	let mockContext;
	let mockFetch;
	let mockKvAuth0;
	let mockApollo;

	beforeEach(async () => {
		// Reset all mocks
		vi.clearAllMocks();

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

		// Setup mock Apollo client
		mockApollo = {
			query: vi.fn(),
			cache: {
				extract: vi.fn(() => ({ test: 'apollo-state' })),
			},
		};

		// Mock apollo module
		const apolloModule = await import('#src/api/apollo');
		apolloModule.default = vi.fn(() => mockApollo);

		// Mock rendering modules
		const cssVariablesModule = await import('#src/rendering/cssVariables');
		cssVariablesModule.default = vi.fn(() => '<style>css-vars</style>');

		const documentCookiesModule = await import('#src/rendering/documentCookies');
		documentCookiesModule.default = vi.fn(() => '<script>cookies</script>');

		const externalsModule = await import('#src/rendering/externals');
		externalsModule.renderOptInExternals = vi.fn(() => '<script>externals</script>');

		const globalsModule = await import('#src/rendering/globals');
		globalsModule.default = vi.fn(() => '<script>globals</script>');

		const appInstallModule = await import('#src/util/appInstallPrompt');
		appInstallModule.shouldShowAppInstallPrompt = vi.fn(async () => true);
		appInstallModule.renderAppInstallPrompt = vi.fn(() => '<div>app-install</div>');

		const basketCookieModule = await import('#src/util/basketCookie');
		basketCookieModule.default = vi.fn(async () => {});

		const experimentModule = await import('#src/util/experiment/experimentUtils');
		experimentModule.assignAllActiveExperiments = vi.fn(async () => {});

		const optimizelyModule = await import('#src/util/optimizelyUserMetrics');
		optimizelyModule.setUserDataCookies = vi.fn(async () => {});

		const visitorCookieModule = await import('#src/util/visitorCookie');
		visitorCookieModule.default = vi.fn();

		// Setup default Apollo query responses
		mockApollo.query.mockImplementation(({ query }) => {
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
		});
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
		const createApolloClient = (await import('#src/api/apollo')).default;

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
			forceHeader: mockContext.forceHeader,
		});
	});

	it('should set visitor ID cookie', async () => {
		const setVisitorIdCookie = (await import('#src/util/visitorCookie')).default;

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(setVisitorIdCookie).toHaveBeenCalledWith(mockCookieStore);
	});

	it('should set basket cookie', async () => {
		const setBasketCookie = (await import('#src/util/basketCookie')).default;

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
		const { setUserDataCookies } = await import('#src/util/optimizelyUserMetrics');

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(setUserDataCookies).toHaveBeenCalledWith(mockCookieStore, mockApollo);
	});

	it('should assign all active experiments', async () => {
		const { assignAllActiveExperiments } = await import(
			'#src/util/experiment/experimentUtils'
		);

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(assignAllActiveExperiments).toHaveBeenCalledWith(mockApollo);
	});

	it('should check app install prompt status', async () => {
		const { shouldShowAppInstallPrompt } = await import('#src/util/appInstallPrompt');

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
		const renderDocumentCookies = (await import('#src/rendering/documentCookies')).default;

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderDocumentCookies).toHaveBeenCalledWith(mockCookieStore);
	});

	it('should render opt-in externals', async () => {
		const { renderOptInExternals } = await import('#src/rendering/externals');

		await renderESIHead({
			cookieStore: mockCookieStore,
			context: mockContext,
			fetch: mockFetch,
			kvAuth0: mockKvAuth0,
		});

		expect(renderOptInExternals).toHaveBeenCalledWith(mockContext.config, mockCookieStore);
	});

	it('should render app install prompt when shown', async () => {
		const { renderAppInstallPrompt, shouldShowAppInstallPrompt } = await import('#src/util/appInstallPrompt');
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
		const { renderAppInstallPrompt, shouldShowAppInstallPrompt } = await import('#src/util/appInstallPrompt');
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
		const renderGlobals = (await import('#src/rendering/globals')).default;

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
		const renderCssVariables = (await import('#src/rendering/cssVariables')).default;

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
		const { shouldShowAppInstallPrompt } = await import('#src/util/appInstallPrompt');
		const { setUserDataCookies } = await import('#src/util/optimizelyUserMetrics');
		const { assignAllActiveExperiments } = await import(
			'#src/util/experiment/experimentUtils'
		);

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
		const createApolloClient = (await import('#src/api/apollo')).default;
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
