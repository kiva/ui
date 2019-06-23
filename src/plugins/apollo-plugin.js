import checkApolloInject from '@/util/apolloInjectCheck';
import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';

// install method for plugin
export default Vue => {
// export default {
	Vue.mixin({
		created() {
			if (this.$options.apollo) {
				checkApolloInject(this);

				const {
					query,
					preFetch,
					preFetchVariables = () => {},
					variables = () => {},
					result = () => {},
				} = this.$options.apollo;

				if (query) {
					// if the query was prefetched, read the data from the cache
					if (preFetch) {
						const basketId = cookieStore.get('kvbskt');
						try {
							const data = this.apollo.readQuery({
								query,
								variables: {
									basketId,
									...preFetchVariables({ route: this.$route }),
								}
							});
							result.call(this, { data });
						} catch (e) {
							// if there's an error, skip reading from teh cache and just wait for the watch query
							logReadQueryError(e);
						}
					}

					if (!this.$isServer) {
						// Setup an observer to watch for changes to the query result
						const observer = this.apollo.watchQuery({
							query,
							variables: variables.call(this)
						});

						// Use Vue's $watch to reactively update the query variables when the component data changes
						// This will cause a new query result to be fetched if it is not available in the cache
						this.$watch(variables, vars => observer.setVariables(vars), { deep: true });

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
