import CDNHelper from '../../../../src/util/CDNHelper';
import { getCDNHelper } from '../../../../src/composables/useCDNHeaders';
import getCDNHeaders from '../../../../src/rendering/cdnHeaders';

// Helper to mock getCDNHelper
vi.mock('#src/composables/useCDNHeaders', { spy: true });

describe('getCDNHeaders', () => {
	it('returns undefined if useCDNCaching is not set', () => {
		const result = getCDNHeaders();
		expect(result).toBeUndefined();
	});

	it('returns undefined if getCDNHelper returns undefined', () => {
		getCDNHelper.mockImplementation(() => undefined);
		const result = getCDNHeaders({ useCDNCaching: true });
		expect(result).toBeUndefined();
	});

	it('returns all tags as Surrogate-Key separated by space', () => {
		const cdnHelper = new CDNHelper();
		cdnHelper.addTags(['foo', 'bar']);
		getCDNHelper.mockImplementation(() => cdnHelper);
		const result = getCDNHeaders({ useCDNCaching: true });
		expect(result['Surrogate-Key']).toBe('foo bar ui-all ui-pages');
	});

	it('returns cach control options as Surrogate-Control', () => {
		const cdnHelper = new CDNHelper();
		cdnHelper.setNumeric('maxAge', 60);
		getCDNHelper.mockImplementation(() => cdnHelper);
		const result = getCDNHeaders({ useCDNCaching: true });
		expect(result['Surrogate-Control']).toBe('max-age=60');
	});
});
