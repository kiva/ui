// @vitest-environment node
import fetchGraphQL from '#server/util/fetchGraphQL';
import { warn } from '#server/util/log';
import { filterToStillFundraising } from '#server/util/live-loan/ads/ads-freshness';

// mock the gateway client so no real requests are made
vi.mock('#server/util/fetchGraphQL');

// mock out the argv module so command line arguments aren't read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// mock logging so warnings don't print during the test run
vi.mock('#server/util/log', () => ({
	warn: vi.fn(),
	error: vi.fn(),
}));

describe('ads-freshness', () => {
	beforeEach(() => {
		fetchGraphQL.mockClear();
		warn.mockClear();
	});

	it('keeps only authoritative still-fundraising, non-anonymized loans, preserving order', async () => {
		fetchGraphQL.mockResolvedValue({
			l0: { id: 1, status: 'fundraising', anonymizationLevel: 'none' },
			l1: { id: 2, status: 'funded', anonymizationLevel: 'none' },
			l2: { id: 3, status: 'fundraising', anonymizationLevel: 'full' },
			l3: { id: 4, status: 'refunded', anonymizationLevel: 'none' },
		});

		const out = await filterToStillFundraising([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

		expect(out.map(l => l.id)).toEqual([1]);
	});

	it('drops loans the authoritative resolver did not return', async () => {
		fetchGraphQL.mockResolvedValue({ l0: { id: 1, status: 'fundraising', anonymizationLevel: 'none' } });

		const out = await filterToStillFundraising([{ id: 1 }, { id: 99 }]);

		expect(out.map(l => l.id)).toEqual([1]);
	});

	it('returns an empty array for no candidates without calling the gateway', async () => {
		const out = await filterToStillFundraising([]);

		expect(out).toEqual([]);
		expect(fetchGraphQL).not.toHaveBeenCalled();
	});

	it('returns an empty array and warns when the re-check errors', async () => {
		fetchGraphQL.mockRejectedValue(new Error('gateway down'));

		const out = await filterToStillFundraising([{ id: 1 }]);

		expect(out).toEqual([]);
		expect(warn).toHaveBeenCalled();
	});

	it('sends one aliased lend.loan query covering every candidate id', async () => {
		fetchGraphQL.mockResolvedValue({});

		await filterToStillFundraising([{ id: 7 }, { id: 8 }]);

		const [request, path] = fetchGraphQL.mock.calls[0];
		expect(path).toEqual('data.lend');
		expect(request.query).toMatch(/loan\(id:\s*7\)/);
		expect(request.query).toMatch(/loan\(id:\s*8\)/);
	});

	it('splits large candidate sets into complexity-safe chunks and merges survivors', async () => {
		// 45 candidates > the 40 chunk size -> 2 gateway calls; each mock returns fundraising
		// records for exactly the ids in its own chunk query, so all 45 must survive the merge.
		const loans = Array.from({ length: 45 }, (unused, i) => ({ id: i + 1 }));
		fetchGraphQL.mockImplementation(async ({ query }) => {
			const ids = [...query.matchAll(/loan\(id:\s*(\d+)\)/g)].map(m => Number(m[1]));
			return Object.fromEntries(
				ids.map((id, i) => [`l${i}`, { id, status: 'fundraising', anonymizationLevel: 'none' }]),
			);
		});

		const out = await filterToStillFundraising(loans);

		expect(fetchGraphQL).toHaveBeenCalledTimes(2);
		expect(out).toHaveLength(45);
	});

	it('keeps survivors from healthy chunks when another chunk fails', async () => {
		// 45 candidates -> 2 chunks; the first chunk's gateway call fails, the second succeeds.
		// A failed chunk must drop only its own loans, never poison the healthy chunk's survivors.
		const loans = Array.from({ length: 45 }, (unused, i) => ({ id: i + 1 }));
		fetchGraphQL
			.mockRejectedValueOnce(new Error('chunk 1 gateway down'))
			.mockResolvedValueOnce({ l0: { id: 41, status: 'fundraising', anonymizationLevel: 'none' } });

		const out = await filterToStillFundraising(loans);

		expect(out.map(l => l.id)).toEqual([41]);
	});
});
