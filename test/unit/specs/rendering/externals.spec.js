vi.mock('#src/head/script', () => ({ default: vi.fn().mockName('headScript') }));
vi.mock('#src/head/oneTrustEvent', () => ({ default: vi.fn().mockName('oneTrustEvent') }));
vi.mock('serialize-javascript', () => ({ default: vi.fn(x => `SERIALIZED(${x.getMockName?.() || x.name || x})`) }));

describe('rendering/externals.js', () => {
	let renderExternals;
	let renderOptInExternals;

	beforeEach(async () => {
		// Import the module dynamically to ensure fresh state for each test
		const externalsModule = await import('#src/rendering/externals');
		renderExternals = externalsModule.renderExternals;
		renderOptInExternals = externalsModule.renderOptInExternals;
	});

	afterEach(() => {
		// Reset the loaded modules to clear cached variables
		vi.resetModules();
	});

	it('renders OneTrust script and head script if enabled', () => {
		const config = { oneTrust: { enable: true, key: 'abc', domainSuffix: 'def' } };
		const result = renderExternals(config);
		expect(result).toContain('data-domain-script="abcdef"');
		expect(result).toContain('otSDKStub.js');
		expect(result).toContain('SERIALIZED(headScript)');
	});

	it('renders only head script if OneTrust is not enabled', () => {
		const config = { oneTrust: { enable: false } };
		const result = renderExternals(config);
		expect(result).not.toContain('otSDKStub.js');
		expect(result).toContain('SERIALIZED(headScript)');
	});

	it('caches the rendered externals', () => {
		const config = { oneTrust: { enable: false } };
		const result1 = renderExternals(config);
		const result2 = renderExternals({ oneTrust: { enable: true, key: 'x', domainSuffix: 'y' } });
		expect(result1).toBe(result2);
	});

	describe('renderOptInExternals', () => {
		it('returns empty string if user opted out', () => {
			const config = { enableOptimizely: true, optimizelyProjectId: '123' };
			const cookieStore = { get: vi.fn().mockReturnValue('opted_out=true') };
			const result = renderOptInExternals(config, cookieStore);
			expect(result).toBe('');
		});

		it('renders optimizely scripts if not opted out and enabled', () => {
			const config = { enableOptimizely: true, optimizelyProjectId: '123' };
			const cookieStore = { get: vi.fn().mockReturnValue('') };
			const result = renderOptInExternals(config, cookieStore);
			expect(result).toContain('optimizely');
			expect(result).toContain('cdn.optimizely.com/js/123.js');
		});

		it('caches the rendered opt-in externals', () => {
			const config = { enableOptimizely: true, optimizelyProjectId: '123' };
			const cookieStore = { get: vi.fn().mockReturnValue('') };
			const result1 = renderOptInExternals(config, cookieStore);
			const result2 = renderOptInExternals({ enableOptimizely: false }, cookieStore);
			expect(result1).toBe(result2);
		});

		it('returns empty string if optimizely is not enabled or missing projectId', () => {
			const config = { enableOptimizely: false };
			const cookieStore = { get: vi.fn().mockReturnValue('') };
			const result = renderOptInExternals(config, cookieStore);
			expect(result).toBe('');
		});
	});
});
