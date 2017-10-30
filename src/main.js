import Vue from 'vue';
import numeral from 'numeral';
import { sync } from 'vuex-router-sync';

import App from './App';
import createRouter from './router';
import createStore from './store';

Vue.config.productionTip = false;

Vue.filter('numeral', (value, format = '0') => numeral(value).format(format));

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp() {
	const store = createStore();
	const router = createRouter();

	sync(store, router);

	const app = new Vue({
		router,
		store,
		render: h => h(App),
	});

	return { app, router, store };
}
