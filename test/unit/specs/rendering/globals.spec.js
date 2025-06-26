describe('renderGlobals', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	it('renders a script tag with window globals for each state', async () => {
		const states = { foo: { a: 1 }, bar: 'baz' };
		vi.stubEnv('NODE_ENV', 'development');
		const { default: renderGlobals } = await import('#src/rendering/globals');
		const result = renderGlobals(states);
		expect(result).toContain('<script>');
		expect(result).toContain('window.foo = {"a":1};');
		expect(result).toContain('window.bar = "baz";');
		expect(result).not.toContain('currentScript');
	});

	it('renders nothing for empty states', async () => {
		vi.stubEnv('NODE_ENV', 'development');
		const { default: renderGlobals } = await import('#src/rendering/globals');
		const result = renderGlobals({});
		expect(result).toBe('<script></script>');
	});

	it('includes autoRemove script in production', async () => {
		const states = { foo: 1 };
		vi.stubEnv('NODE_ENV', 'production');
		const { default: renderGlobals } = await import('#src/rendering/globals');
		const result = renderGlobals(states);
		expect(result).toContain('currentScript');
		expect(result).toContain('window.foo = 1;');
	});
});
