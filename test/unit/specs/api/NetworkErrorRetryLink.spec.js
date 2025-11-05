import createNetworkErrorRetryLink from '#src/api/NetworkErrorRetryLink';

vi.mock('@apollo/client/link/retry/index', () => ({
	RetryLink: vi.fn(function MockRetryLink(config) {
		this.config = config;
		return this;
	})
}));

describe('NetworkErrorRetryLink.js', () => {
	it('should create a RetryLink with default config', () => {
		const link = createNetworkErrorRetryLink({});

		expect(link).toBeDefined();
		expect(link.config).toBeDefined();
		expect(link.config.attempts.max).toBe(1);
	});

	it('should use custom attemptsMax when provided', () => {
		const link = createNetworkErrorRetryLink({ attemptsMax: 3 });

		expect(link.config.attempts.max).toBe(3);
	});

	it('should set activateRetry to false by default', () => {
		const link = createNetworkErrorRetryLink({});
		const error = new Error('Network error');

		const shouldRetry = link.config.attempts.retryIf(error, {});

		expect(shouldRetry).toBe(false);
	});

	it('should retry when activateRetry is true and error exists', () => {
		const link = createNetworkErrorRetryLink({ activateRetry: true });
		const error = new Error('Network error');

		const shouldRetry = link.config.attempts.retryIf(error, {});

		expect(shouldRetry).toBe(true);
	});

	it('should not retry when activateRetry is true but no error', () => {
		const link = createNetworkErrorRetryLink({ activateRetry: true });

		const shouldRetry = link.config.attempts.retryIf(null, {});

		expect(shouldRetry).toBe(false);
	});

	it('should not retry when activateRetry is false even with error', () => {
		const link = createNetworkErrorRetryLink({ activateRetry: false });
		const error = new Error('Network error');

		const shouldRetry = link.config.attempts.retryIf(error, {});

		expect(shouldRetry).toBe(false);
	});

	it('should use both custom attemptsMax and activateRetry', () => {
		const link = createNetworkErrorRetryLink({
			attemptsMax: 5,
			activateRetry: true
		});

		expect(link.config.attempts.max).toBe(5);

		const error = new Error('Network error');
		const shouldRetry = link.config.attempts.retryIf(error, {});
		expect(shouldRetry).toBe(true);
	});
});
