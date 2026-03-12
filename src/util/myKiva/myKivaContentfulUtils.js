import { optimizeContentfulUrl } from '#src/util/imageUtils';
import { formatUiSetting } from '#src/util/contentfulUtils';

/**
 * Extracts the rich text content array from a Contentful slide
 * @param {Object} slide - Contentful slide entry
 * @returns {Array} Rich text content nodes
 */
export const getRichTextContent = slide => slide?.fields?.richText?.content ?? [];

/**
 * Extracts and formats the UI settings data from a slide's rich text content
 * @param {Object} slide - Contentful slide entry
 * @returns {Object} Parsed UI settings data object
 */
export const getRichTextUiSettingsData = slide => {
	const richTextContent = getRichTextContent(slide);
	const uiSettings = richTextContent.find(
		item => item.data?.target?.sys?.contentType?.sys?.id?.toLowerCase() === 'uisetting'
	);
	const uiSettingsTarget = uiSettings?.data?.target ?? {};
	const uiSettingsData = formatUiSetting(uiSettingsTarget);
	return uiSettingsData?.dataObject ?? {};
};

/**
 * Returns the title text for a slide, using progress data if available
 * @param {Object} slide - Contentful slide entry with optional progress data
 * @returns {string} Slide title
 */
export const getSlideTitle = slide => {
	if (slide.totalProgressToAchievement) {
		return `Your progress: ${slide.totalProgressToAchievement}/${slide.target} loans`;
	}
	return getRichTextUiSettingsData(slide)?.title || '';
};

/**
 * Returns the subtitle text for a slide
 * @param {Object} slide - Contentful slide entry
 * @param {boolean} isNonBadge - Whether the slide is a non-badge content slide
 * @returns {string} Slide subtitle
 */
export const getSlideSubTitle = (slide, isNonBadge) => {
	if (isNonBadge) {
		return getRichTextUiSettingsData(slide).contentText || '';
	}
	if (slide.totalProgressToAchievement) {
		return 'Keep lending to reach your next achievement';
	}
	return 'Get started to reach your first achievement';
};

/**
 * Returns the primary CTA button text for a slide
 * @param {Object} slide - Contentful slide entry
 * @returns {string} Primary CTA text
 */
export const getSlidePrimaryCtaText = slide => {
	return getRichTextUiSettingsData(slide).primaryCtaText || '';
};

/**
 * Returns the primary CTA button variant for a slide
 * @param {Object} slide - Contentful slide entry
 * @returns {string} Primary CTA variant (defaults to 'secondary')
 */
export const getSlidePrimaryCtaVariant = slide => {
	return getRichTextUiSettingsData(slide).primaryCtaVariant || 'secondary';
};

/**
 * Returns the secondary CTA button text for a slide
 * @param {Object} slide - Contentful slide entry
 * @returns {string} Secondary CTA text
 */
export const getSlideSecondaryCtaText = slide => {
	return getRichTextUiSettingsData(slide).secondaryCtaText || '';
};

/**
 * Checks if the slide title should use a sans-serif font
 * @param {Object} slide - Contentful slide entry
 * @returns {boolean} Whether the title font is sans
 */
export const isSlideTitleFontSans = slide => {
	return getRichTextUiSettingsData(slide).titleSans?.toLowerCase() === 'true';
};

/**
 * Returns the title color class for a slide
 * @param {Object} slide - Contentful slide entry
 * @param {boolean} isNonBadge - Whether the slide is a non-badge content slide
 * @returns {string} Tailwind color class or Contentful-defined color
 */
export const getSlideTitleColor = (slide, isNonBadge) => {
	const data = getRichTextUiSettingsData(slide);
	if (!data.titleColor && isNonBadge) return 'tw-text-action';
	return data.titleColor;
};

/**
 * Extracts and optimizes the media image URL from a Contentful media entry
 * @param {Object} media - Contentful rich text embedded entry node
 * @returns {string} Optimized image URL
 */
export const getSlideMediaImgUrl = media => {
	const baseUrl = media?.data?.target?.fields?.contentLight?.[0]?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};

/**
 * Returns the background image URL for a slide, handling both badge and non-badge types
 * @param {Object} slide - Contentful slide entry
 * @param {boolean} isNonBadge - Whether the slide is a non-badge content slide
 * @param {boolean} isMobile - Whether the current viewport is mobile
 * @returns {string} Optimized background image URL
 */
export const getSlideBackgroundImg = (slide, isNonBadge, isMobile) => {
	const richTextContent = getRichTextContent(slide);
	if (isNonBadge) {
		const mobileMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id?.toLowerCase() === 'media'
				&& item.data?.target?.fields?.key?.toLowerCase().includes('mobile')
		);
		const desktopMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id?.toLowerCase() === 'media'
				&& item.data?.target?.fields?.key?.toLowerCase().includes('desktop')
		);
		return getSlideMediaImgUrl(isMobile ? mobileMediaData : desktopMediaData);
	}
	const backgroundImage = richTextContent.find(
		item => item.nodeType?.toLowerCase() === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);
	const baseUrl = backgroundImage?.data?.target?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};
