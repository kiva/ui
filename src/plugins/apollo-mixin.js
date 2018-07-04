export default {
	created() {
		if (this.$options.apollo) {
			if (!this.$options.inject || !this.$options.inject.apollo) {
				throw new Error('No apollo client provided! Add "inject: [\'apollo\']" to this component definition.');
			}

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
					const data = this.apollo.readQuery({
						query,
						variables: preFetchVariables({ route: this.$route }),
					});
					result.call(this, { data });
				}

				const observer = this.apollo.watchQuery({
					query,
					variables: variables.call(this)
				});

				this.$watch(variables, vars => observer.setVariables(vars), { deep: true });

				// Watch for changes in the query results
				observer.subscribe({
					next: apolloResult => result.call(this, apolloResult)
				});
			}
		}
	}
};
