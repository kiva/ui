// Mock web-vitals module
vi.mock('web-vitals', () => ({
	onCLS: vi.fn(),
	onFCP: vi.fn(),
	onINP: vi.fn(),
	onLCP: vi.fn(),
	onTTFB: vi.fn(),
}));

describe('webVitals.js', () => {
	beforeEach(async () => {
		vi.clearAllMocks();
	});

	it('should collect and track CLS metric', async () => {
		const { onCLS } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		// Get the handler that was passed to onCLS
		expect(onCLS).toHaveBeenCalled();

		const handler = onCLS.mock.calls[0][0];

		// Simulate a CLS report
		handler({ name: 'CLS', id: 'test-cls-id', delta: 0.05 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'CLS',
			'test-cls-id',
			50, // 0.05 * 1000 rounded
		);
	});

	it('should collect and track FCP metric', async () => {
		const { onFCP } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		const handler = onFCP.mock.calls[0][0];

		handler({ name: 'FCP', id: 'test-fcp-id', delta: 1234.56 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'FCP',
			'test-fcp-id',
			1235, // rounded
		);
	});

	it('should collect and track INP metric', async () => {
		const { onINP } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		const handler = onINP.mock.calls[0][0];

		handler({ name: 'INP', id: 'test-inp-id', delta: 100.7 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'INP',
			'test-inp-id',
			101, // rounded
		);
	});

	it('should collect and track LCP metric', async () => {
		const { onLCP } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		const handler = onLCP.mock.calls[0][0];

		handler({ name: 'LCP', id: 'test-lcp-id', delta: 2500.3 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'LCP',
			'test-lcp-id',
			2500, // rounded
		);
	});

	it('should collect and track TTFB metric', async () => {
		const { onTTFB } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		const handler = onTTFB.mock.calls[0][0];

		handler({ name: 'TTFB', id: 'test-ttfb-id', delta: 150.9 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'TTFB',
			'test-ttfb-id',
			151, // rounded
		);
	});

	it('should multiply CLS value by 1000 for precision', async () => {
		const { onCLS } = await import('web-vitals');
		const { default: collectWebVitals } = await import('#src/util/webVitals');

		const mockTrackEvent = vi.fn();

		collectWebVitals(mockTrackEvent);

		const handler = onCLS.mock.calls[0][0];

		handler({ name: 'CLS', id: 'cls-precision-test', delta: 0.123 });

		expect(mockTrackEvent).toHaveBeenCalledWith(
			'web vitals',
			'report',
			'CLS',
			'cls-precision-test',
			123, // 0.123 * 1000
		);
	});
});
