/* eslint-disable no-underscore-dangle */
import 'babel-polyfill';
import _dropWhile from 'lodash/dropWhile';
import CookieStore from '@/util/CookieStore';
import KvAuth0 from '@/util/KvAuth0';
import usingTouchMutation from '@/graphql/mutation/updateUsingTouch.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';
import createApp from '@/main';
import '@/assets/iconLoader';

const config = window.__KV_CONFIG__ || {};

// Set webpack public asset path based on configuration
__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

// Create cookie store
const cookieStore = new CookieStore();

// Create auth instance
const kvAuth0 = new KvAuth0({
	clientID: config.auth0ClientID,
	domain: config.auth0Domain,
});

// Create the App instance
const {
	app,
	router,
	apolloClient,
} = createApp({
	appConfig: config,
	apollo: {
		cookieStore,
		csrfToken: cookieStore.has('kvis') && cookieStore.get('kvis').substr(6),
		uri: config.graphqlUri,
		types: config.graphqlFragmentTypes,
	},
	kvAuth0,
});

// Apply Server state to Client Store
if (window.__APOLLO_STATE__) {
	apolloClient.cache.restore(window.__APOLLO_STATE__);
}

// setup global analytics data
app.$setKvAnalyticsData(apolloClient);

// fire server rendered pageview
app.$fireServerPageView();

// Setup adding touch info to the state
window.addEventListener('touchstart', function onFirstTouch() {
	apolloClient.mutate({
		mutation: usingTouchMutation,
		variables: { usingTouch: true }
	});
	window.removeEventListener('touchstart', onFirstTouch);
});

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

		// Pre-fetch graphql queries from activated components
		preFetchAll(activated, apolloClient, {
			route: to,
		}).then(next).catch(next);
	});

	router.beforeEach((to, from, next) => {
		app.$Progress.start(6500);

		// if no routes match our path, force a page refresh to that path
		const matched = router.getMatchedComponents(to);
		if (!matched.length) {
			window.location = to.fullPath;
		} else {
			next();
		}
	});

	router.afterEach((to, from) => {
		// finish loading
		app.$Progress.finish();
		// fire pageview
		app.$fireAsyncPageView(to, from);
	});

	router.onError(() => app.$Progress.fail());

	// Mount app in DOM
	app.$mount('#app');
});
