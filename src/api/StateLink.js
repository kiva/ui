import { withClientState } from 'apollo-link-state';

export default ({ cache }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: null,
			tipMsgType: 'info',
			tipVisible: false
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateTipMessage(_, { tipMsg, tipMsgType, tipVisible }, context) {
					context.cache.writeData({
						data: { tipMsg, tipMsgType, tipVisible }
					});
					return null;
				}
			}
		},
	});
};
