/*
 * Add to Basket Interstitial resolvers
 */
export default () => {
	return {
		defaults: {
			basketAddInterstitial: {
				active: false,
				visible: false,
				loanId: 0,
				__typename: 'BasketAddInterstitial',
			}
		},
		resolvers: {
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

					context.cache.writeData({
						data,
					});

					return data;
				},
			},
		},
	};
};
