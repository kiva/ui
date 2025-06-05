import { gql } from 'graphql-tag';
import numeral from 'numeral';

export const basketCountFragment = gql`fragment BasketCount on Shop {
	id
	nonTrivialItemCount
	basket {
		id
		totals {
			itemTotal
		}
	}
}`;

/**
 * Set data to be used as CSS variables for the basket count and total.
 * @param {Object} data - The data from the GraphQL query for the basketCountFragment
 * @param {Object} cookieStore - The cookie store for this request
 */
export function basketCountData(data, cookieStore) {
	// Set CSS variables for the basket count/total
	const userData = {};
	const basketCount = data?.shop?.nonTrivialItemCount ?? 0;
	const basketItemTotal = numeral(data?.shop?.basket?.totals?.itemTotal ?? 0);
	// Replicating logic from TheHeader.vue for showing total instead of count if hasLargeBasket is true (> $500)
	const basketNumber = basketItemTotal.value() > 500 ? basketItemTotal.format('$0,0') : basketCount;
	userData['basket-count'] = `"${basketCount}"`;
	userData['basket-number'] = `"${basketNumber}"`;
	if (!basketCount) {
		userData['basket-count-display'] = 'none';
	}

	// Set CSS variables for the corporate basket count
	const lcaLoanCount = cookieStore.get('lcaid') ? 1 : 0;
	const corporateBasketCount = Math.max(basketCount - lcaLoanCount, 0);
	userData['corporate-basket-count'] = `"${corporateBasketCount}"`;
	if (!corporateBasketCount) {
		userData['corporate-basket-count-display'] = 'none';
	}

	return userData;
}
