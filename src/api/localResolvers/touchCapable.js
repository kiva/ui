/*
 * TouchCapable resolvers
 */
export default () => {
	return {
		defaults: {
			touchCapable: false,
		},
		resolvers: {
			Mutation: {
				updateTouchCapable(_, { touchCapable }, context) {
					context.cache.writeData({
						data: { touchCapable }
					});
					return null;
				},
			},
		},
	};
};
