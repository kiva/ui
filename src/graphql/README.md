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

Prefetching runs over the whole component tree below the matched route. A component that registers its children in a `components` option is followed through that option, and a `<script setup>` component, which cannot register them, has its imported children attached by the build step instead — so the authoring style does not decide whether a prefetching component below it is reached. Only the Options API can author an `apollo` block, so a `<script setup>` component fetches through a composable instead — `useApolloQuery` with an exported `preFetchOperations`, covered under "Composable Data Fetching" below. See "How it works" there for what discovery does and does not reach.

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

A composable that owns a query for state the initial render needs declares it as a registered operation and reads it with `useApolloQuery`. Mutations and fetches triggered by user actions keep using the injected apollo client directly.

```javascript
import { computed } from 'vue';
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

Nothing else is required: a component prefetches the operations of every composable it imports, and a composable that uses another composable inherits its operations the same way.

`useApolloQuery(operation, variables)` must be called during `setup()`. It returns three refs:

- `result`: the query data, `null` until it has been read.
- `loading`: true until the first read or fetch settles.
- `error`: a transport error or the operation's GraphQL `errors` array, when one occurred. Nothing is logged or handled automatically on the read path: transport errors are already logged and retried at the apollo link layer, and GraphQL errors rendering as no data is by design. Read the ref if the caller needs to react.

Derive state from `result` and `loading` so "not loaded yet" stays representable, and never initialize a ref to a guessed value to cover the load window.

### Operation options

A registered operation takes the same options as a component `apollo` block operation (see the component sections above), with the same meanings, run by the same implementation: `preFetchVariables` and `shouldPreFetch` are evaluated with the same context both kinds get, `errorHandlers` run at prefetch time, and `fetchPolicy` applies to the client subscription. The complete list of differences:

- Registration replaces `preFetch: true`: listing an operation in a `preFetchOperations` export opts it in, and an operation that authors its own `preFetch` value keeps it.
- Results come back as the three refs instead of a `result()` callback.
- Client variables are `useApolloQuery`'s second argument instead of a `this`-bound `variables` method: a plain object, or a getter over the composable's own reactive state, re-evaluated into the subscription whenever those values change.
- `lazy` stays component-block-only.

```javascript
import { ref } from 'vue';

const operation = {
	query: myQuery,
	preFetchVariables({ route }) {
		return { id: route.query.id };
	},
	shouldPreFetch(operation, { route }) {
		return !!route.query.id;
	},
};

export const preFetchOperations = [operation];

export default function useMyThing() {
	const id = ref(null);
	const { result } = useApolloQuery(operation, () => ({ id: id.value }));
	return { result, id };
}
```

`preFetchVariables` for a registered operation may only depend on the route and the cookie store: `useApolloQuery` rebuilds those variables to read the prefetched value from the cache, so anything the read path cannot reproduce makes the read miss.

### Warnings from this layer

`[useApolloQuery] SSR cache miss for <operation> in <component>` (dev only) means the render needed a value the prefetch did not load. The page renders the "not loaded" state and the client loads the value after hydration. The message names one of two causes:

- *Not attached to the component*: the operation is missing from its composable's `preFetchOperations` export, or the transform cannot see the import because the composable is imported dynamically or resolves outside `src/composables/`. If the operation is intentionally not prefetched, author that on the operation (`shouldPreFetch`, or `preFetch: false`); the warning is suppressed for operations that opted out.
- *Prefetched, but the cache read missed*: the prefetch wrote the value with variables the read could not rebuild (keep `preFetchVariables` to route and cookie store inputs), or the prefetch response carried GraphQL errors and left an incomplete cache entry (check the operation's `errorHandlers` and the server logs).

### How it works

A vite plugin (`build/prefetch-discovery-plugin.js`) rewrites modules in every mode (dev serve, build, vitest, storybook): each compiled component gets the `preFetchOperations` of its statically imported composables attached to its definition, and each composable module merges the exports of the composables it imports into its own export. A component compiles into a main module and, when its script block needs its own transform as a `lang="ts"` block does, a `?vue&type=script` sub-module; whichever holds the imports is the one rewritten, and both export the same definition object. `preFetchAll` prefetches attached operations in the same pass as component `apollo` blocks, deduplicated by identity because operations are module singletons, and a failed prefetch fails the render for both kinds. `useApolloQuery` reads the prefetched value from the cache, never fetches during server render, and subscribes on the client through the same code that serves component blocks (`src/util/watchApolloOperation.js`). Importing a composable counts as using it: a component prefetches an imported composable's operations even on renders that never call it, and usage invisible to static analysis (dynamically imported composables, runtime-selected operations) is unsupported for SSR.

The same plugin attaches the imported children of a `<script setup>` component to its definition as `__childComponents`, and `getDeepComponents` walks that list alongside the `components` option. A component authored any other way registers the children it renders, so the option already reaches them and nothing is attached. Importing a child counts as rendering it, the same way importing a composable counts as using it: an imported child's queries are prefetched even on renders that never render the child. Children written as dynamic imports (the `defineAsyncComponent(() => import(...))` pattern) are attached as loaders and awaited during the walk, the same treatment registered async components already received, so importing a component lazily still costs a module load during prefetch.

Discovery reaches a child of a `<script setup>` component when the import is statically written and resolves to a `.vue` file in this repo. It does not reach a component re-exported through a `.js` module, or one imported from `@kiva/kv-components` or another prebuilt package. A component that picks its children at runtime through `<component :is>` registers nothing for the walk to follow, so it stays responsible for prefetching what it renders, as `src/pages/ContentfulPage.vue` does.
