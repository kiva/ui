import { createSSRApp } from 'vue';
import { VueHeadMixin, createHead } from '@unhead/vue';
import VueProgressBar from '@aacassandra/vue3-progressbar';
import Vue3TouchEvents from 'vue3-touch-events';

import App from '#src/App';
import createApolloClient from '#src/api/apollo';
import kivaPlugins from '#src/plugins';
import kvAnalytics from '#src/plugins/kv-analytics-plugin';

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default async function createApp({
	apollo = {},
	appConfig = {},
	cookieStore,
	device,
	kvAuth0,
	locale,
	fetch,
	kivaUserAgent,
	router,
	cdnNotedLoggedIn = false,
	isServer = false,
} = {}) {
	const renderConfig = {
		cdnNotedLoggedIn,
	};

	// Create a new app instance
	const app = createSSRApp(App);

	// Install router
	app.use(router);

	if (!isServer) {
		// Wait for the router to be ready before reading the current route
		await router.isReady();
	}

	const route = router.currentRoute.value;

	// Determine if the route should use CDN caching
	const useCDNCaching = route.meta?.useCDNCaching;
	renderConfig.useCDNCaching = useCDNCaching;

	const head = createHead();
	// head for composition api
	app.use(head);
	// head for options api
	app.mixin(VueHeadMixin);

	app.use(kivaPlugins);
	app.use(kvAnalytics);
	app.use(Vue3TouchEvents);
	// Vue progress bar exports an object with a 'default' property on the server
	app.use(VueProgressBar.default ?? VueProgressBar, {
		color: '#26b6e8',
		failedColor: '#9c021a',
		thickness: '0.2rem',
		transition: {
			speed: '0.2s',
			opacity: '0s',
			termination: 300,
		},
		autoFinish: false,
	});

	const apolloClient = createApolloClient({
		...apollo,
		appConfig,
		cookieStore: useCDNCaching && isServer ? null : cookieStore,
		kvAuth0: useCDNCaching && isServer ? null : kvAuth0,
		fetch,
		userAgent: kivaUserAgent,
		route,
	});

	if (!useCDNCaching || !isServer) {
		app.provide('cookieStore', cookieStore);
		app.provide('device', device);
		app.provide('kvAuth0', kvAuth0);
		app.provide('locale', locale);
	}
	app.provide('apollo', apolloClient);
	app.provide('$kvTrackEvent', app.config.globalProperties.$kvTrackEvent); // provide kvTrackEvent for composition api
	app.provide('$appConfig', appConfig); // provide appConfig for composition api
	app.provide('$renderConfig', renderConfig); // provide renderConfig for composition api

	app.config.globalProperties.$appConfig = appConfig; // provide application config for options api
	app.config.globalProperties.$renderConfig = renderConfig; // provide renderConfig for options api

	return {
		app,
		head,
		router,
		apolloClient,
		renderConfig,
	};
}
