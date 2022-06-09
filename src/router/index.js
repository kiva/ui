import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

const DISALLOW_SELECTOR_REGEX = /[;=/]/;

export default function createRouter() {
	return new Router({
		mode: 'history',
		routes,
		scrollBehavior(to, _from, savedPosition) {
			if (to.hash && !DISALLOW_SELECTOR_REGEX.test(to.hash)) {
				const element = document.querySelector(to.hash);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
					return null;
				}
				return { selector: to.hash };
			}
			if (savedPosition) {
				return savedPosition;
			}
			// Enables the ability to disable scroll on navigation, such as when changing the query string for
			// filtering. Pushed route requires the name property for the Vue Router to pass along the params.
			if (to?.params?.noScroll) {
				return;
			}
			return { x: 0, y: 0 };
		}
	});
}
