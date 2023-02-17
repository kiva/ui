import tipMessageDataQuery from '@/graphql/query/tipMessage/tipMessageData.graphql';

/*
 * TipMessage resolvers
 */
export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query: tipMessageDataQuery,
				data: {
					tip: {
						id: 0,
						message: '',
						persist: false,
						type: '',
						visible: false,
						__typename: 'TipMessage',
					}
				},
			});
		},
		resolvers: {
			Mutation: {
				showTipMessage(_, { message = '', persist = false, type = '' }, context) {
					const data = context.cache.readQuery({ query: tipMessageDataQuery });
					context.cache.writeQuery({
						query: tipMessageDataQuery,
						data: {
							tip: {
								...data.tip,
								message,
								persist,
								type,
								visible: true,
							}
						}
					});
					return true;
				},
				closeTipMessage(_, args, context) {
					const data = context.cache.readQuery({ query: tipMessageDataQuery });
					context.cache.writeQuery({
						query: tipMessageDataQuery,
						data: {
							tip: {
								...data.tip,
								visible: false,
							}
						}
					});
					return true;
				},
			},
		},
	};
};
