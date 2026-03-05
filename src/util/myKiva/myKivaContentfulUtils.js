import { optimizeContentfulUrl } from '#src/util/imageUtils';
import { formatUiSetting } from '#src/util/contentfulUtils';

export const getRichTextContent = slide => slide?.fields?.richText?.content ?? [];

export const getRichTextUiSettingsData = slide => {
	const richTextContent = getRichTextContent(slide);
	const uiSettings = richTextContent.find(
		item => item.data?.target?.sys?.contentType?.sys?.id === 'uiSetting'
	);
	const uiSettingsTarget = uiSettings?.data?.target ?? {};
	const uiSettingsData = formatUiSetting(uiSettingsTarget);
	return uiSettingsData?.dataObject ?? {};
};

export const getSlideTitle = slide => {
	if (slide.totalProgressToAchievement) {
		return `Your progress: ${slide.totalProgressToAchievement}/${slide.target} loans`;
	}
	return getRichTextUiSettingsData(slide)?.title || '';
};

export const getSlideSubTitle = (slide, isNonBadge) => {
	if (isNonBadge) {
		return getRichTextUiSettingsData(slide).contentText || '';
	}
	if (slide.totalProgressToAchievement) {
		return 'Keep lending to reach your next achievement';
	}
	return 'Get started to reach your first achievement';
};

export const getSlidePrimaryCtaText = slide => {
	return getRichTextUiSettingsData(slide).primaryCtaText || '';
};

export const getSlidePrimaryCtaVariant = slide => {
	return getRichTextUiSettingsData(slide).primaryCtaVariant || 'secondary';
};

export const getSlideSecondaryCtaText = slide => {
	return getRichTextUiSettingsData(slide).secondaryCtaText || '';
};

export const isSlideTitleFontSans = slide => {
	return getRichTextUiSettingsData(slide).titleSans === 'true';
};

export const getSlideTitleColor = (slide, isNonBadge) => {
	const data = getRichTextUiSettingsData(slide);
	if (!data.titleColor && isNonBadge) return 'tw-text-action';
	return data.titleColor;
};

export const getSlideMediaImgUrl = media => {
	const baseUrl = media?.data?.target?.fields?.contentLight?.[0]?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};

export const getSlideBackgroundImg = (slide, isNonBadge, isMobile) => {
	const richTextContent = getRichTextContent(slide);
	if (isNonBadge) {
		const mobileMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id === 'media'
				&& item.data?.target?.fields?.key.includes('mobile')
		);
		const desktopMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id === 'media'
				&& item.data?.target?.fields?.key.includes('desktop')
		);
		return getSlideMediaImgUrl(isMobile ? mobileMediaData : desktopMediaData);
	}
	const backgroundImage = richTextContent.find(
		item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);
	const baseUrl = backgroundImage?.data?.target?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};
