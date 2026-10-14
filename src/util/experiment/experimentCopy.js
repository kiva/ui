import {
	findRichTextEmbeddedEntry,
	formatUiSetting,
	hasUnresolvedRichTextEntry,
} from '#src/util/contentfulUtils';
import { settingWithinDateRange } from '#src/util/settingsUtils';

/**
 * Whether a uiSetting is on and now falls within its dates. No dates means always on; with dates,
 * both must be set.
 *
 * @param {Object} setting A formatted uiSetting
 * @param {Date} now The time to check
 * @returns {boolean}
 */
function settingIsLive(setting, now) {
	// Without a key, the round couldn't be named in the exposure event
	if (!setting.active || !setting.key) return false;
	const hasSchedule = !!(setting.startDate || setting.endDate);
	return !hasSchedule || settingWithinDateRange(setting, 'startDate', 'endDate', now);
}

/**
 * Picks the copy round that is live now. A block keyed `<round>-<version>` joins the round whose schedule
 * (a dated uiSetting) it embeds in its body; blocks without one form an always-on round. The first linked
 * live round wins, and the set's own `active` and dates apply to every round.
 *
 * Returns null when no round is live, so the page can show its hardcoded copy.
 *
 * @param {Object} uiSettingEntry The uiSetting entry, as returned by getContentfulEntries
 * @param {Date} [now] The time to pick the round for, defaults to the current time
 * @returns {Object|null} The live round as { key, variants, trackingAction }, where variants maps each
 * version to its block, or null
 */
export function selectActiveCopyRound(uiSettingEntry, now = new Date()) {
	if (!uiSettingEntry?.fields) return null;

	const setting = formatUiSetting(uiSettingEntry);
	if (!settingIsLive(setting, now)) return null;

	// A Map keeps linked order, so the first linked round wins
	const rounds = new Map();
	setting.contents.forEach(block => {
		// The version is the last segment, since round names contain dashes
		const version = block.key?.match(/-([^-]+)$/)?.[1];
		if (block.contentType !== 'genericContentBlock' || !version) return;

		const embeddedSchedule = findRichTextEmbeddedEntry(block.bodyCopy, 'uiSetting');
		// Skip blocks whose schedule didn't load, or their copy would show with no end date
		if (!embeddedSchedule && hasUnresolvedRichTextEntry(block.bodyCopy)) return;
		const schedule = embeddedSchedule ? formatUiSetting(embeddedSchedule) : setting;
		if (!rounds.has(schedule.key)) {
			rounds.set(schedule.key, { schedule, variants: {} });
		}
		const { variants } = rounds.get(schedule.key);
		// If two blocks in a round have the same version, keep the first one
		if (!Object.hasOwn(variants, version)) {
			variants[version] = block;
		}
	});

	const liveRound = [...rounds.values()].find(({ schedule }) => settingIsLive(schedule, now));
	if (!liveRound) return null;

	// A blank action counts as unset, so the caller's fallback applies
	const trackingAction = liveRound.schedule.dataObject?.trackingAction;
	return {
		key: liveRound.schedule.key,
		variants: liveRound.variants,
		trackingAction: typeof trackingAction === 'string' && trackingAction.trim() ? trackingAction : null,
	};
}

// Version `a` is the experiment's control in Kiva Admin; its block holds the default copy
const CONTROL_VERSION = 'a';

/**
 * Picks the copy for an assigned experiment version from a variants map and fills placeholders.
 * Falls back to the control block when the version is missing or has no block. Returns null when
 * there is no usable text, so callers can apply their own hardcoded fallback with `??`.
 *
 * @param {Object|null} variants Copy blocks by version, from a round's `variants`
 * @param {string|null} [version] The assigned experiment version, e.g. 'a', 'b', 'unassigned'
 * @param {string} field The block field holding the text, e.g. 'headline'
 * @param {Object} [replacements] Values for the `{key}` tokens in the text; a null or undefined value
 * leaves its token untouched
 * @returns {string|null} The text with placeholders filled, or null
 */
export function getExperimentCopy(variants, version, field, replacements = {}) {
	if (!variants) return null;
	const pick = v => (v != null && Object.hasOwn(variants, v) ? variants[v] : undefined);
	const block = pick(version) ?? pick(CONTROL_VERSION);
	const text = block?.[field];
	if (typeof text !== 'string' || !text) return null;
	// split/join instead of replaceAll: replacement values (e.g. dollar amounts) must be inserted
	// verbatim, without replaceAll's `$`-sequence handling
	return Object.entries(replacements ?? {}).reduce(
		(copy, [key, value]) => (value == null ? copy : copy.split(`{${key}}`).join(String(value))),
		text,
	);
}
