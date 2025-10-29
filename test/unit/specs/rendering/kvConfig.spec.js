import renderConfigGlobal from '../../../../src/rendering/kvConfig';
import renderGlobals from '../../../../src/rendering/globals';

vi.mock('#src/rendering/globals', () => ({
	default: vi.fn().mockReturnValue('<script>window.__KV_CONFIG__ = {};</script>')
}));

describe('renderConfigGlobal', () => {
	it('renders config global only once (caches result)', () => {
		const config = { foo: 'bar' };
		const result1 = renderConfigGlobal(config);
		const result2 = renderConfigGlobal(config);
		// Should call renderGlobals only once
		expect(renderGlobals).toHaveBeenCalledTimes(1);
		expect(renderGlobals).toHaveBeenCalledWith({ __KV_CONFIG__: config });
		expect(result1).toBe(result2);
	});

	it('returns the cached result on subsequent calls', () => {
		const config = { a: 1 };
		const result1 = renderConfigGlobal(config);
		const result2 = renderConfigGlobal({ a: 2 });
		expect(result1).toBe(result2);
	});
});
