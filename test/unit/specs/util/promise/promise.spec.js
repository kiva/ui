describe('promise', () => {
	let originalWindow;

	beforeEach(() => {
		originalWindow = global.window;
	});

	afterEach(() => {
		global.window = originalWindow;
		vi.resetModules();
	});

	it('should use window.Promise when window is defined and has Promise', async () => {
		// Set up window with Promise
		global.window = { Promise };

		// Re-import module to test this branch
		vi.resetModules();
		const promiseModule = await import('#src/util/promise/promise');

		expect(promiseModule.default).toBe(Promise);
	});

	it('should use global Promise when window.Promise is undefined', async () => {
		// Set up window without Promise property
		global.window = {};

		// Re-import module to test fallback branch
		vi.resetModules();
		const promiseModule = await import('#src/util/promise/promise');

		expect(promiseModule.default).toBe(Promise);
	});

	it('should use global Promise when window is undefined', async () => {
		// Set window to undefined
		global.window = undefined;

		// Re-import module to test fallback branch
		vi.resetModules();
		const promiseModule = await import('#src/util/promise/promise');

		expect(promiseModule.default).toBe(Promise);
	});

	it('should use global Promise when window.Promise is null', async () => {
		// Set up window with null Promise
		global.window = { Promise: null };

		// Re-import module to test fallback branch
		vi.resetModules();
		const promiseModule = await import('#src/util/promise/promise');

		expect(promiseModule.default).toBe(Promise);
	});
});
