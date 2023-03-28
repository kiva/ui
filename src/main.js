/* global UI_TAG */
/* eslint-disable vue/multi-word-component-names */
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import Meta from 'vue-meta';
import VueProgressBar from 'vue-progressbar';
import Vue2TouchEvents from 'vue2-touch-events';

import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import kivaPlugins from '@/plugins';
import kvAnalytics from '@/plugins/kv-analytics-plugin';

// Track if plugins have already been installed (in case this is SSR)
let pluginsInstalled = false;

Vue.config.productionTip = false;

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
} = {}) {
	if (!pluginsInstalled) {
		pluginsInstalled = true;

		Vue.use(VueCompositionAPI);
		Vue.use(Meta);
		Vue.use(kivaPlugins);
		Vue.use(kvAnalytics);
		Vue.use(Vue2TouchEvents);
		Vue.use(VueProgressBar, {
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
	}

	const apolloClient = createApolloClient({
		...apollo,
		appConfig,
		cookieStore,
		kvAuth0,
		fetch,
		url,
	});

	const router = createRouter();
	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Sentry.init({
			Vue,
			trackComponents: true,
			dsn: appConfig.sentryURI,
			integrations: [
				new Integrations.BrowserTracing({
					routingInstrumentation: Sentry.vueRouterInstrumentation(router),
					tracingOrigins: ['localhost', appConfig.host, /^\//],
				}),
			],
			release: UI_TAG,
			beforeSend(event) {
				// make sentry colleted event easy to compare to
				const eventAsString = JSON.stringify(event);
				// match specific 3rd party events for exclusion
				// Skip sending failed loads of pX
				// eslint-disable-next-line quotes
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

	// Provide application config to all components
	Vue.prototype.$appConfig = appConfig;

	const app = new Vue({
		name: '',
		router,
		render: h => h(App),
		provide: {
			apollo: apolloClient,
			cookieStore,
			device,
			kvAuth0,
			locale,
		}
	});

	return {
		app,
		router,
		apolloClient,
	};
}
