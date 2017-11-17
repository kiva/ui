import Vue from 'vue';
import Vuex from 'vuex';

import createApolloClient from '@/api/apollo';
import createMyModule from './modules/my';

Vue.use(Vuex);

export default function createStore() {
	const apolloClient = createApolloClient();

	return new Vuex.Store({
		modules: {
			my: createMyModule(apolloClient),
		},
	});
}
