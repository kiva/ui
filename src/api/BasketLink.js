import _get from 'lodash/get';
import _set from 'lodash/set';
import { ApolloLink } from 'apollo-link';

export default ({ cookies }) => {
	return new ApolloLink((operation, forward) => {
		// Fetch current basket id from cookie
		const basketId = cookies.get('kvbskt');

		// Add the basket id to the current query's variables
		if (!_get(operation, 'variables.basketId') && basketId) {
			_set(operation, 'variables.basketId', basketId);
		}

		return forward(operation);
	});
};
