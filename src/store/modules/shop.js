import basketCountQuery from '@/graphql/query/basketCount.graphql';
import * as types from '@/store/mutation-types';

export default apollo => {
	const initialState = {
		headerItemCount: 0
	};

	return {
		state: initialState,
		getters: {},
		actions: {
			getHeaderBasketCount({ commit }) {
				return apollo.query({ query: basketCountQuery })
					.then(result => result.data.shop.headerItemCount)
					.then(count => commit(types.SET_HEADER_BASKET_COUNT, { count }))
					.catch(() => commit(types.SET_HEADER_BASKET_COUNT, { count: 0 }));
			},
		},
		mutations: {
			[types.SET_HEADER_BASKET_COUNT](state, { count }) {
				state.headerItemCount = count;
			},
		}
	};
};
