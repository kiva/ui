export default {
	provide: {
        apollo: {
			mutate() {
				return Promise.resolve({});
			},
			watchQuery() {
				return {
					subscribe() {}
				}
			},
			query() {
				return Promise.resolve({});
            },
            readFragment() {
                return {}
            }

		},
	}
};
