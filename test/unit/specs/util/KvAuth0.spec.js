import KvAuth0, {
	KIVA_ID_KEY, LAST_LOGIN_KEY, USED_MFA_KEY, MockKvAuth0
} from '#src/util/KvAuth0';

vi.mock('#src/util/syncDate', () => ({
	default: vi.fn(() => Promise.resolve())
}));

function getKvAuth0WithFACookie(cookieValue, checkFakeAuth = true, domain = 'login.dev.kiva.org') {
	return new KvAuth0({
		domain,
		checkFakeAuth,
		clientID: '',
		cookieStore: {
			get: () => cookieValue,
			set: () => {},
		},
	});
}

describe('KvAuth0', () => {
	describe('Fake authentication', () => {
		describe('constructor', () => {
			it('does not set anything auth related when checkFakeAuth is false', () => {
				const kvAuth0 = getKvAuth0WithFACookie('123', false);
				expect(kvAuth0.user).toEqual(null);
				expect(kvAuth0.accessToken).toEqual('');
			});

			it('does not set anything auth related when the cookie is undefined', () => {
				const kvAuth0 = getKvAuth0WithFACookie(undefined);
				expect(kvAuth0.user).toEqual(null);
				expect(kvAuth0.accessToken).toEqual('');
			});

			it('simulates being logged in when a user id is in the cookie', () => {
				const kvAuth0 = getKvAuth0WithFACookie('123');
				expect(kvAuth0.user[KIVA_ID_KEY]).toEqual(123);
				expect(kvAuth0.isMfaAuthenticated()).toEqual(false);
				expect(kvAuth0.isNotedLoggedIn()).toEqual(true);
				expect(kvAuth0.isNotedUserSessionUser()).toEqual(true);
			});

			it('makes isMfaAuthenticated return true when mfa is included in the cookie', () => {
				const kvAuth0 = getKvAuth0WithFACookie('456:recent/mfa');
				expect(kvAuth0.isMfaAuthenticated()).toEqual(true);
			});
		});

		describe('fakeAuthAllowed', () => {
			function expectTrueForSettings(domain, checkFakeAuth) {
				const kvAuth0 = getKvAuth0WithFACookie('123', checkFakeAuth, domain);
				expect(kvAuth0.fakeAuthAllowed()).toBe(true);
			}
			function expectFalseForSettings(domain, checkFakeAuth) {
				const kvAuth0 = getKvAuth0WithFACookie('123', checkFakeAuth, domain);
				expect(kvAuth0.fakeAuthAllowed()).toBe(false);
			}

			it('returns true for non-production domains with checkFakeAuth enabled', () => {
				expectTrueForSettings('login.dev.kiva.org', true);
				expectTrueForSettings('login.stage.kiva.org', true);
			});

			it('returns false for production domains or when checkFakeAuth is not enabled', () => {
				expectFalseForSettings('login.dev.kiva.org', false);
				expectFalseForSettings('login.kiva.org', true);
				expectFalseForSettings('login.kiva.org', false);
			});
		});

		describe('getFakeAuthCookieValue', () => {
			function expectValuesForCookie(cookie, expected) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue();
				expect(fakeAuthInfo).toEqual(expected);
			}

			it('returns undefined when checkFakeAuth is false', () => {
				const kvAuth0 = getKvAuth0WithFACookie('123', false);
				const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue();
				expect(fakeAuthInfo).not.toBeDefined();
			});

			it('returns undefined when no cookie is present', () => {
				expectValuesForCookie(undefined, undefined);
			});

			it('returns undefined when cookie does not have a valid user id', () => {
				expectValuesForCookie('abc', undefined);
				expectValuesForCookie('a12b', undefined);
				expectValuesForCookie(':recent', undefined);
			});

			it('returns user id and scopes when cookie contains a valid user id', () => {
				expectValuesForCookie('1a', { userId: 1, scopes: [] });
				expectValuesForCookie('123', { userId: 123, scopes: [] });
				expectValuesForCookie('456:', { userId: 456, scopes: [] });
				expectValuesForCookie('789:active', { userId: 789, scopes: ['active'] });
				expectValuesForCookie('123:recent/active', { userId: 123, scopes: ['recent', 'active'] });
				expectValuesForCookie('123:recent/active/mfa', { userId: 123, scopes: ['recent', 'active', 'mfa'] });
			});
		});

		describe('getFakeIdTokenPayload', () => {
			function expectUndefinedForCookie(cookie) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeIdTokenPayload = kvAuth0.getFakeIdTokenPayload();
				expect(fakeIdTokenPayload).not.toBeDefined();
			}
			function expectValuesForCookie(cookie, {
				id, lastLogin, mfa, scopes
			}) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeIdTokenPayload = kvAuth0.getFakeIdTokenPayload();
				expect(fakeIdTokenPayload[KIVA_ID_KEY]).toEqual(id);
				expect(fakeIdTokenPayload[LAST_LOGIN_KEY] / 1000).toBeCloseTo(lastLogin / 1000, 1);
				expect(fakeIdTokenPayload[USED_MFA_KEY]).toEqual(mfa);
				expect(fakeIdTokenPayload.scopes).toEqual(scopes);
			}

			it('returns undefined when no cookie is present', () => {
				expectUndefinedForCookie(undefined);
			});

			it('returns undefined when cookie does not have a valid user id', () => {
				expectUndefinedForCookie('abc');
				expectUndefinedForCookie('a12b');
				expectUndefinedForCookie(':recent');
			});

			it('returns user id, last login time, mfa status, and scopes when cookie contains a valid user id', () => {
				const recent = Date.now();
				const active = Date.now() - (1 + (5 * 60)) * 1000; // 5 minutes and 1 second before now
				const passive = Date.now() - (1 + (60 * 60)) * 1000; // 1 hour and 1 second before now

				expectValuesForCookie('1a', {
					id: 1, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('123', {
					id: 123, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('456:', {
					id: 456, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('789:active', {
					id: 789, lastLogin: active, mfa: false, scopes: ['active']
				});
				expectValuesForCookie('123:recent/active', {
					id: 123, lastLogin: recent, mfa: false, scopes: ['recent', 'active']
				});
				expectValuesForCookie('456:recent/active/mfa', {
					id: 456, lastLogin: recent, mfa: true, scopes: ['recent', 'active', 'mfa']
				});
			});
		});
	});

	describe('Constructor', () => {
		it('initializes with provided parameters', () => {
			const kvAuth0 = new KvAuth0({
				accessToken: 'test-token',
				audience: 'test-audience',
				clientID: 'test-client',
				cookieStore: {},
				domain: 'test.auth0.com',
				mfaAudience: 'mfa-audience',
				redirectUri: 'https://example.com/callback',
				scope: 'openid profile',
				user: { id: 123 },
			});

			expect(kvAuth0.enabled).toBe(true);
			expect(kvAuth0.user).toEqual({ id: 123 });
			expect(kvAuth0.accessToken).toBe('test-token');
			expect(kvAuth0.audience).toBe('test-audience');
			expect(kvAuth0.clientID).toBe('test-client');
			expect(kvAuth0.domain).toBe('test.auth0.com');
			expect(kvAuth0.accessTokenExpired).toBe(false);
		});

		it('initializes with default values when not provided', () => {
			const kvAuth0 = new KvAuth0({});

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.checkFakeAuth).toBe(false);
			expect(kvAuth0.accessTokenExpired).toBe(false);
		});
	});

	describe('getKivaId', () => {
		it('returns undefined when user is null', () => {
			const kvAuth0 = new KvAuth0({});
			expect(kvAuth0.getKivaId()).toBeUndefined();
		});

		it('returns kiva id from user object', () => {
			const kvAuth0 = new KvAuth0({
				user: { [KIVA_ID_KEY]: 12345 },
			});
			expect(kvAuth0.getKivaId()).toBe(12345);
		});

		it('returns kiva id from _json property', () => {
			const kvAuth0 = new KvAuth0({
				user: { _json: { [KIVA_ID_KEY]: 67890 } },
			});
			expect(kvAuth0.getKivaId()).toBe(67890);
		});
	});

	describe('getLastLogin', () => {
		it('returns 0 when user is null', () => {
			const kvAuth0 = new KvAuth0({});
			expect(kvAuth0.getLastLogin()).toBe(0);
		});

		it('returns last login from user object', () => {
			const lastLogin = Date.now();
			const kvAuth0 = new KvAuth0({
				user: { [LAST_LOGIN_KEY]: lastLogin },
			});
			expect(kvAuth0.getLastLogin()).toBe(lastLogin);
		});

		it('returns last login from _json property', () => {
			const lastLogin = Date.now();
			const kvAuth0 = new KvAuth0({
				user: { _json: { [LAST_LOGIN_KEY]: lastLogin } },
			});
			expect(kvAuth0.getLastLogin()).toBe(lastLogin);
		});
	});

	describe('isMfaAuthenticated', () => {
		it('returns false when user is null', () => {
			const kvAuth0 = new KvAuth0({});
			expect(kvAuth0.isMfaAuthenticated()).toBe(false);
		});

		it('returns mfa status from user object', () => {
			const kvAuth0 = new KvAuth0({
				user: { [USED_MFA_KEY]: true },
			});
			expect(kvAuth0.isMfaAuthenticated()).toBe(true);
		});

		it('returns mfa status from _json property', () => {
			const kvAuth0 = new KvAuth0({
				user: { _json: { [USED_MFA_KEY]: true } },
			});
			expect(kvAuth0.isMfaAuthenticated()).toBe(true);
		});
	});

	describe('getSyncCookieValue', () => {
		it('returns value from cookie store', () => {
			const kvAuth0 = getKvAuth0WithFACookie('12345');
			expect(kvAuth0.getSyncCookieValue()).toBe('12345');
		});
	});

	describe('isNotedLoggedIn', () => {
		it('returns falsy when sync cookie is not set', () => {
			const kvAuth0 = getKvAuth0WithFACookie(undefined);
			expect(kvAuth0.isNotedLoggedIn()).toBeFalsy();
		});

		it('returns false when sync cookie is logout value', () => {
			const kvAuth0 = getKvAuth0WithFACookie('o');
			expect(kvAuth0.isNotedLoggedIn()).toBe(false);
		});

		it('returns true when sync cookie has a value', () => {
			const kvAuth0 = getKvAuth0WithFACookie('12345');
			expect(kvAuth0.isNotedLoggedIn()).toBe(true);
		});
	});

	describe('isNotedLoggedOut', () => {
		it('returns true when sync cookie is logout value', () => {
			const kvAuth0 = getKvAuth0WithFACookie('o');
			expect(kvAuth0.isNotedLoggedOut()).toBe(true);
		});

		it('returns false when sync cookie is not logout value', () => {
			const kvAuth0 = getKvAuth0WithFACookie('12345');
			expect(kvAuth0.isNotedLoggedOut()).toBe(false);
		});
	});

	describe('isNotedUserSessionUser', () => {
		it('returns true when sync cookie matches user id', () => {
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					get: () => '12345',
				},
				user: { [KIVA_ID_KEY]: 12345 },
			});
			expect(kvAuth0.isNotedUserSessionUser()).toBe(true);
		});

		it('returns false when sync cookie does not match user id', () => {
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					get: () => '67890',
				},
				user: { [KIVA_ID_KEY]: 12345 },
			});
			expect(kvAuth0.isNotedUserSessionUser()).toBe(false);
		});
	});

	describe('Server mode', () => {
		it('checkSession rejects in server mode', async () => {
			const kvAuth0 = new KvAuth0({});
			kvAuth0.isServer = true;

			await expect(kvAuth0.checkSession()).rejects.toThrow('checkSession called in server mode');
		});

		it('getMfaManagementToken rejects in server mode', async () => {
			const kvAuth0 = new KvAuth0({});
			kvAuth0.isServer = true;

			await expect(kvAuth0.getMfaManagementToken())
				.rejects.toThrow('getMfaManagementToken called in server mode');
		});
	});

	describe('getMfaManagementToken', () => {
		it('rejects when user is not logged in', async () => {
			const kvAuth0 = new KvAuth0({});
			await expect(kvAuth0.getMfaManagementToken()).rejects.toThrow('api.authenticationRequired');
		});

		it('returns existing mfaManagementToken if available', async () => {
			const kvAuth0 = new KvAuth0({
				user: { [KIVA_ID_KEY]: 123 },
			});
			kvAuth0.mfaManagementToken = 'existing-token';

			const token = await kvAuth0.getMfaManagementToken();
			expect(token).toBe('existing-token');
		});
	});

	describe('checkSession', () => {
		it('resolves immediately when user exists and skipIfUserExists is true', async () => {
			const kvAuth0 = new KvAuth0({});
			kvAuth0.user = { [KIVA_ID_KEY]: 123 };
			await expect(kvAuth0.checkSession({ skipIfUserExists: true })).resolves.toBeUndefined();
		});

		it('successfully authenticates and sets user data', async () => {
			const mockResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
					[USED_MFA_KEY]: false,
				},
				accessToken: 'test-access-token',
				expiresIn: 3600,
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, mockResult);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toEqual(mockResult.idTokenPayload);
			expect(kvAuth0.accessToken).toBe('test-access-token');
			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.cookieStore.set).toHaveBeenCalledWith(
				'kvls',
				12345,
				{ path: '/', secure: true }
			);
		});

		it('handles login_required error by noting logged out', async () => {
			const mockError = {
				error: 'login_required',
				error_description: 'Login required',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.cookieStore.set).toHaveBeenCalledWith(
				'kvls',
				'o',
				{ path: '/', secure: true }
			);
		});

		it('handles unauthorized error by noting logged out', async () => {
			const mockError = {
				error: 'unauthorized',
				error_description: 'Unauthorized',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.cookieStore.set).toHaveBeenCalledWith(
				'kvls',
				'o',
				{ path: '/', secure: true }
			);
		});

		it('handles access_denied error by noting logged out', async () => {
			const mockError = {
				error: 'access_denied',
				error_description: 'Access denied',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.cookieStore.set).toHaveBeenCalledWith(
				'kvls',
				'o',
				{ path: '/', secure: true }
			);
		});

		it('handles consent_required error by resolving without authentication', async () => {
			const mockError = {
				error: 'consent_required',
				error_description: 'Consent required',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			// Should not note logged out for consent_required
			expect(kvAuth0.cookieStore.set).not.toHaveBeenCalled();
		});

		it('handles interaction_required error by resolving without authentication', async () => {
			const mockError = {
				error: 'interaction_required',
				error_description: 'Interaction required',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			// Should not note logged out for interaction_required
			expect(kvAuth0.cookieStore.set).not.toHaveBeenCalled();
		});

		it('handles unknown errors by clearing login state and calling error callbacks', async () => {
			const mockError = {
				error: 'unknown_error',
				error_description: 'Something went wrong',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					remove: vi.fn(),
				},
			});
			const errorCallback = vi.fn();
			kvAuth0.onError(errorCallback);

			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.cookieStore.remove).toHaveBeenCalledWith(
				'kvls',
				{ path: '/', secure: true }
			);
			expect(errorCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					error: mockError,
					errorString: 'unknown_error: Something went wrong',
				})
			);
		});

		it('passes correct options to webAuth.checkSession', async () => {
			const checkSessionSpy = vi.fn((options, callback) => {
				callback(null, {
					idTokenPayload: { [KIVA_ID_KEY]: 123 },
					accessToken: 'token',
					expiresIn: 3600,
				});
			});
			const kvAuth0 = new KvAuth0({
				audience: 'test-audience',
				cookieStore: {
					set: vi.fn(),
				},
				scope: 'openid profile',
			});
			kvAuth0.webAuth = {
				checkSession: checkSessionSpy,
			};

			await kvAuth0.checkSession();

			expect(checkSessionSpy).toHaveBeenCalledWith(
				{
					audience: 'test-audience',
					responseType: 'token id_token',
					scope: 'openid profile',
				},
				expect.any(Function)
			);
		});

		it('only calls checkSession once if already in progress', async () => {
			const checkSessionSpy = vi.fn((options, callback) => {
				// Simulate async behavior
				setTimeout(() => {
					callback(null, {
						idTokenPayload: { [KIVA_ID_KEY]: 123 },
						accessToken: 'token',
						expiresIn: 3600,
					});
				}, 50);
			});
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: checkSessionSpy,
			};

			// Call checkSession multiple times simultaneously
			const promise1 = kvAuth0.checkSession();
			const promise2 = kvAuth0.checkSession();
			const promise3 = kvAuth0.checkSession();

			// All should return the same promise
			expect(promise1).toBe(promise2);
			expect(promise2).toBe(promise3);

			await Promise.all([promise1, promise2, promise3]);

			// Should only have called checkSession once
			expect(checkSessionSpy).toHaveBeenCalledTimes(1);
		});

		it('clears auth data when receiving an error', async () => {
			// First set some auth data
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.user = { [KIVA_ID_KEY]: 12345 };
			kvAuth0.accessToken = 'existing-token';

			const mockError = {
				error: 'login_required',
				error_description: 'Login required',
			};

			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(mockError, null);
				}),
			};

			await kvAuth0.checkSession();

			// Auth data should be cleared
			expect(kvAuth0.user).toBe(null);
			expect(kvAuth0.accessToken).toBe('');
		});

		it('allows checkSession to be called again after completion', async () => {
			const checkSessionSpy = vi.fn((options, callback) => {
				callback(null, {
					idTokenPayload: { [KIVA_ID_KEY]: 123 },
					accessToken: 'token',
					expiresIn: 3600,
				});
			});
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: checkSessionSpy,
			};

			// First call
			await kvAuth0.checkSession();
			expect(checkSessionSpy).toHaveBeenCalledTimes(1);

			// Second call should work and increment the count
			await kvAuth0.checkSession();
			expect(checkSessionSpy).toHaveBeenCalledTimes(2);
		});
	});

	describe('accessTokenExpired tracking', () => {
		it('sets accessTokenExpired to false when authenticating with checkSession', async () => {
			const mockResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'test-access-token',
				expiresIn: 3600,
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, mockResult);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.accessToken).toBe('test-access-token');
		});

		it('maintains accessTokenExpired as false when token has not expired', async () => {
			vi.useFakeTimers();
			const mockResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'test-access-token',
				expiresIn: 3600, // 1 hour
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, mockResult);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.accessTokenExpired).toBe(false);

			// Fast forward time but not past expiration
			vi.advanceTimersByTime(1800 * 1000); // 30 minutes

			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.accessToken).toBe('test-access-token');

			vi.useRealTimers();
		});

		it('sets accessTokenExpired to true when token expires after expiresIn duration', async () => {
			vi.useFakeTimers();
			const mockResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'test-access-token',
				expiresIn: 3600, // 1 hour
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, mockResult);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.accessToken).toBe('test-access-token');

			// Fast forward time past expiration
			vi.advanceTimersByTime(3600 * 1000); // 1 hour

			expect(kvAuth0.accessTokenExpired).toBe(true);
			expect(kvAuth0.accessToken).toBe('');
			expect(kvAuth0.user).toBe(null);

			vi.useRealTimers();
		});

		it('resets accessTokenExpired to false when getting a new token', async () => {
			vi.useFakeTimers();
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});

			// First authentication
			const firstResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'first-token',
				expiresIn: 10, // 10 seconds
			};
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, firstResult);
				}),
			};

			await kvAuth0.checkSession();
			expect(kvAuth0.accessTokenExpired).toBe(false);

			// Fast forward past expiration
			vi.advanceTimersByTime(10 * 1000);
			expect(kvAuth0.accessTokenExpired).toBe(true);
			expect(kvAuth0.accessToken).toBe('');

			// Second authentication with new token
			const secondResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'second-token',
				expiresIn: 3600,
			};
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, secondResult);
				}),
			};

			await kvAuth0.checkSession();

			// Should reset to false with new token
			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.accessToken).toBe('second-token');

			vi.useRealTimers();
		});

		it('does not set expiration timer when expiresIn is not provided', async () => {
			vi.useFakeTimers();
			const mockResult = {
				idTokenPayload: {
					[KIVA_ID_KEY]: 12345,
					[LAST_LOGIN_KEY]: Date.now(),
				},
				accessToken: 'test-access-token',
			};
			const kvAuth0 = new KvAuth0({
				cookieStore: {
					set: vi.fn(),
				},
			});
			kvAuth0.webAuth = {
				checkSession: vi.fn((options, callback) => {
					callback(null, mockResult);
				}),
			};

			await kvAuth0.checkSession();

			expect(kvAuth0.accessTokenExpired).toBe(false);

			// Fast forward time
			vi.advanceTimersByTime(3600 * 1000);

			// Should still be false since no timer was set
			expect(kvAuth0.accessTokenExpired).toBe(false);
			expect(kvAuth0.accessToken).toBe('test-access-token');

			vi.useRealTimers();
		});
	});

	describe('MockKvAuth0', () => {
		it('has expected properties and methods', () => {
			expect(MockKvAuth0.enabled).toBe(false);
			expect(MockKvAuth0.user).toEqual({});
			expect(MockKvAuth0.accessToken).toBe('');
			expect(MockKvAuth0.getKivaId()).toBeUndefined();
			expect(MockKvAuth0.getLastLogin()).toBe(0);
			expect(MockKvAuth0.fakeAuthAllowed()).toBe(false);
			expect(MockKvAuth0.getFakeAuthCookieValue()).toBeUndefined();
			expect(MockKvAuth0.getFakeIdTokenPayload()).toBeUndefined();
			expect(MockKvAuth0.getSyncCookieValue()).toBe(null);
			expect(MockKvAuth0.isNotedLoggedIn()).toBe(false);
			expect(MockKvAuth0.isNotedLoggedOut()).toBe(false);
			expect(MockKvAuth0.isNotedUserSessionUser()).toBe(true);
		});

		it('has async methods that return promises', async () => {
			await expect(MockKvAuth0.checkSession()).resolves.toEqual({});
			await expect(MockKvAuth0.getMfaEnrollToken()).resolves.toEqual({});
			await expect(MockKvAuth0.popupLogin()).resolves.toEqual({});
			await expect(MockKvAuth0.popupCallback()).resolves.toEqual({});
		});

		it('has onError method that does nothing', () => {
			expect(() => {
				MockKvAuth0.onError(() => {});
			}).not.toThrow();
		});
	});
});
