import { formatUiSetting } from '#src/util/contentfulUtils';
import { settingWithinDateRange } from '#src/util/settingsUtils';

/**
 * Turns a Contentful copy set into its copy, grouped by experiment version.
 * See docs/experiment-copy.md for how to set one up in Contentful.
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
