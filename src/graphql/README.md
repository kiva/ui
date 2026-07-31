## Component Data Fetching

### Working with the apollo object

Including the `apollo` block within your component allows access to graphql query and mutation operations during component initialization. By default the query will occur as part of the created hook as defined in the apollo-plugin.js file. We can also activate a `prefetch` mode to request data prior to the created hook. When using `preFetch`, understand that the `this` object is not populated or available so variables must be populated directly.

In all cases, we must `inject` the `apollo` and `cookieStore` objects into our component.

```javascript
export default {
	inject: ['apollo', 'cookieStore'],
}
```

A basic query performed during the `created` hook looks like this:
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: myQueryName,
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

When a query requires variables, we can define a `variables` function that returns the necessary variables for the query. This function will be called before the query is executed, with the `this` context of the component, allowing access to component data and methods.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: myQueryName,
		variables() {
			return { id: this.myId };
		},
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

### Prefetching graphql data

When prefetching data on the server is required, we must add the `preFetch` property to our `apollo` object. There are a couple of ways to set this up, depending on the complexity of the data fetching requirements.

A basic query setup, will add the `preFetch: true` property, assign a the `query` field, then use the `result` object to extract and assign your data.
```javascript
export default {
	inject: ['apollo'],
	apollo: {
		preFetch: true,
		query: myQueryName,
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

For queries that require variables, we can define a `preFetchVariables` function that returns the necessary variables for the prefetch query. This function will be called before the prefetch query is executed, with an argument containing the apollo client and additional data such as the current route.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: myQueryName,
		preFetch: true,
		preFetchVariables({ route }) {
			return { id: route.query.id };
		},
		variables() {
			return { id: this.$route.query.id };
		},
		result({ data }) {
			this.myVar = data?.someProperty;
		},
	}
}
```

We can also define a `shouldPreFetch` function to conditionally determine if the prefetch should occur. This function receives the operation and preFetch arguments as parameters, allowing for more control over when the prefetching should take place.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: strategicPartnerLoginInfoByPageIdQuery,
		preFetch: true,
		shouldPreFetch(operation, { route }) {
			const pageId = route.query.partnerContentId;
			return !!pageId; // Only prefetch if pageId exists
		},
		preFetchVariables({ route }) {
			return { pageId: route.query.partnerContentId ?? '' };
		},
		variables() {
			return { pageId: this.$route.query.partnerContentId ?? '' };
		}
		result({ data }) {
			const spLoginInfo = data?.strategicPartnerLoginInfoByPageId;
			const logo = spLoginInfo?.contentful?.entry?.fields?.primaryLogo;
			this.fetchedLogoUrl = logo?.fields?.file?.url || '';
			this.fetchedLogoAltText = logo?.fields?.title || '';
		}
	}
}
```

We can gain even more control and chain multiple graphql operations by utilizing a `preFetch` function. This function is called with the current operation, the apollo client, and additional context such as the current route. This allows for complex prefetching scenarios where multiple queries can be executed in sequence or in parallel. If the `query` option is not defined, the `result` method will not be called, and we must handle the results manually in the `created` hook instead.

Note: In the example below the use of the try/catch block, logReadQueryError and the usage of route and or cookieStore off of the preFetch context.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { route }) {
			const pageId = route?.query?.partnerContentId;
			if (!pageId) {
				return Promise.resolve();
			}
			return client.query({
				query: strategicPartnerLoginInfoByPageIdQuery,
				variables: { pageId: route.query.partnerContentId ?? '' }
			});
		},
	},
	created() {
		try {
			const partnerContentData = this.apollo.readQuery({
				query: strategicPartnerLoginInfoByPageIdQuery,
				variables: { pageId: this.$route.query.partnerContentId ?? '' }
			});
			const spLoginInfo = partnerContentData?.strategicPartnerLoginInfoByPageId;
			const logo = spLoginInfo?.contentful?.entry?.fields?.primaryLogo;
			this.fetchedLogoUrl = logo?.fields?.file?.url || '';
			this.fetchedLogoAltText = logo?.fields?.title || '';
		} catch (e) {
			logReadQueryError(e, 'RegisterSocial strategicPartnerLoginInfoByPageIdQuery');
		}
	}
}
```

### Handling preFetch errors

If errors occur during preFetching, we can handle them by defining error handler methods within the `errorHandlers` object of the `apollo` block, but if the component is using a custom preFetch function the error handling must be done within that function. The keys of this object should match the error codes that the handlers are intended to catch. The error handler methods will receive the error object as an argument, as well as the same context as the `preFetch` function.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch: true,
		query: myQueryName,
		result({ data }) {
			this.myVar = data?.someProperty;
		},
		errorHandlers: {
			SOME_ERROR_CODE({ graphQLErrors, route }) {
				console.error('An error occurred during prefetch:', graphQLErrors[0]);
				// Handle the error, e.g., show a notification or redirect
				return Promise.reject({ url: '/redirect-url' });
			}
		}
	}
}
```

If an error occurs during preFetch and no error handler is defined, a warning will be logged to the console containing the error code and message: "Warning: No error handler for error code 'ERROR_CODE': error message".

### Lazy loading queries

When a component is rendered below the fold, we can defer its query until the component is near the viewport by adding the `lazy` option. This avoids fetching data the user may never scroll to.

A basic lazy query uses `lazy: true`, which defers the query until the component's root element is within 500px of the viewport:
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		lazy: true,
		query: myQueryName,
		variables() {
			return { id: this.myId };
		},
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

The `lazy` option also accepts an object to override any `IntersectionObserver` option:
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		lazy: { rootMargin: '200px', threshold: 0.5 },
		query: myQueryName,
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

By default the observer watches the component's root element (`$el`). To observe a different element, pass a `target` string matching a template `ref`:
```html
<template>
	<div>
		<p>Always visible content</p>
		<div ref="lazySection">
			<!-- content populated by lazy query -->
		</div>
	</div>
</template>
```
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: {
		lazy: { target: 'lazySection' },
		query: myQueryName,
		result({ data }) {
			this.myVar = data?.someProperty;
		}
	}
}
```

When combined with `preFetch: true`, the lazy option is automatically skipped if the data was already prefetched on the server and the watch query is set up immediately with no unnecessary observer. If the prefetch did not run (e.g. `shouldPreFetch` returned `false`), the lazy behavior applies as normal.

The plugin handles cleanup automatically: all intersection observers are disconnected in `beforeUnmount`. If `IntersectionObserver` is not supported by the browser, the query falls back to executing immediately.

### Multiple queries

When multiple queries are required, we can define the apollo option as an array of objects, each containing a `query` and `result` method, and other options as described above. This allows us to perform multiple queries in a single component, and independently handle prefetching and results for each query.
```javascript
export default {
	inject: ['apollo', 'cookieStore'],
	apollo: [
		{
			query: myQueryName1,
			result({ data }) {
				this.myVar1 = data?.someProperty1;
			}
		},
		{
			query: myQueryName2,
			result({ data }) {
				this.myVar2 = data?.someProperty2;
			}
		}
	]
}
```

During prefetching, all queries will be executed in parallel, and the result methods will be called in the order they are defined. This allows for efficient data fetching and handling of multiple queries within a single component.

## Composable Data Fetching

Composables must not fetch render state through the apollo client directly. A composable that owns a query feeding render state declares it as a registered operation and reads it through `useApolloQuery`. The layer covers render-state queries; imperative on-demand fetches and mutations have no layer helpers.

```javascript
import useApolloQuery from '#src/composables/useApolloQuery';
import myQuery from '#src/graphql/query/myQuery.graphql';

const operation = { query: myQuery };

// Exporting an operation here registers it: every component that imports this
// composable prefetches it
export const preFetchOperations = [operation];

export default function useMyThing() {
	const { result, loading, error } = useApolloQuery(operation);
	const myValue = computed(() => result.value?.someProperty ?? null);
	return { myValue, loading, error };
}
```

`useApolloQuery` must be called during `setup()`. It returns three refs:

- `result` — the query data, `null` until it has been read.
- `loading` — true until the first fetch settles. Reflects real fetch state, never a guessed default.
- `error` — a transport error or the operation's GraphQL `errors` array, when one occurred. Nothing is logged or handled automatically on the read path: transport errors are already logged and retried at the apollo link layer, and GraphQL errors rendering as no-data is by design — read the ref if the caller needs to react.

Derive state from `result`/`loading` so "not loaded yet" stays representable. Never initialize a ref to a guessed value to cover the load window — that conflation of "unknown" with a real value is the bug class this layer exists to prevent.

### How composable operations are prefetched

A query belongs to the component that needs it, regardless of where it is declared — composable operations ride the same prefetch as component `apollo` blocks:

1. **Registration** happens by export: the composable module creates its operations once, at module evaluation, and registers them by listing them in an authored `preFetchOperations` export. Registration is the prefetch opt-in, so `preFetch: true` is applied automatically at collection (an explicit authored flag still wins) and `shouldPreFetch` remains the contextual gate. A module authors only its own operations; composables it uses contribute theirs automatically (see Attachment), so the full surface emerges by composition.
2. **Attachment**: a vite transform (`build/composable-operations-plugin.js`) rewrites every compiled component module whose static imports resolve into `src/composables/`, attaching the union of the imported modules' `preFetchOperations` to the component definition, static data on the definition, adjacent to `apollo`. It also rewrites composable modules that import other composables, merging the imported surfaces into the module's own `preFetchOperations` export, so composition needs no re-export authoring. The same transform runs in dev serve, build, vitest, and storybook, for both the server and client environments, so no mode has a different mechanism and nothing can go stale: each rewritten module's output depends only on its own source, making the module both the unit of analysis and the unit of invalidation.
3. **Prefetch**: `preFetchAll` collects the `apollo` blocks and the attached operations of the definitions it walks, dedupes attached operations by identity (they are module singletons shared by every importer), and executes everything in one parallel pass before render with identical options, identical variables, and identical failure behavior: a failed prefetch fails the render for both kinds. Client-side navigations prefetch the attached operations of activated components exactly like component blocks; a navigation that activates nothing fetches nothing.
4. **Server cache miss**: `useApolloQuery` never fetches during render. A miss warns in dev (see below), renders the representable "not loaded" state, and the client `watchQuery` subscription loads the value after hydration. The fix for a miss is fixing the prefetch, not compensating during render. Usage invisible to static analysis (dynamically imported composables, runtime-selected operations) is therefore unsupported for SSR.

Importing a composable counts as using it: a component that imports one prefetches its operations even on renders that never exercise them. Vue's convention of calling composables unconditionally at the top of `setup()` makes the difference rare, and the semantics match the static child-component walk that component `apollo` blocks already get.

### Composable operation options

Registered operations take the same options as component `apollo` blocks (see the component sections above), treated the same way: `shouldPreFetch` is evaluated by the prefetcher with the same context both kinds get (`cookieStore`, `device`, `kvAuth0`, `renderConfig`, `route`), and opting out skips the server prefetch, suppresses the cache-miss warning, and leaves loading to the client subscription; `errorHandlers` run at prefetch time, exactly as for component operations; `fetchPolicy` applies to the client `watchQuery` subscription. Composable authors never write `preFetch: true`: registration itself is the opt-in, and the flag is applied automatically. The one capability difference is `lazy` (the IntersectionObserver-deferred fetch), which remains component-block-only.

Declaratively-defined operations are written to and read from the cache with identical variables — the apollo plugin, the prefetcher, and `useApolloQuery` all build them with the same shared helper (`#src/util/operationVariables`). Manual `preFetch` functions in component blocks build their own variables and sit outside that guarantee. Divergent variables are usually harmless because apollo cache keys derive from a field's own arguments, so unused variables never enter a key — but a registered operation must not declare variables the read path cannot reproduce.

```javascript
const operation = {
	query: myQuery,
	preFetchVariables({ route }) {
		return { id: route.query.id };
	},
	shouldPreFetch(operation, { route }) {
		return !!route.query.id;
	},
};
```

`preFetchVariables` for a registered operation may only depend on the route and cookie store, since those are what the composable can reproduce when reading.

### Warnings from this layer

- `[useApolloQuery] SSR cache miss for <operation> in <component>` (dev only): the prefetch did not load a value the render needs, and the page renders the "not loaded" state (the client loads it after hydration). The message names the failure. *Not attached to the component* means the operation is not registered in the module's `preFetchOperations` export, or the transform could not see the import (an analysis-invisible usage). *The prefetch ran but the cache read missed* means the operation was attached and executed but was written with different variables than the read built. Fix the prefetch; do not compensate in the component.

## Server Rendering Scope Rules

The SSR module graph is shared by many requests: production renders run in pooled worker threads, and a worker's modules are evaluated once and reused for every request it serves. Module-level state is therefore worker-scoped, not request-scoped. Place state accordingly:

- **Module scope** — only request-invariant data: query documents, pure functions, config-derived memos, registered composable operations and their authored surfaces.
- **Per-request instances** — anything that varies by request or user. The apollo client and `cookieStore` are created per request in `createApp` and provided through the app; new per-request state belongs in the same pattern.
- **Apollo cache** — data that must transfer from server to client. It is serialized into `__APOLLO_STATE__` per request and restored before hydration.

Never store request or user data in module scope — it leaks across requests on a shared worker.
