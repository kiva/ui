import { BatchHttpLink } from '@apollo/client/link/batch-http/index';
import { HttpLink } from '@apollo/client/link/http/index';
import { split } from '@apollo/client/core/index';
import createHttpLink from '#src/api/HttpLink';

vi.mock('@apollo/client/link/batch-http/index');
vi.mock('@apollo/client/link/http/index');
vi.mock('@apollo/client/core/index');

describe('HttpLink', () => {
	let mockHttpLink;
	let mockBatchHttpLink;
	let mockSplitFn;

	beforeEach(() => {
		mockHttpLink = 'mockHttpLink';
		mockBatchHttpLink = 'mockBatchHttpLink';
		mockSplitFn = null;

		// Clear all mock calls from previous tests
		vi.clearAllMocks();

		HttpLink.mockImplementation(() => mockHttpLink);
		BatchHttpLink.mockImplementation(() => mockBatchHttpLink);
		split.mockImplementation((fn, trueBranch, falseBranch) => {
			mockSplitFn = fn;
			return { split: true, trueBranch, falseBranch };
		});
	});

	describe('Link creation', () => {
		it('should create a split link with HttpLink when apolloBatching is false', () => {
			const options = {
				uri: 'https://api.kiva.org/graphql',
				userAgent: 'test-agent',
				fetch: vi.fn(),
				apolloBatching: false,
			};

			const link = createHttpLink(options);

			expect(split).toHaveBeenCalled();
			expect(HttpLink).toHaveBeenCalled();
			expect(link.split).toBe(true);
		});

		it('should create a split link with BatchHttpLink when apolloBatching is true', () => {
			const options = {
				uri: 'https://api.kiva.org/graphql',
				apolloBatching: true,
			};

			createHttpLink(options);

			expect(BatchHttpLink).toHaveBeenCalled();
		});

		it('should use default empty string for uri when not provided', () => {
			createHttpLink({});

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.uri).toBe('');
		});
	});

	describe('Options configuration', () => {
		it('should set strictSSL to false for vm environments', () => {
			createHttpLink({ uri: 'https://vm.kiva.org/graphql' });

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.fetchOptions.strictSSL).toBe(false);
		});

		it('should set strictSSL to false for local environments', () => {
			createHttpLink({ uri: 'http://local.kiva.org/graphql' });

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.fetchOptions.strictSSL).toBe(false);
		});

		it('should set strictSSL to true for production environments', () => {
			createHttpLink({ uri: 'https://api.kiva.org/graphql' });

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.fetchOptions.strictSSL).toBe(true);
		});

		it('should add user agent to headers when provided', () => {
			createHttpLink({ userAgent: 'Kiva/1.0' });

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.headers['User-Agent']).toBe('Kiva/1.0');
		});

		it('should not add user agent header when not provided', () => {
			createHttpLink({});

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.headers['User-Agent']).toBeUndefined();
		});

		it('should set credentials to same-origin', () => {
			createHttpLink({});

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.credentials).toBe('same-origin');
		});

		it('should pass fetch function to link options', () => {
			const mockFetch = vi.fn();
			createHttpLink({ fetch: mockFetch });

			const httpLinkCall = HttpLink.mock.calls[HttpLink.mock.calls.length - 1][0];
			expect(httpLinkCall.fetch).toBe(mockFetch);
		});
	});

	describe('Stellate configuration', () => {
		it('should use stellate URI when stellateGraphqlUri is provided', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				apolloBatching: false,
			});

			// First HttpLink call is for stellate (TRUE branch), second is for origin (FALSE branch)
			const stellateCall = HttpLink.mock.calls[0][0];
			expect(stellateCall.uri).toBe('https://kiva-api-gcdn.stellate.sh');
		});

		it('should add gcdn-debug header when stellateDebugHeaders is true', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateDebugHeaders: true,
				apolloBatching: false,
			});

			// First HttpLink call is for stellate (TRUE branch)
			const stellateCall = HttpLink.mock.calls[0][0];
			expect(stellateCall.headers['gcdn-debug']).toBe(1);
		});

		it('should not add gcdn-debug header when stellateDebugHeaders is false', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateDebugHeaders: false,
			});

			const stellateCall = HttpLink.mock.calls[0][0];
			expect(stellateCall.headers['gcdn-debug']).toBeUndefined();
		});

		it('should preserve user agent in stellate options', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				userAgent: 'Kiva/1.0',
				apolloBatching: false,
			});

			// First HttpLink call is for stellate (TRUE branch)
			const stellateCall = HttpLink.mock.calls[0][0];
			expect(stellateCall.headers['User-Agent']).toBe('Kiva/1.0');
		});
	});

	describe('Split function logic', () => {
		let mockOperation;

		beforeEach(() => {
			mockOperation = {
				operationName: 'GetLoan',
				getContext: vi.fn(() => ({ response: { ok: true } })),
			};
		});

		it('should return false when stellateGraphqlUri is not provided', () => {
			createHttpLink({ uri: 'https://api.kiva.org/graphql' });

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(false);
		});

		it('should return false when cachableOperations is empty', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: '',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(false);
		});

		it('should return true when operation is in cachableOperations list', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: 'GetLoan,GetBorrower',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(true);
		});

		it('should return true when cachableOperations includes wildcard', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: '*',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(true);
		});

		it('should return false when operation is not in cachableOperations list', () => {
			mockOperation.operationName = 'CreateLoan';
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: 'GetLoan,GetBorrower',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(false);
		});

		it('should return false when response.ok is false', () => {
			mockOperation.getContext.mockReturnValue({ response: { ok: false } });
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: 'GetLoan',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(false);
		});

		it('should return true when response.ok is undefined', () => {
			mockOperation.getContext.mockReturnValue({ response: { ok: undefined } });
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: 'GetLoan',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(true);
		});

		it('should handle stellateCachedOperations with spaces', () => {
			createHttpLink({
				uri: 'https://api.kiva.org/graphql',
				stellateGraphqlUri: 'https://kiva-api-gcdn.stellate.sh',
				stellateCachedOperations: 'GetLoan, GetBorrower, GetLender',
			});

			const result = mockSplitFn(mockOperation);
			expect(result).toBe(true);
		});
	});
});
