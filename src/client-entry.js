/* eslint-disable no-underscore-dangle, vue/multi-word-component-names */
import '@babel/polyfill';
import { getUserLocale } from 'get-user-locale';
import _dropWhile from 'lodash/dropWhile';
import _get from 'lodash/get';
import Bowser from 'bowser';
import CookieStore from '@/util/cookieStore';
import KvAuth0, { MockKvAuth0 } from '@/util/KvAuth0';
import userIdQuery from '@/graphql/query/userId.graphql';
import usingTouchMutation from '@/graphql/mutation/updateUsingTouch.graphql';
import showTipMessage from '@/graphql/mutation/tipMessage/showTipMessage.graphql';

import { preFetchAll } from '@/util/apolloPreFetch';
import { authenticationGuard } from '@/util/authenticationGuard';
import { contentfulPreviewCookie } from '@/util/contentfulPreviewCookie';
import collectWebVitals from '@/util/webVitals';

import createApp from '@/main';
import '@/assets/iconLoader';

import { fetch } from 'whatwg-fetch';

const config = window.__KV_CONFIG__ || {};

// Set webpack public asset path based on configuration
__webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

// Create cookie store instance
const cookieStore = new CookieStore();

// Create auth instance
let kvAuth0;
if (config.auth0.enable) {
	kvAuth0 = new KvAuth0({
		audience: config.auth0.apiAudience,
		checkFakeAuth: config.auth0.checkFakeAuth,
		clientID: config.auth0.browserClientID,
		cookieStore,
		domain: config.auth0.domain,
		mfaAudience: config.auth0.mfaAudience,
		redirectUri: config.auth0.browserCallbackUri,
		scope: config.auth0.scope,
	});
} else {
	kvAuth0 = MockKvAuth0;
}

// Get device information
const { userAgent } = window.navigator;
const device = userAgent ? Bowser.getParser(userAgent).parse().parsedResult : null;

// Create the App instance
const {
	app,
	router,
	apolloClient,
} = createApp({
	name: '',
	appConfig: config,
	apollo: {
		uri: config.graphqlUri,
		types: config.graphqlFragmentTypes,
	},
	cookieStore,
	device,
	kvAuth0,
	locale: getUserLocale(),
	fetch,
});

// Show a tip message when there is an unhandled auth0 error
kvAuth0.onError(({ eventId, user }) => {
	let message = 'We\'re sorry, something went wrong.';
	if (user) {
		message = `${message} Please log out and try again.`;
	} else {
		message = `${message} Please clear your cookies and try again.`;
	}
	if (eventId) {
		message = `${message} (event id: ${eventId})`;
	}
	apolloClient.mutate({
		mutation: showTipMessage,
		variables: {
			message,
			type: 'error',
			persist: true,
		},
	});
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

// setup global analytics configuration + data
app.$setKvAnalyticsData(userId).then(() => {
	// fire server rendered pageview
	app.$fireServerPageView();
	app.$fireQueuedEvents();
	collectWebVitals(app.$kvTrackEvent);
});

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
		const areRoutesTheSame = JSON.stringify(to?.matched?.[0]?.path) === JSON.stringify(from?.matched?.[0]?.path);
		const areParamsTheSame = JSON.stringify(to?.params) === JSON.stringify(from?.params);
		let activated;
		/** if route is the same but params are different, do not drop matched components this prevents buggy
		 * navigation when client side navigating from route to same route with different params
		 */
		if (areRoutesTheSame && !areParamsTheSame) {
			activated = matched;
		} else {
			activated = _dropWhile(matched, (c, i) => prevMatched[i] === c);
		}

		contentfulPreviewCookie({ route: to, cookieStore });
		authenticationGuard({ route: to, apolloClient, kvAuth0 })
			.then(() => {
				// Pre-fetch graphql queries from activated components
				return preFetchAll(activated, apolloClient, {
					cookieStore,
					kvAuth0,
					route: to,
					device
				});
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

		if (!to?.params?.noAnalytics) {
			// fire pageview
			app.$fireAsyncPageView(to, from);
		}
	});

	router.onError(() => app.$Progress.fail());

	// Mount app in DOM
	app.$mount('#app');
});
