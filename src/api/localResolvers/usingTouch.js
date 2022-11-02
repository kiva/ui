import query from '@/graphql/mutation/updateUsingTouch.graphql';
/*
 * UsingTouch resolvers
 */
export default () => {
	return {
		defaults(cache) {
			const usingTouch = false;

			cache.writeQuery({
				query,
				usingTouch,
			});

			return usingTouch;
		},
		typePolicies: {
			Mutation: {
				updateUsingTouch(_, { usingTouch = false }, context) {
					context.cache.writeQuery({
						query,
						data: { usingTouch }
					});
					return null;
				},
			},
		},
	};
};
