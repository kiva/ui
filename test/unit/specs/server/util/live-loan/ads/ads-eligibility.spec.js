// @vitest-environment node
import fetch from '#server/util/fetch';
import { warn } from '#server/util/log';
import {
	AD_FEED_LOAN_COUNT,
	buildAdFeedFilters,
	primaryFirstName,
	isEligibleLoan,
	fetchAdEligibleLoans,
} from '#server/util/live-loan/ads/ads-eligibility';

// mock out the fetch module so that no real requests are made
vi.mock('#server/util/fetch');

// mock out the argv module to prevent command line arguments for jest from being read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

// mock out logging so warnings don't print during the test run
vi.mock('#server/util/log', () => ({
	warn: vi.fn(),
	error: vi.fn(),
}));

const completeLoan = {
	id: 1,
	anonymizationLevel: 'none',
	borrowers: [{ id: 1, firstName: 'Maria', isPrimary: true }],
	image: {
		id: 'img-1', hash: 'abcimagehash01', width: 800, height: 800
	},
};

describe('ads-eligibility', () => {
	describe('buildAdFeedFilters', () => {
		it('returns a single merged filter object so all criteria AND together', () => {
			expect(buildAdFeedFilters()).toEqual([{
				partnerRiskRating: { range: { gte: 3.5 } },
				lenderRepaymentTerm: { range: { lte: 12 } },
				partnerDefaultRate: { range: { lte: 0.05 } },
				amountLeft: { range: { gte: 200 } },
				daysUntilExpiration: { range: { gte: 3 } },
			}]);
		});

		it('requests the FLSS single-page maximum of 200 candidates', () => {
			expect(AD_FEED_LOAN_COUNT).toEqual(200);
		});

		it('adds a loanIds none filter when a loan-id exclusion list is provided', () => {
			expect(buildAdFeedFilters({ loanIds: [10, 20] })[0]).toMatchObject({
				loanIds: { none: [10, 20] },
			});
		});

		it('omits the loanIds key when the exclusion list is empty or absent', () => {
			expect(buildAdFeedFilters({ loanIds: [] })[0]).not.toHaveProperty('loanIds');
			expect(buildAdFeedFilters()[0]).not.toHaveProperty('loanIds');
		});

		it('adds a partnerId none filter when a partner-id exclusion list is provided', () => {
			expect(buildAdFeedFilters({ partnerId: [11, 12] })[0]).toMatchObject({
				partnerId: { none: [11, 12] },
			});
		});

		it('adds a sectorId none filter when a sector-id exclusion list is provided', () => {
			expect(buildAdFeedFilters({ sectorId: [2, 3] })[0]).toMatchObject({
				sectorId: { none: [2, 3] },
			});
		});

		it('omits the partnerId and sectorId keys when those exclusion lists are empty or absent', () => {
			const [filter] = buildAdFeedFilters({ partnerId: [], sectorId: [] });
			expect(filter).not.toHaveProperty('partnerId');
			expect(filter).not.toHaveProperty('sectorId');
			expect(buildAdFeedFilters()[0]).not.toHaveProperty('partnerId');
			expect(buildAdFeedFilters()[0]).not.toHaveProperty('sectorId');
		});

		it('merges every exclusion field into the single AND-ed filter object', () => {
			const [filter] = buildAdFeedFilters({ loanIds: [1], partnerId: [2], sectorId: [3] });
			expect(filter).toMatchObject({
				loanIds: { none: [1] },
				partnerId: { none: [2] },
				sectorId: { none: [3] },
			});
		});

		it('ignores an unknown exclusion field with no ids rather than emitting an empty none', () => {
			expect(buildAdFeedFilters({ loanIds: [], partnerId: [] })[0]).toEqual(buildAdFeedFilters()[0]);
		});
	});

	describe('primaryFirstName', () => {
		it('returns the isPrimary borrower firstName when present', () => {
			const loan = {
				borrowers: [
					{ id: 1, firstName: 'Not Primary', isPrimary: false },
					{ id: 2, firstName: 'Primary', isPrimary: true },
				],
			};
			expect(primaryFirstName(loan)).toEqual('Primary');
		});

		it('falls back to the first borrower when none is marked primary', () => {
			const loan = {
				borrowers: [
					{ id: 1, firstName: 'First', isPrimary: false },
					{ id: 2, firstName: 'Second', isPrimary: false },
				],
			};
			expect(primaryFirstName(loan)).toEqual('First');
		});

		it('returns an empty string when there are no borrowers', () => {
			expect(primaryFirstName({ borrowers: [] })).toEqual('');
			expect(primaryFirstName({})).toEqual('');
			expect(primaryFirstName(null)).toEqual('');
		});
	});

	describe('isEligibleLoan', () => {
		it('returns true for a complete, non-anonymized loan', () => {
			expect(isEligibleLoan(completeLoan)).toEqual(true);
		});

		it('returns false when anonymizationLevel is not "none"', () => {
			expect(isEligibleLoan({ ...completeLoan, anonymizationLevel: 'public' })).toEqual(false);
		});

		it('returns false when there is no primary borrower firstName', () => {
			expect(isEligibleLoan({ ...completeLoan, borrowers: [] })).toEqual(false);
		});

		it('returns false when the loan image hash is missing', () => {
			expect(isEligibleLoan({ ...completeLoan, image: { id: 'img-1' } })).toEqual(false);
			expect(isEligibleLoan({ ...completeLoan, image: null })).toEqual(false);
		});

		it('accepts an image exactly at the 500x500 minimum', () => {
			expect(isEligibleLoan({ ...completeLoan, image: { ...completeLoan.image, width: 500, height: 500 } }))
				.toEqual(true);
		});

		it('returns false when the image is under 500px on either side', () => {
			expect(isEligibleLoan({ ...completeLoan, image: { ...completeLoan.image, width: 499 } })).toEqual(false);
			expect(isEligibleLoan({ ...completeLoan, image: { ...completeLoan.image, height: 320 } })).toEqual(false);
		});

		it('returns false when the image has no width/height', () => {
			expect(isEligibleLoan({ ...completeLoan, image: { id: 'img-1', hash: 'abcimagehash01' } })).toEqual(false);
		});

		it('returns false when the loan has no id', () => {
			expect(isEligibleLoan({ ...completeLoan, id: undefined })).toEqual(false);
			expect(isEligibleLoan(null)).toEqual(false);
		});
	});

	describe('fetchAdEligibleLoans', () => {
		beforeEach(() => {
			fetch.mockClear();
		});

		it('requests the ad-feed filters and count, with no sort', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans();

			const { query, variables } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(variables.filters).toEqual(buildAdFeedFilters());
			expect(variables.sortBy).toBeUndefined();
			expect(query).not.toMatch(/sortBy/);
		});

		it('threads a loan-id exclusion into the query filters', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans(100, { loanIds: [7, 8] });

			const { variables } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(variables.filters).toEqual(buildAdFeedFilters({ loanIds: [7, 8] }));
		});

		it('threads partner and sector exclusions into the query filters', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			const exclusions = { partnerId: [7, 8], sectorId: [6, 16] };
			await fetchAdEligibleLoans(100, exclusions);

			const { variables } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(variables.filters).toEqual(buildAdFeedFilters(exclusions));
		});

		it('requests the borrower loan-use text in the query fields', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans();

			const { query } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(query).toMatch(/\buse\b/);
		});

		it('requests the image dimensions in the query fields', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans();

			const { query } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(query).toMatch(/\bwidth\b/);
			expect(query).toMatch(/\bheight\b/);
		});

		it('threads a custom count into the fundraisingLoans limit', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans(50);

			const { query } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(query).toMatch(/fundraisingLoans\s*\(\s*limit\s*:\s*50/);
		});

		it('defaults the limit to AD_FEED_LOAN_COUNT', async () => {
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values: [] } } }) });

			await fetchAdEligibleLoans();

			const { query } = JSON.parse(fetch.mock.calls[0][1].body);
			expect(query).toMatch(new RegExp(`limit\\s*:\\s*${AD_FEED_LOAN_COUNT}`));
		});

		it('filters out anonymized and incomplete loans from the returned array', async () => {
			const anonymizedLoan = { ...completeLoan, id: 2, anonymizationLevel: 'public' };
			const missingImageLoan = { ...completeLoan, id: 3, image: null };
			const values = [completeLoan, anonymizedLoan, missingImageLoan];
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: { values } } }) });

			const result = await fetchAdEligibleLoans();

			expect(result).toEqual([completeLoan]);
		});

		it('returns an empty array and warns when no loans are returned', async () => {
			warn.mockClear();
			fetch.mockResolvedValue({ json: () => ({ data: { fundraisingLoans: {} } }) });

			const result = await fetchAdEligibleLoans();

			expect(result).toEqual([]);
			expect(warn).toHaveBeenCalled();
		});
	});
});
