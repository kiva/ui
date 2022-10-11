import showTipMessageQuery from '@/graphql/mutation/tipMessage/showTipMessage.graphql';
import closeTipMessageQuery from '@/graphql/mutation/tipMessage/closeTipMessage.graphql';
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
					context.cache.writeQuery({
						query: showTipMessageQuery,
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
					context.cache.writeQuery({
						query: closeTipMessageQuery,
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
