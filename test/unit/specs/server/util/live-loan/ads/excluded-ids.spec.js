// @vitest-environment node
import fetch from '#server/util/fetch';
import { warn } from '#server/util/log';
import { parseIdList, fetchExcludedIds } from '#server/util/live-loan/ads/excluded-ids';

// mock out the fetch module so that no real requests are made
vi.mock('#server/util/fetch');

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// mock out logging so warnings don't print during the test run
vi.mock('#server/util/log', () => ({
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
}));

const settingValue = value => ({
	json: () => ({ data: { general: { uiConfigSetting: { key: 'k', value } } } }),
});

describe('excluded-ids', () => {
	describe('parseIdList', () => {
		it('parses a comma list into integers', () => {
			expect(parseIdList('123,456,789')).toEqual([123, 456, 789]);
		});

		it('trims whitespace and ignores non-numeric entries', () => {
			expect(parseIdList(' 12 , abc, 34 ,, 5.5, -7')).toEqual([12, 34]);
		});

		it('de-duplicates ids preserving first occurrence', () => {
			expect(parseIdList('5,5,9,5')).toEqual([5, 9]);
		});

		it('returns [] for empty, undefined, null, or non-string', () => {
			expect(parseIdList('')).toEqual([]);
			expect(parseIdList(undefined)).toEqual([]);
			expect(parseIdList(null)).toEqual([]);
			expect(parseIdList(123)).toEqual([]);
		});
	});

	describe('fetchExcludedIds', () => {
		beforeEach(() => {
			fetch.mockClear();
			warn.mockClear();
		});

		it('passes the key and returns the parsed ids', async () => {
			fetch.mockResolvedValue(settingValue('11, 22, 22'));

			const result = await fetchExcludedIds('live_loan_ads_excluded_loan_ids');

			const { variables } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(variables.key).toEqual('live_loan_ads_excluded_loan_ids');
			expect(result).toEqual([11, 22]);
		});

		it('returns [] when the setting is absent (null value)', async () => {
			fetch.mockResolvedValue(settingValue(null));

			expect(await fetchExcludedIds('k')).toEqual([]);
		});

		it('returns [] and warns when the read throws', async () => {
			fetch.mockRejectedValue(new Error('boom'));

			expect(await fetchExcludedIds('k')).toEqual([]);
			expect(warn).toHaveBeenCalled();
		});
	});
});
