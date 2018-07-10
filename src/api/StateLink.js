import { withClientState } from 'apollo-link-state';

export default ({ cache }) => {
	return withClientState({
		cache,
		defaults: {
			usingTouch: false,
			tipMsg: '',
			tipMsgType: 'info',
			tipVisible: false,
			tipPersist: false,
			tipInitUrl: ''
		},
		resolvers: {
			Mutation: {
				updateUsingTouch(_, { usingTouch }, context) {
					context.cache.writeData({
						data: { usingTouch }
					});
					return null;
				},
				updateTipMessage(_, {
					tipMsg,
					tipMsgType,
					tipVisible,
					tipPersist,
					tipInitUrl
				}, context) {
					context.cache.writeData({
						data: {
							tipMsg,
							tipMsgType,
							tipVisible,
							tipPersist,
							tipInitUrl
						}
					});
					return null;
				}
			}
		},
	});
};
