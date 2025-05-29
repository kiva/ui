/* eslint-disable no-param-reassign */
import { ApolloLink } from '@apollo/client/core/index';

export default ({ cookieStore }) => {
	return new ApolloLink((operation, forward) => {
		if (!cookieStore) return forward(operation);

		// Fetch current basket id from cookie
		const basketId = cookieStore.get('kvbskt');

		// Add the basket id to the current query's variables
		if (!operation.variables.basketId && basketId) {
			operation.variables.basketId = basketId;
		}

		return forward(operation);
	});
};
