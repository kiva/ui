import {
	describe, it, expect, vi, beforeEach, afterEach
} from 'vitest';
import CDNHelper from '#src/util/CDNHelper';

vi.mock('#src/util/CDNHelper');

describe('useCDNHeaders', () => {
	const originalWindow = global.window;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
		// Mock server environment by deleting window
		delete global.window;
	});

	afterEach(() => {
		// Restore window
		global.window = originalWindow;
	});

	it('should initialize CDNHelper and execute callback', async () => {
		const mockCallback = vi.fn();
		const mockHelperInstance = { mock: 'helper' };
		CDNHelper.mockImplementation(() => mockHelperInstance);

		const { default: useCDNHeaders } = await import('#src/composables/useCDNHeaders');

		useCDNHeaders(mockCallback);

		expect(CDNHelper).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith(mockHelperInstance);
	});

	it('should not execute callback if callback is not a function', async () => {
		const mockHelperInstance = { mock: 'helper' };
		CDNHelper.mockImplementation(() => mockHelperInstance);

		const { default: useCDNHeaders } = await import('#src/composables/useCDNHeaders');

		useCDNHeaders(null);

		expect(CDNHelper).toHaveBeenCalledTimes(1);
	});

	it('should reuse existing CDNHelper instance on subsequent calls', async () => {
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();
		const mockHelperInstance = { mock: 'helper' };
		CDNHelper.mockImplementation(() => mockHelperInstance);

		const { default: useCDNHeaders } = await import('#src/composables/useCDNHeaders');

		useCDNHeaders(mockCallback1);
		useCDNHeaders(mockCallback2);

		expect(CDNHelper).toHaveBeenCalledTimes(1); // Only once
		expect(mockCallback1).toHaveBeenCalledWith(mockHelperInstance);
		expect(mockCallback2).toHaveBeenCalledWith(mockHelperInstance);
	});

	it('should not execute in client-side context', async () => {
		// Restore window to simulate client environment
		global.window = { document: {} };

		const mockCallback = vi.fn();

		const { default: useCDNHeaders } = await import('#src/composables/useCDNHeaders');

		const result = useCDNHeaders(mockCallback);

		expect(result).toBeUndefined();
		expect(CDNHelper).not.toHaveBeenCalled();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('should return helper via getCDNHelper', async () => {
		const mockHelperInstance = { mock: 'helper' };
		CDNHelper.mockImplementation(() => mockHelperInstance);

		const { default: useCDNHeaders, getCDNHelper } = await import('#src/composables/useCDNHeaders');

		useCDNHeaders(() => {});

		expect(getCDNHelper()).toStrictEqual(mockHelperInstance);
	});
});
