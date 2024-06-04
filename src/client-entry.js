/* global UI_TAG */
/* eslint-disable no-underscore-dangle, vue/require-name-property */
import '#src/assets/scss/tailwind/tailwind.css';
import '#src/assets/scss/app.scss';

const config = window.__KV_CONFIG__ || {};

// Set webpack public asset path based on configuration
// __webpack_public_path__ = config.publicPath || '/'; // eslint-disable-line

async function getCookieStore() {
	const { default: CookieStore } = await import('#src/util/cookieStore');
	return new CookieStore();
}

async function getKvAuth0(cookieStore) {
	const { default: KvAuth0, MockKvAuth0 } = await import('#src/util/KvAuth0');
	if (config.auth0.enable) {
		return new KvAuth0({
			audience: config.auth0.apiAudience,
			checkFakeAuth: config.auth0.checkFakeAuth,
			clientID: config.auth0.browserClientID,
			cookieStore,
			domain: config.auth0.domain,
			mfaAudience: config.auth0.mfaAudience,
			redirectUri: config.auth0.browserCallbackUri,
			scope: config.auth0.scope,
		});
	}
	return MockKvAuth0;
}

async function getDevice() {
	const { userAgent } = window.navigator;
	if (!userAgent) {
		return null;
	}
	const { default: Bowser } = await import('bowser');
	return Bowser.getParser(userAgent).parse().parsedResult;
}

async function getLocale() {
	const { getUserLocale } = await import('get-user-locale');
	return getUserLocale();
}

async function getFetch() {
	const { fetch } = await import('whatwg-fetch');
	return fetch;
}

async function getUserId(apolloClient) {
	const { default: userIdQuery } = await import('#src/graphql/query/userId.graphql');
	const result = await apolloClient.query({ query: userIdQuery });
	return result?.data?.my?.userAccount?.id ?? null;
}

async function setupAuthErrorHandling(kvAuth0, apolloClient) {
	const { default: showTipMessage } = await import('#src/graphql/mutation/tipMessage/showTipMessage.graphql');
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
}

async function setupTouchDetection(apolloClient) {
	const { default: usingTouchMutation } = await import('#src/graphql/mutation/updateUsingTouch.graphql');
	// Setup adding touch info to the state
	window.addEventListener('touchstart', function onFirstTouch() {
		apolloClient.mutate({
			mutation: usingTouchMutation,
			variables: { usingTouch: true }
		});
		window.removeEventListener('touchstart', onFirstTouch);
	});
}

async function setupAnalytics(app, apolloClient) {
	const userId = await getUserId(apolloClient);
	await app.$setKvAnalyticsData(userId);
	app.$fireServerPageView();
	app.$fireQueuedEvents();
	const { default: collectWebVitals } = await import('#src/util/webVitals');
	collectWebVitals(app.$kvTrackEvent);
}

async function setupSentry(app, router) {
	const Sentry = await import('@sentry/vue');
	Sentry.init({
		app,
		trackComponents: true,
		dsn: config.sentryURI,
		integrations: [
			new Sentry.BrowserTracing({
				routingInstrumentation: Sentry.vueRouterInstrumentation(router),
				tracingOrigins: [config.host],
			}),
		],
		release: UI_TAG,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: config?.sentryTraceSampleRate,
		beforeSend(event) {
			// make sentry colleted event easy to compare to
			const eventAsString = JSON.stringify(event);
			// match specific 3rd party events for exclusion
			// Skip sending failed to fetch error caused by unhandled promise rejection in google ads
			// Sentry Event Link: https://kiva.sentry.io/issues/4413252219/events/726c65f507684f43b748e913d4793518/
			// This url is unreachable: https://pagead2.googlesyndication.com/pagead/buyside_topics/set/
			if (eventAsString.indexOf('Failed to fetch') !== -1
				&& eventAsString.indexOf('pagead') !== -1) {
				return false;
			}
			// Skip sending failed loads of pX
			if (eventAsString.indexOf("Cannot set property 'PX1065' of undefined") !== -1) {
				return false;
			}
			// Skip sending errors from CefSharp
			// https://forum.sentry.io/t/unhandledrejection-non-error-promise-rejection-captured-with-value/14062/20
			if (eventAsString.indexOf('Object Not Found Matching Id') !== -1) {
				return false;
			}
			// return event otherwise
			return event;
		},
	});
}

function setupClientRouting({
	app, apolloClient, cookieStore, kvAuth0, router
}) {
	// Add router hook for handling asyncData.
	// Doing it after initial route is resolved so that we don't double-fetch
	// the data that we already have. Using router.beforeResolve() so that all
	// async components are resolved.
	router.beforeResolve(async (to, from, next) => {
		const [{ contentfulPreviewCookie }, { authenticationGuard }, { preFetchAll }] = await Promise.all([
			import('#src/util/contentfulPreviewCookie'),
			import('#src/util/authenticationGuard'),
			import('#src/util/apolloPreFetch'),
		]);

		// get newly activated components
		console.log('to', to);
		console.log('from', from);
		// const matched = router.getMatchedComponents(to);
		// const prevMatched = router.getMatchedComponents(from);
		const { matched } = to;
		const prevMatched = from.matched;
		const activated = matched.filter((c, i) => prevMatched[i] !== c);

		contentfulPreviewCookie({ route: to, cookieStore });
		authenticationGuard({ route: to, apolloClient, kvAuth0 })
			.then(() => {
				// Pre-fetch graphql queries from activated components
				return preFetchAll(activated, apolloClient, {
					cookieStore,
					kvAuth0,
					route: to,
				});
			}).then(next).catch(next);
	});

	router.beforeEach((to, from, next) => {
		app.config.globalProperties.$Progress.start(6500);
		next();
	});

	router.afterEach((to, from) => {
		// finish loading
		app.config.globalProperties.$Progress.finish();

		if (!to?.params?.noAnalytics) {
			// fire pageview
			app.$fireAsyncPageView(to, from);
		}
	});

	router.onError(() => app.config.globalProperties.$Progress.fail());
}

async function initApp() {
	const [{ default: createApp }, cookieStore, device, locale, fetch] = await Promise.all([
		import('#src/main'),
		getCookieStore(),
		getDevice(),
		getLocale(),
		getFetch(),
	]);
	const kvAuth0 = await getKvAuth0(cookieStore);

	// Create the App instance
	const {
		app,
		router,
		apolloClient,
	} = createApp({
		appConfig: config,
		apollo: {
			uri: config.graphqlUri,
			types: config.graphqlPossibleTypes,
		},
		cookieStore,
		device,
		kvAuth0,
		locale,
		fetch,
	});

	// Apply Server state to Client Store
	if (window.__APOLLO_STATE__) {
		apolloClient.cache.restore(window.__APOLLO_STATE__);
	}

	setupAuthErrorHandling(kvAuth0, apolloClient);
	setupTouchDetection(apolloClient);

	if (config.enableSentry) {
		setupSentry(app, router);
	}

	if (config.enableAnalytics) {
		setupAnalytics(app, apolloClient);
	}

	// Wait until router has resolved all async before hooks and async components
	await router.isReady();
	setupClientRouting({
		app, apolloClient, cookieStore, kvAuth0, router
	});

	// Mount app in DOM
	app.mount('#app');
}

// Start application once browser is idle
if ('requestIdleCallback' in window) {
	requestIdleCallback(initApp, { timeout: 2000 });
} else {
	setTimeout(initApp, 500);
}
