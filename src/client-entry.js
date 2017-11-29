/* eslint-disable no-underscore-dangle */
import _dropWhile from 'lodash/dropWhile';
import _values from 'lodash/values';
import cookie from 'js-cookie';
import createApp from '@/main';

const config = window.__KV_CONFIG__ || {};

const {
	app,
	router,
	store,
	apolloClient,
} = createApp({
	apollo: {
		uri: config.graphqlUri,
		csrfToken: cookie.get('kvis') && cookie.get('kvis').substr(6),
	}
});

// Apply Server state to Client Store
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
}
if (window.__APOLLO_STATE__) {
	apolloClient.cache.restore(window.__APOLLO_STATE__);
}

// Wait until router has resolved all async before hooks and async components
router.onReady(() => {
	// Add router hook for handling asyncData.
	// Doing it after initial route is resolved so that we don't double-fetch
	// the data that we already have. Using router.beforeResolve() so that all
	// async components are resolved.
	router.beforeResolve((to, from, next) => {
		// get newly activated components
		const matched = router.getMatchedComponents(to);
		const prevMatched = router.getMatchedComponents(from);
		const activated = _dropWhile(matched, (c, i) => prevMatched[i] === c);

		// recursively call asyncData on activated components and their child components
		function callAsyncData({ asyncData, components }) {
			return Promise.all([
				asyncData && asyncData({ store, route: to }),
				components && _values(components).map(callAsyncData)
			]);
		}
		Promise.all(activated.map(callAsyncData)).then(next).catch(next);
	});

	// Mount app in DOM
	app.$mount('#app');
});
