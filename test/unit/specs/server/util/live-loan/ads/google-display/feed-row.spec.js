// @vitest-environment node
import {
	FEED_COLUMNS,
	sanitizeText,
	truncate,
	buildTitle,
	buildDescription,
	buildSubtitle,
	buildCategory,
	buildFinalUrl,
	buildImageUrl,
	isRowAdSafe,
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
};

// The hash 'abc123def456' rendered through the Cloudinary ad-image transform.
const EXPECTED_IMAGE_URL = 'https://res.cloudinary.com/kiva/'
	+ 'c_limit,w_1200,h_1200,f_jpg,cs_srgb,fl_force_icc/remote/abc123def456.jpg';

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
		it('caps text at 25 characters', () => {
			expect(truncate('a'.repeat(40))).toEqual('a'.repeat(25));
		});

		it('leaves text within the cap unchanged', () => {
			expect(truncate('Short country')).toEqual('Short country');
		});

		it('is code-point-safe: never splits a multi-byte character', () => {
			// 24 ASCII + an astral emoji lands exactly at the 25th code point; a UTF-16 slice would
			// cut the emoji mid-surrogate and emit invalid UTF-8.
			const result = truncate(`${'a'.repeat(24)}\u{1F600}bcd`);
			expect(result).toEqual(`${'a'.repeat(24)}\u{1F600}`);
			expect([...result]).toHaveLength(25);
		});
	});

	describe('buildTitle', () => {
		it('builds "Help {firstName}" from the primary borrower', () => {
			expect(buildTitle(loan)).toEqual('Help Mukumoy');
		});
	});

	describe('buildDescription', () => {
		it('builds "Support {firstName}" from the primary borrower', () => {
			expect(buildDescription(loan)).toEqual('Support Mukumoy');
		});
	});

	describe('buildSubtitle', () => {
		it('is the borrower country', () => {
			expect(buildSubtitle(loan)).toEqual('Tajikistan');
		});

		it('caps a long country name at 25 characters', () => {
			const longCountry = { geocode: { country: { name: 'The Democratic Republic of the Congo' } } };
			expect(buildSubtitle(longCountry)).toEqual('The Democratic Republic o');
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
		it('builds the Cloudinary sRGB+ICC image URL from the hash', () => {
			expect(buildImageUrl('abc123def456')).toEqual(EXPECTED_IMAGE_URL);
		});
	});

	describe('isRowAdSafe', () => {
		it('accepts clean nonprofit copy', () => {
			expect(isRowAdSafe({ 'Item title': 'Help Maria', 'Item description': 'Support Maria' })).toBe(true);
		});

		it('rejects a banned financial/ecommerce word', () => {
			expect(isRowAdSafe({ 'Item title': 'Help Invest', 'Item description': 'Support Invest' })).toBe(false);
		});

		it('rejects an ALL-CAPS run of 4+ letters', () => {
			expect(isRowAdSafe({ 'Item title': 'Help MARIA', 'Item description': 'Support MARIA' })).toBe(false);
		});
	});

	describe('loanToFeedRow', () => {
		it('maps a loan to the 7 monolith-aligned columns in order', () => {
			const row = loanToFeedRow(loan);
			expect(Object.keys(row)).toEqual(FEED_COLUMNS);
			expect(row).toEqual({
				ID: '456',
				'Item title': 'Help Mukumoy',
				'Item description': 'Support Mukumoy',
				'Item subtitle': 'Tajikistan',
				'Item category': 'Retail',
				'Image URL': EXPECTED_IMAGE_URL,
				'Final URL': 'https://www.kiva.org/lend/456?utm_medium=paid&utm_source=google&utm_campaign=liveloans',
			});
		});
	});
});
