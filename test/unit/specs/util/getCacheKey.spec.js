describe('getCacheKey', () => {
	it('should include commit hash in cache key', async () => {
		global.UI_COMMIT = 'abc123def456';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('myKey');

		expect(result).toContain('myKey-abc123de');
	});

	it('should use first 8 characters of commit hash', async () => {
		global.UI_COMMIT = 'verylongcommithash123456789';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('test');

		// Should contain the key and first 8 chars of commit
		expect(result).toContain('test-verylong');
	});

	it('should handle empty commit hash', async () => {
		global.UI_COMMIT = '';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('myKey');

		expect(result).toMatch(/^myKey-/);
	});

	it('should handle undefined commit hash', async () => {
		global.UI_COMMIT = undefined;
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('myKey');

		expect(result).toMatch(/^myKey-/);
	});

	it('should handle short commit hash', async () => {
		global.UI_COMMIT = 'abc';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('myKey');

		expect(result).toContain('myKey-abc');
	});

	it('should generate different keys for different input keys', async () => {
		global.UI_COMMIT = 'abc12345';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result1 = getCacheKey('key1');
		const result2 = getCacheKey('key2');

		expect(result1).not.toBe(result2);
		expect(result1).toContain('key1');
		expect(result2).toContain('key2');
	});

	it('should include timestamp in development mode', async () => {
		global.UI_COMMIT = 'abc12345';
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		vi.resetModules(); // Reset to ensure the module re-evaluates NODE_ENV
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result1 = getCacheKey('devKey');
		// Wait a bit to ensure timestamp changes
		await new Promise(resolve => {
			setTimeout(resolve, 5);
		});
		const result2 = getCacheKey('devKey');

		// In development, keys should be different due to timestamp
		expect(result1).not.toBe(result2);
		expect(result1).toContain('devKey');
		expect(result2).toContain('devKey');

		process.env.NODE_ENV = originalEnv;
	});

	it('should verify cache key format includes commit hash', async () => {
		global.UI_COMMIT = 'abc12345';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('testKey');

		// Should start with key name followed by dash and commit hash
		expect(result).toMatch(/^testKey-abc12345/);
		// Format is: key-commithash or key-commithashtimestamp
		const parts = result.split('-');
		expect(parts[0]).toBe('testKey');
		expect(parts[1]).toContain('abc12345');
	});

	it('should handle special characters in key', async () => {
		global.UI_COMMIT = 'abc12345';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('my-key_123.test');

		expect(result).toContain('my-key_123.test-abc12345');
	});

	it('should handle empty string as key', async () => {
		global.UI_COMMIT = 'abc12345';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey('');

		expect(result).toContain('-abc12345');
	});

	it('should handle numeric key', async () => {
		global.UI_COMMIT = 'abc12345';
		const getCacheKey = (await import('#src/util/getCacheKey')).default;

		const result = getCacheKey(123);

		expect(result).toContain('123-abc12345');
	});
});
