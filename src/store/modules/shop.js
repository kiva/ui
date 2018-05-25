import basketCountQuery from '@/graphql/query/basketCount.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	const initialState = {
		headerItemCount: 0,
		totals: {
			redemptionCodeAvailableTotal: 0,
		}
	};

	return {
		state: initialState,
		getters: {},
		actions: {
			getHeaderBasketCount({ commit }) {
				return new Promise(resolve => {
					apollo.query({ query: basketCountQuery })
						.then(result => result.data.shop)
						.then(shop => {
							commit(types.SET_HEADER_BASKET_COUNT, { count: shop.headerItemCount });
							commit(types.SET_BASKET_TOTALS, { totals: shop.basket.totals });
							resolve();
						}).catch(() => resolve());
				});
			},
		},
		mutations: {
			[types.SET_HEADER_BASKET_COUNT](state, { count }) {
				state.headerItemCount = count;
			},
			[types.SET_BASKET_TOTALS](state, { totals }) {
				Object.assign(state.totals, totals);
			}
		}
	};
};
