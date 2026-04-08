// @vitest-environment node
import express from 'express';
import liveLoanRouter from '#server/live-loan-router';
import * as liveLoanFetch from '#server/util/live-loan/live-loan-fetch';
import * as memJsUtils from '#server/util/memJsUtils';

// Mock out modules to prevent real network/cache calls
vi.mock('#server/util/live-loan/live-loan-fetch');
vi.mock('#server/util/memJsUtils');
vi.mock('#server/util/live-loan/live-loan-draw');
vi.mock('#server/util/log', () => ({
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
}));

// Mock argv to prevent CLI argument conflicts
vi.mock('#server/util/argv', () => ({ default: {} }));

// Helper: create a minimal Express app with the live-loan router mounted
function createApp(cache) {
	const app = express();
	app.use('/live-loan', liveLoanRouter(cache));
	return app;
}

// Helper: create a mock cache object
function createMockCache() {
	return {
		get: vi.fn(),
		set: vi.fn(),
	};
}

// Helper: make a request to the app and capture the redirect
function makeRequest(app, path) {
	return new Promise((resolve, reject) => {
		// Use node http to test the express app
		const server = app.listen(0, () => {
			const { port } = server.address();
			const http = require('http'); // eslint-disable-line global-require
			const options = {
				hostname: 'localhost',
				port,
				path,
				method: 'GET',
			};
			const httpReq = http.request(options, res => {
				server.close();
				resolve({
					statusCode: res.statusCode,
					headers: res.headers,
					location: res.headers.location,
				});
			});
			httpReq.on('error', err => {
				server.close();
				reject(err);
			});
			httpReq.end();
		});
	});
}

describe('live-loan-router bundle-url routes', () => {
	let cache;

	beforeEach(() => {
		vi.resetAllMocks();
		cache = createMockCache();

		// Default: no cached data
		memJsUtils.getFromCache.mockResolvedValue(null);

		// setToCache must return a Promise so the .catch() call in fetchRecommendedLoans
		// doesn't throw a synchronous TypeError
		memJsUtils.setToCache.mockResolvedValue(undefined);
	});

	describe('redirectToBundleUrl - user bundle-url route', () => {
		it('redirects to /add-loan-bundle with all loan IDs on success', async () => {
			const loans = [{ id: 100 }, { id: 200 }, { id: 300 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=100,200,300');
		});

		it('falls back to /lend-by-category/ on fetch error', async () => {
			liveLoanFetch.default.mockRejectedValue(new Error('Network error'));

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend-by-category/');
		});

		it('falls back to /lend-by-category/ when no loans returned', async () => {
			liveLoanFetch.default.mockResolvedValue([]);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend-by-category/');
		});

		it('filters out loans with missing or null IDs', async () => {
			const loans = [{ id: 100 }, { id: null }, { id: undefined }, { id: 200 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=100,200');
		});

		it('falls back to /lend-by-category/ when all loan IDs are null/missing', async () => {
			const loans = [{ id: null }, { id: undefined }, {}];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend-by-category/');
		});

		it('uses cached loan data when available', async () => {
			const loans = [{ id: 10 }, { id: 20 }];
			memJsUtils.getFromCache.mockResolvedValue(JSON.stringify(loans));

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/99/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=10,20');
			// Should not have called fetchLoansByType since data came from cache
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
		});
	});

	describe('redirectToBundleUrl - FLSS bundle-url route', () => {
		it('redirects to /add-loan-bundle for FLSS user route', async () => {
			const loans = [{ id: 111 }, { id: 222 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/flss/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=111,222');
		});

		it('calls fetchLoansByType with FLSS query type', async () => {
			const loans = [{ id: 111 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			await makeRequest(app, '/live-loan/flss/u/42/bundle-url');

			expect(liveLoanFetch.default).toHaveBeenCalledWith(
				'user',
				'42',
				liveLoanFetch.QUERY_TYPE.FLSS
			);
		});
	});

	describe('redirectToBundleUrl - recommendations bundle-url route', () => {
		it('redirects to /add-loan-bundle for recommendations route', async () => {
			const loans = [{ id: 333 }, { id: 444 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/recommendations/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=333,444');
		});

		it('calls fetchLoansByType with recommendations query type', async () => {
			const loans = [{ id: 333 }];
			liveLoanFetch.default.mockResolvedValue(loans);

			const app = createApp(cache);
			await makeRequest(app, '/live-loan/recommendations/u/42/bundle-url');

			expect(liveLoanFetch.default).toHaveBeenCalledWith(
				'user',
				'42',
				liveLoanFetch.QUERY_TYPE.RECOMMENDATIONS
			);
		});
	});

});
