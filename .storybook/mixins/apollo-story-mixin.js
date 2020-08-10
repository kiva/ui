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
			readQuery() {
				return {}
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
