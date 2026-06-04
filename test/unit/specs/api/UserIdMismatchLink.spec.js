import * as Sentry from '@sentry/vue';
import createUserIdMismatchLink from '#src/api/UserIdMismatchLink';
import logFormatter from '#src/util/logFormatter';

vi.mock('@apollo/client/core/index', () => ({
	ApolloLink: vi.fn(handler => ({ handler, request: handler }))
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('@sentry/vue', () => ({
	withScope: vi.fn(),
	captureMessage: vi.fn()
}));

// Run a response back through the link's afterware, simulating the Observable
// returned by forward(operation). Returns whatever the afterware returns so
// callers can assert the response passes through unchanged.
function passResponseThrough(link, { operation, response }) {
	let afterware;
	const observable = {
		map: vi.fn(cb => {
			afterware = cb;
			return observable;
		})
	};
	const forward = vi.fn(() => observable);

	link.request(operation, forward);

	return afterware(response);
}

describe('UserIdMismatchLink.js', () => {
	let mockSetTag;
	let mockSetContext;

	beforeEach(() => {
		mockSetTag = vi.fn();
		mockSetContext = vi.fn();
		Sentry.withScope.mockImplementation(callback => callback({
			setTag: mockSetTag,
			setContext: mockSetContext
		}));
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('creates an ApolloLink', () => {
		const link = createUserIdMismatchLink({ kvAuth0: { getKivaId: vi.fn() } });

		expect(link).toBeDefined();
		expect(link.handler).toBeDefined();
	});

	it('does not alert when the GraphQL id matches the Auth0 id', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(67890), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'myQuery' },
			response: { data: { my: { id: 67890 } } }
		});

		expect(logFormatter).not.toHaveBeenCalled();
		expect(Sentry.captureMessage).not.toHaveBeenCalled();
	});

	it('does not alert when ids match across string and number types', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(67890), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'myQuery' },
			response: { data: { my: { id: '67890' } } }
		});

		expect(logFormatter).not.toHaveBeenCalled();
		expect(Sentry.captureMessage).not.toHaveBeenCalled();
	});

	it('alerts with the operation name, both ids, and both tags on mismatch', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(12345), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'loanQuery' },
			response: { data: { my: { id: 67890 } } }
		});

		const expectedMessage = 'User ID mismatch: GraphQL user ID (67890) '
			+ 'does not match Auth0 user ID (12345)';

		expect(logFormatter).toHaveBeenCalledWith(
			expectedMessage,
			'error',
			expect.objectContaining({
				operationName: 'loanQuery',
				graphqlUserId: 67890,
				auth0UserId: 12345,
				authentication_guard: 'user_id_mismatch',
				data_integrity: 'user_id_mismatch'
			})
		);
		expect(mockSetTag).toHaveBeenCalledWith('authentication_guard', 'user_id_mismatch');
		expect(mockSetTag).toHaveBeenCalledWith('data_integrity', 'user_id_mismatch');
		expect(Sentry.captureMessage).toHaveBeenCalledWith(expectedMessage);
	});

	it('alerts when the access token is not expired but the Auth0 id is unknown', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(undefined), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'myQuery' },
			response: { data: { my: { id: 67890 } } }
		});

		expect(logFormatter).toHaveBeenCalled();
		expect(Sentry.captureMessage).toHaveBeenCalled();
	});

	it('does not alert for an anonymous user with an expired token', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(undefined), accessTokenExpired: true };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'myQuery' },
			response: { data: { my: { id: 67890 } } }
		});

		expect(logFormatter).not.toHaveBeenCalled();
		expect(Sentry.captureMessage).not.toHaveBeenCalled();
	});

	it('does nothing when the response has no my.id', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(12345), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });

		passResponseThrough(link, {
			operation: { operationName: 'loanQuery' },
			response: { data: { lend: { id: 1 } } }
		});

		expect(kvAuth0.getKivaId).not.toHaveBeenCalled();
		expect(logFormatter).not.toHaveBeenCalled();
		expect(Sentry.captureMessage).not.toHaveBeenCalled();
	});

	it('passes the response through unchanged and never mutates it', () => {
		const kvAuth0 = { getKivaId: vi.fn().mockReturnValue(12345), accessTokenExpired: false };
		const link = createUserIdMismatchLink({ kvAuth0 });
		const response = { data: { my: { id: 67890 } } };

		const result = passResponseThrough(link, {
			operation: { operationName: 'loanQuery' },
			response
		});

		expect(result).toBe(response);
		expect(response).toEqual({ data: { my: { id: 67890 } } });
	});

	it('swallows errors from the comparison so the operation never fails', () => {
		const kvAuth0 = {
			getKivaId: vi.fn(() => { throw new Error('boom'); }),
			accessTokenExpired: false
		};
		const link = createUserIdMismatchLink({ kvAuth0 });
		const response = { data: { my: { id: 67890 } } };

		let result;
		expect(() => {
			result = passResponseThrough(link, {
				operation: { operationName: 'loanQuery' },
				response
			});
		}).not.toThrow();

		expect(result).toBe(response);
	});
});
