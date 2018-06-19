import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import getDeepComponents from './getDeepComponents';

// A function to pre-fetch a graphql query from a component's apollo options
export function preFetchApolloQuery(config, client, args) {
	return new Promise((resolve, reject) => {
		// Fetch the query from the component's apollo options
		client.query({
			query: config.query
		}).then(({ errors }) => {
			let handled = false;
			// Pass any errors to the error handlers from the component's apollo options
			if (errors) {
				_forEach(config.errorHandlers, (handler, code) => {
					const graphQLErrors = _filter(errors, { code });
					if (graphQLErrors.length) {
						// Call the error handler with the errors, resolve/reject for finishing
						// the promise, and any additional args passed in from the top function
						handler({
							graphQLErrors,
							resolve,
							reject,
							...args,
						});
						handled = true;
					}
				});
			}
			// If no error handler was called, the promise needs to be completed
			if (!handled) {
				resolve();
			}
		}).catch(reject);
	});
}

export function preFetchAll(components, apolloClient, { ...args }) {
	const allComponents = getDeepComponents(components);
	const apolloComponents = _filter(allComponents, 'apollo.preFetch');
	return Promise.all(_map(apolloComponents, c => preFetchApolloQuery(c.apollo, apolloClient, args)));
}
