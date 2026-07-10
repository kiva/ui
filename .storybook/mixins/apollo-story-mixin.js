export default ({
	queryResult = {},
	mutationResult = {},
	fragmentResult = null,
	loading = false,
	// Named operations that should stay pending while everything else resolves.
	// Lets a story show e.g. a loaded parent with still-loading child queries.
	loadingQueries = [],
} = {}) => {
	// Add to basket button expects basketAddInterstitial
	const queryData = { ...queryResult.data, data: { ...queryResult.data, basketAddInterstitial: {} } };

	const isQueryLoading = query => loading || loadingQueries.includes(query?.definitions?.[0]?.name?.value);

	return {
		provide: {
			apollo: {
				mutate() {
					return loading ? new Promise(() => { }) : Promise.resolve(mutationResult);
				},
				readQuery() {
					return queryData;
				},
				watchQuery({ query } = {}) {
					return {
						// Handle both Apollo Observable subscribe signatures:
						//   subscribe({ next, error, complete })  — observer object
						//   subscribe(nextFn, errorFn, completeFn) — positional
						// kv-shop's `watchShopQuery` wraps the observable and re-calls
						// subscribe positionally, so the mock must accept both forms.
						subscribe: (...args) => {
							const next = typeof args[0] === 'function' ? args[0] : args[0]?.next;
							if (typeof next === 'function' && !isQueryLoading(query)) {
								next(queryData);
							}
							return { unsubscribe: () => {} };
						},
						setVariables() {},
					};
				},
				query({ query } = {}) {
					return isQueryLoading(query) ? new Promise(() => { }) : Promise.resolve(queryData);
				},
				readFragment() {
					return fragmentResult;
				},
			},
		}
	};
};
