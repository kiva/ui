/* global UI_TAG */
/* eslint-disable no-underscore-dangle, vue/require-name-property */
import '#src/assets/scss/tailwind/tailwind.css';
import '#src/assets/scss/app.scss';

// Facilitate using sprite icon SVGs in KvIcon
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-store';

const config = window.__KV_CONFIG__ || {};

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

async function getRouter() {
	const { default: createRouter } = await import('#src/router');
	return createRouter({ isServer: false });
}

async function getUserId(apolloClient) {
	const { default: userIdQuery } = await import('#src/graphql/query/userId.graphql');
	const result = await apolloClient.query({ query: userIdQuery });
	return result?.data?.my?.userAccount?.id ?? null;
}

async function hydrateApolloCache(apolloClient) {
	// Gather the state from the server.
	const states = [
		window.__APOLLO_STATE__,
		window.__APOLLO_STATE_ESI__,
	].filter(x => !!x);
	// If no state is available, skip hydration.
	// This can happen if the server didn't render any data.
	if (states.length === 0) {
		return;
	}
	// Apply the merged state to the Apollo cache.
	const { applyStateToCache, mergeStateObjects } = await import('#src/util/apolloCacheUtils');
	applyStateToCache(apolloClient, mergeStateObjects(...states));
}

async function setupApolloCachePersistence(cache) {
	const { persistCache, SessionStorageWrapper } = await import('apollo3-cache-persist');
	await persistCache({
		cache,
		storage: new SessionStorageWrapper(window.sessionStorage),
	});
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
	await app.config.globalProperties.$setKvAnalyticsData(userId);
	app.config.globalProperties.$fireServerPageView();
	app.config.globalProperties.$fireQueuedEvents();
	const { default: collectWebVitals } = await import('#src/util/webVitals');
	collectWebVitals(app.config.globalProperties.$kvTrackEvent);
}

async function setupSentry(app, router) {
	const Sentry = await import('@sentry/vue');
	Sentry.init({
		app,
		dsn: config.sentryURI,
		integrations: [
			Sentry.browserTracingIntegration({
				router,
			}),
			Sentry.vueIntegration({
				tracingOptions: {
					trackComponents: true,
				},
			}),
		],
		release: UI_TAG,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: config?.sentryTraceSampleRate,
		tracePropagationTargets: [config.host],
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
			// Skip Load failed caused by failed fetch calls in 3rd party libraries
			// NOTE: we do see failed loads for our own async modules, this doesn't filter those out
			// Sentry Event Link: https://kiva.sentry.io/issues/3808313433/events/427b92cf47ed4aaeb321caf20783eba0/
			if ((eventAsString.indexOf('Load failed') !== -1
				|| eventAsString.indexOf('Failed to fetch') !== -1
				|| eventAsString.indexOf('TypeError') !== -1)
				&& (
					(eventAsString.indexOf('ct.pinterest') !== -1)
					|| (eventAsString.indexOf('rum.management') !== -1)
				)
			) {
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
		const [{ authenticationGuard }, { preFetchAll }] = await Promise.all([
			import('#src/util/authenticationGuard'),
			import('#src/util/apolloPreFetch'),
		]);

		const { matched } = to;
		const prevMatched = from.matched;
		const activated = matched.filter((c, i) => prevMatched[i] !== c);

		try {
			await authenticationGuard({ route: to, apolloClient, kvAuth0 });
			// Pre-fetch graphql queries from activated components
			await preFetchAll(activated, apolloClient, {
				cookieStore,
				kvAuth0,
				route: to,
			});
			next();
		} catch (error) {
			// pass error through next to ensure redirect to login
			next(error);
		}
	});

	router.beforeEach((to, from, next) => {
		app.config.globalProperties.$Progress.start(6500);
		next();
	});

	router.afterEach((to, from) => {
		// finish loading
		app.config.globalProperties.$Progress.finish();

		if (to?.query?.noAnalytics?.toLowerCase() !== 'true') {
			// fire pageview
			app.config.globalProperties.$fireAsyncPageView(to, from);
		}
	});

	router.onError(() => app.config.globalProperties.$Progress.fail());
}

async function initApp() {
	const [{ default: createApp }, cookieStore, device, locale, fetch, router] = await Promise.all([
		import('#src/main'),
		getCookieStore(),
		getDevice(),
		getLocale(),
		getFetch(),
		getRouter(),
	]);
	const kvAuth0 = await getKvAuth0(cookieStore);

	// Create the App instance
	const {
		app,
		apolloClient,
	} = await createApp({
		appConfig: config,
		apollo: {
			uri: config.graphqlUri,
			types: config.graphqlPossibleTypes,
		},
		// Since we're in the browser and not the CDN, just check if the user is logged in
		cdnNotedLoggedIn: kvAuth0.isNotedLoggedIn(),
		cookieStore,
		device,
		kvAuth0,
		locale,
		fetch,
		router,
	});

	// Apply persisted state from session storage to Client Store
	if (config.apolloPersistCache) {
		await setupApolloCachePersistence(apolloClient.cache);
	}
	// Apply Server state to Client Store
	await hydrateApolloCache(apolloClient);

	setupAuthErrorHandling(kvAuth0, apolloClient);
	setupTouchDetection(apolloClient);

	if (config.enableSentry) {
		setupSentry(app, router);
	}

	if (config.enableAnalytics) {
		setupAnalytics(app, apolloClient);
	}

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
