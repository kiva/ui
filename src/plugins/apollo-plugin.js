import checkInjections from '#src/util/injectionCheck';
import getOperationVariables from '#src/util/operationVariables';
import logReadQueryError from '#src/util/logReadQueryError';
import watchApolloOperation from '#src/util/watchApolloOperation';
import { parseLazy, observeLazyOperation } from '#src/util/lazyApolloOperation';

const injections = ['apollo', 'cookieStore'];

function setupWatchQuery(vm, operation, commonVars) {
	const { variables = () => {}, result = () => {} } = operation;

	watchApolloOperation({
		client: vm.apollo,
		operation,
		commonVars,
		getVariables: () => variables.call(vm),
		watchVariables: (getVariables, callback) => vm.$watch(getVariables, callback, { deep: true }),
		next: apolloResult => result.call(vm, apolloResult),
	});
}

// install method for plugin
export default app => {
	app.mixin({
		created() {
			if (this.$options.apollo) {
				checkInjections(this, injections);

				// Get common variable inputs for all queries
				const commonVars = { cookieStore: this.cookieStore, route: this.$route };

				// $options.apollo is either a single object or an array of objects
				const operations = Array.isArray(this.$options.apollo) ? this.$options.apollo : [this.$options.apollo];

				this.lazyOperations = [];

				// Load data for each query in the component
				for (let i = 0; i < operations.length; i += 1) {
					const operation = operations[i];
					const {
						query,
						preFetch,
						shouldPreFetch = true,
						preFetchVariables = () => { },
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
									variables: getOperationVariables(query, commonVars, preFetchVariables({
										...commonVars,
										client: this.apollo,
									})),
								});

								if (data !== null) {
									result.call(this, { data });
								}
							} catch (e) {
								// if there's an error, skip reading from the cache and just wait for the watch query
								logReadQueryError(e, `ApolloMixin ${query?.definitions?.[0]?.name?.value}`);
							}
						}

						const lazyConfig = parseLazy(operation.lazy);
						if (lazyConfig && !preFetched) {
							this.lazyOperations.push({ operation, lazyConfig, commonVars });
						} else if (typeof window !== 'undefined') {
							setupWatchQuery(this, operation, commonVars);
						}
					}
				}
			}
		},
		mounted() {
			if (!this.lazyOperations?.length) return;

			this.lazyObservers = [];

			for (let i = 0; i < this.lazyOperations.length; i += 1) {
				const { operation, lazyConfig, commonVars } = this.lazyOperations[i];

				const observer = observeLazyOperation({
					instance: this,
					lazyConfig,
					start: () => setupWatchQuery(this, operation, commonVars),
					label: `apollo-plugin ${this.$options.name}`,
				});
				if (observer) {
					this.lazyObservers.push(observer);
				}
			}
		},
		beforeUnmount() {
			if (this.lazyObservers) {
				this.lazyObservers.forEach(obs => obs.disconnect());
			}
		},
	});
};
