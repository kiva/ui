// @vitest-environment happy-dom
import useCDNHeaders from '../../../../src/composables/useCDNHeaders';

describe('useCDNHeaders (client-side)', () => {
	it('does nothing on client', () => {
		const cb = vi.fn();
		useCDNHeaders(cb);
		expect(cb).not.toHaveBeenCalled();
	});
});
