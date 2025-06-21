import { gql } from 'graphql-tag';

export const basketCountFragment = gql`fragment BasketCount on Shop {
	id
	nonTrivialItemCount
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
	if (!basketCount) {
		userData['basket-count-display'] = 'none';
	}

	// Set CSS variables for the corporate basket count
	const lcaLoanCount = cookieStore.get('lcaid') ? 1 : 0;
	const corporateBasketCount = Math.max(basketCount - lcaLoanCount, 0);
	if (!corporateBasketCount) {
		userData['corporate-basket-count-display'] = 'none';
	}

	return userData;
}
