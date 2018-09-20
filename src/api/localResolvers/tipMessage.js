/*
 * TipMessage resolvers
 */
export default () => {
	return {
		defaults: {
			tip: {
				message: '',
				persist: false,
				type: '',
				visible: false,
				__typename: 'TipMessage',
			},
		},
		resolvers: {
			Mutation: {
				showTipMessage(_, { message = '', persist = false, type = '' }, context) {
					context.cache.writeData({
						data: {
							tip: {
								message,
								persist,
								type,
								visible: true,
								__typename: 'TipMessage',
							},
						},
					});
					return true;
				},
				closeTipMessage(_, data, context) {
					context.cache.writeData({
						data: {
							tip: {
								visible: false,
								__typename: 'TipMessage',
							},
						},
					});
					return true;
				},
			},
		},
	};
};
