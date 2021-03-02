/* global UI_COMMIT */
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import Meta from 'vue-meta';
import VueProgressBar from 'vue-progressbar';
import Vue2TouchEvents from 'vue2-touch-events';

import App from '@/App';
import createRouter from '@/router';
import createApolloClient from '@/api/apollo';
import kivaPlugins from '@/plugins';

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
} = {}) {
	if (!pluginsInstalled) {
		pluginsInstalled = true;

		Vue.use(Meta);
		Vue.use(kivaPlugins);
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
	});

	const router = createRouter();
	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Sentry.init({
			dsn: appConfig.sentryURI,
			integrations: [new Integrations.Vue({ Vue, attachProps: true })],
			release: UI_COMMIT
		});
	}

	// Provide application config to all components
	Vue.prototype.$appConfig = appConfig;

	const app = new Vue({
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
