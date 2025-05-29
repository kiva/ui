/* eslint-disable no-throw-literal */
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './routes';

const DISALLOW_SELECTOR_REGEX = /[;=/]/;

export default async ({ isServer, url }) => {
	const router = createRouter({
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

	// If server-side rendering, handle initial navigation
	if (isServer) {
		// redirect to the resolved url if it does not match the requested url
		const { fullPath } = router.resolve(url);
		if (fullPath !== url) {
			// redirects defined in routes.js use a permanent (301) redirect
			throw { url: fullPath, code: 301 };
		}

		// Set the router's initial location, ignoring any errors about redirection
		router.push(url).catch(() => { });
	}

	// Wait for the router to resolve all async before hooks and async components
	await router.isReady();

	// If server-side rendering and there are no matched routes, throw a 404 error
	if (isServer && !router.currentRoute.value.matched.length) {
		// TODO: Check for + redirect to kiva php app external route
		throw { code: 404 };
	}

	return router;
};
