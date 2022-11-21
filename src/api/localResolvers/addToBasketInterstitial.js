import query from '@/graphql/query/basketAddInterstitialClient.graphql';
/*
 * Add to Basket Interstitial resolvers
 */
export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query,
				data: {
					basketAddInterstitial: {
						id: 0,
						active: false,
						visible: false,
						loanId: 0,
						__typename: 'BasketAddInterstitial',
					}
				},
			});
		},
		typePolicies: {
			Mutation: {
				updateAddToBasketInterstitial(_, { active = false, visible = false, loanId = 0 }, context) {
					const data = {
						basketAddInterstitial: {
							id: 0,
							active,
							visible,
							loanId,
							__typename: 'BasketAddInterstitial',
						}
					};

					context.cache.writeQuery({
						query,
						data,
					});

					return data;
				},
			},
		},
	};
};
