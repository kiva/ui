import { fetchAdEligibleLoans } from '../ads-eligibility.js';
import { loanToFeedRow, isRowAdSafe, FEED_COLUMNS } from './feed-row.js';
import { warn } from '../../../log.js';

// Cache keys + TTLs for serving the feed. A fresh copy is served from cache between regenerations so
// scrapers can't drive the FLSS/hydrate pipeline on every hit; the last-good copy is served if a
// regeneration fails so a transient outage never empties the feed.
export const ADS_FEED_FRESH_KEY = 'google-ads-feed';
export const ADS_FEED_LAST_GOOD_KEY = 'google-ads-feed-last-good';
export const ADS_FEED_FRESH_TTL = 5 * 60; // 5 minutes — keep the feed close to FLSS's ~5-min refresh cadence
export const ADS_FEED_LAST_GOOD_TTL = 3 * 24 * 60 * 60; // 3 days
// On a generation failure the last-good feed is re-primed into the fresh key for this short window,
// so an FLSS/gateway outage re-runs the full pipeline at most once per window instead of every request.
export const ADS_FEED_FAILURE_BACKOFF_TTL = 60; // 1 minute

// defense-in-depth: values are already sanitized upstream, but never let a stray
// tab/newline in a cell break the row/column structure
const cell = v => String(v ?? '').replace(/[\t\r\n]+/g, ' ');

export function toTsv(rows, columns = FEED_COLUMNS) {
	const header = columns.join('\t');
	const body = rows.map(row => columns.map(col => cell(row[col])).join('\t'));
	return [header, ...body].join('\n');
}

// The header-only feed served when the kill switch is off: it drains inventory from Google without
// running the FLSS pipeline.
export function emptyGoogleFeed() {
	return toTsv([]);
}

export async function generateGoogleFeed(count) {
	// FLSS (updated via kafka events) is the freshest source of fundraising loans and already excludes
	// funded/refunded/expired; the eligibility gate drops anonymized/no-name/no-image on the FLSS
	// record. No re-check against a slower source is needed.
	const eligible = await fetchAdEligibleLoans(count);

	const rows = [];
	eligible.forEach(loan => {
		const row = loanToFeedRow(loan);
		// Drop rows whose copy isn't ad-safe (banned words / ALL-CAPS) rather than emit a policy risk.
		if (!isRowAdSafe(row)) {
			warn(`Ad feed: dropping loan ${row.ID} whose copy is not ad-safe`);
			return;
		}
		rows.push(row);
	});
	return toTsv(rows);
}
