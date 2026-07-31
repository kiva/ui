import {
	ref,
	inject,
	onBeforeUnmount,
	getCurrentInstance,
} from 'vue';
import { routeLocationKey } from 'vue-router';
import getOperationVariables from '#src/util/operationVariables';

const isServer = typeof window === 'undefined';

// Dev-only detector for prefetch gaps: preFetchAll should have loaded every
// operation that did not opt out via shouldPreFetch, so a server cache miss
// means the prefetch needs fixing, not the render. shouldPreFetch gets the
// same context here as in preFetchApolloQuery.
function warnAboutCacheMiss(vm, operation, prefetchContext) {
	const optedOut = typeof operation.shouldPreFetch === 'function'
		? !operation.shouldPreFetch(operation, prefetchContext)
		: operation.shouldPreFetch === false;
	if (optedOut) {
		return;
	}
	const operationName = operation.query?.definitions?.[0]?.name?.value ?? 'unnamed operation';
	const componentName = vm.type?.name ?? 'unknown component';
	const cause = (vm.type?.preFetchOperations ?? []).includes(operation)
		? 'the operation is attached, so the prefetch ran but the cache read missed (check variables)'
		// eslint-disable-next-line max-len
		: 'the operation is not attached to the component (not registered in a preFetchOperations export, or the import is invisible to the transform)';
	// eslint-disable-next-line max-len
	console.warn(`[useApolloQuery] SSR cache miss for ${operationName} in ${componentName}: ${cause}. Rendering the "not loaded" state; the client will load it after hydration.`);
}

/**
 * Read a composable operation (see the preFetchOperations export convention
 * in src/util/composableOperations.js) from within setup().
 *
 * Reads the value loaded by prefetching the component definitions the
 * operation is attached to, and subscribes for updates on the client. loading reflects real fetch
 * state, so callers can tell "not loaded yet" apart from real values. error
 * carries a transport error or the operation's GraphQL errors array for
 * callers that need them; nothing is logged or handled automatically here.
 *
 * @param {object} operation - Operation registered in a composable's preFetchOperations export
 * @param {object} [variables] - Additional query variables
 * @returns {{
 *   result: import('vue').Ref<object|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<Error|object[]|null>,
 * }}
 */
export default function useApolloQuery(operation, variables = {}) {
	const result = ref(null);
	const error = ref(null);
	const loading = ref(true);

	const vm = getCurrentInstance();
	const apollo = vm ? inject('apollo', null) : null;
	const query = operation?.query;
	if (!apollo || !query) {
		return { result, loading, error };
	}

	const cookieStore = inject('cookieStore', null);
	// routeLocationKey is what useRoute injects; injecting it directly allows a
	// null default so router-less mounts (unit specs, storybook) stay silent
	const route = inject(routeLocationKey, null);

	// Same variables the operation is prefetched with, so the cache read hits
	const context = { cookieStore, route, client: apollo };
	const operationVariables = getOperationVariables(query, context, {
		...operation.preFetchVariables?.(context),
		...variables,
	});

	// Read the value already loaded by the prefetch (or a previous fetch)
	let inCache = false;
	if (typeof apollo.readQuery === 'function') {
		try {
			const data = apollo.readQuery({ query, variables: operationVariables });
			if (data) {
				result.value = data;
				loading.value = false;
				inCache = true;
			}
		} catch (e) {
			// An unreadable cache entry counts as a miss
		}
	}

	if (isServer) {
		// No fetch during server render: a miss renders the "not loaded" state
		// and the client subscription loads the value after hydration
		if (!inCache && process.env.NODE_ENV !== 'production') {
			warnAboutCacheMiss(vm, operation, {
				cookieStore,
				device: inject('device', null),
				kvAuth0: inject('kvAuth0', null),
				renderConfig: inject('$renderConfig', null),
				route,
			});
		}
	} else if (typeof apollo.watchQuery === 'function') {
		// Subscribe for updates (and the initial fetch when the cache was cold).
		// GraphQL errors arrive alongside data under errorPolicy 'all'; both
		// error kinds are exposed on the error ref without logging (transport
		// errors are already logged and retried at the apollo link layer).
		const subscription = apollo.watchQuery({
			query,
			...(operation.fetchPolicy && { fetchPolicy: operation.fetchPolicy }),
			variables: operationVariables,
		}).subscribe({
			next: apolloResult => {
				if (apolloResult?.data) {
					result.value = apolloResult.data;
				}
				if (apolloResult?.errors?.length) {
					error.value = apolloResult.errors;
				}
				loading.value = false;
			},
			error: e => {
				error.value = e;
				loading.value = false;
			},
		});
		onBeforeUnmount(() => subscription?.unsubscribe?.());
	}

	return { result, loading, error };
}
