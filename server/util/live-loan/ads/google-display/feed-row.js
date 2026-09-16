import { primaryFirstName } from '../ads-eligibility.js';
import { KIVA_PROD_HOST } from '../constants.js';

const UTM_QUERY = 'utm_medium=paid&utm_source=google&utm_campaign=liveloans';
const KIVA_LEND_BASE = `${KIVA_PROD_HOST}/lend`;
// Ad image: Kiva's own image CDN in WebP at a fixed size. WebP is a Google-Merchant-accepted format and
// the `.webp` extension matches the served bytes, so no image-conversion step is needed. The prod host is
// hardcoded (not env-derived) so Google is always served the live image, even from a non-prod feed run.
const AD_IMAGE_SIZE = 'w1200h1200';
const KIVA_IMAGE_BASE = `${KIVA_PROD_HOST}/img/${AD_IMAGE_SIZE}`;
// Google Merchant Center max lengths for the title and description fields.
const TITLE_MAX = 150;
const DESCRIPTION_MAX = 5000;

// Static Google Merchant attributes every row carries. A Kiva loan is not a purchasable good, so price
// and availability are fixed placeholders, and identifier_exists=no tells Google the item intentionally
// has no brand/GTIN/MPN (which it otherwise requires on new products).
const DEFAULT_PRICE = '25.00 USD';
const DEFAULT_AVAILABILITY = 'in_stock';
const IDENTIFIER_EXISTS = 'no';

// Words barred from ad copy: financial-services / ecommerce framing that risks Google reclassifying
// the ads out of the nonprofit lane.
const BANNED_WORDS = ['loan', 'buy', 'invest', 'interest', 'guaranteed', 'earn'];
const BANNED_WORDS_RE = new RegExp(`\\b(${BANNED_WORDS.join('|')})\\b`, 'iu');
// A run of 4+ uppercase letters reads as ALL-CAPS "shouting", which Google disapproves.
const ALL_CAPS_RE = /\p{Lu}{4,}/u;

// Lead-in that turns a bare loan-use fragment into a sentence for the description.
const LOAN_USE_PREFIX = 'This loan helps';

export const FEED_COLUMNS = [
	'id', 'title', 'description', 'google_product_category', 'image_link', 'link',
	'price', 'availability', 'identifier_exists',
];

export function sanitizeText(s) {
	return (s ?? '').replace(/[\t\n\r\p{Cc}]/gu, ' ').replace(/\s+/g, ' ').trim();
}

// Hard-cap text at `max` code points, code-point-safe so a multi-byte character
// (emoji, astral CJK) is never split into invalid UTF-8.
export function truncate(s, max) {
	return [...sanitizeText(s)].slice(0, max).join('');
}

export function buildTitle(loan) {
	return truncate(`Support ${primaryFirstName(loan)}`, TITLE_MAX);
}

export function buildCategory(loan) {
	return sanitizeText(loan?.sector?.name);
}

// Present the borrower's loan-use text as a sentence, used only when it fits the 5000-char limit;
// over the limit (or with no use text) we fall back to the whole sector name rather than truncate
// the sentence mid-word.
export function buildDescription(loan) {
	const use = sanitizeText(loan?.use);
	if (use) {
		const lowerFirst = use.charAt(0).toLowerCase() + use.slice(1);
		const sentence = `${LOAN_USE_PREFIX} ${lowerFirst}`;
		if ([...sentence].length <= DESCRIPTION_MAX) return sentence;
	}
	return buildCategory(loan);
}

export function buildFinalUrl(id) {
	return `${KIVA_LEND_BASE}/${id}?${UTM_QUERY}`;
}

export function buildImageUrl(hash) {
	return `${KIVA_IMAGE_BASE}/${hash}.webp`;
}

// Whether a loan is safe to publish as an ad: rejects ALL-CAPS shouting and banned financial/ecommerce
// words in the borrower's own text (first name, loan-use, sector). Only borrower-authored copy is
// scanned -- the fixed template wording (the "Support ..." title, the "This loan is special because ..."
// lead-in) is safe by construction. Unsafe loans are dropped from the feed.
export function isLoanAdSafe(loan) {
	const copy = [primaryFirstName(loan), sanitizeText(loan?.use), buildCategory(loan)].join(' ');
	return !ALL_CAPS_RE.test(copy) && !BANNED_WORDS_RE.test(copy);
}

export function loanToFeedRow(loan) {
	return {
		id: String(loan.id),
		title: buildTitle(loan),
		description: buildDescription(loan),
		google_product_category: buildCategory(loan),
		image_link: buildImageUrl(loan.image.hash),
		link: buildFinalUrl(loan.id),
		price: DEFAULT_PRICE,
		availability: DEFAULT_AVAILABILITY,
		identifier_exists: IDENTIFIER_EXISTS,
	};
}
