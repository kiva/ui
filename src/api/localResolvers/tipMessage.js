import showTipMessageQuery from '@/graphql/mutation/tipMessage/showTipMessage.graphql';
import closeTipMessageQuery from '@/graphql/mutation/tipMessage/closeTipMessage.graphql';
/*
 * TipMessage resolvers
 */
export default () => {
	return {
		defaults(cache) {
			const tip = {
				message: '',
				persist: false,
				type: '',
				visible: false,
				__typename: 'TipMessage',
			};

			cache.writeQuery({
				showTipMessageQuery,
				tip,
			});

			return tip;
		},
		typePolicies: {
			Mutation: {
				showTipMessage(_, {
					message = '', persist = false, type = '', visible = true
				}, context) {
					context.cache.writeQuery({
						query: showTipMessageQuery,
						data: {
							tip: {
								message,
								persist,
								type,
								visible,
								__typename: 'TipMessage',
							},
						},
					});
					return true;
				},
				closeTipMessage(_, { visible = false }, context) {
					context.cache.writeQuery({
						query: closeTipMessageQuery,
						data: {
							tip: {
								visible,
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
