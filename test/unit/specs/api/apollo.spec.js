import { ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client/core/index';
import createApolloClient from '#src/api/apollo';
import Auth0LinkCreator from '#src/api/Auth0Link';
import BasketLinkCreator from '#src/api/BasketLink';
import ContentfulPreviewLink from '#src/api/ContentfulPreviewLink';
import ExperimentIdLink from '#src/api/ExperimentIdLink';
import HttpLinkCreator from '#src/api/HttpLink';
import NetworkErrorLoggingLink from '#src/api/NetworkErrorLoggingLink';
import NetworkErrorRetryLink from '#src/api/NetworkErrorRetryLink';
import SnowplowSessionLink from '#src/api/SnowplowSessionLink';
import { initState, setLocalState } from '#src/api/localState';

// Mock all the dependencies
vi.mock('@apollo/client/core/index', () => ({
	ApolloLink: {
		from: vi.fn(links => ({ links })),
	},
	ApolloClient: vi.fn(function ApolloClientMock(config) {
		this.config = config;
		this.onResetStore = vi.fn(callback => {
			this.resetStoreCallback = callback;
		});
		return this;
	}),
	InMemoryCache: vi.fn(function InMemoryCacheMock(config) {
		this.config = config;
		this.writeQuery = vi.fn();
		return this;
	}),
}));

vi.mock('#src/api/Auth0Link', () => ({
	default: vi.fn(config => ({ type: 'Auth0Link', config })),
}));

vi.mock('#src/api/BasketLink', () => ({
	default: vi.fn(config => ({ type: 'BasketLink', config })),
}));

vi.mock('#src/api/ContentfulPreviewLink', () => ({
	default: vi.fn(config => ({ type: 'ContentfulPreviewLink', config })),
}));

vi.mock('#src/api/ExperimentIdLink', () => ({
	default: vi.fn(config => ({ type: 'ExperimentIdLink', config })),
}));

vi.mock('#src/api/HttpLink', () => ({
	default: vi.fn(config => ({ type: 'HttpLink', config })),
}));

vi.mock('#src/api/NetworkErrorLoggingLink', () => ({
	default: vi.fn(() => ({ type: 'NetworkErrorLoggingLink' })),
}));

vi.mock('#src/api/NetworkErrorRetryLink', () => ({
	default: vi.fn(config => ({ type: 'NetworkErrorRetryLink', config })),
}));

vi.mock('#src/api/SnowplowSessionLink', () => ({
	default: vi.fn(config => ({ type: 'SnowplowSessionLink', config })),
}));

vi.mock('#src/api/localState', () => ({
	initState: vi.fn(() => ({
		resolvers: { testResolver: vi.fn() },
	})),
	setLocalState: vi.fn(),
}));

describe('createApolloClient', () => {
	let mockAppConfig;
	let mockCookieStore;
	let mockKvAuth0;
	let mockTypes;
	let mockRoute;
	let mockFetch;

	beforeEach(() => {
		vi.clearAllMocks();

		mockAppConfig = {
			apolloNetworkErrorRetryActive: true,
			apolloNetworkErrorRetryAttempts: 3,
			apolloBatching: true,
			stellateDebugHeaders: false,
			stellateGraphqlUri: 'https://stellate.test',
			stellateCachedOperations: ['Operation1', 'Operation2'],
		};

		mockCookieStore = {
			get: vi.fn(),
			set: vi.fn(),
		};

		mockKvAuth0 = {
			getAccessToken: vi.fn(),
		};

		mockTypes = {
			Type1: ['SubType1', 'SubType2'],
			Type2: ['SubType3'],
		};

		mockRoute = {
			query: {},
		};

		mockFetch = vi.fn();
	});

	/**
	 * Helper to create Apollo client with custom configuration overrides
	 * @param {Object} overrides - Optional overrides for the default configuration
	 * @returns {Object} The created Apollo client
	 */
	const createClient = (overrides = {}) => {
		const defaultConfig = {
			appConfig: mockAppConfig,
			cookieStore: mockCookieStore,
			kvAuth0: mockKvAuth0,
			types: mockTypes,
			uri: 'https://api.test/graphql',
			userAgent: 'Test/1.0',
			fetch: mockFetch,
			route: mockRoute,
		};

		return createApolloClient({ ...defaultConfig, ...overrides });
	};

	it('should create an Apollo client with all required configuration', () => {
		const client = createClient({ forceHeader: 'test-header' });

		expect(client).toBeDefined();
		expect(client.config).toBeDefined();
	});

	it('should create InMemoryCache with possibleTypes and typePolicies', () => {
		createClient();

		expect(vi.mocked(InMemoryCache)).toHaveBeenCalledWith({
			possibleTypes: mockTypes,
			typePolicies: {
				Mergable: {
					merge: true,
				},
				Setting: {
					keyFields: ['key'],
				},
			},
		});
	});

	it('should initialize local state with correct parameters', () => {
		createClient({ forceHeader: 'test-header' });

		expect(vi.mocked(initState)).toHaveBeenCalledWith({
			appConfig: mockAppConfig,
			cookieStore: mockCookieStore,
			kvAuth0: mockKvAuth0,
			route: mockRoute,
			forceHeader: 'test-header',
		});
	});

	it('should create Apollo link chain in correct order', () => {
		createClient();

		expect(vi.mocked(SnowplowSessionLink)).toHaveBeenCalledWith({ cookieStore: mockCookieStore });
		expect(vi.mocked(ExperimentIdLink)).toHaveBeenCalledWith({ cookieStore: mockCookieStore });
		expect(vi.mocked(Auth0LinkCreator)).toHaveBeenCalledWith({
			cookieStore: mockCookieStore,
			kvAuth0: mockKvAuth0,
		});
		expect(vi.mocked(BasketLinkCreator)).toHaveBeenCalledWith({ cookieStore: mockCookieStore });
		expect(vi.mocked(ContentfulPreviewLink)).toHaveBeenCalledWith({ route: mockRoute });
		expect(vi.mocked(NetworkErrorLoggingLink)).toHaveBeenCalled();
		expect(vi.mocked(NetworkErrorRetryLink)).toHaveBeenCalledWith({
			activateRetry: true,
			attemptsMax: 3,
		});
		expect(vi.mocked(HttpLinkCreator)).toHaveBeenCalledWith({
			uri: 'https://api.test/graphql',
			userAgent: 'Test/1.0',
			fetch: mockFetch,
			apolloBatching: true,
			stellateDebugHeaders: false,
			stellateGraphqlUri: 'https://stellate.test',
			stellateCachedOperations: ['Operation1', 'Operation2'],
		});
		expect(vi.mocked(ApolloLink.from)).toHaveBeenCalled();
	});

	it('should use default apolloBatching value when not provided', () => {
		const appConfigWithoutBatching = { ...mockAppConfig };
		delete appConfigWithoutBatching.apolloBatching;

		createClient({ appConfig: appConfigWithoutBatching });

		expect(vi.mocked(HttpLinkCreator)).toHaveBeenCalledWith(
			expect.objectContaining({
				apolloBatching: true,
			})
		);
	});

	it('should respect apolloBatching false when explicitly set', () => {
		createClient({
			appConfig: { ...mockAppConfig, apolloBatching: false },
		});

		expect(vi.mocked(HttpLinkCreator)).toHaveBeenCalledWith(
			expect.objectContaining({
				apolloBatching: false,
			})
		);
	});

	it('should create ApolloClient with correct default options', () => {
		createClient();

		expect(vi.mocked(ApolloClient)).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultOptions: {
					watchQuery: {
						errorPolicy: 'all',
					},
					query: {
						errorPolicy: 'all',
					},
					mutate: {
						errorPolicy: 'all',
					},
				},
				assumeImmutableResults: true,
			})
		);
	});

	it('should set resolvers from initState', () => {
		createClient();

		expect(vi.mocked(ApolloClient)).toHaveBeenCalledWith(
			expect.objectContaining({
				resolvers: { testResolver: expect.any(Function) },
			})
		);
	});

	it('should set default local state on creation', () => {
		createClient();

		expect(vi.mocked(setLocalState)).toHaveBeenCalledWith(
			{
				appConfig: mockAppConfig,
				cookieStore: mockCookieStore,
				kvAuth0: mockKvAuth0,
			},
			expect.any(InMemoryCache)
		);
	});

	it('should register onResetStore callback', () => {
		const client = createClient();

		expect(client.onResetStore).toHaveBeenCalled();
		expect(client.resetStoreCallback).toBeDefined();
	});

	it('should call setLocalState when store is reset', () => {
		const client = createClient();

		// Clear the initial call
		vi.mocked(setLocalState).mockClear();

		// Trigger the reset callback
		client.resetStoreCallback();

		expect(vi.mocked(setLocalState)).toHaveBeenCalledWith(
			{
				appConfig: mockAppConfig,
				cookieStore: mockCookieStore,
				kvAuth0: mockKvAuth0,
			},
			expect.any(InMemoryCache)
		);
	});

	it('should handle minimal configuration', () => {
		const client = createClient({
			appConfig: {},
			types: {},
			route: {},
		});

		expect(client).toBeDefined();
		expect(client.config).toBeDefined();
	});

	it('should pass undefined values to NetworkErrorRetryLink when config missing', () => {
		createClient({ appConfig: {} });

		expect(vi.mocked(NetworkErrorRetryLink)).toHaveBeenCalledWith({
			activateRetry: undefined,
			attemptsMax: undefined,
		});
	});

	it('should pass undefined forceHeader to initState when not provided', () => {
		createClient();

		expect(vi.mocked(initState)).toHaveBeenCalledWith(
			expect.objectContaining({
				forceHeader: undefined,
			})
		);
	});
});
