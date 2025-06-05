import { gql } from 'graphql-tag';
import numeral from 'numeral';

/**
 * Determine if the route or URL indicates that the user is coming from the Impact Dashboard.
 * @param {Object|URL} routeOrUrl - The route object or URL to check.
 * @returns {boolean} - True if the user is coming from the Impact Dashboard, false otherwise.
 */
export function isFromImpactDashboard(routeOrUrl) {
	if (routeOrUrl instanceof URL) {
		return routeOrUrl.searchParams.get('fromContext')?.startsWith('/impact-dashboard') ?? false;
	}
	return routeOrUrl?.query?.fromContext?.startsWith('/impact-dashboard') ?? false;
}

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
			totals {
				bonusAvailableTotal
				freeTrialAvailableTotal
				redemptionCodeAvailableTotal
				universalCodeAvailableTotal
			}
		}
	}
`;

/**
 * Determine the total bonus balance available to the user.
 * This includes the user's promo balance and any available promo credits in the basket.
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
