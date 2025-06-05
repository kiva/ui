import { gql } from 'graphql-tag';
import numeral from 'numeral';

export const userBalanceFragment = gql`fragment UserBalance on My {
	id
	userAccount {
		id
		balance
	}
}`;

/**
 * Set data to be used as CSS variables for the user balance.
 * @param {Object} data - The user data from the GraphQL query with the userBalanceFragment.
 */
export function userBalanceData(data) {
	// Set CSS variables for the user balance
	const userBalance = numeral(Math.floor(data?.my?.userAccount?.balance ?? 0)).format('$0');
	return { 'user-balance': `"${userBalance}"` };
}
