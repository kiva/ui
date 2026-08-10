import fetchGraphQL from '../../fetchGraphQL.js';
import { getFromCache, setToCache } from '../../memJsUtils.js';
import { warn } from '../../log.js';

// Kill-switch setting key, read via uiConfigSetting. The resolver prefixes 'ui.', so the actual
// Settings Manager key to toggle is `ui.live_loan_ads_feed_enabled`. This is the feed's own flag,
// separate from the monolith's `feature.live_loan_ads_feed.enabled`.
const FLAG_KEY = 'live_loan_ads_feed_enabled';
const CACHE_KEY = 'live-loan-ads-feed-flag';
// Short TTL so a toggle takes effect within seconds while still sparing the gateway a hit per request.
const FLAG_TTL_SECONDS = 30;

const FLAG_QUERY = `query adsFeedUiConfig($key: String!) {
	general {
		uiConfigSetting(key: $key) {
			key
			value
		}
	}
}`;

function toBool(value) {
	return value != null && String(value) === 'true';
}

// Read the feed kill switch server-side. Cached briefly to avoid a gateway call on every feed
// request; fails closed (off) if the setting can't be read so the feed never serves unintentionally.
export async function isFeedEnabled(cache) {
	const cached = await getFromCache(CACHE_KEY, cache);
	if (cached != null) {
		const asString = String(cached);
		if (asString === 'true' || asString === 'false') return asString === 'true';
	}

	let enabled;
	try {
		const value = await fetchGraphQL(
			{ query: FLAG_QUERY, variables: { key: FLAG_KEY } },
			'data.general.uiConfigSetting.value',
		);
		enabled = toBool(value);
	} catch (err) {
		warn(`Ad feed: kill-switch read failed, defaulting off, ${err}`);
		return false;
	}

	setToCache(CACHE_KEY, String(enabled), FLAG_TTL_SECONDS, cache).catch(() => {});
	return enabled;
}
