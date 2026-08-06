import {
	ref,
	inject,
	watch,
	onBeforeUnmount,
	getCurrentInstance,
} from 'vue';
import { routeLocationKey } from 'vue-router';
import getOperationVariables from '#src/util/operationVariables';
import logReadQueryError from '#src/util/logReadQueryError';
import watchApolloOperation from '#src/util/watchApolloOperation';

const isServer = typeof window === 'undefined';

// Dev-only warning for a server cache miss. Silent when the operation opted
// out of prefetching (authored preFetch: false, or shouldPreFetch declining
// with the same context the prefetcher passes).
function warnAboutCacheMiss(vm, operation, preFetched, prefetchContext) {
	if (!preFetched) {
		const { shouldPreFetch = true } = operation;
		const optedOut = operation.preFetch === false || (typeof shouldPreFetch === 'function'
			? !shouldPreFetch(operation, prefetchContext)
			: !shouldPreFetch);
		if (optedOut) {
			return;
		}
	}
	const operationName = operation.query?.definitions?.[0]?.name?.value ?? 'unnamed operation';
	const componentName = vm.type?.name ?? 'unknown component';
	const cause = preFetched
		// eslint-disable-next-line max-len
		? 'the operation was prefetched, but the cache read missed (check variables, and check the prefetch for GraphQL errors)'
		// eslint-disable-next-line max-len
		: 'the operation is not attached to the component (not registered in a preFetchOperations export, or the import is invisible to the transform)';
	// eslint-disable-next-line max-len
	console.warn(`[useApolloQuery] SSR cache miss for ${operationName} in ${componentName}: ${cause}. Rendering the "not loaded" state; the client will load it after hydration.`);
}

/**
 * Read an apollo operation from within setup(). The operation takes the same
 * options as a component apollo block operation (see src/graphql/README.md).
 *
 * When the operation was prefetched (attached to the component and not opted
 * out), the prefetched value is read from the cache. The server never fetches
 * beyond that read: a miss renders the "not loaded" state and warns in dev.
 * On the client a watch query subscription loads and follows the value.
 *
 * @param {object} operation - Operation registered in a composable's preFetchOperations export
 * @param {object|Function} [variables] - The operation's client variables: a plain object or a
 *   reactive getter, watched like a component operation's variables method
 * @returns {{
 *   result: import('vue').Ref<object|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<Error|object[]|null>,
 * }}
 */
export default function useApolloQuery(operation, variables = () => ({})) {
	const result = ref(null);
	const error = ref(null);
	const loading = ref(true);

	const vm = getCurrentInstance();
	const apollo = vm ? inject('apollo', null) : null;
	const query = operation?.query;
	if (!apollo || !query) {
		return { result, loading, error };
	}

	const { shouldPreFetch = true, preFetchVariables = () => ({}) } = operation;

	const cookieStore = inject('cookieStore', null);
	// routeLocationKey is what useRoute injects; injecting it directly allows a
	// null default so router-less mounts (unit specs, storybook) stay silent
	const route = inject(routeLocationKey, null);
	const commonVars = { cookieStore, route };
	const prefetchContext = {
		cookieStore,
		device: inject('device', null),
		kvAuth0: inject('kvAuth0', null),
		renderConfig: inject('$renderConfig', null),
		route,
	};

	// The same prefetch decision the apollo plugin makes for component
	// operations, with registration standing in for preFetch: true
	const attached = (vm.type?.preFetchOperations ?? []).includes(operation);
	const preFetch = attached && operation.preFetch !== false;
	let preFetched = preFetch && shouldPreFetch;
	if (typeof shouldPreFetch === 'function') {
		preFetched = preFetch && shouldPreFetch(operation, prefetchContext);
	}

	// If the operation was prefetched, read the data from the cache
	if (preFetched) {
		try {
			const data = apollo.readQuery({
				query,
				variables: getOperationVariables(query, commonVars, preFetchVariables({
					...commonVars,
					client: apollo,
				})),
			});
			if (data !== null) {
				result.value = data;
				loading.value = false;
			}
		} catch (e) {
			logReadQueryError(e, `useApolloQuery ${query?.definitions?.[0]?.name?.value}`);
		}
	}

	if (isServer) {
		// No fetch during server render: a miss renders the "not loaded" state
		// and the client subscription loads the value after hydration
		if (result.value === null && process.env.NODE_ENV !== 'production') {
			warnAboutCacheMiss(vm, operation, preFetched, prefetchContext);
		}
		return { result, loading, error };
	}

	const getVariables = typeof variables === 'function' ? variables : () => variables;
	const { subscription } = watchApolloOperation({
		client: apollo,
		operation,
		commonVars,
		getVariables,
		watchVariables: (getter, callback) => watch(getter, callback, { deep: true }),
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

	return { result, loading, error };
}
