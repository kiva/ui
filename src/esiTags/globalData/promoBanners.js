import { hasPromoSession, isFromImpactDashboard } from '#src/util/promoCredit';
import { activePromoBanner, showBannerForPromo } from '#src/util/globalPromoBanner';

// Re-exporting fragments to indicate they are required for this module
export { userPromoBalanceFragment, basketPromoAvailableFragment } from '#src/util/promoCredit';
export { globalPromoFragment } from '#src/util/globalPromoBanner';

// Check if the global promo banner should be shown based on promo status and banner settings.
function shouldShowGlobalPromoBanner(data, hasPromo, url) {
	const activeBanner = activePromoBanner(data, url.pathname);
	return activeBanner && (!hasPromo || showBannerForPromo(activeBanner));
}

// Check if the promo credit banner should be shown based on user data and URL.
function shouldShowPromoCreditBanner(hasPromo, url) {
	if (hasPromo) {
		return true;
	}
	if (isFromImpactDashboard(url)) {
		return true;
	}
	return false;
}

/**
 * Set data to be used as CSS variables for promotional banners.
 * @param {Object} data - The user data from the GraphQL query with the
 *   userPromoBalanceFragment, basketPromoAvailableFragment, and
 *   lendingRewardFragment.
 * @param {URL} url - The current URL.
 */
export function promoBannerData(data, url) {
	const userData = {};
	const hasPromo = hasPromoSession(data);

	if (!shouldShowGlobalPromoBanner(data, hasPromo, url)) {
		userData['global-promo-banner-display'] = 'none';
	}

	if (!shouldShowPromoCreditBanner(hasPromo, url)) {
		userData['promo-credit-banner-display'] = 'none';
	}

	return userData;
}
