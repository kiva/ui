import { gql } from 'graphql-tag';
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

// GraphQL fragment to fetch the global promo banner setting
export const globalPromoFragment = gql`fragment GlobalPromoFragment on Contentful {
	entries(contentType: "uiSetting", contentKey: "ui-global-promo")
}`;

// GraphQL query to fetch the global promo banner setting
export const bannerQuery = gql`
	query bannerQuery {
		contentful {
			...GlobalPromoFragment
		}
	}
	${globalPromoFragment}
`;

/**
 * Fetch the global promo setting from the contentful data.
 *
 * @param {Object} data - The data result from the bannerQuery.
 * @returns {Object|undefined} - The global promo setting if active, otherwise undefined.
 */
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

/**
 * Filter for global promo banners based on the current path.
 *
 * @param {Object} promoContent - The promo/banner content object from the global promo setting.
 * @param {string} path - The current URL path to check against the banner's visibility rules.
 * @returns {boolean} - True if the promo banner should be shown, false otherwise.
 */
export function filterForPromoBanner(promoContent, path) {
	// exclude items that are not global-promo-banners
	const isGlobalPromo = promoContent?.sys?.contentType?.sys?.id === 'globalPromoBanner';
	if (!isGlobalPromo) return false;

	// check for visibility based on current route and hiddenUrls field
	const hiddenUrls = globalBannerDenyList.concat(promoContent?.fields?.hiddenUrls ?? []);
	const visibleUrls = promoContent?.fields?.visibleUrls ?? [];
	if (isExcludedUrl(hiddenUrls, visibleUrls, path)) return false;

	return true;
}

/**
 * Check if the promo banner should be shown for a promo session.
 *
 * @param {Object} banner - The promo banner object.
 * @returns {boolean} - True if the banner should be shown for a promo, false otherwise.
 */
export function showBannerForPromo(banner) {
	return banner?.fields?.showForPromo ?? false;
}

/**
 * Get the active global promo banner from the global promo setting data.
 *
 * @param {Object} data - The data result from the bannerQuery.
 * @param {string} path - The current URL path to check against the banner's visibility rules.
 * @returns {Object|undefined} - The first active global promo banner if it exists and is active today.
 */
export function activePromoBanner(data, path) {
	// get the uiGlobalPromoSetting from the data
	const uiGlobalPromoSetting = globalPromoSetting(data);

	// return the active promo banner from the uiGlobalPromoSetting
	return uiGlobalPromoSetting?.fields?.content?.find(promoContent => {
		// exclude items that are not global-promo-banners
		if (!filterForPromoBanner(promoContent, path)) return false;

		// check global promo banner fields
		return settingEnabled(promoContent.fields, 'active', 'startDate', 'endDate');
	});
}

/**
 * Get all inactive global promo banners from the global promo setting data.
 *
 * @param {Object} data - The data result from the bannerQuery.
 * @param {string} path - The current URL path to check against the banner's visibility rules.
 * @returns {Array} - An array of inactive global promo banners where today's date is within the start and end dates.
 */
export function inactivePromoBanners(data, path) {
	// get the global promo setting from the data
	const uiGlobalPromoSetting = globalPromoSetting(data);

	// return all inactive promo banners from the uiGlobalPromoSetting
	return uiGlobalPromoSetting?.fields?.content?.filter(promoContent => {
		// exclude items that are not global-promo-banners
		if (!filterForPromoBanner(promoContent, path)) return false;

		// exclude active promo banners
		if (promoContent.fields.active) {
			return false;
		}

		return settingWithinDateRange(
			promoContent.fields,
			'startDate',
			'endDate'
		);
	}) ?? [];
}
