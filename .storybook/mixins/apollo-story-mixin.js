export default ({
	queryResult = {},
	mutationResult = {},
	fragmentResult = null,
	loading = false,
} = {}) => {
	// Add to basket button expects basketAddInterstitial
	const queryData = { ...queryResult, data: { ...queryResult.data, basketAddInterstitial: {} } };

	return {
		provide: {
			apollo: {
				mutate() {
					return loading ? new Promise(() => {}) : Promise.resolve(mutationResult);
				},
				readQuery() {
					return queryData;
				},
				watchQuery() {
					return {
						subscribe: ({ next }) => { next(queryData); }
					};
				},
				query() {
					return loading ? new Promise(() => {}) : Promise.resolve(queryData);
				},
				readFragment() {
					return fragmentResult;
				},
			},
		}
	};
};
