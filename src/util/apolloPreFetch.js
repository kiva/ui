import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import getDeepComponents from './getDeepComponents';
import logFormatter from './logFormatter';

// harmless or known responses from our graphql api
const wellKnownErrorCodes = [
	'api.authenticationRequired'
];

export function handleApolloErrors(handlers = {}, errors, args) {
	// Get the error code for each error from either error.code or error.extensions.code
	const formattedErrors = _map(errors, error => {
		const extensions = error.extensions || {};
		return {
			...error,
			code: error.code || extensions.code,
		};
	});
	// Group the errors by their error code
	const errorsByCode = _groupBy(formattedErrors, 'code');
	// Get promises handling all of the errors
	return Promise.all(_map(errorsByCode, (graphQLErrors, code) => {
		// Try to get the handler for this error code
		const handler = handlers[code];
		// Warn about errors being unhandled if a handler wasn't found
		if (!handler) {
			// skip logging well known error codes
			if (wellKnownErrorCodes.indexOf(code) !== -1) {
				return Promise.resolve();
			}

			logFormatter(`Warning: No error handler for error code '${code}': ${graphQLErrors[0].message}`, 'warn');
			return Promise.resolve();
		}
		// Call the error handler with the errors and any additional args passed in from the top function
		const handlerPromise = handler({ graphQLErrors, ...args });
		// Throw error for malformed error handler functions
		if (!(handlerPromise instanceof Promise)) {
			throw new TypeError('Error handler functions must return a Promise');
		}
		return handlerPromise;
	}));
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
	return new Promise((resolve, reject) => {
		const { cookieStore } = args;
		const prefetchVariables = config.preFetchVariables ? config.preFetchVariables({ client, ...args }) : {};
		client.query({
			query: config.query,
			variables: {
				basketId: cookieStore.get('kvbskt'),
				...prefetchVariables,
			},
			fetchPolicy: 'network-only', // This is used to force re-fetch of queries after new auth
		}).then(result => {
			if (result.errors) {
				// Handle Apollo errors with custom code
				handleApolloErrors(config.errorHandlers, result.errors, args).then(resolve).catch(reject);
			} else {
				resolve(result);
			}
		}).catch(reject);
	});
}

export function preFetchAll(components, apolloClient, { ...args }) {
	// update basketId before preFetch cycle
	const allComponents = getDeepComponents(components);
	const apolloComponents = _filter(allComponents, 'apollo.preFetch');
	return Promise.all(_map(apolloComponents, c => preFetchApolloQuery(c.apollo, apolloClient, args)));
}
