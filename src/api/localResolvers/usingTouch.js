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
						data: { usingTouch }
					});
					return null;
				},
			},
		},
	};
};
