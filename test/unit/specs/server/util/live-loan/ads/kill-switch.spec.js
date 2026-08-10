// @vitest-environment node
import fetchGraphQL from '#server/util/fetchGraphQL';
import { getFromCache, setToCache } from '#server/util/memJsUtils';
import { warn } from '#server/util/log';
import { isFeedEnabled } from '#server/util/live-loan/ads/kill-switch';

vi.mock('#server/util/fetchGraphQL');
vi.mock('#server/util/argv', () => ({ default: {} }));
vi.mock('#server/util/memJsUtils', () => ({
	getFromCache: vi.fn(),
	setToCache: vi.fn(() => Promise.resolve()),
}));
vi.mock('#server/util/log', () => ({
	warn: vi.fn(),
	error: vi.fn(),
}));

const cache = {};

describe('kill-switch', () => {
	beforeEach(() => {
		fetchGraphQL.mockReset();
		getFromCache.mockReset();
		setToCache.mockReset();
		setToCache.mockResolvedValue();
		warn.mockClear();
	});

	it('returns the cached value without hitting the gateway when cached', async () => {
		getFromCache.mockResolvedValue('true');

		expect(await isFeedEnabled(cache)).toBe(true);
		expect(fetchGraphQL).not.toHaveBeenCalled();
	});

	it('treats a cached "false" as disabled without hitting the gateway', async () => {
		getFromCache.mockResolvedValue('false');

		expect(await isFeedEnabled(cache)).toBe(false);
		expect(fetchGraphQL).not.toHaveBeenCalled();
	});

	it('coerces a Buffer cache value', async () => {
		getFromCache.mockResolvedValue(Buffer.from('true'));

		expect(await isFeedEnabled(cache)).toBe(true);
	});

	it('reads the gateway on a cache miss and caches the result', async () => {
		getFromCache.mockResolvedValue(null);
		fetchGraphQL.mockResolvedValue('true');

		expect(await isFeedEnabled(cache)).toBe(true);
		expect(setToCache).toHaveBeenCalledWith(expect.any(String), 'true', 30, cache);
	});

	it('reads the uiConfigSetting resolver with the feed flag key', async () => {
		getFromCache.mockResolvedValue(null);
		fetchGraphQL.mockResolvedValue('true');

		await isFeedEnabled(cache);

		const [request, resultPath] = fetchGraphQL.mock.calls[0];
		expect(request.query).toContain('uiConfigSetting');
		expect(request.variables.key).toEqual('live_loan_ads_feed_enabled');
		expect(resultPath).toEqual('data.general.uiConfigSetting.value');
	});

	it('returns false when the gateway reports the flag off', async () => {
		getFromCache.mockResolvedValue(null);
		fetchGraphQL.mockResolvedValue('false');

		expect(await isFeedEnabled(cache)).toBe(false);
	});

	it('fails closed (off) and warns when the gateway read throws', async () => {
		getFromCache.mockResolvedValue(null);
		fetchGraphQL.mockRejectedValue(new Error('gateway down'));

		expect(await isFeedEnabled(cache)).toBe(false);
		expect(warn).toHaveBeenCalled();
	});
});
