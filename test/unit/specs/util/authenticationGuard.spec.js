import * as Sentry from '@sentry/vue';
import { authenticationGuard, checkLastLoginTime } from '#src/util/authenticationGuard';
import logFormatter from '#src/util/logFormatter';

vi.mock('@sentry/vue', () => ({
	withScope: vi.fn(),
	captureMessage: vi.fn()
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/query/authenticationQuery.graphql', () => ({
	default: 'authenticationQuery'
}));

describe('authenticationGuard.js', () => {
	let mockRoute;
	let mockApolloClient;
	let mockKvAuth0;
	let mockSetTag;
	let mockSentryScope;

	beforeEach(() => {
		vi.clearAllMocks();

		mockRoute = {
			fullPath: '/lend/1234',
			path: '/lend/1234',
			matched: [
				{
					meta: {}
				}
			]
		};

		mockApolloClient = {
			query: vi.fn()
		};

		mockKvAuth0 = {
			enabled: true,
			isMfaAuthenticated: vi.fn(),
			getKivaId: vi.fn()
		};

		// Setup Sentry mocking
		mockSetTag = vi.fn();
		mockSentryScope = {
			setTag: mockSetTag
		};
		Sentry.withScope.mockImplementation(callback => callback(mockSentryScope));
	});

	describe('checkLastLoginTime', () => {
		it('should return true when login is within duration', () => {
			const lastLogin = Date.now() - 1000; // 1 second ago
			const data = {
				my: {
					lastLoginTimestamp: lastLogin
				},
				general: {
					activeLoginDuration: {
						value: '3600'
					}
				}
			};

			const result = checkLastLoginTime(data, 'activeLoginDuration', 3600);

			expect(result).toBe(true);
		});

		it('should return false when login exceeds duration', () => {
			const lastLogin = Date.now() - 5000 * 1000; // 5000 seconds ago
			const data = {
				my: {
					lastLoginTimestamp: lastLogin
				},
				general: {
					activeLoginDuration: {
						value: '3600'
					}
				}
			};

			const result = checkLastLoginTime(data, 'activeLoginDuration', 3600);

			expect(result).toBe(false);
		});

		it('should use default duration when duration key value is missing', () => {
			const lastLogin = Date.now() - 1000;
			const data = {
				my: {
					lastLoginTimestamp: lastLogin
				},
				general: {}
			};

			const result = checkLastLoginTime(data, 'activeLoginDuration', 3600);

			expect(result).toBe(true);
		});

		it('should return false when lastLoginTimestamp is 0', () => {
			const data = {
				my: {
					lastLoginTimestamp: 0
				},
				general: {
					activeLoginDuration: {
						value: '3600'
					}
				}
			};

			const result = checkLastLoginTime(data, 'activeLoginDuration', 3600);

			expect(result).toBe(false);
		});

		it('should handle missing my data', () => {
			const data = {
				general: {
					activeLoginDuration: {
						value: '3600'
					}
				}
			};

			const result = checkLastLoginTime(data, 'activeLoginDuration', 3600);

			expect(result).toBe(false);
		});
	});

	describe('authenticationGuard', () => {
		it('should resolve when auth0 is not enabled', async () => {
			mockKvAuth0.enabled = false;

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();

			expect(mockApolloClient.query).not.toHaveBeenCalled();
		});

		it('should resolve when no authentication is required', async () => {
			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();

			expect(mockApolloClient.query).not.toHaveBeenCalled();
		});

		it('should resolve when authentication required and user is logged in', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now()
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();

			expect(mockApolloClient.query).toHaveBeenCalledWith({
				query: 'authenticationQuery',
				fetchPolicy: 'network-only'
			});
		});

		it('should reject with login redirect when user is not authenticated', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: { my: null }
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { doneUrl: '/lend/1234' }
			});
		});

		it('should resolve when active login required and user has active login', async () => {
			mockRoute.matched[0].meta.activeLoginRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now() - 1000
					},
					general: {
						activeLoginDuration: {
							value: '3600'
						}
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();
		});

		it('should reject when active login required but user login is not active', async () => {
			mockRoute.matched[0].meta.activeLoginRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now() - 5000 * 1000
					},
					general: {
						activeLoginDuration: {
							value: '3600'
						}
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { force: true, doneUrl: '/lend/1234' }
			});
		});

		it('should resolve when recent login required and user has recent login', async () => {
			mockRoute.matched[0].meta.recentLoginRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now() - 100 * 1000
					},
					general: {
						recentLoginDuration: {
							value: '300'
						}
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();
		});

		it('should reject when recent login required but user login is not recent', async () => {
			mockRoute.matched[0].meta.recentLoginRequired = true;
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now() - 400 * 1000
					},
					general: {
						recentLoginDuration: {
							value: '300'
						}
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { force: true, doneUrl: '/lend/1234' }
			});
		});

		it('should resolve when mfa required and user has mfa authenticated', async () => {
			mockRoute.matched[0].meta.mfaRequired = true;
			mockKvAuth0.isMfaAuthenticated.mockReturnValue(true);
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now(),
						emailVerifiedRecently: false
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();
		});

		it('should resolve when mfa required and user has email verified recently', async () => {
			mockRoute.matched[0].meta.mfaRequired = true;
			mockKvAuth0.isMfaAuthenticated.mockReturnValue(false);
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now(),
						emailVerifiedRecently: true
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();
		});

		it('should reject to verification page when mfa required but not authenticated', async () => {
			mockRoute.matched[0].meta.mfaRequired = true;
			mockRoute.matched[0].meta.process = 'checkout';
			mockKvAuth0.isMfaAuthenticated.mockReturnValue(false);
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now(),
						emailVerifiedRecently: false
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/start-verification',
				query: {
					doneUrl: '/lend/1234',
					process: 'checkout'
				}
			});
		});

		it('should handle query errors and redirect to login', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockRejectedValue(new Error('Network error'));

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { doneUrl: '/lend/1234' }
			});
		});

		it('should handle multiple matched routes with different requirements', async () => {
			mockRoute.matched = [
				{ meta: {} },
				{ meta: { authenticationRequired: true } }
			];
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						lastLoginTimestamp: Date.now()
					}
				}
			});

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).resolves.toBeUndefined();
		});

		it('should handle activeLoginRequired error in catch', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockRejectedValue(new Error('activeLoginRequired'));

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { force: true, doneUrl: '/lend/1234' }
			});
		});

		it('should handle recentLoginRequired error in catch', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockRejectedValue(new Error('recentLoginRequired'));

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { force: true, doneUrl: '/lend/1234' }
			});
		});

		it('should handle api.authenticationRequired error in catch', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockApolloClient.query.mockRejectedValue(new Error('api.authenticationRequired'));

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/ui-login',
				query: { doneUrl: '/lend/1234' }
			});
		});

		it('should handle verificationRequired error in catch', async () => {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockRoute.matched[0].meta.process = 'lending';
			mockApolloClient.query.mockRejectedValue(new Error('verificationRequired'));

			await expect(authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			})).rejects.toEqual({
				path: '/start-verification',
				query: {
					doneUrl: '/lend/1234',
					process: 'lending'
				}
			});
		});

		async function setupUserIdMismatchTest({ graphqlUserId, auth0UserId }) {
			mockRoute.matched[0].meta.authenticationRequired = true;
			mockKvAuth0.getKivaId = vi.fn().mockReturnValue(auth0UserId);
			mockApolloClient.query.mockResolvedValue({
				data: {
					my: {
						id: graphqlUserId,
						lastLoginTimestamp: Date.now()
					}
				}
			});

			await authenticationGuard({
				route: mockRoute,
				apolloClient: mockApolloClient,
				kvAuth0: mockKvAuth0
			});
		}

		function expectUserIdMismatchLogged({ graphqlUserId, auth0UserId }) {
			// eslint-disable-next-line max-len
			const expectedMessage = `User ID mismatch: GraphQL user ID (${graphqlUserId}) does not match Auth0 user ID (${auth0UserId})`;
			expect(logFormatter).toHaveBeenCalledWith(
				expectedMessage,
				'error',
				{ authentication_guard: 'user_id_mismatch' }
			);
			expect(Sentry.withScope).toHaveBeenCalled();
			expect(mockSetTag).toHaveBeenCalledWith('authentication_guard', 'user_id_mismatch');
			expect(Sentry.captureMessage).toHaveBeenCalledWith(expectedMessage);
		}

		function expectUserIdMismatchNotLogged() {
			expect(logFormatter).not.toHaveBeenCalled();
			expect(Sentry.withScope).not.toHaveBeenCalled();
			expect(mockSetTag).not.toHaveBeenCalled();
			expect(Sentry.captureMessage).not.toHaveBeenCalled();
		}

		it(
			'should log error and send tagged message to Sentry when data.my.id does not match logged in user id',
			async () => {
				const graphqlUserId = 67890;
				const auth0UserId = 12345;
				await setupUserIdMismatchTest({ graphqlUserId, auth0UserId });
				expectUserIdMismatchLogged({ graphqlUserId, auth0UserId });
			}
		);

		it(
			'should log error and send tagged message to Sentry when user not logged in',
			async () => {
				const graphqlUserId = 67890;
				const auth0UserId = undefined;
				await setupUserIdMismatchTest({ graphqlUserId, auth0UserId });
				expectUserIdMismatchLogged({ graphqlUserId, auth0UserId });
			}
		);

		it(
			'should not log error when user IDs match',
			async () => {
				const userId = 67890;
				await setupUserIdMismatchTest({
					graphqlUserId: userId,
					auth0UserId: userId
				});
				expectUserIdMismatchNotLogged();
			}
		);

		it(
			'should not log error when user IDs match (string vs number)',
			async () => {
				await setupUserIdMismatchTest({
					graphqlUserId: '67890',
					auth0UserId: 67890
				});
				expectUserIdMismatchNotLogged();
			}
		);
	});
});
