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
				liveLoanFetch.QUERY_TYPE.FLSS,
				4,
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
				liveLoanFetch.QUERY_TYPE.RECOMMENDATIONS,
				4,
			);
		});
	});

	describe('balance-aware bundle size', () => {
		it('balance=75 on /u/:id/bundle-url returns 3 loans', async () => {
			const fresh = [{ id: 11 }, { id: 12 }, { id: 13 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=75');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=11,12,13');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'default', 3);
		});

		it('balance=130 returns 6 loans', async () => {
			const fresh = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=130');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2,3,4,5,6');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'default', 6);
		});

		it('balance=200 redirects to /lend/filter without fetching loans', async () => {
			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=200');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend/filter');
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
			expect(memJsUtils.getFromCache).not.toHaveBeenCalled();
		});

		it('no balance preserves 4-loan default behavior', async () => {
			const fresh = [{ id: 100 }, { id: 200 }, { id: 300 }, { id: 400 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=100,200,300,400');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'default', 4);
		});

		it('strips balance from forwarded query params, keeps others', async () => {
			const fresh = [{ id: 1 }, { id: 2 }, { id: 3 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(
				app,
				'/live-loan/u/42/bundle-url?balance=75&utm_source=email&utm_campaign=weekly',
			);

			expect(result.statusCode).toBe(302);
			const loc = new URL(`http://x${result.location}`);
			expect(loc.pathname).toBe('/add-loan-bundle');
			expect(loc.searchParams.get('loanIds')).toBe('1,2,3');
			expect(loc.searchParams.get('utm_source')).toBe('email');
			expect(loc.searchParams.get('utm_campaign')).toBe('weekly');
			expect(loc.searchParams.has('balance')).toBe(false);
		});

		it('invalid balance (non-numeric) falls back to 4 loans', async () => {
			const fresh = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=abc');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2,3,4');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'default', 4);
		});

		it('balance=75 on /flss/u/:id/bundle-url returns 3 loans with FLSS query type', async () => {
			const fresh = [{ id: 1 }, { id: 2 }, { id: 3 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/flss/u/42/bundle-url?balance=75');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2,3');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'flss', 3);
		});

		it('balance=200 on /flss/u/:id/bundle-url redirects to /lend/filter', async () => {
			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/flss/u/42/bundle-url?balance=200');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend/filter');
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
		});

		it('balance=130 on /recommendations route returns 6 loans', async () => {
			const fresh = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/recommendations/u/42/bundle-url?balance=130');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2,3,4,5,6');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'recommendations', 6);
		});

		it('balance=200 on /recommendations/u/:id/bundle-url redirects to /lend/filter', async () => {
			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/recommendations/u/42/bundle-url?balance=200');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/lend/filter');
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
		});
	});

	describe('length-aware cache for bundle-url', () => {
		it('serves cached array when cached.length >= requested count', async () => {
			const cached = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
			memJsUtils.getFromCache.mockResolvedValue(JSON.stringify(cached));

			const app = createApp(cache);
			// balance=50 -> 2 loans; cache has 4 -> sufficient; slice to 2
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=50');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2');
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
		});

		it('refetches and overwrites when cached.length < requested count', async () => {
			const cached = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
			memJsUtils.getFromCache.mockResolvedValue(JSON.stringify(cached));
			const fresh = [{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }];
			liveLoanFetch.default.mockResolvedValue(fresh);

			const app = createApp(cache);
			// balance=130 -> 6 loans; cache has 4 -> insufficient
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url?balance=130');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=11,12,13,14,15,16');
			expect(liveLoanFetch.default).toHaveBeenCalledWith('user', '42', 'default', 6);
			expect(memJsUtils.setToCache).toHaveBeenCalledWith(
				'recommendations-by-user-id-42',
				JSON.stringify(fresh),
				10 * 60,
				cache,
			);
		});

		it('slices cached array to count when cache has more than requested', async () => {
			const cached = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
			memJsUtils.getFromCache.mockResolvedValue(JSON.stringify(cached));

			const app = createApp(cache);
			// No balance -> default 4 loans; cache has 6 -> slice
			const result = await makeRequest(app, '/live-loan/u/42/bundle-url');

			expect(result.statusCode).toBe(302);
			expect(result.location).toBe('/add-loan-bundle?loanIds=1,2,3,4');
			expect(liveLoanFetch.default).not.toHaveBeenCalled();
		});
	});

	describe('serveImg - bundle-img routes', () => {
		let drawLoanCard;

		beforeEach(async () => {
			const drawModule = await import('#server/util/live-loan/live-loan-draw');
			drawLoanCard = drawModule.default;
			drawLoanCard.mockResolvedValue({ buffer: Buffer.from('jpeg-bytes'), hasBorrowerImage: true });
		});

		it('serves jpeg for /u/:id/bundle-img/:offset with bundle style', async () => {
			liveLoanFetch.default.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/u/42/bundle-img/1');

			expect(result.statusCode).toBe(200);
			expect(result.headers['content-type']).toBe('image/jpeg');
			expect(drawLoanCard).toHaveBeenCalledWith({ id: 1 }, 'bundle');
		});

		it('FLSS bundle-img route passes FLSS query type and bundle style', async () => {
			liveLoanFetch.default.mockResolvedValue([{ id: 11 }, { id: 22 }]);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/flss/u/42/bundle-img/2');

			expect(result.statusCode).toBe(200);
			expect(result.headers['content-type']).toBe('image/jpeg');
			expect(drawLoanCard).toHaveBeenCalledWith({ id: 22 }, 'bundle');
			expect(liveLoanFetch.default).toHaveBeenCalledWith(
				'user',
				'42',
				liveLoanFetch.QUERY_TYPE.FLSS,
				4,
			);
		});

		it('recommendations bundle-img route passes recommendations query type and bundle style', async () => {
			liveLoanFetch.default.mockResolvedValue([{ id: 33 }]);

			const app = createApp(cache);
			const result = await makeRequest(app, '/live-loan/recommendations/u/42/bundle-img/1');

			expect(result.statusCode).toBe(200);
			expect(result.headers['content-type']).toBe('image/jpeg');
			expect(drawLoanCard).toHaveBeenCalledWith({ id: 33 }, 'bundle');
			expect(liveLoanFetch.default).toHaveBeenCalledWith(
				'user',
				'42',
				liveLoanFetch.QUERY_TYPE.RECOMMENDATIONS,
				4,
			);
		});
	});
});
