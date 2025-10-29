import createNetworkErrorLoggingLink from '../../../../src/api/NetworkErrorLoggingLink';

vi.mock('@apollo/client/link/error/index', () => ({
	onError: vi.fn(handler => ({ handler, errorHandler: handler }))
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

describe('NetworkErrorLoggingLink.js', () => {
	let mockLogFormatter;

	beforeEach(async () => {
		const logFormatter = await import('#src/util/logFormatter');
		mockLogFormatter = logFormatter.default;

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create an error link', () => {
		const link = createNetworkErrorLoggingLink();

		expect(link).toBeDefined();
		expect(link.errorHandler).toBeDefined();
	});

	it('should log network error when it exists', () => {
		const link = createNetworkErrorLoggingLink();
		const mockNetworkError = new Error('Network failure');
		const mockOperation = { operationName: 'testQuery' };
		const mockForward = vi.fn();

		link.errorHandler({
			networkError: mockNetworkError,
			operation: mockOperation,
			forward: mockForward
		});

		expect(mockLogFormatter).toHaveBeenCalledWith(
			'Apollo network error: Error: Network failure',
			'error',
			{ operation: mockOperation, networkError: mockNetworkError }
		);
		expect(mockForward).toHaveBeenCalled();
	});

	it('should not log when network error does not exist', () => {
		const link = createNetworkErrorLoggingLink();
		const mockOperation = { operationName: 'testQuery' };
		const mockForward = vi.fn();

		link.errorHandler({
			networkError: null,
			operation: mockOperation,
			forward: mockForward
		});

		expect(mockLogFormatter).not.toHaveBeenCalled();
		expect(mockForward).toHaveBeenCalled();
	});

	it('should forward operation after logging error', () => {
		const link = createNetworkErrorLoggingLink();
		const mockNetworkError = new Error('Connection timeout');
		const mockOperation = { operationName: 'userQuery' };
		const mockForward = vi.fn();

		link.errorHandler({
			networkError: mockNetworkError,
			operation: mockOperation,
			forward: mockForward
		});

		expect(mockForward).toHaveBeenCalledTimes(1);
	});
});
