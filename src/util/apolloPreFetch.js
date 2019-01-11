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

// A wrap around the apollo client query function that returns a Promise
function query(config, client, args) {
	return new Promise((resolve, reject) => {
		client.query({
			query: config.query,
			variables: config.preFetchVariables ? config.preFetchVariables(args) : {},
			fetchPolicy: 'network-only', // This was used to force re-fetch of queries after new auth. Better way?
		}).then(result => {
			if (result.errors) {
				reject(result.errors);
			} else {
				resolve(result);
			}
		}).catch(reject);
	});
}

// A function to pre-fetch a graphql query from a component's apollo options
export function preFetchApolloQuery(config, client, args) {
	if (typeof config.preFetch === 'function') {
		// Call the manual pre-fetch function
		const preFetchPromise = config.preFetch(config, client, args);
		if (!(preFetchPromise instanceof Promise)) {
			throw new TypeError('Pre-fetch functions must return a Promise');
		}
		return preFetchPromise;
	}
	// Fetch the query from the component's apollo options
	return query(config, client, args).catch(errors => {
		// Handle Apollo errors with custom code
		if (Array.isArray(errors)) {
			// Pass any errors to the error handlers from the component's apollo options
			return handleApolloErrors(config.errorHandlers, errors, args);
		}
		// Pass other types of errors down the chain
		throw errors;
	}).catch(err => {
		// Attempt one retry without custom error handling if requested by a previous error handler
		// This is to handle the case of authenticating using a popup while prefetching
		if (err === 'retry') {
			return query(config, client, args);
		}
		// Reject everything else
		throw err;
	});
}

export function preFetchAll(components, apolloClient, { ...args }) {
	const allComponents = getDeepComponents(components);
	const apolloComponents = _filter(allComponents, 'apollo.preFetch');
	return Promise.all(_map(apolloComponents, c => preFetchApolloQuery(c.apollo, apolloClient, args)));
}
