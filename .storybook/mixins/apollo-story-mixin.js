export default ({
	queryResult = {},
	mutationResult = {},
	fragmentResult = null,
	loading = false,
} = {}) => {
	// Add to basket button expects basketAddInterstitial
	const queryData = { ...queryResult.data, data: { ...queryResult.data, basketAddInterstitial: {} } };

	return {
		provide: {
			apollo: {
				mutate() {
					return loading ? new Promise(() => { }) : Promise.resolve(mutationResult);
				},
				readQuery() {
					return queryData;
				},
				watchQuery() {
					return {
						// Handle both Apollo Observable subscribe signatures:
						//   subscribe({ next, error, complete })  — observer object
						//   subscribe(nextFn, errorFn, completeFn) — positional
						// kv-shop's `watchShopQuery` wraps the observable and re-calls
						// subscribe positionally, so the mock must accept both forms.
						subscribe: (...args) => {
							const next = typeof args[0] === 'function' ? args[0] : args[0]?.next;
							if (typeof next === 'function' && !loading) {
								next(queryData);
							}
							return { unsubscribe: () => {} };
						},
						setVariables() {},
					};
				},
				query() {
					return loading ? new Promise(() => { }) : Promise.resolve(queryData);
				},
				readFragment() {
					return fragmentResult;
				},
			},
		}
	};
};
