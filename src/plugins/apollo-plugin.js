import checkInjections from '#src/util/injectionCheck';
import logReadQueryError from '#src/util/logReadQueryError';
import { isContentfulQuery } from '#src/util/contentful/isContentfulQuery';
import { createIntersectionObserver } from '#src/util/observerUtils';

const injections = ['apollo', 'cookieStore'];

function parseLazy(lazy) {
	if (!lazy) return null;
	if (lazy === true) return { rootMargin: '500px' };
	const { target, ...options } = lazy;
	return { rootMargin: '500px', ...options, target };
}

function setupWatchQuery(vm, operation, commonVars) {
	const {
		query,
		variables = () => {},
		result = () => {},
		fetchPolicy,
	} = operation;
	const { basketId, isContentfulPreview } = commonVars;

	const observer = vm.apollo.watchQuery({
		query,
		...(fetchPolicy && { fetchPolicy }),
		variables: {
			...(basketId && { basketId }),
			...variables.call(vm),
			...(isContentfulQuery(query) && isContentfulPreview && { preview: true }),
		},
	});

	vm.$watch(variables, vars => observer.setVariables({
		...(basketId && { basketId }),
		...vars,
		...(isContentfulQuery(query) && isContentfulPreview && { preview: true }),
	}), { deep: true });

	observer.subscribe({
		next: apolloResult => result.call(vm, apolloResult),
	});
}

// install method for plugin
export default app => {
	app.mixin({
		created() {
			if (this.$options.apollo) {
				checkInjections(this, injections);

				// Get common variables for all queries
				const basketId = this.cookieStore?.get('kvbskt') ?? null;
				const isContentfulPreview = this.$route?.query?.preview === 'true';

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

						const lazyConfig = parseLazy(operation.lazy);
						const commonVars = { basketId, isContentfulPreview };
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

				const { target: customTarget, ...observerOptions } = lazyConfig;

				// Resolve the observation target: use a custom target ref if provided,
				// otherwise default to this.$el. In Vue 3 fragment components, $el may
				// be a comment/text node — walk siblings to find the first Element.
				let target = customTarget ? this.$refs[customTarget] : this.$el;
				while (target && !(target instanceof Element)) {
					target = target.nextSibling;
				}
				if (!target) {
					console.warn('[apollo-plugin] No Element found for IntersectionObserver in', this.$options.name);
					setupWatchQuery(this, operation, commonVars);
				} else {
					const observer = createIntersectionObserver({
						targets: [target],
						options: observerOptions,
						callback: entries => {
							entries.forEach(entry => {
								if (entry.intersectionRatio > 0) {
									setupWatchQuery(this, operation, commonVars);
									observer.disconnect();
								}
							});
						},
					});

					if (observer) {
						this.lazyObservers.push(observer);
					} else {
						// IntersectionObserver not supported — fall back to immediate setup
						setupWatchQuery(this, operation, commonVars);
					}
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
