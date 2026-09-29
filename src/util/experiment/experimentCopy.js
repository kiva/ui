import { formatUiSetting } from '#src/util/contentfulUtils';
import { settingWithinDateRange } from '#src/util/settingsUtils';

/**
 * Turns a Contentful copy set into its copy, grouped by experiment version.
 * The set is a uiSetting linking one genericContentBlock per version, keyed `<setting key>-<version>`.
 * Versions must match the experiment's versions in Kiva Admin; the required `control` block holds the
 * default copy.
 *
 * Returns null when the set is turned off, outside its dates, or has no copy, so the page can
 * show its hardcoded copy instead.
 *
 * @param {Object} uiSettingEntry The uiSetting entry, as returned by getContentfulEntries
 * @returns {Object|null} The copy for each version, e.g. { control: {...}, b: {...} }, or null
 */
export function formatExperimentCopy(uiSettingEntry) {
	if (!uiSettingEntry?.fields) return null;

	const setting = formatUiSetting(uiSettingEntry);
	if (!setting.active || !setting.key) return null;

	// No dates means always on. With dates, both must be set and today must fall between them
	const hasSchedule = !!(setting.startDate || setting.endDate);
	if (hasSchedule && !settingWithinDateRange(setting, 'startDate', 'endDate')) return null;

	const prefix = `${setting.key}-`;
	const variants = {};
	setting.contents.forEach(block => {
		if (block.contentType !== 'genericContentBlock' || !block.key?.startsWith(prefix)) return;
		const variant = block.key.slice(prefix.length);
		// If two blocks have the same version, keep the first one
		if (variant && !Object.hasOwn(variants, variant)) {
			variants[variant] = block;
		}
	});

	return Object.keys(variants).length ? variants : null;
}

// The control block is required in the copy set and holds the default copy; its key must match the
// control key in the experiment's Kiva Admin distribution
const CONTROL_VERSION = 'control';

/**
 * Picks the copy for an assigned experiment version from a variants map and fills placeholders.
 * Falls back to the control block when the version is missing or has no block. Returns null when
 * there is no usable text, so callers can apply their own hardcoded fallback with `??`.
 *
 * @param {Object|null} variants Copy blocks by version, as returned by formatExperimentCopy
 * @param {string|null} [version] The assigned experiment version, e.g. 'control', 'b', 'unassigned'
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
