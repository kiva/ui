/**
 * Collect the composable operations attached to the given component
 * definitions, deduplicated by identity (a composable's operations are module
 * singletons shared by every definition importing it). Registration applies
 * preFetch: true automatically; an operation that authors its own preFetch
 * value keeps it.
 *
 * @param {object[]} components - Component definitions
 * @returns {object[]} Unique attached operations, ready for prefetching
 */
export function getAttachedOperations(components) {
	const operations = new Set();
	components?.forEach(component => {
		component?.preFetchOperations?.forEach(operation => operations.add(operation));
	});
	return Array.from(operations).map(operation => ({ preFetch: true, ...operation }));
}
