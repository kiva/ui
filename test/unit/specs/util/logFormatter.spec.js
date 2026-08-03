import logFormatter from '#src/util/logFormatter';

describe('logFormatter.js', () => {
	let consoleSpy;

	beforeEach(() => {
		// Store original console methods
		consoleSpy = {
			log: vi.spyOn(console, 'log').mockImplementation(() => {}),
			debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
			info: vi.spyOn(console, 'info').mockImplementation(() => {}),
			warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
			error: vi.spyOn(console, 'error').mockImplementation(() => {}),
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return false for empty string message', () => {
		const result = logFormatter('', 'log');
		expect(result).toBe(false);
		expect(consoleSpy.log).not.toHaveBeenCalled();
	});

	it('should return false for null message', () => {
		const result = logFormatter(null, 'log');
		expect(result).toBe(false);
		expect(consoleSpy.log).not.toHaveBeenCalled();
	});

	it('should return false for undefined message', () => {
		const result = logFormatter(undefined, 'log');
		expect(result).toBe(false);
		expect(consoleSpy.log).not.toHaveBeenCalled();
	});

	it('should return false when there is neither a message nor metadata', () => {
		const result = logFormatter(null, 'error', {});

		expect(result).toBe(false);
		expect(consoleSpy.error).not.toHaveBeenCalled();
	});

	// Dropping the log would discard the level and the context along with it.
	it('should log a fallback message when there is no message but metadata exists', () => {
		logFormatter(null, 'error', { operationName: 'LoanQuery' });

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: { operationName: 'LoanQuery' },
				level: 'error',
				message: '(no message)',
			})
		);
	});

	it('should call console.log with stringified message for default type', () => {
		logFormatter('Test message');

		expect(consoleSpy.log).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'log',
				message: 'Test message',
			})
		);
	});

	it('should call console.log with stringified message when no type specified', () => {
		logFormatter('Test message', undefined);

		expect(consoleSpy.log).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'log',
				message: 'Test message',
			})
		);
	});

	it('should call console.debug for debug type', () => {
		logFormatter('Debug message', 'debug');

		expect(consoleSpy.debug).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'debug',
				message: 'Debug message',
			})
		);
	});

	it('should call console.info for info type', () => {
		logFormatter('Info message', 'info');

		expect(consoleSpy.info).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'info',
				message: 'Info message',
			})
		);
	});

	it('should call console.warn for warn type', () => {
		logFormatter('Warning message', 'warn');

		expect(consoleSpy.warn).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'warn',
				message: 'Warning message',
			})
		);
	});

	it('should call console.error for error type', () => {
		logFormatter('Error message', 'error');

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'error',
				message: 'Error message',
			})
		);
	});

	it('should include custom metadata in output', () => {
		const meta = { userId: 123, action: 'login' };
		logFormatter('User action', 'info', meta);

		expect(consoleSpy.info).toHaveBeenCalledWith(
			JSON.stringify({
				meta: { userId: 123, action: 'login' },
				level: 'info',
				message: 'User action',
			})
		);
	});

	it('should handle empty metadata object', () => {
		logFormatter('Test message', 'log', {});

		expect(consoleSpy.log).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'log',
				message: 'Test message',
			})
		);
	});

	it('should handle unknown type by using console.log', () => {
		logFormatter('Test message', 'unknownType');

		expect(consoleSpy.log).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'unknownType',
				message: 'Test message',
			})
		);
	});

	it('should handle numeric message', () => {
		logFormatter(42, 'info');

		expect(consoleSpy.info).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'info',
				message: 42,
			})
		);
	});

	it('should handle object message', () => {
		const obj = { key: 'value' };
		logFormatter(obj, 'debug');

		expect(consoleSpy.debug).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'debug',
				message: obj,
			})
		);
	});

	// An Error's message and stack are non-enumerable, so without unwrapping,
	// JSON.stringify reduces one to `{}` and the failure is lost entirely.
	it('should use an Error message as the log message', () => {
		logFormatter(new Error('Network error: 503'), 'error');

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'error',
				message: 'Network error: 503',
			})
		);
	});

	it('should use the message from an Error subclass', () => {
		class ApolloishError extends Error {}

		logFormatter(new ApolloishError('Query failed'), 'error');

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'error',
				message: 'Query failed',
			})
		);
	});

	// This is what makes `logFormatter('...', 'error', { error })` safe to write
	// at a call site whatever kind of error was caught.
	it('should reduce an Error in metadata to its message', () => {
		logFormatter('Failed to post loan comment', 'error', {
			error: new Error('Comment not added'),
			loanId: 12345,
		});

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: { error: 'Comment not added', loanId: 12345 },
				level: 'error',
				message: 'Failed to post loan comment',
			})
		);
	});

	// Plain objects serialize fine on their own, so they must pass through whole
	// rather than being flattened to an undefined message.
	it('should preserve a plain object in metadata', () => {
		const auth0Error = { error: 'unknown_error', error_description: 'Something went wrong' };

		logFormatter('Auth0 reported an unknown error', 'error', { error: auth0Error });

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: { error: auth0Error },
				level: 'error',
				message: 'Auth0 reported an unknown error',
			})
		);
	});

	// An empty message must not silence the log — the failure is still real.
	it('should fall back to the string form for an Error with an empty message', () => {
		logFormatter(new Error(''), 'error');

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'error',
				message: 'Error',
			})
		);
	});

	it('should use the string form of a subclass with an empty message', () => {
		logFormatter(new TypeError(''), 'error');

		expect(consoleSpy.error).toHaveBeenCalledWith(
			JSON.stringify({
				meta: {},
				level: 'error',
				message: 'TypeError',
			})
		);
	});

	it('should handle complex metadata', () => {
		const meta = {
			user: { id: 1, name: 'Test' },
			timestamp: Date.now(),
			tags: ['tag1', 'tag2']
		};
		logFormatter('Complex log', 'warn', meta);

		expect(consoleSpy.warn).toHaveBeenCalledWith(
			JSON.stringify({
				meta,
				level: 'warn',
				message: 'Complex log',
			})
		);
	});
});
