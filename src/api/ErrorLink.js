import { onError } from 'apollo-link-error';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';

export default () => {
	return onError(({
		operation,
		response,
		graphQLErrors,
		networkError,
	}) => {
		const handlers = operation.getContext().errorHandlers || {};
		if (graphQLErrors) {
			_forEach(handlers, (handler, code) => {
				const errors = _filter(graphQLErrors, { code });
				if (errors.length) {
					handler(errors);
				}
			});
		}
		if (networkError && !graphQLErrors) {
			console.error(networkError);
		}
		// prevent the errors from traveling further down the chain
		if (response) {
			response.errors = null;
		}
	});
};
