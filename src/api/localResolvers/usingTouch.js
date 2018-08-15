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
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
			},
		},
	};
};
