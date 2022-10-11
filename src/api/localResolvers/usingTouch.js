import query from '@/graphql/mutation/updateUsingTouch.graphql';
/*
 * UsingTouch resolvers
 */
export default () => {
	return {
		defaults: {
			usingTouch: false,
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
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
