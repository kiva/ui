import query from '@/graphql/query/shared/usingTouchClient.graphql';
/*
 * UsingTouch resolvers
 */
export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query,
				data: { usingTouch: false },
			});
		},
		typePolicies: {
			Mutation: {
				updateUsingTouch(_, { usingTouch = false }, context) {
					context.cache.writeQuery({
						query,
						data: { usingTouch }
					});
					return true;
				},
			},
		},
	};
};
