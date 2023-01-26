export default ({
	queryResult = {},
	mutationResult = {},
	fragmentResult = {},
	loading = false,
} = {}) => ({
	provide: {
		apollo: {
			mutate() {
				return loading ? new Promise(() => {}) : Promise.resolve(mutationResult);
			},
			readQuery() {
				return queryResult.data;
			},
			watchQuery() {
				return {
					subscribe: ({ next }) => { next(queryResult); }
				};
			},
			query() {
				return loading ? new Promise(() => {}) : Promise.resolve(queryResult);
			},
			readFragment() {
				return fragmentResult
			},
		},
	}
});
