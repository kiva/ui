import promotionEnabledQuery from '@/graphql/query/promotionEnabled.graphql';
import * as types from '@/store/mutation-types';
import { isWithinRange } from 'date-fns';

export default apollo => {
	const initialState = {
		promotionalBannerEnabled: false
	};

	return {
		state: initialState,
		getters: {},
		actions: {
			getPromotionEnabled({ commit }) {
				return new Promise(resolve => {
					apollo.query({ query: promotionEnabledQuery })
						.then(result => result.data)
						.then(data => {
							const enabled = data.enabled.value === 'true';
							const startTime = new Date(data.start_time.value);
							const endTime = new Date(data.end_time.value);
							commit(types.DETERMINE_PROMOTION_ENABLED, { enabled, startTime, endTime });
							resolve();
						}).catch(() => resolve());
				});
			},
		},
		mutations: {
			[types.DETERMINE_PROMOTION_ENABLED](state, { enabled, startTime, endTime }) {
				state.promotionalBannerEnabled = enabled && isWithinRange(new Date(), startTime, endTime);
			},
		}
	};
};
