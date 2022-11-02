import query from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
/*
 * Add to Basket Interstitial resolvers
 */
export default () => {
	return {
		defaults(cache) {
			const data = {
				active: false,
				visible: false,
				loanId: 0,
				__typename: 'BasketAddInterstitial',
			};

			cache.writeQuery({
				query,
				data,
			});

			return data;
		},
		typePolicies: {
			Mutation: {
				updateAddToBasketInterstitial(_, { active = false, visible = false, loanId = 0 }, context) {
					const data = {
						basketAddInterstitial: {
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
