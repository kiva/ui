// @vitest-environment node
import { FEED_COLUMNS } from '#server/util/live-loan/ads/google-display/feed-row';
import { fetchAdEligibleLoans } from '#server/util/live-loan/ads/ads-eligibility';
import { toTsv, generateGoogleFeed } from '#server/util/live-loan/ads/google-display/google-feed';

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// stub only fetchAdEligibleLoans so the rest of the core module (primaryFirstName, etc.) runs for real
vi.mock('#server/util/live-loan/ads/ads-eligibility.js', async importOriginal => ({
	...(await importOriginal()),
	fetchAdEligibleLoans: vi.fn(),
}));

// mock logging so the ad-safety drop warning doesn't print during the test run
vi.mock('#server/util/log', () => ({
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
};

const loanTwo = {
	id: 789,
	borrowers: [{ id: 2, firstName: 'Amara', isPrimary: true }],
	sector: { id: 2, name: 'Agriculture' },
	geocode: { country: { id: 2, name: 'Kenya' } },
	activity: { id: 2, name: 'Farming' },
	image: { id: 2, hash: 'hash789' },
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
		});

		it('produces a header line plus one data line per loan', async () => {
			fetchAdEligibleLoans.mockResolvedValue([loanOne, loanTwo]);

			const result = await generateGoogleFeed();
			const lines = result.split('\n');

			expect(lines).toHaveLength(3);
			expect(lines[0]).toEqual(FEED_COLUMNS.join('\t'));
			expect(lines[1]).toContain('Support Mukumoy');
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

			expect(fetchAdEligibleLoans).toHaveBeenCalledWith(50);
		});
	});
});
