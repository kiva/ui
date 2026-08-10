import { primaryFirstName } from '../ads-eligibility.js';
import { KIVA_PROD_HOST } from '../constants.js';

const UTM_QUERY = 'utm_medium=paid&utm_source=google&utm_campaign=liveloans';
const KIVA_LEND_BASE = `${KIVA_PROD_HOST}/lend`;
// The feed serves its own ICC-compliant images from this endpoint (built from the loan image hash),
// not the raw CDN image, because Google Ads dynamic display requires an embedded sRGB profile.
const KIVA_AD_IMAGE_BASE = `${KIVA_PROD_HOST}/live-loan/ads/image`;
// Google caps Item title / subtitle / description at 25 characters.
const CAP = 25;

// Words barred from ad copy: financial-services / ecommerce framing that risks Google reclassifying
// the ads out of the nonprofit lane.
const BANNED_WORDS = ['loan', 'buy', 'invest', 'interest', 'guaranteed', 'earn'];
const BANNED_WORDS_RE = new RegExp(`\\b(${BANNED_WORDS.join('|')})\\b`, 'iu');
// A run of 4+ uppercase letters reads as ALL-CAPS "shouting", which Google disapproves.
const ALL_CAPS_RE = /\p{Lu}{4,}/u;

export const FEED_COLUMNS = [
	'ID', 'Item title', 'Item description', 'Item subtitle', 'Item category', 'Image URL', 'Final URL',
];

export function sanitizeText(s) {
	return (s ?? '').replace(/[\t\n\r\p{Cc}]/gu, ' ').replace(/\s+/g, ' ').trim();
}

// Hard-cap short text at Google's per-field limit, code-point-safe so a multi-byte character
// (emoji, astral CJK) is never split into invalid UTF-8.
export function truncate(s) {
	return [...sanitizeText(s)].slice(0, CAP).join('');
}

export function buildTitle(loan) {
	return truncate(`Help ${primaryFirstName(loan)}`);
}

export function buildDescription(loan) {
	return truncate(`Support ${primaryFirstName(loan)}`);
}

export function buildSubtitle(loan) {
	return truncate(loan?.geocode?.country?.name);
}

export function buildCategory(loan) {
	return sanitizeText(loan?.sector?.name);
}

export function buildFinalUrl(id) {
	return `${KIVA_LEND_BASE}/${id}?${UTM_QUERY}`;
}

export function buildImageUrl(hash) {
	return `${KIVA_AD_IMAGE_BASE}/${hash}`;
}

// Whether a row's visible copy is safe to publish as an ad: rejects ALL-CAPS shouting and banned
// financial/ecommerce words in the title/description. Unsafe rows are dropped from the feed.
export function isRowAdSafe(row) {
	const copy = `${row['Item title']} ${row['Item description']}`;
	return !ALL_CAPS_RE.test(copy) && !BANNED_WORDS_RE.test(copy);
}

export function loanToFeedRow(loan) {
	return {
		ID: String(loan.id),
		'Item title': buildTitle(loan),
		'Item description': buildDescription(loan),
		'Item subtitle': buildSubtitle(loan),
		'Item category': buildCategory(loan),
		'Image URL': buildImageUrl(loan.image.hash),
		'Final URL': buildFinalUrl(loan.id),
	};
}
