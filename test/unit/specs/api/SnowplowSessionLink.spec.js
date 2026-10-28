import createSnowplowSessionLink from '#src/api/SnowplowSessionLink';

vi.mock('@apollo/client/link/context/index', () => ({
	setContext: vi.fn(handler => ({ handler, contextHandler: handler }))
}));

// A v2 tracker cookie: the session id is the 6th and last field
const v2Cookie = [
	'domain-user-id', 'created-timestamp', 'visit-count', 'current-timestamp', 'last-visit-timestamp', 'session-id',
].join('.');
// Newer trackers (3.5 and up) add four fields after the session id
const newerCookie = [
	v2Cookie, 'previous-session-id', 'first-event-id', 'first-event-timestamp', 'event-index',
].join('.');

describe('SnowplowSessionLink.js', () => {
	let mockCookieStore;

	beforeEach(() => {
		mockCookieStore = {
			get: vi.fn()
		};
	});

	it('should create a context link', () => {
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });

		expect(link).toBeDefined();
		expect(link.contextHandler).toBeDefined();
	});

	it('should add X-Session-Id header when sp cookie exists', () => {
		mockCookieStore.get.mockReturnValue(v2Cookie);
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const mockOperation = {};
		const previousContext = { headers: {} };

		const result = link.contextHandler(mockOperation, previousContext);

		expect(mockCookieStore.get).toHaveBeenCalledWith('_sp_id.6d5c');
		expect(result.headers['X-Session-Id']).toBe('session-id');
	});

	it('should take the session id from the 6th field, not the last, of the newer cookie format', () => {
		mockCookieStore.get.mockReturnValue(newerCookie);
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = {};

		const result = link.contextHandler({}, previousContext);

		expect(result.headers['X-Session-Id']).toBe('session-id');
	});

	it('should return previous context when cookie is undefined', () => {
		mockCookieStore.get.mockReturnValue(undefined);
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = { headers: { 'X-Custom': 'value' } };

		const result = link.contextHandler({}, previousContext);

		expect(result).toEqual(previousContext);
		expect(result.headers['X-Session-Id']).toBeUndefined();
	});

	it('should return previous context when cookieStore is not provided', () => {
		const link = createSnowplowSessionLink({});
		const previousContext = { headers: { 'X-Custom': 'value' } };

		const result = link.contextHandler({}, previousContext);

		expect(result).toEqual(previousContext);
	});

	it('should preserve existing headers when adding session id', () => {
		mockCookieStore.get.mockReturnValue(v2Cookie);
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = {
			headers: {
				Authorization: 'Bearer token',
				'Content-Type': 'application/json'
			}
		};

		const result = link.contextHandler({}, previousContext);

		expect(result.headers.Authorization).toBe('Bearer token');
		expect(result.headers['Content-Type']).toBe('application/json');
		expect(result.headers['X-Session-Id']).toBe('session-id');
	});

	it('should return previous context when cookie has no session id field', () => {
		mockCookieStore.get.mockReturnValue('singlePart');
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = { headers: {} };

		const result = link.contextHandler({}, previousContext);

		expect(result).toEqual(previousContext);
		expect(result.headers['X-Session-Id']).toBeUndefined();
	});

	it('should return previous context when session id is empty string', () => {
		// When cookie value is empty string, getSPCookieSession returns ''
		// and the code returns previousContext without adding header
		mockCookieStore.get.mockReturnValue('');
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = { headers: {} };

		const result = link.contextHandler({}, previousContext);

		// Should return previous context without X-Session-Id header
		expect(result).toEqual(previousContext);
		expect(result.headers['X-Session-Id']).toBeUndefined();
	});
});
