import promotionEnabledQuery from '@/graphql/query/promotionEnabled.graphql';
import * as types from '@/store/mutation-types';
import { isWithinRange } from 'date-fns';

export default apollo => {
	const initialState = {
		holidayModeEnabled: false,
		promotionalBannerEnabled: false,
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
							commit(types.DETERMINE_HOLIDAY_MODE_ENABLED, {
								enabled: data.holiday_enabled.value === 'true',
								startTime: new Date(data.holiday_start_time.value),
								endTime: new Date(data.holiday_end_time.value)
							});
							commit(types.DETERMINE_PROMOTION_ENABLED, {
								enabled: data.promo_enabled.value === 'true',
								startTime: new Date(data.promo_start_time.value),
								endTime: new Date(data.promo_end_time.value)
							});
							resolve();
						}).catch(() => resolve());
				});
			},
		},
		mutations: {
			[types.DETERMINE_PROMOTION_ENABLED](state, { enabled, startTime, endTime }) {
				state.promotionalBannerEnabled = enabled && isWithinRange(new Date(), startTime, endTime);
			},
			[types.DETERMINE_HOLIDAY_MODE_ENABLED](state, { enabled, startTime, endTime }) {
				state.holidayModeEnabled = enabled && isWithinRange(new Date(), startTime, endTime);
			},
		}
	};
};
