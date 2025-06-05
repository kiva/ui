import { gql } from 'graphql-tag';
import { basketPromoAvailableFragment, hasPromoSession, userPromoBalanceFragment } from '#src/util/promoCredit';
import { settingEnabled, settingWithinDateRange } from '#src/util/settingsUtils';
import { isExcludedUrl } from '#src/util/urlUtils';

/**
 * Global exclude list for promotion banners + disclaimers
 */
export const globalBannerDenyList = [
	'/checkout',
	'/confirm-instant-donation/*',
	'/donate/support-kiva',
	'/error',
	'/instant-donation-thanks/*',
	'/instant-lending-error',
	'/join-team',
	'/register/social',
	'/possibility/giving-tuesday',
	'/possibility/12-days-of-lending',
	'/possibility/year-end',
	'/process-instant-lending/*',
];

export const bannerQuery = gql`
	query bannerQuery($basketId: String) {
		contentful {
			entries(contentType: "uiSetting", contentKey: "ui-global-promo")
		}
		my {
			id
			...UserPromoBalanceFragment
		}
		shop(basketId: $basketId) {
			id
			...BasketPromoAvailableFragment
		}
	}
	${userPromoBalanceFragment}
	${basketPromoAvailableFragment}
`;

export function globalPromoSetting(data) {
	// gather contentful content and the uiSetting key ui-global-promo
	const contentfulContent = data?.contentful?.entries?.items ?? [];
	const uiGlobalPromoSetting = contentfulContent.find(item => item.fields.key === 'ui-global-promo');

	if (uiGlobalPromoSetting?.fields && settingEnabled(
		uiGlobalPromoSetting.fields,
		'active',
		'startDate',
		'endDate'
	)) {
		return uiGlobalPromoSetting;
	}
}

export function filterForPromoBanner(promoContent) {
	// exclude items that are not global-promo-banners
	const isGlobalPromo = promoContent?.sys?.contentType?.sys?.id === 'globalPromoBanner';
	if (!isGlobalPromo) return false;

	// check for visibility based on current route and hiddenUrls field
	const hiddenUrls = globalBannerDenyList.concat(promoContent?.fields?.hiddenUrls ?? []);
	const visibleUrls = promoContent?.fields?.visibleUrls ?? [];
	if (isExcludedUrl(hiddenUrls, visibleUrls, this.$route.path)) return false;

	return true;
}

export function activePromoBanner(data) {
	// get the uiGlobalPromoSetting from the data
	const uiGlobalPromoSetting = globalPromoSetting(data);

	// return the active promo banner from the uiGlobalPromoSetting
	return uiGlobalPromoSetting?.fields?.content?.find(promoContent => {
		// exclude items that are not global-promo-banners
		if (!filterForPromoBanner(promoContent)) return false;

		// check global promo banner fields
		if (!settingEnabled(promoContent.fields, 'active', 'startDate', 'endDate')) {
			return false;
		}

		// check for visibility on promo session override
		const showForPromo = promoContent.fields.showForPromo ?? false;
		return showForPromo || !hasPromoSession(data);
	});
}

export function inactivePromoBanners(data) {
	// get the global promo setting from the data
	const uiGlobalPromoSetting = globalPromoSetting(data);

	// return all inactive promo banners from the uiGlobalPromoSetting
	return uiGlobalPromoSetting?.fields?.content?.filter(promoContent => {
		// exclude items that are not global-promo-banners
		if (!filterForPromoBanner(promoContent)) return false;

		// exclude active promo banners
		if (promoContent.fields.active) {
			return false;
		}

		return settingWithinDateRange(
			promoContent.fields,
			'startDate',
			'endDate'
		);
	});
}
