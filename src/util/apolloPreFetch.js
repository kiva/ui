import _filter from 'lodash/filter';
import _map from 'lodash/map';
import getDeepComponents from './getDeepComponents';

export function handleApolloErrors(handlers, errors, args) {
	return Promise.all(_map(handlers, (handler, code) => {
		// Get all the errors that match this handlers' error code
		const graphQLErrors = _filter(errors, { code });
		if (graphQLErrors.length) {
			// Call the error handler with the errors and any additional args passed in from the top function
			const handlerPromise = handler({ graphQLErrors, ...args });
			// Warn against poorly-formed error handler functions
			if (!(handlerPromise instanceof Promise)) {
				throw new TypeError('Error handler functions must return a Promise');
			}
			return handlerPromise;
		}
		return Promise.resolve();
	}));
}

// A function to pre-fetch a graphql query from a component's apollo options
export function preFetchApolloQuery(config, client, args) {
	return new Promise((resolve, reject) => {
		if (typeof config.preFetch === 'function') {
			// Call the manual pre-fetch function
			const preFetchPromise = config.preFetch(config, client, args);
			if (!(preFetchPromise instanceof Promise)) {
				throw new TypeError('Pre-fetch functions must return a Promise');
			}
			preFetchPromise.then(resolve).catch(reject);
		} else {
			// Fetch the query from the component's apollo options
			client.query({
				query: config.query,
				variables: config.preFetchVariables ? config.preFetchVariables(args) : {},
			}).then(({ errors }) => {
				if (errors) {
					// Pass any errors to the error handlers from the component's apollo options
					handleApolloErrors(config.errorHandlers, errors, args).then(resolve).catch(reject);
				} else {
					// Just resolve if there aren't any errors
					resolve();
				}
			}).catch(reject);
		}
	});
}

export function preFetchAll(components, apolloClient, { ...args }) {
	const allComponents = getDeepComponents(components);
	const apolloComponents = _filter(allComponents, 'apollo.preFetch');
	return Promise.all(_map(apolloComponents, c => preFetchApolloQuery(c.apollo, apolloClient, args)));
}
