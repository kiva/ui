import { setContext } from '@apollo/client/link/context/index';
import createAuth0Link from '../../../../src/api/Auth0Link';

vi.mock('@apollo/client/link/context/index');

describe('Auth0Link', () => {
	let mockKvAuth0;
	let mockSetContextHandler;
	let mockPreviousContext;
	let mockOperation;

	beforeEach(() => {
		mockSetContextHandler = null;
		setContext.mockImplementation(handler => {
			mockSetContextHandler = handler;
			return 'mockContextLink';
		});

		mockKvAuth0 = {
			enabled: true,
			clientID: 'test-client-id',
			user: { id: '12345', name: 'Test User' },
			accessToken: 'test-access-token',
			isServer: false,
			getKivaId: vi.fn(() => '12345'),
			getSyncCookieValue: vi.fn(() => null),
			isNotedLoggedOut: vi.fn(() => false),
			isNotedUserSessionUser: vi.fn(() => true),
			getFakeAuthCookieValue: vi.fn(() => null),
			fakeAuthAllowed: vi.fn(() => false),
			checkSession: vi.fn(() => Promise.resolve()),
		};

		mockPreviousContext = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		mockOperation = {
			operationName: 'TestQuery',
		};

		// Mock window.location for browser-only tests
		global.window = { location: { pathname: '/test' } };
	});

	afterEach(() => {
		delete global.window;
	});

	describe('Link creation', () => {
		it('should create a context link using setContext', () => {
			const link = createAuth0Link({ kvAuth0: mockKvAuth0 });
			expect(setContext).toHaveBeenCalledWith(expect.any(Function));
			expect(link).toBe('mockContextLink');
		});
	});

	describe('Context handler', () => {
		it('should return previous context when kvAuth0 is not provided', () => {
			createAuth0Link({ kvAuth0: null });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result).toBe(mockPreviousContext);
		});

		it('should return previous context when auth0 is not enabled', () => {
			mockKvAuth0.enabled = false;
			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result).toEqual({
				...mockPreviousContext,
				user: undefined,
			});
		});

		it('should add user and token to context when auth0 is enabled', () => {
			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
				headers: {
					...mockPreviousContext.headers,
					authorization: 'Bearer test-access-token',
				},
			});
		});

		it('should not add authorization header when token is null', () => {
			mockKvAuth0.accessToken = null;
			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
			});
			expect(result.headers.authorization).toBeUndefined();
		});
	});

	describe('Fake authentication', () => {
		it('should add fake auth headers when fake auth is enabled', () => {
			mockKvAuth0.getFakeAuthCookieValue.mockReturnValue({
				userId: 'fake-user-123',
				scopes: ['read', 'write'],
			});
			mockKvAuth0.fakeAuthAllowed.mockReturnValue(true);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result).toEqual({
				...mockPreviousContext,
				headers: {
					...mockPreviousContext.headers,
					'x-fa-user-id': 'fake-user-123',
					'x-fa-scopes': 'read write',
					'x-fa-app-id': 'test-client-id',
				},
			});
		});

		it('should use default app-id when clientID is not set', () => {
			mockKvAuth0.clientID = null;
			mockKvAuth0.getFakeAuthCookieValue.mockReturnValue({
				userId: 'fake-user-123',
				scopes: ['read'],
			});
			mockKvAuth0.fakeAuthAllowed.mockReturnValue(true);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.headers['x-fa-app-id']).toBe('org.kiva.www');
		});

		it('should handle fake auth errors gracefully', () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockKvAuth0.getFakeAuthCookieValue.mockImplementation(() => {
				throw new Error('Fake auth error');
			});
			mockKvAuth0.fakeAuthAllowed.mockReturnValue(true);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
				headers: {
					...mockPreviousContext.headers,
					authorization: 'Bearer test-access-token',
				},
			});

			consoleErrorSpy.mockRestore();
		});

		it('should not add fake auth headers when not allowed', () => {
			mockKvAuth0.getFakeAuthCookieValue.mockReturnValue({
				userId: 'fake-user-123',
				scopes: ['read'],
			});
			mockKvAuth0.fakeAuthAllowed.mockReturnValue(false);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.headers['x-fa-user-id']).toBeUndefined();
		});
	});

	describe('User session handling', () => {
		it('should add user to context when user has kiva id and no sync cookie', () => {
			mockKvAuth0.getSyncCookieValue.mockReturnValue(null);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
				headers: {
					...mockPreviousContext.headers,
					authorization: 'Bearer test-access-token',
				},
			});
		});

		it('should not add user when user is noted logged out and has no kiva id', () => {
			mockKvAuth0.getKivaId.mockReturnValue(null);
			mockKvAuth0.isNotedLoggedOut.mockReturnValue(true);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.user).toBeUndefined();
			expect(result.headers.authorization).toBeUndefined();
		});

		it('should add user when session matches sync cookie user', () => {
			mockKvAuth0.getSyncCookieValue.mockReturnValue('sync-value');
			mockKvAuth0.isNotedUserSessionUser.mockReturnValue(true);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
				headers: {
					...mockPreviousContext.headers,
					authorization: 'Bearer test-access-token',
				},
			});
		});

		it('should trigger checkSession when kiva id does not exist and not on denied page', async () => {
			mockKvAuth0.getKivaId.mockReturnValue(null);
			mockKvAuth0.isNotedLoggedOut.mockReturnValue(false);
			mockKvAuth0.isServer = false;
			global.window.location.pathname = '/lend';

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const resultPromise = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(resultPromise).toBeInstanceOf(Promise);
			const result = await resultPromise;

			expect(mockKvAuth0.checkSession).toHaveBeenCalled();
			expect(result.user).toBe(mockKvAuth0.user);
		});
	});

	describe('Server-side handling', () => {
		it('should return previous context on server before checkSession', () => {
			mockKvAuth0.isServer = true;
			mockKvAuth0.getKivaId.mockReturnValue(null);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.user).toBeUndefined();
			expect(result.headers.authorization).toBeUndefined();
		});
	});

	describe('Denied pages handling', () => {
		it('should not add user on /error page', () => {
			global.window.location.pathname = '/error';
			mockKvAuth0.getKivaId.mockReturnValue(null);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.user).toBeUndefined();
			expect(result.headers.authorization).toBeUndefined();
		});

		it('should not add user on /register/social page', () => {
			global.window.location.pathname = '/register/social';
			mockKvAuth0.getKivaId.mockReturnValue(null);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.user).toBeUndefined();
			expect(result.headers.authorization).toBeUndefined();
		});

		it('should add user on allowed pages', () => {
			global.window.location.pathname = '/lend';
			mockKvAuth0.getKivaId.mockReturnValue('12345');
			mockKvAuth0.getSyncCookieValue.mockReturnValue(null);

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.user).toBe(mockKvAuth0.user);
			expect(result.headers.authorization).toBe('Bearer test-access-token');
		});
	});

	describe('Auth0 checkSession', () => {
		it('should call checkSession and add user when session is valid', async () => {
			mockKvAuth0.getKivaId.mockReturnValue(null);
			global.window.location.pathname = '/lend';

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const resultPromise = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(resultPromise).toBeInstanceOf(Promise);
			const result = await resultPromise;

			expect(mockKvAuth0.checkSession).toHaveBeenCalled();
			expect(result).toEqual({
				...mockPreviousContext,
				user: mockKvAuth0.user,
				headers: {
					...mockPreviousContext.headers,
					authorization: 'Bearer test-access-token',
				},
			});
		});

		it('should reject promise when checkSession fails', async () => {
			const error = new Error('Session check failed');
			mockKvAuth0.checkSession.mockRejectedValue(error);
			mockKvAuth0.getKivaId.mockReturnValue(null);
			global.window.location.pathname = '/lend';

			createAuth0Link({ kvAuth0: mockKvAuth0 });
			const resultPromise = mockSetContextHandler(mockOperation, mockPreviousContext);

			await expect(resultPromise).rejects.toThrow('Session check failed');
		});
	});
});
