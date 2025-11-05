import createSnowplowSessionLink from '#src/api/SnowplowSessionLink';

vi.mock('@apollo/client/link/context/index', () => ({
	setContext: vi.fn(handler => ({ handler, contextHandler: handler }))
}));

describe('SnowplowSessionLink.js', () => {
	let mockCookieStore;

	beforeEach(() => {
		mockCookieStore = {
			get: vi.fn()
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create a context link', () => {
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });

		expect(link).toBeDefined();
		expect(link.contextHandler).toBeDefined();
	});

	it('should add X-Session-Id header when sp cookie exists', () => {
		mockCookieStore.get.mockReturnValue('domain.timestamp.count.session123');
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const mockOperation = {};
		const previousContext = { headers: {} };

		const result = link.contextHandler(mockOperation, previousContext);

		expect(mockCookieStore.get).toHaveBeenCalledWith('_sp_id.6d5c');
		expect(result.headers['X-Session-Id']).toBe('session123');
	});

	it('should extract session id from end of cookie value', () => {
		mockCookieStore.get.mockReturnValue('part1.part2.part3.sessionABC');
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });
		const previousContext = {};

		const result = link.contextHandler({}, previousContext);

		expect(result.headers['X-Session-Id']).toBe('sessionABC');
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
		mockCookieStore.get.mockReturnValue('a.b.c.session456');
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
		expect(result.headers['X-Session-Id']).toBe('session456');
	});

	it('should handle cookie with single part', () => {
		mockCookieStore.get.mockReturnValue('singlePart');
		const link = createSnowplowSessionLink({ cookieStore: mockCookieStore });

		const result = link.contextHandler({}, {});

		expect(result.headers['X-Session-Id']).toBe('singlePart');
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
