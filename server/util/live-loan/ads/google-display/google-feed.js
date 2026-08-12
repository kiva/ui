import { fetchAdEligibleLoans } from '../ads-eligibility.js';
import { fetchExcludedIds } from '../excluded-ids.js';
import {
	EXCLUDED_LOAN_IDS_SETTING_KEY,
	EXCLUDED_PARTNER_IDS_SETTING_KEY,
	EXCLUDED_SECTOR_IDS_SETTING_KEY,
} from '../constants.js';
import { loanToFeedRow, isRowAdSafe, FEED_COLUMNS } from './feed-row.js';
import { info, warn } from '../../../log.js';

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

export async function generateGoogleFeed(count) {
	// Admin-managed denylists (Settings Manager), read fresh each generation; excluded loans, partners,
	// and sectors are pushed into the FLSS query so they never enter the candidate set. The three reads
	// are independent, so they run in parallel. Absent/failed read => no exclusions for that dimension.
	const [excludedLoanIds, excludedPartnerIds, excludedSectorIds] = await Promise.all([
		fetchExcludedIds(EXCLUDED_LOAN_IDS_SETTING_KEY),
		fetchExcludedIds(EXCLUDED_PARTNER_IDS_SETTING_KEY),
		fetchExcludedIds(EXCLUDED_SECTOR_IDS_SETTING_KEY),
	]);
	// Keyed by FLSS filter field so buildAdFeedFilters can merge each dimension without knowing them.
	const exclusions = { loanIds: excludedLoanIds, partnerId: excludedPartnerIds, sectorId: excludedSectorIds };
	info(
		`Ad feed: applying ${excludedLoanIds.length} excluded loan id(s), `
		+ `${excludedPartnerIds.length} partner id(s), ${excludedSectorIds.length} sector id(s)`,
		exclusions,
	);

	// FLSS (updated via kafka events) is the freshest source of fundraising loans and already excludes
	// funded/refunded/expired; the eligibility gate drops anonymized/no-name/no-image on the FLSS
	// record. No re-check against a slower source is needed.
	const eligible = await fetchAdEligibleLoans(count, exclusions);

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
