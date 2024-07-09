## Component Data Fetching

### Working with the apollo object

Including the `apollo` block within your component allows access to graphql query and mutation operations during component initialization. By default the query will occur as part of the created hook as defined in the apollo-plugin.js file. We can also activate a `prefetch` mode to request data prior to the created hook. When using `preFetch`, understand that the `this` object is not populated or available so variables must be populated directly.

In all cases, we must `inject` the `apollo` object into our component.

```
export default {
	inject: ['apollo'],
}
```

A basic query performed during the `created` hook looks like this:
```
export default {
	inject: ['apollo'],
	apollo: {
		query: myQueryName,
		results() {
			const myVar = result?.someProperty;
		}
	}
}
```

### Prefetching graphql data

When prefetching data on the server is required, we must add the `preFetch` property to our `apollo` object and decide which mode to work with. There are 2 modes for prefetching server data using the `apollo` object.

1. A basic query setup, will add the `preFetch: true` property, assign a the `query` field, then use the `results` object to extract and assign your data.
```
export default {
	inject: ['apollo'],
	apollo: {
		preFetch: true,
		query: myQueryName,
		results() {
			const myVar = result?.someProperty;
		}
	}
}
```

2. Alternatively, we can gain more control and chain multiple graphql operations by utilizing a `preFetch` function, coupled with a `readQuery` in the created hook. Note: The `results` method isn't called in this case.

Note: In the example below the use of the try/catch block, logReadQueryError and the usage of route and or cookieStore off of the preFetch instance.
```
export default {
	inject: ['apollo'],
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
