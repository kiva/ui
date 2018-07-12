import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes,
		scrollBehavior(to, from, savedPosition) {
			if (to.hash) {
				return { selector: to.hash };
			}
			if (savedPosition) {
				return savedPosition;
			}
			return { x: 0, y: 0 };
		}
	});
}
