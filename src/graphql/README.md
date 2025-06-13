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
