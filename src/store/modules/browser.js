import * as types from '@/store/mutation-types';

export default () => {
	return {
		state: {
			usingTouch: false,
		},
		getters: {},
		actions: {
			detectBrowserAbility({ commit }) {
				window.addEventListener('touchstart', function onFirstTouch() {
					commit(types.SET_TOUCH_USAGE, { usingTouch: true });
					window.removeEventListener('touchstart', onFirstTouch);
				});
			}
		},
		mutations: {
			[types.SET_TOUCH_USAGE](state, { usingTouch }) {
				state.usingTouch = usingTouch;
			},
		},
	};
};
