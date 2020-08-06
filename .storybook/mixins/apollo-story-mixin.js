export default {
	provide: {
		federation: {
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
