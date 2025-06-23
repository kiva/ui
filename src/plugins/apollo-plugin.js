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

				const {
					query,
					preFetch,
					preFetchVariables = () => { },
					variables = () => { },
					result = () => { },
				} = this.$options.apollo;

				if (query) {
					const basketId = this.cookieStore.get('kvbskt');
					const isContentfulPreview = this.$route?.query?.preview === 'true';

					// if the query was prefetched, read the data from the cache
					if (preFetch) {
						try {
							const data = this.apollo.readQuery({
								query,
								variables: {
									basketId,
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
								basketId,
								...variables.call(this),
								...(isContentfulQuery(query) && isContentfulPreview && { preview: true })
							}
						});

						// Use Vue's $watch to reactively update the query variables when the component data changes
						// This will cause a new query result to be fetched if it is not available in the cache
						this.$watch(variables, vars => observer.setVariables({
							basketId,
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
	});
};
