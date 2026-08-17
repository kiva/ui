import fetchGraphQL from '../../fetchGraphQL.js';
import { warn } from '../../log.js';

// Parse a comma-separated uiConfigSetting value (loan/partner/sector ids) into a de-duplicated id list.
// Matches strict digit runs only, not Number()/parseInt, so Number-coercible junk like "0x1A", "1e3",
// "-7", or "5.5" can't slip a malformed id into the FLSS filter. A non-string value (absent setting)
// yields an empty list -- i.e. "no exclusions".
export function parseIdList(value) {
	if (typeof value !== 'string') return [];
	// Settings Manager may JSON-encode the value (string type -> `"6,16"`, array -> `["6","16"]`).
	// Strip the JSON wrapper chars up front: the strict per-id digit filter below is the real gate, so
	// quotes/brackets can be dropped blindly while junk like "abc"/"5.5"/"-7" is still rejected.
	const ids = value
		.replace(/["[\]]/g, '')
		.split(',')
		.map(part => part.trim())
		.filter(part => /^\d+$/.test(part))
		.map(Number);
	return [...new Set(ids)];
}

// Read a Settings Manager denylist via the standard uiConfigSetting(key:) query and parse it into ids.
// A missing setting or a failed read is treated as "no exclusions" (empty list) so the feed still
// generates; the read failure is logged.
export async function fetchExcludedIds(key) {
	try {
		const value = await fetchGraphQL(
			{
				query: `query liveLoanAdsUiConfigSetting($key: String!) {
					general { uiConfigSetting(key: $key) { key value } }
				}`,
				variables: { key },
			},
			'data.general.uiConfigSetting.value',
		);
		return parseIdList(value);
	} catch (err) {
		warn(`Ad feed: failed to read uiConfigSetting "${key}"; treating as no exclusions`, { error: err });
		return [];
	}
}
