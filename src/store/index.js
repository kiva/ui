import Vue from 'vue';
import Vuex from 'vuex';

import createMyModule from './modules/my';

Vue.use(Vuex);

export default function createStore({ apolloClient }) {
	return new Vuex.Store({
		modules: {
			my: createMyModule(apolloClient),
		},
	});
}
