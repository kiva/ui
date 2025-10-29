import { shouldShowAppInstallPrompt, renderAppInstallPrompt } from '../../../../src/util/appInstallPrompt';

describe('shouldShowAppInstallPrompt', () => {
	const allowedRoutes = [
		'/start', '/portfolio', '/lend', '/lend-by-category', '/about', '/'
	];
	const deniedParams = ['upc', 'promo_code', 'lending_reward'];

	function makeUrl(path, params = {}) {
		const url = new URL(`https://kiva.org${path}`);
		Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
		return url;
	}

	it('returns false if denied param is present', async () => {
		const cookieStore = { get: vi.fn() };
		const apollo = { query: vi.fn() };
		const results = await Promise.all(
			deniedParams.map(async param => {
				const url = makeUrl('/lend', { [param]: '1' });
				return shouldShowAppInstallPrompt(url, cookieStore, apollo);
			})
		);
		results.forEach(result => expect(result).toBe(false));
	});

	it('returns false if not on allowed route', async () => {
		const url = makeUrl('/not-allowed');
		const cookieStore = { get: vi.fn() };
		const apollo = { query: vi.fn() };
		const result = await shouldShowAppInstallPrompt(url, cookieStore, apollo);
		expect(result).toBe(false);
	});

	it('returns true if no basketId (allowed route, no promo params)', async () => {
		const results = await Promise.all(
			allowedRoutes.map(async route => {
				const url = makeUrl(route);
				const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
				const apollo = { query: vi.fn() };
				return shouldShowAppInstallPrompt(url, cookieStore, apollo);
			})
		);
		results.forEach(result => expect(result).toBe(true));
	});

	it('returns false if basket has free credits', async () => {
		const url = makeUrl('/lend');
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				data: { shop: { basket: { hasFreeCredits: true } } }
			})
		};
		const result = await shouldShowAppInstallPrompt(url, cookieStore, apollo);
		expect(result).toBe(false);
	});

	it('returns false if lendingRewardOffered is true', async () => {
		const url = makeUrl('/lend');
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				data: { shop: { basket: { hasFreeCredits: false }, lendingRewardOffered: true } }
			})
		};
		const result = await shouldShowAppInstallPrompt(url, cookieStore, apollo);
		expect(result).toBe(false);
	});

	it('returns true if basket has no free credits and no lendingRewardOffered', async () => {
		const url = makeUrl('/lend');
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				data: { shop: { basket: { hasFreeCredits: false }, lendingRewardOffered: false } }
			})
		};
		const result = await shouldShowAppInstallPrompt(url, cookieStore, apollo);
		expect(result).toBe(true);
	});
});

describe('renderAppInstallPrompt', () => {
	it('returns apple meta tag if showPrompt is true', () => {
		const result = renderAppInstallPrompt(true);
		expect(result).toContain('apple-itunes-app');
	});

	it('returns beforeinstallprompt script if showPrompt is false', () => {
		const result = renderAppInstallPrompt(false);
		expect(result).toContain('beforeinstallprompt');
	});

	it('returns beforeinstallprompt script if showPrompt is not provided', () => {
		const result = renderAppInstallPrompt();
		expect(result).toContain('beforeinstallprompt');
	});
});
