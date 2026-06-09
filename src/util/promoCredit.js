import { gql } from 'graphql-tag';
import numeral from 'numeral';

export const userPromoBalanceFragment = gql`
	fragment UserPromoBalance on My {
		id
		userAccount {
			id
			promoBalance
		}
	}
`;

export const basketPromoAvailableFragment = gql`
	fragment BasketPromoAvailable on Shop {
		id
		basket {
			id
			hasFreeCredits
			totals {
				bonusAvailableTotal
				freeTrialAvailableTotal
				redemptionCodeAvailableTotal
				universalCodeAvailableTotal
			}
		}
		lendingRewardOffered
	}
`;

export const promoCreditQuery = gql`
	query promoCredit($basketId: String) {
		my {
			id
			...UserPromoBalance
		}
		shop(basketId: $basketId) {
			id
			...BasketPromoAvailable
		}
	}
	${userPromoBalanceFragment}
	${basketPromoAvailableFragment}
`;

/**
 * Determine the total bonus balance available to the user.
 * This includes the user's promo balance and any available promo credits in the basket.
 *
 * @param {Object} data - The user data from the GraphQL query with the
 *   userPromoBalanceFragment and basketPromoAvailableFragment.
 * @returns {number} - The total bonus balance available to the user.
 */
export function bonusBalance(data) {
	// parse individual promo credit type amounts
	const bonusAvailableTotal = numeral(
		data.shop?.basket?.totals?.bonusAvailableTotal
	).value();
	const freeTrialAvailableTotal = numeral(
		data.shop?.basket?.totals?.freeTrialAvailableTotal
	).value();
	const redemptionCodeAvailableTotal = numeral(
		data.shop?.basket?.totals?.redemptionCodeAvailableTotal
	).value();
	const universalCodeAvailableTotal = numeral(
		data.shop?.basket?.totals?.universalCodeAvailableTotal
	).value();

	const basketPromoBalance = bonusAvailableTotal
		+ freeTrialAvailableTotal
		+ redemptionCodeAvailableTotal
		+ universalCodeAvailableTotal;

	// Parse user promoBalance
	const userPromoBalance = numeral(data?.my?.userAccount?.promoBalance ?? 0).value();
	// if we have promo balance from the user or the basket proceed with that
	return userPromoBalance >= basketPromoBalance ? userPromoBalance : basketPromoBalance;
}

/**
 * Check if the current session has any promotional credits available.
 *
 * @param {Object} data - The user data from the GraphQL query with the
 *   userPromoBalanceFragment and basketPromoAvailableFragment
 * @return {boolean} - True if there are promotional credits available, false otherwise.
 */
export function hasPromoSession(data) {
	// 1. Lending reward offered
	if (data?.shop?.lendingRewardOffered) {
		return true;
	}
	// 2. Basket has free credits
	if (data?.shop?.basket?.hasFreeCredits) {
		return true;
	}
	// 3. Bonus balance (from basket or user account)
	if (bonusBalance(data) > 0) {
		return true;
	}
	// 4. Managed Account Promo (promoCampaign.managedAccount.pageId)
	if (data?.shop?.promoCampaign?.managedAccount?.pageId) {
		return true;
	}
	// 5. UPC Campaign Banner (promoCampaign.managedAccount.campaignInfo.upc, partnerName, upcCampaignLink)
	const managedAccount = data?.shop?.promoCampaign?.managedAccount;
	const upc = managedAccount?.campaignInfo?.upc;
	const partnerName = managedAccount?.strategicPartner?.partnerName;
	const partnerPage = managedAccount?.strategicPartner?.partnerContentfulPage;
	const upcCampaignLink = (partnerPage && upc) ? `/impact-dashboard/${partnerPage}/upc/${upc}` : null;
	if (upc && partnerName && upcCampaignLink) {
		return true;
	}
	return false;
}

/**
 * Determine whether the optional tip section is eligible to be shown for an
 * Admin Reward lending-credit checkout.
 *
 * Returns true only when ALL of the following are true:
 *   1. The `enable_tip_for_admin_reward_lc` feature flag is enabled.
 *   2. The current checkout's promoCampaign managed account has a
 *      `managementType` of exactly `'Admin Reward'`.
 *
 * @param {Object} data - GraphQL result with `shop.promoCampaign.managedAccount.managementType`.
 * @param {boolean} flagEnabled - The resolved boolean value of the feature flag.
 * @returns {boolean}
 */
export function isAdminRewardTipEligible(data, flagEnabled) {
	if (flagEnabled !== true) return false;
	return data?.shop?.promoCampaign?.managedAccount?.managementType === 'Admin Reward';
}

/**
 * Determine if the route or URL indicates that the user is coming from the Impact Dashboard.
 *
 * @param {Object|URL} routeOrUrl - The route object or URL to check.
 * @returns {boolean} - True if the user is coming from the Impact Dashboard, false otherwise.
 */
export function isFromImpactDashboard(routeOrUrl) {
	if (routeOrUrl instanceof URL) {
		return routeOrUrl.searchParams.get('fromContext')?.startsWith('/impact-dashboard') ?? false;
	}
	return routeOrUrl?.query?.fromContext?.startsWith('/impact-dashboard') ?? false;
}
