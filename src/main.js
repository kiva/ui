import Vue from 'vue';
import numeral from 'numeral';
import { sync } from 'vuex-router-sync';

import App from './App';
import createRouter from './router';
import createStore from './store';

Vue.config.productionTip = false;

Vue.filter('numeral', (value, format = '0') => numeral(value).format(format));

export default function createApp() {
	const router = createRouter();
	const store = createStore();

	sync(store, router);

	const app = new Vue({
		router,
		store,
		render: h => h(App),
	});

	return { app, router, store };
}
