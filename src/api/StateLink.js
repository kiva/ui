import { withClientState } from 'apollo-link-state';

export default ({ cache }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: '',
			tipMsgType: 'info',
			showTipOnLoad: false
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateTipMessage(_, { tipMsg, tipMsgType, showTipOnLoad }, context) {
					context.cache.writeData({
						data: { tipMsg, tipMsgType, showTipOnLoad }
					});
					return null;
				}
			}
		},
	});
};
