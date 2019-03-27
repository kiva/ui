import _filter from 'lodash/filter';
import _map from 'lodash/map';
import cookieStore from '@/util/cookieStore';
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
	const basketId = cookieStore.get('kvbskt');
	// Retrieve and assign preFetchVariables
	let prefetchVariables;
	if (typeof config.preFetchVariables === 'function') {
		prefetchVariables = config.preFetchVariables ? config.preFetchVariables(args) : {};
	} else {
		prefetchVariables = config.preFetchVariables ? config.preFetchVariables : {};
	}
	// Always format variables to include basketId
	// eslint-disable-next-line
	config.variables = {
		basketId,
		...prefetchVariables,
	};

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
		client.query({
			query: config.query,
			variables: config.variables,
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
	const allComponents = getDeepComponents(components);
	const apolloComponents = _filter(allComponents, 'apollo.preFetch');
	return Promise.all(_map(apolloComponents, c => preFetchApolloQuery(c.apollo, apolloClient, args)));
}
