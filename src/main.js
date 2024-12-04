import { createSSRApp } from 'vue';
import { VueHeadMixin, createHead } from '@unhead/vue';
import VueProgressBar from '@aacassandra/vue3-progressbar';
import Vue3TouchEvents from 'vue3-touch-events';

import App from '#src/App';
import createRouter from '#src/router';
import createApolloClient from '#src/api/apollo';
import kivaPlugins from '#src/plugins';
import kvAnalytics from '#src/plugins/kv-analytics-plugin';

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp({
	apollo = {},
	appConfig = {},
	cookieStore,
	device,
	kvAuth0,
	locale,
	fetch,
	url = '',
	isServer = false,
} = {}) {
	// Create a new app instance
	const app = createSSRApp(App);

	// Create a new router instance
	const router = createRouter({ isServer });
	app.use(router);
	const route = router.resolve(url);

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
		cookieStore,
		kvAuth0,
		fetch,
		route,
	});

	app.provide('apollo', apolloClient);
	app.provide('cookieStore', cookieStore);
	app.provide('device', device);
	app.provide('kvAuth0', kvAuth0);
	app.provide('locale', locale);
	app.provide('$kvTrackEvent', app.config.globalProperties.$kvTrackEvent); // provide kvTrackEvent for composition api
	app.provide('$appConfig', appConfig); // provide appConfig for composition api

	// Provide application config to all components
	app.config.globalProperties.$appConfig = appConfig;

	return {
		app,
		head,
		router,
		apolloClient,
	};
}
