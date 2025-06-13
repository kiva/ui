import checkInjections from '#src/util/injectionCheck';
import logReadQueryError from '#src/util/logReadQueryError';
import { isContentfulQuery } from '#src/util/contentful/isContentfulQuery';

const injections = ['apollo', 'cookieStore'];

// install method for plugin
export default app => {
	// export default {
	app.mixin({
		created() {
			if (this.$options.apollo) {
				checkInjections(this, injections);

				// Get common variables for all queries
				const basketId = this.cookieStore?.get('kvbskt') ?? null;
				const isContentfulPreview = this.$route?.query?.preview === 'true';

				// $options.apollo is either a single object or an array of objects
				const operations = Array.isArray(this.$options.apollo) ? this.$options.apollo : [this.$options.apollo];

				// Load data for each query in the component
				for (let i = 0; i < operations.length; i += 1) {
					const operation = operations[i];
					const {
						query,
						preFetch,
						shouldPreFetch = true,
						preFetchVariables = () => { },
						variables = () => { },
						result = () => { },
					} = operation;

					if (query) {
						// Check if the query was prefetched
						let preFetched = preFetch && shouldPreFetch;
						if (typeof shouldPreFetch === 'function') {
							preFetched = preFetch && shouldPreFetch(operation, {
								cookieStore: this.cookieStore,
								device: this.device,
								kvAuth0: this.kvAuth0,
								renderConfig: this.$renderConfig,
								route: this.$route,
							});
						}

						// if the query was prefetched, read the data from the cache
						if (preFetched) {
							try {
								const data = this.apollo.readQuery({
									query,
									variables: {
										...(basketId && { basketId }),
										...preFetchVariables({
											cookieStore: this.cookieStore,
											route: this.$route,
											client: this.apollo,
										}),
										/* Adds `preview: true` variable if the query is a contentful query
										and the preview cookie value exists */
										...(isContentfulQuery(query) && isContentfulPreview && { preview: true })
									}
								});

								if (data !== null) {
									result.call(this, { data });
								}
							} catch (e) {
								// if there's an error, skip reading from the cache and just wait for the watch query
								logReadQueryError(e, `ApolloMixin ${query?.definitions?.[0]?.name?.value}`);
							}
						}

						if (typeof window !== 'undefined') {
							// Setup an observer to watch for changes to the query result
							const observer = this.apollo.watchQuery({
								query,
								variables: {
									...(basketId && { basketId }),
									...variables.call(this),
									...(isContentfulQuery(query) && isContentfulPreview && { preview: true })
								}
							});

							// Use Vue's $watch to reactively update the query variables when the component data changes
							// This will cause a new query result to be fetched if it is not available in the cache
							this.$watch(variables, vars => observer.setVariables({
								...(basketId && { basketId }),
								...vars,
								...(isContentfulQuery(query) && isContentfulPreview && { preview: true })
							}), { deep: true });

							// Subscribe to the observer to see each result
							observer.subscribe({
								next: apolloResult => result.call(this, apolloResult)
							});
						}
					}
				}
			}
		}
	});
};
