import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

const DISALLOW_SELECTOR_REGEX = /[;=/]/;

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes,
		scrollBehavior(to, from, savedPosition) {
			if (to.hash && !DISALLOW_SELECTOR_REGEX.test(to.hash)) {
				return { selector: to.hash };
			}
			if (savedPosition) {
				return savedPosition;
			}
			return { x: 0, y: 0 };
		}
	});
}
