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

Vue.config.productionTip = false;

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

// App Instance Factory
// - Allows us to create new instance of app, store + router on each render
export default function createApp({
	apollo = {},
	appConfig = {},
	kvAuth0,
} = {}) {
	const apolloClient = createApolloClient({ ...apollo, kvAuth0, appConfig });
	const router = createRouter();
	// Checking that sentry is enabled & is not server side
	if (appConfig.enableSentry && typeof window !== 'undefined') {
		Sentry.init({
			dsn: appConfig.sentryURI,
			integrations: [new Integrations.Vue({ Vue, attachProps: true })],
			release: UI_COMMIT
		});
	}

	const app = new Vue({
		router,
		render: h => h(App, { props: { appConfig } }),
		provide: {
			apollo: apolloClient,
			algoliaConfig: appConfig.algoliaConfig,
			auth0Config: appConfig.auth0,
			kvAuth0,
		}
	});

	return {
		app,
		router,
		apolloClient,
	};
}
