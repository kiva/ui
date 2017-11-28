import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import createStore from '@/store';
import kivaPlugins from '@/plugins';

Vue.config.productionTip = false;

Vue.use(kivaPlugins);

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp({ apollo = {} } = {}) {
	const apolloClient = createApolloClient(apollo);
	const store = createStore({ apolloClient });
	const router = createRouter();

	sync(store, router);

	const app = new Vue({
		router,
		store,
		render: h => h(App),
	});

	return {
		app,
		router,
		store,
		apolloClient,
	};
}
