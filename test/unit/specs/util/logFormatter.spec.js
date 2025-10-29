import logFormatter from '../../../../src/util/logFormatter';

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
