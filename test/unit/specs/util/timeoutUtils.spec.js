import testDelayedGlobalLibrary from '#src/util/timeoutUtils';

describe('timeoutUtils.js', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		global.window = {
			setInterval: vi.fn((...args) => globalThis.setInterval(...args)),
			clearInterval: vi.fn((...args) => globalThis.clearInterval(...args)),
			setTimeout: vi.fn((...args) => globalThis.setTimeout(...args)),
			clearTimeout: vi.fn((...args) => globalThis.clearTimeout(...args)),
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should resolve with loaded:true when library is present', async () => {
		global.window.testLibrary = {};

		const promise = testDelayedGlobalLibrary('testLibrary');

		// Fast-forward time to trigger the interval check
		vi.advanceTimersByTime(100);

		const result = await promise;
		expect(result).toEqual({ loaded: true });
	});

	it('should resolve with loaded:false when library is not present after timeout', async () => {
		const promise = testDelayedGlobalLibrary('nonExistentLibrary', 500);

		// Fast-forward past the timeout
		vi.advanceTimersByTime(500);

		const result = await promise;
		expect(result).toEqual({ loaded: false });
	});

	it('should use default timeout of 3000ms', async () => {
		const promise = testDelayedGlobalLibrary('library');

		// Just before timeout
		vi.advanceTimersByTime(2999);
		// Library still not loaded, promise should not resolve yet

		// After timeout
		vi.advanceTimersByTime(1);

		const result = await promise;
		expect(result).toEqual({ loaded: false });
	});

	it('should reject when window is undefined', async () => {
		delete global.window;

		await expect(testDelayedGlobalLibrary('library')).rejects.toEqual({
			error: 'window object not available',
		});
	});

	it('should detect library added during polling interval', async () => {
		const promise = testDelayedGlobalLibrary('delayedLibrary', 1000);

		// Advance time and add library before it would timeout
		vi.advanceTimersByTime(300);
		global.window.delayedLibrary = { initialized: true };
		vi.advanceTimersByTime(100);

		const result = await promise;
		expect(result).toEqual({ loaded: true });
	});

	it('should check for library every 100ms', () => {
		const setIntervalSpy = vi.spyOn(global.window, 'setInterval');

		testDelayedGlobalLibrary('library');

		expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 100);
	});

	it('should handle library that is null (not undefined)', async () => {
		global.window.nullLibrary = null;

		const promise = testDelayedGlobalLibrary('nullLibrary');
		vi.advanceTimersByTime(100);

		const result = await promise;
		expect(result).toEqual({ loaded: true });
	});

	it('should handle library that is false', async () => {
		global.window.falseLibrary = false;

		const promise = testDelayedGlobalLibrary('falseLibrary');
		vi.advanceTimersByTime(100);

		const result = await promise;
		expect(result).toEqual({ loaded: true });
	});

	it('should handle custom timeout values', async () => {
		const promise = testDelayedGlobalLibrary('customTimeoutLib', 2000);

		vi.advanceTimersByTime(1999);
		// Should still be polling

		vi.advanceTimersByTime(1);

		const result = await promise;
		expect(result).toEqual({ loaded: false });
	});

	it('should handle zero timeout', async () => {
		const promise = testDelayedGlobalLibrary('zeroTimeoutLib', 0);

		vi.advanceTimersByTime(0);

		const result = await promise;
		expect(result).toEqual({ loaded: false });
	});

	it('should handle very long timeout', async () => {
		const promise = testDelayedGlobalLibrary('longTimeoutLib', 10000);

		vi.advanceTimersByTime(9999);
		// Should still be polling

		vi.advanceTimersByTime(1);

		const result = await promise;
		expect(result).toEqual({ loaded: false });
	});
});
