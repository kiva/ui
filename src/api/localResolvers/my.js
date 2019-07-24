export default ({ kvAuth0 }) => {
	return {
		resolvers: {
			My: {
				lastLoginTimestamp() {
					return kvAuth0.getLastLogin();
				}
			},
		},
	};
};
