// @vitest-environment node
import useCDNHeaders, { getCDNHelper } from '../../../../src/composables/useCDNHeaders';
import CDNHelper from '../../../../src/util/CDNHelper';

describe('useCDNHeaders (server-side)', () => {
	afterEach(() => {
		// Reset the loaded modules to clear cached variables
		vi.resetModules();
	});

	it('initializes CDNHelper and calls callback on server', () => {
		const cb = vi.fn();
		useCDNHeaders(cb);
		expect(cb).toHaveBeenCalledTimes(1);
		const callbackArgument = cb.mock.calls[0][0];
		expect(callbackArgument).toBeInstanceOf(CDNHelper);
	});

	it('reuses the same CDNHelper instance on multiple calls', () => {
		let first;
		useCDNHeaders(h => { first = h; });
		let second;
		useCDNHeaders(h => { second = h; });
		expect(first).toBe(second);
	});

	it('does not call callback if not a function', () => {
		expect(() => useCDNHeaders(null)).not.toThrow();
		expect(() => useCDNHeaders(undefined)).not.toThrow();
	});

	it('getCDNHelper returns the singleton instance', () => {
		let inst;
		useCDNHeaders(h => { inst = h; });
		expect(getCDNHelper()).toBe(inst);
	});
});
