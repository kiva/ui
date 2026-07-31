/*
 * Apollo operations declared by composable modules. A composable registers an
 * operation for prefetching by exporting it in the module's authored
 * `preFetchOperations` array; the composable-operations vite transform
 * attaches the union of the preFetchOperations of the imported composable
 * modules to each component definition, and preFetchAll executes the attached
 * operations alongside the component's own apollo operations. Operations are
 * module singletons holding only request-invariant options, which is why
 * module scope is safe on a shared SSR worker.
 */

/**
 * Collect the composable operations attached to component definitions,
 * deduplicated by identity (operations are module singletons shared by every
 * definition importing the same composable). Registering an operation in a
 * preFetchOperations export is the prefetch opt-in, so preFetch: true is
 * applied automatically; an explicit authored flag still wins.
 *
 * @param {object[]} components - Component definitions
 * @returns {object[]} Unique attached operations, normalized for prefetching
 */
export function getAttachedOperations(components) {
	const operations = new Set();
	components?.forEach(component => {
		component?.preFetchOperations?.forEach(operation => operations.add(operation));
	});
	return Array.from(operations).map(operation => ({ preFetch: true, ...operation }));
}
