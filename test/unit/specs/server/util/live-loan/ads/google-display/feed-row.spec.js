// @vitest-environment node
import {
	FEED_COLUMNS,
	sanitizeText,
	truncate,
	buildTitle,
	buildDescription,
	buildCategory,
	buildFinalUrl,
	buildImageUrl,
	isLoanAdSafe,
	loanToFeedRow,
} from '#server/util/live-loan/ads/google-display/feed-row';

// mock out the argv module so command line arguments aren't read by the code under test
vi.mock('#server/util/argv', () => ({ default: {} }));

const loan = {
	id: 456,
	borrowers: [{ id: 1, firstName: 'Mukumoy', isPrimary: true }],
	sector: { id: 1, name: 'Retail' },
	geocode: { country: { id: 1, name: 'Tajikistan' } },
	image: { id: 1, hash: 'abc123def456' },
	use: 'To buy a cow',
};

// The hash 'abc123def456' as a Kiva image-CDN WebP URL at the ad size, on the hardcoded prod host.
const EXPECTED_IMAGE_URL = 'https://www.kiva.org/img/w1200h1200/abc123def456.webp';

describe('feed-row', () => {
	describe('sanitizeText', () => {
		it('strips tabs/newlines/control chars and collapses whitespace', () => {
			expect(sanitizeText('a\t\n  b ')).toEqual('a b');
		});

		it('returns an empty string for null/undefined', () => {
			expect(sanitizeText(null)).toEqual('');
			expect(sanitizeText(undefined)).toEqual('');
		});
	});

	describe('truncate', () => {
		it('caps text at the given length', () => {
			expect(truncate('a'.repeat(200), 150)).toEqual('a'.repeat(150));
		});

		it('leaves text within the cap unchanged', () => {
			expect(truncate('Short use text', 5000)).toEqual('Short use text');
		});

		it('is code-point-safe: never splits a multi-byte character', () => {
			// 24 ASCII + an astral emoji lands exactly at the 25th code point; a UTF-16 slice would
			// cut the emoji mid-surrogate and emit invalid UTF-8.
			const result = truncate(`${'a'.repeat(24)}\u{1F600}bcd`, 25);
			expect(result).toEqual(`${'a'.repeat(24)}\u{1F600}`);
			expect([...result]).toHaveLength(25);
		});
	});

	describe('buildTitle', () => {
		it('builds "Support {firstName}" from the primary borrower', () => {
			expect(buildTitle(loan)).toEqual('Support Mukumoy');
		});

		it('caps a very long title at 150 characters', () => {
			const longName = { borrowers: [{ id: 1, firstName: 'x'.repeat(200), isPrimary: true }] };
			expect([...buildTitle(longName)]).toHaveLength(150);
		});
	});

	describe('buildDescription', () => {
		it('wraps the borrower loan-use text in the "special because" sentence', () => {
			expect(buildDescription(loan)).toEqual('This loan is special because to buy a cow');
		});

		it('falls back to the sector name, unformatted, when use is empty or missing', () => {
			expect(buildDescription({ use: '', sector: { name: 'Retail' } })).toEqual('Retail');
			expect(buildDescription({ sector: { name: 'Agriculture' } })).toEqual('Agriculture');
		});

		it('keeps the formatted sentence when it is within the 5000-character limit', () => {
			const result = buildDescription({ use: 'a'.repeat(4000), sector: { name: 'Retail' } });
			expect(result.startsWith('This loan is special because ')).toBe(true);
			expect([...result].length).toBeLessThanOrEqual(5000);
		});

		it('falls back to the sector name when the formatted sentence would exceed 5000 characters', () => {
			expect(buildDescription({ use: 'x'.repeat(6000), sector: { name: 'Retail' } })).toEqual('Retail');
		});
	});

	describe('buildCategory', () => {
		it('is the sector name', () => {
			expect(buildCategory(loan)).toEqual('Retail');
		});
	});

	describe('buildFinalUrl', () => {
		it('builds the lend URL with the campaign UTMs', () => {
			expect(buildFinalUrl(456)).toEqual(
				'https://www.kiva.org/lend/456?utm_medium=paid&utm_source=google&utm_campaign=liveloans',
			);
		});
	});

	describe('buildImageUrl', () => {
		it('builds the Kiva image-CDN WebP URL from the hash', () => {
			expect(buildImageUrl('abc123def456')).toEqual(EXPECTED_IMAGE_URL);
		});
	});

	describe('isLoanAdSafe', () => {
		const cleanLoan = {
			borrowers: [{ id: 1, firstName: 'Maria', isPrimary: true }],
			use: 'Groceries for her family',
			sector: { id: 1, name: 'Retail' },
		};

		it('accepts a loan with clean borrower copy', () => {
			expect(isLoanAdSafe(cleanLoan)).toBe(true);
		});

		it('rejects a banned word in the borrower loan-use text', () => {
			expect(isLoanAdSafe({ ...cleanLoan, use: 'To buy a cow' })).toBe(false);
		});

		it('rejects a banned word in the sector name', () => {
			expect(isLoanAdSafe({ ...cleanLoan, sector: { id: 1, name: 'Loan services' } })).toBe(false);
		});

		it('rejects an ALL-CAPS borrower first name', () => {
			expect(isLoanAdSafe({ ...cleanLoan, borrowers: [{ id: 1, firstName: 'MARIA', isPrimary: true }] }))
				.toBe(false);
		});
	});

	describe('loanToFeedRow', () => {
		it('maps a loan to the Google Merchant product columns in order', () => {
			const row = loanToFeedRow(loan);
			expect(Object.keys(row)).toEqual(FEED_COLUMNS);
			expect(row).toEqual({
				id: '456',
				title: 'Support Mukumoy',
				description: 'This loan is special because to buy a cow',
				google_product_category: 'Retail',
				image_link: EXPECTED_IMAGE_URL,
				link: 'https://www.kiva.org/lend/456?utm_medium=paid&utm_source=google&utm_campaign=liveloans',
				price: '25.00 USD',
				availability: 'in_stock',
				identifier_exists: 'no',
			});
		});
	});
});
