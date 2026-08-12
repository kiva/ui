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
	image: { id: 'img-1', hash: 'abcimagehash01' },
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

		it('caps the candidate count at the locked feed limit of 100', () => {
			expect(AD_FEED_LOAN_COUNT).toEqual(100);
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
