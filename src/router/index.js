import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './routes';

const DISALLOW_SELECTOR_REGEX = /[;=/]/;

export default ({ isServer }) => createRouter({
	history: isServer ? createMemoryHistory() : createWebHistory(),
	routes,
	scrollBehavior(to, _from, savedPosition) {
		if (to.hash && !DISALLOW_SELECTOR_REGEX.test(to.hash)) {
			return { el: to.hash, behavior: 'smooth' };
		}
		if (savedPosition) {
			return savedPosition;
		}
		// Enables the ability to disable scroll on navigation, such as when changing the query string for
		// filtering. Pushed route requires the name property for the Vue Router to pass along the params.
		if (to?.query?.noScroll?.toLowerCase() === 'true') {
			return;
		}
		return { left: 0, top: 0 };
	}
});
