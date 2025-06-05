import { gql } from 'graphql-tag';
import {
	isFromImpactDashboard,
	bonusBalance,
} from '#src/util/promoCredit';

// Re-exporting fragments to indicate they are required for this module
export {
	userPromoBalanceFragment,
	basketPromoAvailableFragment,
} from '#src/util/promoCredit';

export const lendingRewardFragment = gql`
	fragment LendingReward on Shop {
		id
		lendingRewardOffered
	}
`;

// Check if the promo credit banner should be shown based on user data and URL.
function shouldShowPromoCreditBanner(data, url) {
	if (isFromImpactDashboard(url)) {
		return true;
	}
	if (data?.shop?.lendingRewardOffered) {
		return true;
	}
	if (bonusBalance(data) > 0) {
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
export function promoBannerData(data, route) {
	const userData = {};

	if (!shouldShowPromoCreditBanner(data, route)) {
		userData['promo-credit-banner-display'] = 'none';
	}

	return userData;
}
