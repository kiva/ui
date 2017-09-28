import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '@/pages/HomePage';
import PageTwo from '@/pages/PageTwo';

Vue.use(Router);

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes: [
			{ path: '/', component: HomePage }, // () => import('@/pages/HomePage') },
			{ path: '/two', component: PageTwo },
		],
	});
}
