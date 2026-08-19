// @vitest-environment node
import { FEED_COLUMNS } from '#server/util/live-loan/ads/google-display/feed-row';
import { fetchAdEligibleLoans } from '#server/util/live-loan/ads/ads-eligibility';
import { fetchExcludedIds } from '#server/util/live-loan/ads/excluded-ids';
import {
	EXCLUDED_LOAN_IDS_SETTING_KEY,
	EXCLUDED_PARTNER_IDS_SETTING_KEY,
	EXCLUDED_SECTOR_IDS_SETTING_KEY,
} from '#server/util/live-loan/ads/constants';
import { info, warn } from '#server/util/log';
import { toTsv, generateGoogleFeed } from '#server/util/live-loan/ads/google-display/google-feed';

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// stub only fetchAdEligibleLoans so the rest of the core module (primaryFirstName, etc.) runs for real
vi.mock('#server/util/live-loan/ads/ads-eligibility.js', async importOriginal => ({
	...(await importOriginal()),
	fetchAdEligibleLoans: vi.fn(),
}));

// stub the setting reader so no real request is made for the excluded-loan-ids denylist
vi.mock('#server/util/live-loan/ads/excluded-ids.js', () => ({ fetchExcludedIds: vi.fn() }));

// mock logging so the ad-safety drop warning doesn't print during the test run
vi.mock('#server/util/log', () => ({
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
}));

const loanOne = {
	id: 456,
	borrowers: [{ id: 1, firstName: 'Mukumoy', isPrimary: true }],
	sector: { id: 1, name: 'Retail' },
	geocode: { country: { id: 1, name: 'Tajikistan' } },
	activity: { id: 1, name: 'Food Production/Sales' },
	image: { id: 1, hash: 'hash456' },
	use: 'To support her family shop',
};

const loanTwo = {
	id: 789,
	borrowers: [{ id: 2, firstName: 'Amara', isPrimary: true }],
	sector: { id: 2, name: 'Agriculture' },
	geocode: { country: { id: 2, name: 'Kenya' } },
	activity: { id: 2, name: 'Farming' },
	image: { id: 2, hash: 'hash789' },
	use: 'To grow her small farm',
};

describe('google-feed', () => {
	describe('toTsv', () => {
		it('emits the header line joined by tabs for the default columns', () => {
			const [header] = toTsv([]).split('\n');
			expect(header).toEqual(FEED_COLUMNS.join('\t'));
		});

		it('serializes a single row in column order, tab-joined, using explicit columns', () => {
			const columns = ['A', 'B'];
			const rows = [{ A: 'x', B: 'y' }];
			expect(toTsv(rows, columns)).toEqual('A\tB\nx\ty');
		});

		it('serializes a single row in FEED_COLUMNS order using the default columns', () => {
			const row = FEED_COLUMNS.reduce((acc, col, i) => ({ ...acc, [col]: `val${i}` }), {});
			const lines = toTsv([row]).split('\n');
			expect(lines[1]).toEqual(FEED_COLUMNS.map((col, i) => `val${i}`).join('\t'));
		});

		it('returns exactly the header line with no trailing newline for an empty rows array', () => {
			const columns = ['A', 'B'];
			const result = toTsv([], columns);
			expect(result).toEqual('A\tB');
			expect(result).not.toContain('\n');
		});

		it('flattens tabs and newlines in a cell value to a single space', () => {
			const columns = ['A', 'B'];
			const rows = [{ A: 'x\ty', B: 'a\nb' }];
			const [, dataLine] = toTsv(rows, columns).split('\n');
			const fields = dataLine.split('\t');
			expect(fields).toEqual(['x y', 'a b']);
		});

		it('serializes a missing/undefined cell value as an empty string', () => {
			const columns = ['A', 'B'];
			const rows = [{ A: 'x' }];
			expect(toTsv(rows, columns)).toEqual('A\tB\nx\t');
		});
	});

	describe('generateGoogleFeed', () => {
		beforeEach(() => {
			fetchAdEligibleLoans.mockClear();
			fetchExcludedIds.mockClear();
			info.mockClear();
			warn.mockClear();
			fetchExcludedIds.mockResolvedValue([]);
		});

		it('produces a header line plus one data line per loan', async () => {
			fetchAdEligibleLoans.mockResolvedValue([loanOne, loanTwo]);

			const result = await generateGoogleFeed();
			const lines = result.split('\n');

			expect(lines).toHaveLength(3);
			expect(lines[0]).toEqual(FEED_COLUMNS.join('\t'));
			expect(lines[1]).toContain('Support Mukumoy');
			// The composed description carries the "This loan is special because ..." lead-in; the row
			// survives ad-safety, proving the template word "loan" is not scanned (only raw borrower text is).
			expect(lines[1]).toContain('This loan is special because to support her family shop');
			expect(lines[1]).toContain(
				'https://www.kiva.org/lend/456?utm_medium=paid&utm_source=google&utm_campaign=liveloans',
			);
			expect(lines[2]).toContain('Support Amara');
			expect(lines[2]).toContain(
				'https://www.kiva.org/lend/789?utm_medium=paid&utm_source=google&utm_campaign=liveloans',
			);
		});

		it('drops a loan whose copy is not ad-safe (ALL-CAPS name)', async () => {
			const shoutyLoan = { ...loanOne, id: 999, borrowers: [{ id: 9, firstName: 'MARIA', isPrimary: true }] };
			fetchAdEligibleLoans.mockResolvedValue([loanOne, shoutyLoan]);

			const result = await generateGoogleFeed();
			const lines = result.split('\n');

			expect(lines).toHaveLength(2); // header + loanOne only
			expect(result).not.toContain('MARIA');
		});

		it('drops a loan whose loan-use description contains a banned word', async () => {
			const buyLoan = { ...loanOne, id: 111, use: 'To buy a cow' };
			fetchAdEligibleLoans.mockResolvedValue([loanTwo, buyLoan]);

			const result = await generateGoogleFeed();
			const lines = result.split('\n');

			expect(lines).toHaveLength(2); // header + loanTwo only
			expect(result).not.toContain('cow');
			// The drop warning names the real loan id, not undefined (guards the id-vs-ID key regression).
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('111'));
		});

		it('returns exactly the header line when there are no eligible loans', async () => {
			fetchAdEligibleLoans.mockResolvedValue([]);

			const result = await generateGoogleFeed();

			expect(result).toEqual(FEED_COLUMNS.join('\t'));
			expect(result).not.toContain('\n');
		});

		it('awaits fetchAdEligibleLoans', async () => {
			fetchAdEligibleLoans.mockResolvedValue([]);

			await generateGoogleFeed();

			expect(fetchAdEligibleLoans).toHaveBeenCalledTimes(1);
		});

		it('forwards a custom count to fetchAdEligibleLoans', async () => {
			fetchAdEligibleLoans.mockResolvedValue([]);

			await generateGoogleFeed(50);

			expect(fetchAdEligibleLoans).toHaveBeenCalledWith(50, {
				loanIds: [],
				partnerId: [],
				sectorId: [],
			});
		});

		it('reads all three denylist settings and routes each to its own exclusion field', async () => {
			fetchExcludedIds.mockImplementation(key => {
				if (key === EXCLUDED_LOAN_IDS_SETTING_KEY) return Promise.resolve([456]);
				if (key === EXCLUDED_PARTNER_IDS_SETTING_KEY) return Promise.resolve([11, 12]);
				if (key === EXCLUDED_SECTOR_IDS_SETTING_KEY) return Promise.resolve([2]);
				return Promise.resolve([]);
			});
			fetchAdEligibleLoans.mockResolvedValue([]);

			await generateGoogleFeed();

			expect(fetchExcludedIds).toHaveBeenCalledWith(EXCLUDED_LOAN_IDS_SETTING_KEY);
			expect(fetchExcludedIds).toHaveBeenCalledWith(EXCLUDED_PARTNER_IDS_SETTING_KEY);
			expect(fetchExcludedIds).toHaveBeenCalledWith(EXCLUDED_SECTOR_IDS_SETTING_KEY);
			expect(fetchAdEligibleLoans).toHaveBeenCalledWith(undefined, {
				loanIds: [456],
				partnerId: [11, 12],
				sectorId: [2],
			});
		});

		it('logs the applied excluded-id counts for loans, partners, and sectors', async () => {
			fetchExcludedIds.mockImplementation(key => {
				if (key === EXCLUDED_LOAN_IDS_SETTING_KEY) return Promise.resolve([1, 2, 3]);
				if (key === EXCLUDED_PARTNER_IDS_SETTING_KEY) return Promise.resolve([9]);
				return Promise.resolve([]);
			});
			fetchAdEligibleLoans.mockResolvedValue([]);

			await generateGoogleFeed();

			expect(info).toHaveBeenCalledWith(expect.any(String), {
				loanIds: [1, 2, 3],
				partnerId: [9],
				sectorId: [],
			});
		});
	});
});
