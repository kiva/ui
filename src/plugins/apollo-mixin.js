export default {
	created() {
		if (this.$options.apollo) {
			if (!this.$options.inject || !this.$options.inject.apollo) {
				throw new Error('No apollo client provided! Add "inject: [\'apollo\']" to this component definition.');
			}

			const { query, preFetch, result = () => {} } = this.$options.apollo;

			if (query) {
				// if the query was prefetched, read the data from the cache
				if (preFetch) {
					const data = this.apollo.readQuery({ query });
					result.call(this, { data });
				}

				// Watch for changes in the query results
				this.apollo.watchQuery({ query }).subscribe({
					next: apolloResult => result.call(this, apolloResult)
				});
			}
		}
	}
};
