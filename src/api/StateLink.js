import { withClientState } from 'apollo-link-state';

export default ({ cache }) => {
	return withClientState({
		cache,
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
				}
			}
		},
	});
};
