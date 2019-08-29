/* eslint-disable no-underscore-dangle */
import 'babel-polyfill';
import _dropWhile from 'lodash/dropWhile';
import _get from 'lodash/get';
import cookieStore from '@/util/cookieStore';
import KvAuth0, { MockKvAuth0 } from '@/util/KvAuth0';
import userIdQuery from '@/graphql/query/userId.graphql';
import usingTouchMutation from '@/graphql/mutation/updateUsingTouch.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';
import logReadQueryError from '@/util/logReadQueryError';
import createApp from '@/main';
import '@/assets/iconLoader';

const config = window.__KV_CONFIG__ || {};

// Set webpack public asset path based on configuration
__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

// Create auth instance
let kvAuth0;
if (config.auth0.enable) {
	kvAuth0 = new KvAuth0({
		audience: config.auth0.apiAudience,
		clientID: config.auth0.browserClientID,
		domain: config.auth0.domain,
		redirectUri: config.auth0.browserCallbackUri,
		scope: config.auth0.scope,
	});
} else {
	kvAuth0 = MockKvAuth0;
}

// Create the App instance
const {
	app,
	router,
	apolloClient,
} = createApp({
	appConfig: config,
	apollo: {
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

// Extract user id from apollo cache
let userId = null;
try {
	const data = apolloClient.readQuery({
		query: userIdQuery,
		variables: {
			basketId: cookieStore.get('kvbskt'),
		},
	});
	userId = _get(data, 'my.userAccount.id');
} catch (e) {
	// do nothing (leave user id as null)
}

// setup global analytics data
app.$setKvAnalyticsData(userId);

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
			kvAuth0,
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
