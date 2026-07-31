import getOperationVariables from './operationVariables';

/**
 * Create the watch query for an apollo operation: build the merged variables,
 * keep them live through the caller's watcher, and subscribe the caller's
 * handlers.
 *
 * @param {object} options
 * @param {object} options.client - Apollo client
 * @param {object} options.operation - Operation holding query and optional fetchPolicy
 * @param {object} options.commonVars - { cookieStore, route } inputs for the shared variables
 * @param {Function} options.getVariables - Returns the operation's own variables
 * @param {Function} options.watchVariables - Watches getVariables, calling back with new variables
 * @param {Function} options.next - Called with each query result
 * @param {Function} [options.error] - Called with a transport error
 * @returns {{ observer: object, subscription: object }}
 */
export default function watchApolloOperation({
	client,
	operation,
	commonVars,
	getVariables,
	watchVariables,
	next,
	error,
}) {
	const { query, fetchPolicy } = operation;

	const observer = client.watchQuery({
		query,
		...(fetchPolicy && { fetchPolicy }),
		variables: getOperationVariables(query, commonVars, getVariables()),
	});

	watchVariables(getVariables, vars => observer.setVariables(getOperationVariables(query, commonVars, vars)));

	const subscription = observer.subscribe({
		next,
		...(error && { error }),
	});

	return { observer, subscription };
}
