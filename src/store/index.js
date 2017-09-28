import Vue from 'vue';
import Vuex from 'vuex';

import my from './modules/my';

Vue.use(Vuex);

export default function createStore() {
	return new Vuex.Store({
		modules: {
			my,
		},
	});
}
